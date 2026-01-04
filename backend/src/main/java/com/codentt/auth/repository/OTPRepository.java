package com.codentt.auth.repository;

import com.codentt.auth.entity.OTP;
import com.codentt.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OTPRepository extends JpaRepository<OTP, Long> {
    Optional<OTP> findByCodeAndIdentifierAndOtpType(String code, String identifier, OTP.OtpType otpType);
    Optional<OTP> findTopByUserAndOtpTypeOrderByCreatedAtDesc(User user, OTP.OtpType otpType);
    
    @Modifying
    @Query("DELETE FROM OTP o WHERE o.expiryDate < ?1")
    void deleteExpiredOTPs(LocalDateTime now);
}

