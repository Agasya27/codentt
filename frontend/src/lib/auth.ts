/**
 * Authentication utility functions
 * Handles JWT token validation and authentication state checks
 */

/**
 * Checks if a JWT token is valid (not expired)
 * @param token - JWT token string
 * @returns boolean indicating if token is valid
 */
function isTokenValid(token: string): boolean {
  if (!token) return false;

  try {
    // Decode JWT token (without verification - for client-side expiry check only)
    const base64Url = token.split('.')[1];
    if (!base64Url) return false;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload = JSON.parse(jsonPayload);
    const currentTime = Math.floor(Date.now() / 1000);

    // Check if token is expired
    if (payload.exp && payload.exp < currentTime) {
      return false;
    }

    return true;
  } catch (error) {
    // If token is malformed, consider it invalid
    console.error('Error validating token:', error);
    return false;
  }
}

/**
 * Checks if user is currently authenticated
 * @returns boolean indicating authentication status
 */
export function isAuthenticated(): boolean {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    return false;
  }

  // Check if token is valid (not expired)
  return isTokenValid(token);
}

/**
 * Gets the current user from localStorage
 * @returns User object or null if not authenticated
 */
export function getCurrentUser() {
  if (!isAuthenticated()) {
    return null;
  }

  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
}

/**
 * Clears authentication data from localStorage
 */
export function clearAuth(): void {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
}

/**
 * Stores the intended route before redirecting to login
 * @param route - Route path to store
 */
export function storeIntendedRoute(route: string): void {
  sessionStorage.setItem('intendedRoute', route);
}

/**
 * Gets and removes the intended route from sessionStorage
 * @returns Intended route or null
 */
export function getIntendedRoute(): string | null {
  const route = sessionStorage.getItem('intendedRoute');
  sessionStorage.removeItem('intendedRoute');
  return route;
}

