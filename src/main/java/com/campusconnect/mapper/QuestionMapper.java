package com.campusconnect.mapper;

import com.campusconnect.dto.response.QuestionResponseDTO;
import com.campusconnect.model.Question;

public class QuestionMapper {

    public static QuestionResponseDTO toDTO(Question q) {
        QuestionResponseDTO dto = new QuestionResponseDTO();
        dto.setId(q.getId());
        dto.setTitle(q.getTitle());
        dto.setBody(q.getBody());
        dto.setUserId(q.getUser().getId());
        dto.setAuthorName(q.getUser().getName());
        dto.setCreatedAt(q.getCreatedAt().toString());
        return dto;
    }
}
