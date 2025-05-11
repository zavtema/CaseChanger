package com.example.CaseChanger.configuration;

import com.example.CaseChanger.Services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.rememberme.JdbcTokenRepositoryImpl;
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository;

import javax.sql.DataSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final AuthService authService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http,
                                           RateLimitingFilter rateLimitingFilter,
                                           AuthenticationManager authenticationManager,
                                           PersistentTokenRepository tokenRepository) throws Exception {

        CaptchaAuthFilter captchaFilter = new CaptchaAuthFilter(authService);
        captchaFilter.setAuthenticationManager(authenticationManager);
        captchaFilter.setRememberMeServices(rememberMeServices(tokenRepository));
        captchaFilter.setFilterProcessesUrl("/api/users/login"); // путь логина

        http
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                )
                .addFilterBefore(rateLimitingFilter, CaptchaAuthFilter.class)
                .addFilterAt(captchaFilter, UsernamePasswordAuthenticationFilter.class) // заменяем стандартный логин-фильтр
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/login", "/register", "/css/**", "/js/**", "/api/users/login", "/api/users/register").permitAll()
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .requestMatchers("/user/**").hasAnyRole("USER", "ADMIN")
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginPage("/login")
                        .loginProcessingUrl("/api/users/login")
                        .failureUrl("/login?error=true")
                        .permitAll()
                )
                .rememberMe(remember -> remember
                        .key("uniqueAndSecretKey")
                        .tokenRepository(tokenRepository)
                        .tokenValiditySeconds(1209600)) // время жизни токена

                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/")
                        .permitAll()
                )
                .userDetailsService(authService);
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(8);
    }

    @Bean
    public PersistentTokenRepository persistentTokenRepository(DataSource dataSource) { // PersistentTokenRepository - интерфейс для работы с куками, DataSource - интерфейс для работы с бд
        JdbcTokenRepositoryImpl tokenRepository = new JdbcTokenRepositoryImpl(); // реализация интерфейса PersistentTokenRepository, хранящая токены в таблице persistent_logins
        tokenRepository.setDataSource(dataSource); // dataSource уже содержит все данные о бд, указанные в properties
        return tokenRepository; // возврат бин в контейнер Spring, чтобы он мог его использовать
    }

    @Bean
    public org.springframework.security.web.authentication.RememberMeServices rememberMeServices(PersistentTokenRepository tokenRepository) {
        var services = new org.springframework.security.web.authentication.rememberme.PersistentTokenBasedRememberMeServices(
                "uniqueAndSecretKey",  // должен совпадать с ключом в .rememberMe(), ключ, защищающий от злоумышленников
                authService, // достаем из куки в браузере токен (это как бы загрузка данных пользователя для восстановления сессии)
                tokenRepository
        );
        services.setTokenValiditySeconds(1209600); // 14 дней
        return services;
    }
}