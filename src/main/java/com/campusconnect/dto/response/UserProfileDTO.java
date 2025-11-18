package com.campusconnect.dto.response;

import lombok.Data;

@Data
public class UserProfileDTO {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String createdAt;
}
