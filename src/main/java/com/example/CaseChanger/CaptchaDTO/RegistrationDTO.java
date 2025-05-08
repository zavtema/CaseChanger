package com.example.CaseChanger.CaptchaDTO;

import lombok.Data;
import org.springframework.stereotype.Service;

@Data
public class RegistrationDTO {
    private String login;
    private String email;
    private String password;
    private String recaptchaToken;
}