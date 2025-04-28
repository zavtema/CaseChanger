package com.example.CaseChanger.Services;


import com.example.CaseChanger.Models.User;
import com.example.CaseChanger.Repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.apache.catalina.Manager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    public void register(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email занят!");
        }
        if (userRepository.existsByLogin(user.getLogin())) {
            throw new IllegalArgumentException("Логин занят!");
        }
        userRepository.save(user);  // Сохранение с UNIQUE-проверкой в БД, понимает куда сохранять т.к. класс User помечен аннотацией @Entity
    }
}
