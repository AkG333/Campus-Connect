package com.campusconnect.service;

import com.campusconnect.dto.LoginRequest;
import com.campusconnect.dto.RegisterRequestDTO;
import com.campusconnect.dto.UserDTO;
import com.campusconnect.dto.response.AuthResponse;
import com.campusconnect.dto.response.UserProfileDTO;
import com.campusconnect.model.Question;
import com.campusconnect.model.User;

import java.util.List;

public interface UserService {

    User registerUser(UserDTO userDTO);

    User getByEmail(String email);

    User getUserById(Long id);

    User updateUser(Long id, UserDTO dto);

    UserProfileDTO getProfile(Long id);

    UserProfileDTO getMyProfile(Long userId);

    List<Question> getQuestionsByUser(Long userId);

}
