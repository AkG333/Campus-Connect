package com.campusconnect.controller;

import com.campusconnect.dto.UserDTO;
import com.campusconnect.dto.response.QuestionResponseDTO;
import com.campusconnect.dto.response.UserProfileDTO;
import com.campusconnect.mapper.QuestionMapper;
import com.campusconnect.mapper.UserMapper;
import com.campusconnect.model.User;
import com.campusconnect.security.SecurityUtils;
import com.campusconnect.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User register(@RequestBody UserDTO dto) {
        return userService.registerUser(dto);
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @GetMapping("/{id}/profile")
    public UserProfileDTO getUserProfile(@PathVariable Long id) {
        return userService.getProfile(id);
    }

    @GetMapping("/me")
    public UserProfileDTO getMyProfile() {
        Long userId = SecurityUtils.getCurrentUserId();
        return userService.getMyProfile(userId);
    }

    @PutMapping("/update")
    public UserProfileDTO updateProfile(@RequestBody UserDTO dto) {
        Long userId = SecurityUtils.getCurrentUserId();
        User updated = userService.updateUser(userId, dto);
        return UserMapper.toProfileDTO(updated);
    }


}
