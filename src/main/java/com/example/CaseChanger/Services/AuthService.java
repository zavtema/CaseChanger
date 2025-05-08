package com.example.CaseChanger.Services;

import com.example.CaseChanger.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService implements UserDetailsService {
    private final UserRepository userRepository;
    private final RecaptchaService recaptchaService;

    @Override
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        com.example.CaseChanger.Models.User user = userRepository.findByLogin(login)
                .orElseThrow(() -> new UsernameNotFoundException("Пользователь с таким именем не найден"));

        return User.builder()
                .username(user.getLogin())
                .password(user.getPassword())
                .roles("USER") // <-- добавил, чтобы были роли
                .build();
    }

    public void verifyCaptcha(String token) {
        if (!recaptchaService.verify(token, "login")) {
            throw new IllegalArgumentException("CAPTCHA failed");
        }
    }
}