package com.codentt.auth.repository;

import com.codentt.auth.entity.User;
import com.codentt.auth.entity.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserSessionRepository extends JpaRepository<UserSession, Long> {
    Optional<UserSession> findByAccessTokenHash(String accessTokenHash);
    List<UserSession> findByUserAndIsActiveTrue(User user);
    
    @Modifying
    @Query("UPDATE UserSession s SET s.isActive = false WHERE s.user = :user")
    void deactivateAllUserSessions(@Param("user") User user);
    
    @Modifying
    @Query("UPDATE UserSession s SET s.isActive = false WHERE s.accessTokenHash = :tokenHash")
    void deactivateSessionByToken(@Param("tokenHash") String tokenHash);
    
    @Modifying
    @Query("DELETE FROM UserSession s WHERE s.expiresAt < :now")
    void deleteExpiredSessions(@Param("now") LocalDateTime now);
}

