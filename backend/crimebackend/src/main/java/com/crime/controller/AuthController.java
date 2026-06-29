package com.crime.controller;

import com.crime.dto.LoginDTO;
import com.crime.dto.RegisterDTO;
import com.crime.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public String register(@RequestBody RegisterDTO registerDTO){

        return authService.register(registerDTO);

    }
    @PostMapping("/login")
    public String login(@RequestBody LoginDTO loginDTO){

        return authService.login(loginDTO);

    }

}