package com.example.CaseChanger.configuration;

import com.example.CaseChanger.Services.AuthService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;

@AllArgsConstructor
public class CaptchaAuthFilter extends UsernamePasswordAuthenticationFilter {
    private final AuthService authService;

    @Override
    public Authentication attemptAuthentication(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws AuthenticationException {
        System.out.println(">>> attemptAuthentication STARTED");

        String token = request.getParameter("recaptchaToken");
        System.out.println(">>> recaptchaToken = " + token); // ← вот это добавь

        try {
            authService.verifyCaptcha(token);
        } catch (IllegalArgumentException e) {
            System.out.println(">>> CAPTCHA failed: " + e.getMessage()); // можно добавить для ясности
            throw new BadCredentialsException(e.getMessage());
        }

        return super.attemptAuthentication(request, response);
    }


    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                            FilterChain chain, Authentication authResult)
            throws IOException, ServletException {
        // Важно: установим сессию для текущего пользователя
        super.successfulAuthentication(request, response, chain, authResult);

        // Логируем успешную аутентификацию
        System.out.println(">>> successfulAuthentication: " + authResult.getName());

        // Редирект на главную
        response.sendRedirect("/");
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                              AuthenticationException failed)
            throws IOException, ServletException {
        System.out.println(">>> unsuccessfulAuthentication: " + failed.getMessage());
        response.sendRedirect("/login?error=true");
    }
}
