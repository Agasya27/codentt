package com.codentt.auth.repository;

import com.codentt.auth.entity.LoginChallenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface LoginChallengeRepository extends JpaRepository<LoginChallenge, Long> {
    Optional<LoginChallenge> findByChallengeToken(String challengeToken);
    
    @Modifying
    @Query("DELETE FROM LoginChallenge lc WHERE lc.expiryDate < ?1")
    void deleteExpiredChallenges(LocalDateTime now);
}

