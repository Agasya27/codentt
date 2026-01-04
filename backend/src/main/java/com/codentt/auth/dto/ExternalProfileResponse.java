package com.codentt.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExternalProfileResponse {
    private Long id;
    private String platform;
    private String username;
    private Integer rating;
    private LocalDateTime lastSyncedAt;
}

