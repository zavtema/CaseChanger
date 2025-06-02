package com.example.CaseChanger.Services;


import com.example.CaseChanger.Models.User;
import com.example.CaseChanger.Repositories.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@AllArgsConstructor
public class RegistrationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RecaptchaService recaptchaService;
    public void register(User user, String recaptchaToken) {
        if (!recaptchaService.verify(recaptchaToken,"register")) {
            throw new IllegalArgumentException("CAPTCHA не пройдена");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email занят!");
        }
        if (userRepository.existsByLogin(user.getLogin())) {
            throw new IllegalArgumentException("Логин занят!");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        log.info("Saving new User with email {}", user.getEmail()); // Logger от @Slf4j (Lombok)
        userRepository.save(user);  // Сохранение с UNIQUE-проверкой в БД, понимает куда сохранять т.к. класс User помечен аннотацией @Entity
    }
}