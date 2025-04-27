package com.example.CaseChanger.Controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequiredArgsConstructor
public class UserController {

    @GetMapping("/")
    public String homepage() {
        return "NotFoundPage";
    }

    @GetMapping("/login")
    public String login() {
        return "NotFoundPage";
    }

    @GetMapping("/registration")
    public String registration() {
        return "NotFoundPage";
    }
}
