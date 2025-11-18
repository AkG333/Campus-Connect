package com.campusconnect.service.impl;

import com.campusconnect.dto.LoginRequest;
import com.campusconnect.dto.UserDTO;
import com.campusconnect.dto.AuthResponse;
import com.campusconnect.dto.response.UserProfileDTO;
import com.campusconnect.mapper.UserMapper;
import com.campusconnect.model.User;
import com.campusconnect.repository.UserRepository;
import com.campusconnect.security.JwtUtil;
import com.campusconnect.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;


    @Override
    public User registerUser(UserDTO dto) {

        User user = User.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(dto.getPassword())
                .role(dto.getRole())
                .build();

        return userRepository.save(user);
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElse(null);
    }

    @Override
    public User getByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    @Override
    public User updateUser(Long id, UserDTO dto) {
        User user = userRepository.findById(id).orElseThrow();

        user.setName(dto.getName());
        user.setRole(dto.getRole());

        return userRepository.save(user);
    }

    @Override
    public UserProfileDTO getProfile(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserMapper.toProfileDTO(user);
    }

    @Override
    public UserProfileDTO getMyProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserMapper.toProfileDTO(user);
    }



}
