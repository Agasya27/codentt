package com.codentt.auth.repository;

import com.codentt.auth.entity.User;
import com.codentt.auth.entity.UserStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserStatsRepository extends JpaRepository<UserStats, Long> {
    Optional<UserStats> findByUser(User user);
    Optional<UserStats> findByUserId(Long userId);
}

