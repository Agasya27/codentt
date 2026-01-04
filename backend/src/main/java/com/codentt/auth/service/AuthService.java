package com.codentt.auth.service;

import com.codentt.auth.dto.*;
import com.codentt.auth.entity.OTP;
import com.codentt.auth.entity.User;
import com.codentt.auth.entity.VerificationToken;
import com.codentt.auth.exception.*;
import com.codentt.auth.repository.OTPRepository;
import com.codentt.auth.repository.UserRepository;
import com.codentt.auth.repository.VerificationTokenRepository;
import com.codentt.auth.utils.TokenGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final VerificationTokenRepository tokenRepository;
    private final OTPRepository otpRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final SmsService smsService;
    private final HumanVerificationService humanVerificationService;
    private final SessionService sessionService;
    
    @Value("${app.email-verification-expiry}")
    private Long emailVerificationExpiry;
    
    @Value("${app.phone-otp-expiry}")
    private Long phoneOtpExpiry;
    
    @Value("${app.password-reset-expiry}")
    private Long passwordResetExpiry;
    
    @Value("${app.otp-length}")
    private int otpLength;
    
    @Value("${app.max-otp-retries}")
    private int maxOtpRetries;
    
    // Simple in-memory rate limiting (in production, use Redis)
    private final Map<String, AtomicInteger> rateLimitMap = new ConcurrentHashMap<>();
    private final Map<String, Long> rateLimitTimeMap = new ConcurrentHashMap<>();
    
    @Transactional
    public ApiResponse<String> register(RegisterRequest request) {
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already taken");
        }
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }
        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new BadRequestException("Phone number already registered");
        }
        
        // Create user (not verified yet)
        User user = User.builder()
                .username(request.getUsername())
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .password(passwordEncoder.encode(request.getPassword()))
                .emailVerified(false)
                .phoneVerified(false)
                .roles(Set.of(User.Role.USER))
                .build();
        
        user = userRepository.save(user);
        
        // Generate and send email verification token
        String emailToken = TokenGenerator.generateSecureToken(32);
        VerificationToken verificationToken = VerificationToken.builder()
                .token(emailToken)
                .user(user)
                .tokenType(VerificationToken.TokenType.EMAIL_VERIFICATION)
                .expiryDate(LocalDateTime.now().plusSeconds(emailVerificationExpiry / 1000))
                .build();
        tokenRepository.save(verificationToken);
        emailService.sendVerificationEmail(user.getEmail(), emailToken);
        
        // Generate and send phone OTP
        String otpCode = TokenGenerator.generateOTP(otpLength);
        OTP otp = OTP.builder()
                .code(otpCode)
                .user(user)
                .identifier(user.getPhoneNumber())
                .otpType(OTP.OtpType.PHONE_VERIFICATION)
                .expiryDate(LocalDateTime.now().plusSeconds(phoneOtpExpiry / 1000))
                .build();
        otpRepository.save(otp);
        smsService.sendOTP(user.getPhoneNumber(), otpCode);
        
        return ApiResponse.success("Registration successful. Please verify your email and phone number.", null);
    }
    
    @Transactional
    public ApiResponse<String> verifyEmail(VerifyEmailRequest request) {
        VerificationToken token = tokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new BadRequestException("Invalid verification token"));
        
        if (!token.isValid()) {
            throw new BadRequestException("Token expired or already used");
        }
        
        User user = token.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);
        
        token.setUsed(true);
        tokenRepository.save(token);
        
        return ApiResponse.success("Email verified successfully", null);
    }
    
    @Transactional
    public ApiResponse<String> verifyPhone(VerifyPhoneRequest request) {
        User user = userRepository.findByPhoneNumber(request.getPhoneNumber())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        OTP otp = otpRepository.findByCodeAndIdentifierAndOtpType(
                request.getOtp(), 
                request.getPhoneNumber(), 
                OTP.OtpType.PHONE_VERIFICATION
        ).orElseThrow(() -> new BadRequestException("Invalid OTP"));
        
        if (!otp.isValid()) {
            otp.incrementRetryCount();
            otpRepository.save(otp);
            throw new BadRequestException("OTP expired or exceeded retry limit");
        }
        
        if (!otp.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("OTP does not match user");
        }
        
        user.setPhoneVerified(true);
        userRepository.save(user);
        
        otp.setUsed(true);
        otpRepository.save(otp);
        
        return ApiResponse.success("Phone number verified successfully", null);
    }
    
    @Transactional
    public ApiResponse<String> resendPhoneOtp(ResendOtpRequest request) {
        checkRateLimit("otp:" + request.getPhoneNumber(), 3, 60000); // 3 per minute
        
        User user = userRepository.findByPhoneNumber(request.getPhoneNumber())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        String otpCode = TokenGenerator.generateOTP(otpLength);
        OTP otp = OTP.builder()
                .code(otpCode)
                .user(user)
                .identifier(user.getPhoneNumber())
                .otpType(OTP.OtpType.PHONE_VERIFICATION)
                .expiryDate(LocalDateTime.now().plusSeconds(phoneOtpExpiry / 1000))
                .build();
        otpRepository.save(otp);
        smsService.sendOTP(user.getPhoneNumber(), otpCode);
        
        return ApiResponse.success("OTP sent successfully", null);
    }
    
    public LoginChallengeResponse getLoginChallenge() {
        return humanVerificationService.generateChallenge();
    }
    
    @Transactional
    public ApiResponse<AuthResponse> login(LoginRequest request) {
        // Validate human verification challenge
        if (!humanVerificationService.validateChallenge(request.getChallengeToken(), request.getChallengeAnswer())) {
            throw new UnauthorizedException("Human verification failed");
        }
        
        // Find user by username or email (intelligent detection)
        User user = findUserByUsernameOrEmail(request.getUsernameOrEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid username/email or password"));
        
        // Check if account is locked
        if (!user.getAccountNonLocked()) {
            if (user.getLockoutTime() != null && 
                LocalDateTime.now().isBefore(user.getLockoutTime().plusMinutes(15))) {
                throw new LockedException("Account is locked. Please try again later.");
            } else {
                // Unlock account after lockout period
                user.resetFailedLoginAttempts();
                userRepository.save(user);
            }
        }
        
        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            user.incrementFailedLoginAttempts();
            userRepository.save(user);
            throw new BadCredentialsException("Invalid credentials");
        }
        
        // Check if user is fully verified
        if (!user.isFullyVerified()) {
            throw new BadRequestException("Please verify your email and phone number before logging in");
        }
        
        // Reset failed login attempts on successful login
        user.resetFailedLoginAttempts();
        userRepository.save(user);
        
        // Generate JWT tokens (use username as subject for consistency)
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("username", user.getUsername());
        claims.put("roles", user.getRoles().stream().map(Enum::name).toList());
        
        String accessToken = jwtService.generateToken(user.getUsername(), claims);
        String refreshToken = jwtService.generateRefreshToken(user.getUsername());
        
        AuthResponse.UserInfo userInfo = AuthResponse.UserInfo.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .emailVerified(user.getEmailVerified())
                .phoneVerified(user.getPhoneVerified())
                .build();
        
        AuthResponse authResponse = AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .expiresIn(86400L) // 24 hours in seconds
                .user(userInfo)
                .build();
        
        return ApiResponse.success("Login successful", authResponse);
    }
    
    @Transactional
    public ApiResponse<String> forgotPassword(ForgotPasswordRequest request) {
        checkRateLimit("forgot-password:" + request.getEmail(), 3, 3600000); // 3 per hour
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with this email"));
        
        String resetToken = TokenGenerator.generateSecureToken(32);
        VerificationToken token = VerificationToken.builder()
                .token(resetToken)
                .user(user)
                .tokenType(VerificationToken.TokenType.PASSWORD_RESET)
                .expiryDate(LocalDateTime.now().plusSeconds(passwordResetExpiry / 1000))
                .build();
        tokenRepository.save(token);
        
        emailService.sendPasswordResetEmail(user.getEmail(), resetToken);
        
        return ApiResponse.success("Password reset link sent to your email", null);
    }
    
    @Transactional
    public ApiResponse<String> resetPassword(ResetPasswordRequest request) {
        VerificationToken token = tokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new BadRequestException("Invalid reset token"));
        
        if (!token.isValid()) {
            throw new BadRequestException("Token expired or already used");
        }
        
        if (token.getTokenType() != VerificationToken.TokenType.PASSWORD_RESET) {
            throw new BadRequestException("Invalid token type");
        }
        
        User user = token.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        
        token.setUsed(true);
        tokenRepository.save(token);
        
        return ApiResponse.success("Password reset successfully", null);
    }
    
    @Transactional
    public ApiResponse<String> logout(String token) {
        if (token != null && !token.isEmpty()) {
            // Invalidate the token in the session table
            sessionService.invalidateToken(token);
        }
        return ApiResponse.success("Logged out successfully", null);
    }
    
    @Transactional
    public ApiResponse<String> logoutAll(String token) {
        if (token != null && !token.isEmpty()) {
            try {
                String username = jwtService.extractUsername(token);
                sessionService.invalidateAllUserSessions(username);
            } catch (Exception e) {
                log.error("Error during logout all", e);
            }
        }
        return ApiResponse.success("Logged out from all devices successfully", null);
    }
    
    /**
     * Intelligently finds user by username or email
     * Detects if the input is an email (contains @) or username
     */
    private Optional<User> findUserByUsernameOrEmail(String identifier) {
        if (identifier == null || identifier.isEmpty()) {
            return Optional.empty();
        }
        
        // Check if it's an email (contains @)
        if (identifier.contains("@")) {
            return userRepository.findByEmail(identifier);
        } else {
            // Try username first, then fallback to email if not found
            Optional<User> userByUsername = userRepository.findByUsername(identifier);
            if (userByUsername.isPresent()) {
                return userByUsername;
            }
            // Fallback to email search (in case username looks like email but doesn't have @)
            return userRepository.findByEmail(identifier);
        }
    }
    
    private void checkRateLimit(String key, int maxRequests, long windowMs) {
        long now = System.currentTimeMillis();
        AtomicInteger count = rateLimitMap.computeIfAbsent(key, k -> new AtomicInteger(0));
        Long windowStart = rateLimitTimeMap.get(key);
        
        if (windowStart == null || (now - windowStart) > windowMs) {
            count.set(0);
            rateLimitTimeMap.put(key, now);
        }
        
        if (count.incrementAndGet() > maxRequests) {
            throw new RateLimitExceededException("Rate limit exceeded. Please try again later.");
        }
    }
}

