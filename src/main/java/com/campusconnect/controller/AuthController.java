package com.campusconnect.controller;

import com.campusconnect.dto.AuthResponse;
import com.campusconnect.dto.LoginRequest;
import com.campusconnect.dto.UserDTO;
import com.campusconnect.model.User;
import com.campusconnect.service.UserService;
import com.campusconnect.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDTO dto) {
        // hash password
        dto.setPassword(passwordEncoder.encode(dto.getPassword()));
        User saved = userService.registerUser(dto);
        // return token immediately (optional)
        String token = jwtUtil.generateToken(saved.getId());
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        User user = userService.getByEmail(req.getEmail());
        if (user == null) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
        String token = jwtUtil.generateToken(user.getId());
        return ResponseEntity.ok(new AuthResponse(token));
    }

}
