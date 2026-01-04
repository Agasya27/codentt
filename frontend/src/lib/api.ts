const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface RegisterRequest {
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
  challengeToken: string;
  challengeAnswer: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface VerifyPhoneRequest {
  phoneNumber: string;
  otp: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResendOtpRequest {
  phoneNumber: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: number;
    username: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    emailVerified: boolean;
    phoneVerified: boolean;
  };
}

export interface LoginChallengeResponse {
  challengeToken: string;
  challengeType: string;
  question: string;
  options: string[];
  expiresIn: number;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('accessToken');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Handle network errors
    if (!response.ok && response.status === 0) {
      throw new Error(`Network error: Unable to connect to backend at ${API_BASE_URL}. Please ensure the backend server is running.`);
    }

    let data;
    try {
      data = await response.json();
    } catch (error) {
      // If response is not JSON, throw a more helpful error
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'No error details available');
        throw new Error(`API request failed: ${response.status} ${response.statusText}. ${errorText}`);
      }
      throw error;
    }
    
    if (!response.ok) {
      throw new Error(data.message || `API request failed: ${response.status} ${response.statusText}`);
    }

    return data;
  } catch (error) {
    // Handle fetch errors (network issues, CORS, etc.)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Connection error: Unable to reach backend at ${API_BASE_URL}. Please check if the backend server is running and CORS is configured correctly.`);
    }
    throw error;
  }
}

export const authApi = {
  register: (data: RegisterRequest) =>
    apiRequest<string>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  verifyEmail: (data: VerifyEmailRequest) =>
    apiRequest<string>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  verifyPhone: (data: VerifyPhoneRequest) =>
    apiRequest<string>('/auth/verify-phone', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  resendOtp: (data: ResendOtpRequest) =>
    apiRequest<string>('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getLoginChallenge: async (): Promise<LoginChallengeResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login-challenge`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        if (response.status === 0) {
          throw new Error(`Network error: Unable to connect to backend at ${API_BASE_URL}. Please ensure the backend server is running.`);
        }
        const error = await response.json().catch(() => ({ message: `HTTP ${response.status}: ${response.statusText}` }));
        throw new Error(error.message || 'Failed to get login challenge');
      }
      return await response.json() as LoginChallengeResponse;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Connection error: Unable to reach backend at ${API_BASE_URL}. Please check if the backend server is running and CORS is configured correctly.`);
      }
      throw error;
    }
  },

  login: (data: LoginRequest) =>
    apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  forgotPassword: (data: ForgotPasswordRequest) =>
    apiRequest<string>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  resetPassword: (data: ResetPasswordRequest) =>
    apiRequest<string>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () =>
    apiRequest<string>('/auth/logout', {
      method: 'POST',
    }),

  logoutAll: () =>
    apiRequest<string>('/auth/logout-all', {
      method: 'POST',
    }),
};

export interface ProfileResponse {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  gender?: string;
  dateOfBirth?: string;
  profilePictureUrl?: string;
  college?: string;
  country?: string;
  timezone?: string;
  roles: string[];
  createdAt: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  gender?: string;
  dateOfBirth?: string;
  profilePictureUrl?: string;
  college?: string;
  country?: string;
  timezone?: string;
}

export interface StatsResponse {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  accuracy: number;
  currentStreak: number;
  longestStreak: number;
  globalRank?: number;
}

export interface ActivityResponse {
  dailyActivities: DailyActivity[];
}

export interface DailyActivity {
  date: string;
  problemsSolved: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
}

export const userApi = {
  getProfile: () =>
    apiRequest<ProfileResponse>('/user/profile', {
      method: 'GET',
    }),

  updateProfile: (data: UpdateProfileRequest) =>
    apiRequest<ProfileResponse>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getStats: () =>
    apiRequest<StatsResponse>('/user/stats', {
      method: 'GET',
    }),

  getActivity: (days?: number) =>
    apiRequest<ActivityResponse>(`/user/activity${days ? `?days=${days}` : ''}`, {
      method: 'GET',
    }),

  getSubmissions: (limit?: number) =>
    apiRequest<SubmissionResponse[]>(`/user/submissions${limit ? `?limit=${limit}` : ''}`, {
      method: 'GET',
    }),
};

export interface SubmissionResponse {
  id: number;
  problemId?: number;
  problemName: string;
  language: string;
  status: string;
  submittedAt: string;
}

