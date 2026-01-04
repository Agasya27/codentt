package com.codentt.auth.service;

import com.codentt.auth.entity.User;
import com.codentt.auth.entity.UserSession;
import com.codentt.auth.repository.UserRepository;
import com.codentt.auth.repository.UserSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class SessionService {
    
    private final UserSessionRepository sessionRepository;
    private final UserRepository userRepository;
    
    @Value("${jwt.expiration}")
    private Long tokenExpiration;
    
    @Transactional
    public void createSession(User user, String accessToken, String refreshToken, String deviceInfo, String ipAddress) {
        try {
            String accessTokenHash = hashToken(accessToken);
            String refreshTokenHash = refreshToken != null ? hashToken(refreshToken) : null;
            
            LocalDateTime expiresAt = LocalDateTime.now().plusSeconds(tokenExpiration / 1000);
            
            UserSession session = UserSession.builder()
                    .user(user)
                    .accessTokenHash(accessTokenHash)
                    .refreshTokenHash(refreshTokenHash)
                    .deviceInfo(deviceInfo)
                    .ipAddress(ipAddress)
                    .expiresAt(expiresAt)
                    .isActive(true)
                    .build();
            
            sessionRepository.save(session);
        } catch (Exception e) {
            log.error("Error creating session for user: {}", user.getUsername(), e);
        }
    }
    
    public boolean isTokenValid(String token) {
        try {
            String tokenHash = hashToken(token);
            Optional<UserSession> session = sessionRepository.findByAccessTokenHash(tokenHash);
            
            if (session.isEmpty()) {
                return false;
            }
            
            UserSession userSession = session.get();
            return userSession.getIsActive() && !userSession.isExpired();
        } catch (Exception e) {
            log.error("Error validating token", e);
            return false;
        }
    }
    
    @Transactional
    public void invalidateToken(String token) {
        try {
            String tokenHash = hashToken(token);
            sessionRepository.deactivateSessionByToken(tokenHash);
        } catch (Exception e) {
            log.error("Error invalidating token", e);
        }
    }
    
    @Transactional
    public void invalidateAllUserSessions(String username) {
        User user = userRepository.findByUsername(username)
                .orElse(null);
        
        if (user != null) {
            sessionRepository.deactivateAllUserSessions(user);
        }
    }
    
    @Transactional
    @Scheduled(fixedRate = 3600000) // Run every hour
    public void cleanupExpiredSessions() {
        sessionRepository.deleteExpiredSessions(LocalDateTime.now());
    }
    
    private String hashToken(String token) throws NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(hash);
    }
}

