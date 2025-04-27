package com.example.CaseChanger.Services;


import com.example.CaseChanger.Models.User;
import com.example.CaseChanger.Repositories.UserRepository;
import lombok.AllArgsConstructor;
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
    }
    public void save(User user) {
        userRepository.save(user);  // Сохранение с UNIQUE-проверкой в БД, понимает куда сохранять т.к. класс User помечен аннотацией @Entity
    }
}
