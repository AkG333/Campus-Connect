package com.campusconnect.dto;

import lombok.Data;

@Data
public class AnswerDTO {
    private String body;
    private Long questionId;
    private Long userId;
}
