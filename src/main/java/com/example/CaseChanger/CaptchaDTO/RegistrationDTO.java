package com.example.CaseChanger.CaptchaDTO;

import lombok.Data;

@Data
public class RegistrationDTO {
    private String login;
    private String email;
    private String password;
    private String recaptchaToken;
}