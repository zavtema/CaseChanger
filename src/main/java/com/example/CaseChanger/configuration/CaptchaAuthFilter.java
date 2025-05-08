package com.example.CaseChanger.configuration;

import com.example.CaseChanger.Services.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

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
}
