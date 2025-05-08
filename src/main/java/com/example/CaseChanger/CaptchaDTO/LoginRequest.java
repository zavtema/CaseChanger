package com.example.CaseChanger.CaptchaDTO;

import lombok.Data;

@Data
public class LoginRequest {
    private String login;
    private String password;
    private String recaptchaToken;
}