package com.codentt.auth.repository;

import com.codentt.auth.entity.User;
import com.codentt.auth.entity.UserDailyActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserDailyActivityRepository extends JpaRepository<UserDailyActivity, Long> {
    Optional<UserDailyActivity> findByUserAndDate(User user, LocalDate date);
    List<UserDailyActivity> findByUserOrderByDateDesc(User user);
    
    @Query("SELECT a FROM UserDailyActivity a WHERE a.user = :user AND a.date >= :startDate ORDER BY a.date DESC")
    List<UserDailyActivity> findByUserAndDateAfter(@Param("user") User user, @Param("startDate") LocalDate startDate);
}

