package com.codentt.auth.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_stats", indexes = {
    @Index(name = "idx_user_stats_user_id", columnList = "user_id"),
    @Index(name = "idx_user_stats_global_rank", columnList = "global_rank")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserStats {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer totalSolved = 0;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer easySolved = 0;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer mediumSolved = 0;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer hardSolved = 0;
    
    @Column(nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal accuracy = BigDecimal.ZERO;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer currentStreak = 0;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer longestStreak = 0;
    
    @Column
    private Integer globalRank;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}

