package com.crime.service;

import com.crime.dto.LoginDTO;
import com.crime.dto.RegisterDTO;
import com.crime.entity.User;
import com.crime.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public String register(RegisterDTO registerDTO) {

        User user = new User();

        user.setName(registerDTO.getName());

        user.setEmail(registerDTO.getEmail());

        user.setPassword(
                passwordEncoder.encode(
                        registerDTO.getPassword()));

        user.setRole(registerDTO.getRole());

        userRepository.save(user);

        return "User Saved Successfully";

    }

    public String login(LoginDTO loginDTO) {

        User user =
                userRepository.findByEmail(
                                loginDTO.getEmail())
                        .orElse(null);

        if (user == null) {

            return "User Not Found";

        }

        if (passwordEncoder.matches(
                loginDTO.getPassword(),
                user.getPassword())) {

            return jwtService.generateToken(
                    user.getEmail());

        }

        return "Invalid Password";

    }

}