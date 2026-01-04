package com.codentt.auth.controller;

import com.codentt.auth.dto.*;
import com.codentt.auth.service.ActivityService;
import com.codentt.auth.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    
    private final ProfileService profileService;
    private final ActivityService activityService;
    
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<ProfileResponse>> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        ProfileResponse profile = profileService.getProfile(username);
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", profile));
    }
    
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<ProfileResponse>> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        ProfileResponse profile = profileService.updateProfile(username, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", profile));
    }
    
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<StatsResponse>> getStats() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        StatsResponse stats = profileService.getStats(username);
        return ResponseEntity.ok(ApiResponse.success("Stats retrieved successfully", stats));
    }
    
    @GetMapping("/activity")
    public ResponseEntity<ApiResponse<ActivityResponse>> getActivity(
            @RequestParam(required = false, defaultValue = "365") Integer days) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        ActivityResponse activity = activityService.getActivity(username, days);
        return ResponseEntity.ok(ApiResponse.success("Activity retrieved successfully", activity));
    }
    
    @GetMapping("/submissions")
    public ResponseEntity<ApiResponse<List<SubmissionResponse>>> getSubmissions(
            @RequestParam(required = false, defaultValue = "10") Integer limit) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        List<SubmissionResponse> submissions = profileService.getRecentSubmissions(username, limit);
        return ResponseEntity.ok(ApiResponse.success("Submissions retrieved successfully", submissions));
    }
}

