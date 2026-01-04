package com.codentt.auth.service;

import com.codentt.auth.dto.LoginChallengeResponse;
import com.codentt.auth.entity.LoginChallenge;
import com.codentt.auth.exception.BadRequestException;
import com.codentt.auth.exception.UnauthorizedException;
import com.codentt.auth.repository.LoginChallengeRepository;
import com.codentt.auth.utils.TokenGenerator;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class HumanVerificationService {
    
    private final LoginChallengeRepository challengeRepository;
    private final ObjectMapper objectMapper;
    
    @Value("${app.login-challenge-expiry}")
    private Long challengeExpiry;
    
    // Predefined challenges
    private static final List<ChallengeData> SENTENCE_CHALLENGES = Arrays.asList(
        new ChallengeData("Arrange these words to form a logical sentence", 
                         Arrays.asList("I", "am", "learning", "Java"), 
                         Arrays.asList("I", "am", "learning", "Java")),
        new ChallengeData("Arrange these words to form a logical sentence",
                         Arrays.asList("The", "cat", "sits", "on", "the", "mat"),
                         Arrays.asList("The", "cat", "sits", "on", "the", "mat")),
        new ChallengeData("Arrange these words to form a logical sentence",
                         Arrays.asList("Spring", "Boot", "is", "powerful"),
                         Arrays.asList("Spring", "Boot", "is", "powerful"))
    );
    
    private static final List<ChallengeData> INTENT_CHALLENGES = Arrays.asList(
        new ChallengeData("What is the intent of: 'I want to buy a laptop'?",
                         Arrays.asList("Question", "Request", "Statement", "Complaint"),
                         Collections.singletonList("Request")),
        new ChallengeData("What is the intent of: 'How do I reset my password'?",
                         Arrays.asList("Question", "Request", "Statement", "Complaint"),
                         Collections.singletonList("Question")),
        new ChallengeData("What is the intent of: 'This product is amazing'?",
                         Arrays.asList("Question", "Request", "Statement", "Complaint"),
                         Collections.singletonList("Statement"))
    );
    
    @Transactional
    public LoginChallengeResponse generateChallenge() {
        Random random = new Random();
        LoginChallenge.ChallengeType type = LoginChallenge.ChallengeType.values()[
            random.nextInt(LoginChallenge.ChallengeType.values().length)
        ];
        
        ChallengeData challengeData;
        if (type == LoginChallenge.ChallengeType.SENTENCE_ARRANGEMENT) {
            challengeData = SENTENCE_CHALLENGES.get(random.nextInt(SENTENCE_CHALLENGES.size()));
        } else if (type == LoginChallenge.ChallengeType.INTENT_SELECTION) {
            challengeData = INTENT_CHALLENGES.get(random.nextInt(INTENT_CHALLENGES.size()));
        } else {
            // IMAGE_MATCH - simplified to text for now
            challengeData = new ChallengeData("Select the word that best matches: 'Programming'",
                    Arrays.asList("Coding", "Cooking", "Dancing", "Singing"),
                    Collections.singletonList("Coding"));
        }
        
        // Shuffle options for sentence arrangement
        List<String> options = new ArrayList<>(challengeData.options);
        if (type == LoginChallenge.ChallengeType.SENTENCE_ARRANGEMENT) {
            Collections.shuffle(options);
        }
        
        String challengeToken = TokenGenerator.generateSecureToken(32);
        LocalDateTime expiryDate = LocalDateTime.now().plusSeconds(challengeExpiry / 1000);
        
        LoginChallenge challenge = LoginChallenge.builder()
                .challengeToken(challengeToken)
                .challengeType(type)
                .question(challengeData.question)
                .correctAnswer(serializeList(challengeData.correctAnswer))
                .options(serializeList(options))
                .expiryDate(expiryDate)
                .build();
        
        challengeRepository.save(challenge);
        
        return LoginChallengeResponse.builder()
                .challengeToken(challengeToken)
                .challengeType(type.name())
                .question(challengeData.question)
                .options(options)
                .expiresIn(challengeExpiry / 1000)
                .build();
    }
    
    @Transactional
    public boolean validateChallenge(String challengeToken, String answer) {
        LoginChallenge challenge = challengeRepository.findByChallengeToken(challengeToken)
                .orElseThrow(() -> new BadRequestException("Invalid challenge token"));
        
        if (!challenge.isValid()) {
            challenge.incrementAttemptCount();
            challengeRepository.save(challenge);
            throw new UnauthorizedException("Challenge expired or exceeded attempts");
        }
        
        challenge.incrementAttemptCount();
        challengeRepository.save(challenge);
        
        try {
            List<String> correctAnswers = deserializeList(challenge.getCorrectAnswer());
            List<String> userAnswers = deserializeList(answer);
            
            // For sentence arrangement, order matters
            if (challenge.getChallengeType() == LoginChallenge.ChallengeType.SENTENCE_ARRANGEMENT) {
                return correctAnswers.equals(userAnswers);
            } else {
                // For selection types, check if answer is in correct answers
                return correctAnswers.containsAll(userAnswers) && userAnswers.size() == 1;
            }
        } catch (Exception e) {
            log.error("Error validating challenge", e);
            return false;
        }
    }
    
    private String serializeList(List<String> list) {
        try {
            return objectMapper.writeValueAsString(list);
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize list", e);
        }
    }
    
    private List<String> deserializeList(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            throw new RuntimeException("Failed to deserialize list", e);
        }
    }
    
    private static class ChallengeData {
        String question;
        List<String> options;
        List<String> correctAnswer;
        
        ChallengeData(String question, List<String> options, List<String> correctAnswer) {
            this.question = question;
            this.options = new ArrayList<>(options);
            this.correctAnswer = new ArrayList<>(correctAnswer);
        }
    }
}

