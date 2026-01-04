package com.codentt.auth.service;

import com.codentt.auth.dto.*;
import com.codentt.auth.entity.User;
import com.codentt.auth.entity.UserStats;
import com.codentt.auth.exception.BadRequestException;
import com.codentt.auth.exception.ResourceNotFoundException;
import com.codentt.auth.dto.SubmissionResponse;
import com.codentt.auth.entity.UserSubmission;
import com.codentt.auth.repository.UserRepository;
import com.codentt.auth.repository.UserStatsRepository;
import com.codentt.auth.repository.UserSubmissionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfileService {
    
    private final UserRepository userRepository;
    private final UserStatsRepository userStatsRepository;
    private final UserSubmissionRepository submissionRepository;
    
    public ProfileResponse getProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        return ProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .emailVerified(user.getEmailVerified())
                .phoneVerified(user.getPhoneVerified())
                .gender(user.getGender())
                .dateOfBirth(user.getDateOfBirth())
                .profilePictureUrl(user.getProfilePictureUrl())
                .college(user.getCollege())
                .country(user.getCountry())
                .timezone(user.getTimezone())
                .roles(user.getRoles().stream().map(Enum::name).collect(Collectors.toSet()))
                .createdAt(user.getCreatedAt())
                .build();
    }
    
    @Transactional
    public ProfileResponse updateProfile(String username, UpdateProfileRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Check email uniqueness if changed
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new BadRequestException("Email already registered");
            }
            user.setEmail(request.getEmail());
            user.setEmailVerified(false); // Require re-verification if email changed
        }
        
        // Check phone uniqueness if changed
        if (request.getPhoneNumber() != null && !request.getPhoneNumber().equals(user.getPhoneNumber())) {
            if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
                throw new BadRequestException("Phone number already registered");
            }
            user.setPhoneNumber(request.getPhoneNumber());
            user.setPhoneVerified(false); // Require re-verification if phone changed
        }
        
        // Update other fields
        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getGender() != null && !request.getGender().isEmpty()) {
            user.setGender(request.getGender());
        }
        if (request.getDateOfBirth() != null) {
            user.setDateOfBirth(request.getDateOfBirth());
        }
        if (request.getProfilePictureUrl() != null) {
            user.setProfilePictureUrl(request.getProfilePictureUrl());
        }
        if (request.getCollege() != null) {
            user.setCollege(request.getCollege());
        }
        if (request.getCountry() != null) {
            user.setCountry(request.getCountry());
        }
        if (request.getTimezone() != null) {
            user.setTimezone(request.getTimezone());
        }
        
        user = userRepository.save(user);
        
        return getProfile(user.getUsername());
    }
    
    public StatsResponse getStats(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        UserStats stats = userStatsRepository.findByUser(user)
                .orElse(UserStats.builder()
                        .user(user)
                        .totalSolved(0)
                        .easySolved(0)
                        .mediumSolved(0)
                        .hardSolved(0)
                        .accuracy(java.math.BigDecimal.ZERO)
                        .currentStreak(0)
                        .longestStreak(0)
                        .build());
        
        return StatsResponse.builder()
                .totalSolved(stats.getTotalSolved())
                .easySolved(stats.getEasySolved())
                .mediumSolved(stats.getMediumSolved())
                .hardSolved(stats.getHardSolved())
                .accuracy(stats.getAccuracy())
                .currentStreak(stats.getCurrentStreak())
                .longestStreak(stats.getLongestStreak())
                .globalRank(stats.getGlobalRank())
                .build();
    }
    
    public List<SubmissionResponse> getRecentSubmissions(String username, Integer limit) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Pageable pageable = PageRequest.of(0, limit);
        List<UserSubmission> submissions = submissionRepository.findByUserOrderBySubmittedAtDesc(user, pageable).getContent();
        
        return submissions.stream()
                .map(sub -> SubmissionResponse.builder()
                        .id(sub.getId())
                        .problemId(sub.getProblemId())
                        .problemName(sub.getProblemName())
                        .language(sub.getLanguage())
                        .status(sub.getStatus())
                        .submittedAt(sub.getSubmittedAt())
                        .build())
                .collect(Collectors.toList());
    }
}

