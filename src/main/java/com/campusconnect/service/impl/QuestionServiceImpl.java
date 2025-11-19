package com.campusconnect.service.impl;

import com.campusconnect.dto.QuestionDTO;
import com.campusconnect.model.Question;
import com.campusconnect.repository.QuestionRepository;
import com.campusconnect.repository.UserRepository;
import com.campusconnect.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionServiceImpl implements QuestionService {

    @Autowired
    private QuestionRepository questionRepo;

    @Autowired
    private UserRepository userRepo;



    @Override
    public Question askQuestion(QuestionDTO dto) {

        Question question = Question.builder()
                .title(dto.getTitle())
                .body(dto.getBody())
                .user(userRepo.findById(dto.getUserId()).orElse(null))
                .build();

        return questionRepo.save(question);
    }

    @Override
    public Question getQuestion(Long id) {
        return questionRepo.findById(id).orElse(null);
    }

    @Override
    public List<Question> getAllQuestions() {
        return questionRepo.findAll();
    }

    @Override
    public Question upvoteQuestion(Long id) {
        Question q = questionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        q.setUpvotes(q.getUpvotes() + 1);

        return questionRepo.save(q);
    }

    @Override
    public Page<Question> searchQuestions(String keyword, int page, int size, String sortBy) {

        Sort sort;

        switch (sortBy) {
            case "oldest":
                sort = Sort.by("createdAt").ascending();
                break;
            case "upvotes":
                sort = Sort.by("upvotes").descending();
                break;
            default:   // latest
                sort = Sort.by("createdAt").descending();
                break;
        }

        Pageable pageable = PageRequest.of(page, size, sort);

        if (keyword == null || keyword.trim().isEmpty()) {
            return questionRepo.findAll(pageable);
        }

        return questionRepo.findByTitleContainingIgnoreCase(keyword, pageable);
    }

    @Override
    public Question editQuestion(Long id, Long userId, QuestionDTO dto) {
        Question q = questionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        if (!q.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        q.setTitle(dto.getTitle());
        q.setBody(dto.getBody());

        return questionRepo.save(q);
    }

    @Override
    public void deleteQuestion(Long id, Long userId) {
        Question q = questionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        if (!q.getUser().getId().equals(userId))
            throw new RuntimeException("Unauthorized");

        questionRepo.delete(q);
    }


}
