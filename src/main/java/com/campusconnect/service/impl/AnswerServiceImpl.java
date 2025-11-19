package com.campusconnect.service.impl;

import com.campusconnect.dto.AnswerDTO;
import com.campusconnect.model.Answer;
import com.campusconnect.repository.AnswerRepository;
import com.campusconnect.repository.QuestionRepository;
import com.campusconnect.repository.UserRepository;
import com.campusconnect.service.AnswerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnswerServiceImpl implements AnswerService {

    @Autowired
    private AnswerRepository answerRepo;

    @Autowired
    private QuestionRepository questionRepo;

    @Autowired
    private UserRepository userRepo;

    @Override
    public Answer postAnswer(AnswerDTO dto) {

        Answer answer = Answer.builder()
                .body(dto.getBody())
                .question(questionRepo.findById(dto.getQuestionId()).orElse(null))
                .user(userRepo.findById(dto.getUserId()).orElse(null))
                .build();

        return answerRepo.save(answer);
    }

    @Override
    public List<Answer> getAnswersForQuestion(Long questionId) {
        return answerRepo.findByQuestionId(questionId);
    }

    @Override
    public Answer upvoteAnswer(Long id) {
        Answer a = answerRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        a.setUpvotes(a.getUpvotes() + 1);

        return answerRepo.save(a);
    }

    @Override
    public Page<Answer> getAnswers(Long questionId, int page, int size, String sortBy) {

        Sort sort;

        switch (sortBy) {
            case "oldest":
                sort = Sort.by("createdAt").ascending();
                break;
            case "upvotes":
                sort = Sort.by("upvotes").descending();
                break;
            default: // latest
                sort = Sort.by("createdAt").descending();
                break;
        }

        Pageable pageable = PageRequest.of(page, size, sort);

        return answerRepo.findByQuestionId(questionId, pageable);
    }

    @Override
    public Answer editAnswer(Long id, Long userId, AnswerDTO dto) {
        Answer a = answerRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        if (!a.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        a.setBody(dto.getBody());
        return answerRepo.save(a);
    }

    @Override
    public void deleteAnswer(Long id, Long userId) {
        Answer a = answerRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        if (!a.getUser().getId().equals(userId))
            throw new RuntimeException("Unauthorized");

        answerRepo.delete(a);
    }

}
