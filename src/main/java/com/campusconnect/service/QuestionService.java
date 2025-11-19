package com.campusconnect.service;

import com.campusconnect.dto.QuestionDTO;
import com.campusconnect.model.Question;
import org.springframework.data.domain.Page;

import java.util.List;

public interface QuestionService {

    Question askQuestion(QuestionDTO questionDTO);

    Question getQuestion(Long id);

    List<Question> getAllQuestions();

    Question upvoteQuestion(Long id);

    Page<Question> searchQuestions(String keyword, int page, int size, String sortBy);

    Question editQuestion(Long id, Long userId, QuestionDTO dto);

    void deleteQuestion(Long id, Long userId);

}
