package com.codentt.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginChallengeResponse {
    private String challengeToken;
    private String challengeType;
    private String question;
    private List<String> options;
    private Long expiresIn; // seconds
}

