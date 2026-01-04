package com.codentt.auth.repository;

import com.codentt.auth.entity.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    Optional<VerificationToken> findByToken(String token);
    
    @Modifying
    @Query("DELETE FROM VerificationToken vt WHERE vt.expiryDate < ?1")
    void deleteExpiredTokens(LocalDateTime now);
}

