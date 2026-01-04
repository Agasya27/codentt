package com.codentt.auth.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {
    
    private final JavaMailSender mailSender;
    
    @Value("${app.frontend-url}")
    private String frontendUrl;
    
    @Value("${spring.mail.username}")
    private String fromEmail;
    
    public void sendVerificationEmail(String to, String token) {
        try {
            String verificationLink = frontendUrl + "/auth/verify-email?token=" + token;
            
            // Development mode: If email is not configured, log the link instead
            if (fromEmail == null || fromEmail.isEmpty()) {
                log.warn("================================================");
                log.warn("EMAIL NOT CONFIGURED - DEVELOPMENT MODE");
                log.warn("================================================");
                log.warn("Verification link for {}: {}", to, verificationLink);
                log.warn("Copy this link and open it in your browser to verify the email.");
                log.warn("================================================");
                return; // Don't throw error in development
            }
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("Verify Your Email - Codentt");
            message.setText("Please click the following link to verify your email address:\n\n" +
                    verificationLink + "\n\n" +
                    "This link will expire in 1 hour.\n\n" +
                    "If you did not request this, please ignore this email.");
            
            mailSender.send(message);
            log.info("Verification email sent to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send verification email to: {}", to, e);
            // In development, log the link instead of failing
            if (fromEmail == null || fromEmail.isEmpty()) {
                String verificationLink = frontendUrl + "/auth/verify-email?token=" + token;
                log.warn("Email sending failed, but here's the verification link: {}", verificationLink);
                return;
            }
            throw new RuntimeException("Failed to send verification email", e);
        }
    }
    
    public void sendPasswordResetEmail(String to, String token) {
        try {
            String resetLink = frontendUrl + "/auth/reset-password?token=" + token;
            
            // Development mode: If email is not configured, log the link instead
            if (fromEmail == null || fromEmail.isEmpty()) {
                log.warn("================================================");
                log.warn("EMAIL NOT CONFIGURED - DEVELOPMENT MODE");
                log.warn("================================================");
                log.warn("Password reset link for {}: {}", to, resetLink);
                log.warn("Copy this link and open it in your browser to reset the password.");
                log.warn("================================================");
                return; // Don't throw error in development
            }
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("Reset Your Password - Codentt");
            message.setText("Please click the following link to reset your password:\n\n" +
                    resetLink + "\n\n" +
                    "This link will expire in 1 hour.\n\n" +
                    "If you did not request this, please ignore this email.");
            
            mailSender.send(message);
            log.info("Password reset email sent to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send password reset email to: {}", to, e);
            // In development, log the link instead of failing
            if (fromEmail == null || fromEmail.isEmpty()) {
                String resetLink = frontendUrl + "/auth/reset-password?token=" + token;
                log.warn("Email sending failed, but here's the reset link: {}", resetLink);
                return;
            }
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }
}

