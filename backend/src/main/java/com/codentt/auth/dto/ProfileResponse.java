package com.codentt.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileResponse {
    private Long id;
    private String username;
    private String fullName;
    private String email;
    private String phoneNumber;
    private Boolean emailVerified;
    private Boolean phoneVerified;
    private String gender;
    private LocalDate dateOfBirth;
    private String profilePictureUrl;
    private String college;
    private String country;
    private String timezone;
    private Set<String> roles;
    private LocalDateTime createdAt;
}

