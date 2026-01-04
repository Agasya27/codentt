package com.codentt.auth.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_submissions", indexes = {
    @Index(name = "idx_user_submissions_user_id", columnList = "user_id"),
    @Index(name = "idx_user_submissions_submitted_at", columnList = "submitted_at"),
    @Index(name = "idx_user_submissions_user_submitted", columnList = "user_id, submitted_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSubmission {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column
    private Long problemId;
    
    @Column(nullable = false, length = 255)
    private String problemName;
    
    @Column(nullable = false, length = 50)
    private String language;
    
    @Column(nullable = false, length = 50)
    private String status; // ACCEPTED, WRONG_ANSWER, TIME_LIMIT_EXCEEDED, etc.
    
    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime submittedAt = LocalDateTime.now();
    
    @PrePersist
    protected void onCreate() {
        if (submittedAt == null) {
            submittedAt = LocalDateTime.now();
        }
    }
}

