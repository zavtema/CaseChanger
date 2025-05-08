package com.example.CaseChanger.Controllers;

import com.example.CaseChanger.CaptchaDTO.RegistrationDTO;
import com.example.CaseChanger.Models.User;
import com.example.CaseChanger.Services.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class RegistrationController {
    private final RegistrationService userService;
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegistrationDTO dto) {
        try {
            User user = new User();
            user.setLogin(dto.getLogin());
            user.setEmail(dto.getEmail());
            user.setPassword(dto.getPassword());
            userService.register(user, dto.getRecaptchaToken());
            return ResponseEntity.ok("Регистрация прошла успешно!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Ошибка сервера");
        }
    }
}
