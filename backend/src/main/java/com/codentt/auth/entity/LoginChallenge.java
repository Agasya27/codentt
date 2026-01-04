package com.codentt.auth.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "login_challenges", indexes = {
    @Index(name = "idx_challenge_token", columnList = "challengeToken"),
    @Index(name = "idx_expiry", columnList = "expiryDate")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginChallenge {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, length = 255)
    private String challengeToken;
    
    @Column(nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private ChallengeType challengeType;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String question; // The challenge question/statement
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String correctAnswer; // JSON string of correct answer
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String options; // JSON string of all options
    
    @Column(nullable = false)
    private LocalDateTime expiryDate;
    
    @Column(nullable = false)
    @Builder.Default
    private Boolean used = false;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer attemptCount = 0;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    public enum ChallengeType {
        SENTENCE_ARRANGEMENT, // Arrange words to form sentence
        INTENT_SELECTION,     // Select correct intent
        IMAGE_MATCH           // Match image to word
    }
    
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiryDate);
    }
    
    public boolean isValid() {
        return !used && !isExpired() && attemptCount < 3;
    }
    
    public void incrementAttemptCount() {
        this.attemptCount++;
    }
}

