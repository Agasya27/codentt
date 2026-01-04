package com.codentt.auth.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "external_profiles", 
    uniqueConstraints = @UniqueConstraint(name = "uk_user_platform", columnNames = {"user_id", "platform"}),
    indexes = {
        @Index(name = "idx_external_profiles_user_id", columnList = "user_id"),
        @Index(name = "idx_external_profiles_platform", columnList = "platform")
    })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExternalProfile {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private Platform platform;
    
    @Column(nullable = false, length = 100)
    private String username;
    
    @Column
    private Integer rating;
    
    @Column
    private LocalDateTime lastSyncedAt;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    public enum Platform {
        LEETCODE, CODEFORCES, CODECHEF
    }
    
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}

