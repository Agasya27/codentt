package com.codentt.auth.controller;

import com.codentt.auth.dto.*;
import com.codentt.auth.service.AuthService;
import com.codentt.auth.service.HumanVerificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    private final HumanVerificationService humanVerificationService;
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }
    
    @PostMapping("/verify-email")
    public ResponseEntity<ApiResponse<String>> verifyEmail(@Valid @RequestBody VerifyEmailRequest request) {
        return ResponseEntity.ok(authService.verifyEmail(request));
    }
    
    @PostMapping("/verify-phone")
    public ResponseEntity<ApiResponse<String>> verifyPhone(@Valid @RequestBody VerifyPhoneRequest request) {
        return ResponseEntity.ok(authService.verifyPhone(request));
    }
    
    @PostMapping("/resend-otp")
    public ResponseEntity<ApiResponse<String>> resendOtp(@Valid @RequestBody ResendOtpRequest request) {
        return ResponseEntity.ok(authService.resendPhoneOtp(request));
    }
    
    @GetMapping("/login-challenge")
    public ResponseEntity<LoginChallengeResponse> getLoginChallenge() {
        return ResponseEntity.ok(humanVerificationService.generateChallenge());
    }
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
    
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return ResponseEntity.ok(authService.forgotPassword(request));
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return ResponseEntity.ok(authService.resetPassword(request));
    }
    
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader != null && authHeader.startsWith("Bearer ") 
                ? authHeader.substring(7) 
                : null;
        return ResponseEntity.ok(authService.logout(token));
    }
    
    @PostMapping("/logout-all")
    public ResponseEntity<ApiResponse<String>> logoutAll(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader != null && authHeader.startsWith("Bearer ") 
                ? authHeader.substring(7) 
                : null;
        return ResponseEntity.ok(authService.logoutAll(token));
    }
}

