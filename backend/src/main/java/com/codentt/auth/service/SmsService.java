package com.codentt.auth.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class SmsService {
    
    @Value("${sms.provider:console}")
    private String provider;
    
    @Value("${sms.twilio.account-sid:}")
    private String twilioAccountSid;
    
    @Value("${sms.twilio.auth-token:}")
    private String twilioAuthToken;
    
    @Value("${sms.twilio.phone-number:}")
    private String twilioPhoneNumber;
    
    public void sendOTP(String phoneNumber, String otp) {
        switch (provider.toLowerCase()) {
            case "twilio":
                sendViaTwilio(phoneNumber, otp);
                break;
            case "console":
            default:
                sendViaConsole(phoneNumber, otp);
                break;
        }
    }
    
    private void sendViaConsole(String phoneNumber, String otp) {
        // For development/testing - just log the OTP
        log.info("SMS OTP for {}: {}", phoneNumber, otp);
        log.info("In production, this would be sent via SMS provider");
    }
    
    private void sendViaTwilio(String phoneNumber, String otp) {
        // TODO: Implement Twilio integration if needed
        // For now, fallback to console
        log.info("Twilio SMS OTP for {}: {}", phoneNumber, otp);
        log.info("Twilio integration not implemented - using console fallback");
    }
}

