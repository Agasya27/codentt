package com.codentt.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityResponse {
    private List<DailyActivity> dailyActivities;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DailyActivity {
        private LocalDate date;
        private Integer problemsSolved;
        private Integer easyCount;
        private Integer mediumCount;
        private Integer hardCount;
    }
}

