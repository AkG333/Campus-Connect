package com.campusconnect.mapper;

import com.campusconnect.dto.response.UserProfileDTO;
import com.campusconnect.dto.response.UserResponseDTO;
import com.campusconnect.model.User;

public class UserMapper {

    public static UserResponseDTO toDTO(User u) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(u.getId());
        dto.setName(u.getName());
        dto.setEmail(u.getEmail());
        dto.setRole(u.getRole());
        return dto;
    }

    public static UserProfileDTO toProfileDTO(User u) {
        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(u.getId());
        dto.setName(u.getName());
        dto.setEmail(u.getEmail());
        dto.setRole(u.getRole());
        dto.setCreatedAt(u.getCreatedAt().toString());
        return dto;
    }

}
