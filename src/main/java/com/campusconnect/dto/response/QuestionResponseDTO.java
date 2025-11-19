package com.campusconnect.dto.response;

import lombok.Data;

@Data
public class QuestionResponseDTO {
    private Long id;
    private String title;
    private String body;
    private Long userId;
    private String authorName;
    private String createdAt;
    private int upvotes;
    private int answerCount;

}
