package com.campusconnect.service;

import com.campusconnect.dto.AnswerDTO;
import com.campusconnect.model.Answer;
import org.springframework.data.domain.Page;

import java.util.List;

public interface AnswerService {

    Answer postAnswer(AnswerDTO answerDTO);

    List<Answer> getAnswersForQuestion(Long questionId);

    Answer upvoteAnswer(Long id);

    Page<Answer> getAnswers(Long questionId, int page, int size, String sortBy);

}
