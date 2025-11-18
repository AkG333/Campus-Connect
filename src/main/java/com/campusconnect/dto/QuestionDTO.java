package com.campusconnect.dto;

import lombok.Data;

@Data
public class QuestionDTO {
    private String title;
    private String body;
    private Long userId;   // the user who asked the question
}
