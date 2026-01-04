package com.codentt.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateProfileRequest {
    @Size(min = 1, max = 100, message = "Full name must be between 1 and 100 characters")
    private String fullName;
    
    @Email(message = "Email must be valid")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;
    
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Phone number must be valid")
    @Size(max = 20, message = "Phone number must not exceed 20 characters")
    private String phoneNumber;
    
    @Pattern(regexp = "^(MALE|FEMALE|OTHER|)$", message = "Gender must be MALE, FEMALE, OTHER, or empty")
    private String gender;
    
    private LocalDate dateOfBirth;
    
    @Size(max = 500, message = "Profile picture URL must not exceed 500 characters")
    private String profilePictureUrl;
    
    @Size(max = 200, message = "College must not exceed 200 characters")
    private String college;
    
    @Size(max = 100, message = "Country must not exceed 100 characters")
    private String country;
    
    @Size(max = 50, message = "Timezone must not exceed 50 characters")
    private String timezone;
}

