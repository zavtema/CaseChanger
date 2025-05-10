package com.example.CaseChanger.configuration;

import com.example.CaseChanger.Services.AuthService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;

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
                                            FilterChain chain, Authentication authResult) throws IOException, ServletException {

        // Логируем, например:
        System.out.println(">>> successfulAuthentication: " + authResult.getName());

        SecurityContext context = SecurityContextHolder.createEmptyContext(); // создаем хранилище безопасности
        context.setAuthentication(authResult); // кладу результат аутентификации
        SecurityContextHolder.setContext(context); // говорю Spring Security о наличии "кастомного" хранилища

        // Сохраняем в сессии
        HttpSession session = request.getSession(true); //  Это позволяет Spring Security восстанавливать пользователя при следующих HTTP-запросах,
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context); // Даже если между ними проходит время (до выхода из сессии).

        // Редирект
        if (!response.isCommitted()) {
            response.sendRedirect("/");
        }
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                              AuthenticationException failed)
            throws IOException, ServletException {
        System.out.println(">>> unsuccessfulAuthentication: " + failed.getMessage());
        response.sendRedirect("/login?error=true");
    }
}
