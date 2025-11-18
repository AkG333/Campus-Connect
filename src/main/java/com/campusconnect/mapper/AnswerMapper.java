package com.campusconnect.mapper;

import com.campusconnect.dto.response.AnswerResponseDTO;
import com.campusconnect.model.Answer;

public class AnswerMapper {

    public static AnswerResponseDTO toDTO(Answer a) {
        AnswerResponseDTO dto = new AnswerResponseDTO();
        dto.setId(a.getId());
        dto.setBody(a.getBody());
        dto.setQuestionId(a.getQuestion().getId());
        dto.setUserId(a.getUser().getId());
        dto.setAuthorName(a.getUser().getName());
        dto.setUpvotes(a.getUpvotes());
        dto.setCreatedAt(a.getCreatedAt().toString());
        return dto;
    }
}
