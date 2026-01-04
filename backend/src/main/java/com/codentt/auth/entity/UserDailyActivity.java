package com.codentt.auth.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_daily_activity", 
    uniqueConstraints = @UniqueConstraint(name = "uk_user_date", columnNames = {"user_id", "date"}),
    indexes = {
        @Index(name = "idx_user_daily_activity_user_id", columnList = "user_id"),
        @Index(name = "idx_user_daily_activity_date", columnList = "date"),
        @Index(name = "idx_user_daily_activity_user_date", columnList = "user_id, date")
    })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDailyActivity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private LocalDate date;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer problemsSolved = 0;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer easyCount = 0;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer mediumCount = 0;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer hardCount = 0;
    
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
        if (date == null) {
            date = LocalDate.now();
        }
    }
}

