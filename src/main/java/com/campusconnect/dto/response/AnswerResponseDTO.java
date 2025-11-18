package com.campusconnect.dto.response;

import lombok.Data;

@Data
public class AnswerResponseDTO {
    private Long id;
    private String body;
    private Long questionId;
    private Long userId;
    private String authorName;
    private int upvotes;
    private String createdAt;
}
