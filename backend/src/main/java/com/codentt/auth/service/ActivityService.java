package com.codentt.auth.service;

import com.codentt.auth.dto.ActivityResponse;
import com.codentt.auth.entity.User;
import com.codentt.auth.entity.UserDailyActivity;
import com.codentt.auth.exception.ResourceNotFoundException;
import com.codentt.auth.repository.UserDailyActivityRepository;
import com.codentt.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActivityService {
    
    private final UserRepository userRepository;
    private final UserDailyActivityRepository activityRepository;
    
    public ActivityResponse getActivity(String username, Integer days) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        LocalDate startDate = days != null && days > 0 
                ? LocalDate.now().minusDays(days - 1)
                : LocalDate.now().minusDays(364); // Default to 1 year
        
        List<UserDailyActivity> activities = activityRepository.findByUserAndDateAfter(user, startDate);
        
        List<ActivityResponse.DailyActivity> dailyActivities = activities.stream()
                .map(activity -> ActivityResponse.DailyActivity.builder()
                        .date(activity.getDate())
                        .problemsSolved(activity.getProblemsSolved())
                        .easyCount(activity.getEasyCount())
                        .mediumCount(activity.getMediumCount())
                        .hardCount(activity.getHardCount())
                        .build())
                .collect(Collectors.toList());
        
        return ActivityResponse.builder()
                .dailyActivities(dailyActivities)
                .build();
    }
}

