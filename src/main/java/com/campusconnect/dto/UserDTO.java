package com.campusconnect.dto;

import lombok.Data;

@Data
public class UserDTO {
    private String name;
    private String email;
    private String password;
    private String role; // STUDENT / ADMIN / PROFESSOR
}
