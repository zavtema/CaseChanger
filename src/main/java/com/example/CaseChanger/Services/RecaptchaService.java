package com.example.CaseChanger.Services;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

@Service
public class RecaptchaService {
    @Value("${google.recaptcha.secret-key}")
    private String secretKey;

    private static final String VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

    private static final float SCORE_THRESHOLD = 0.5f;

    // Клиент для отправки запросов к Google API
    private final RestTemplate restTemplate = new RestTemplate();

    public boolean verify(String recaptchaToken, String action) {
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>(); // MultiValueMap — это интерфейс в Spring, который позволяет хранить несколько значений для одного ключа.
        params.add("secret", secretKey);
        params.add("response", recaptchaToken);
        RecaptchaResponse response = restTemplate.postForObject( // Отправляется Post запрос по указанному URL
                VERIFY_URL,
                params,
                RecaptchaResponse.class
        );
        return isResponseValid(response, action); // отправляем, чтобы Google проверил действителен ли токен и совпадает ли действие
    }

    private boolean isResponseValid(RecaptchaResponse response, String action) {
        return response != null
                && response.isSuccess() // success = true
                && response.getScore() >= SCORE_THRESHOLD // score >= 0.5
                && action.equals(response.getAction()); // Действие совпадает
    }

    // В таком формате приходит ответ и я его фасую по переменным
    @Data
    private static class RecaptchaResponse {
        private boolean success;
        private float score;
        private String action;
        private String challengeTs;
        private String hostname;
    }
}