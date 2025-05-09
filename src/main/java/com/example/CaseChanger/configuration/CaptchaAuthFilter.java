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

// наследуется для того, чтобы мы добавили проверку Captcha перед классической проверкой авторизации
@AllArgsConstructor
public class CaptchaAuthFilter extends UsernamePasswordAuthenticationFilter {
    private final AuthService authSevice;
    @Override
    public Authentication attemptAuthentication(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws AuthenticationException {
        String token = request.getParameter("recaptchaToken");
        try {
            authSevice.verifyCaptcha(token);
        } catch (IllegalArgumentException e) {
            throw new BadCredentialsException(e.getMessage());
        }
        return super.attemptAuthentication(request, response);
    }
    // Ниже хрен пойми зачем добавляю
    @Override
    protected void successfulAuthentication(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain,
            Authentication authResult
    ) throws IOException, ServletException {
        super.successfulAuthentication(request, response, chain, authResult);
        logger.info("Аутентификация успешна для пользователя: " + authResult.getName()); // Логирование
        response.sendRedirect("/"); // Редирект на главную
    }

}
