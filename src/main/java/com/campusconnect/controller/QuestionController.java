package com.campusconnect.controller;

import com.campusconnect.dto.QuestionDTO;
import com.campusconnect.dto.response.QuestionResponseDTO;
import com.campusconnect.mapper.QuestionMapper;
import com.campusconnect.model.Question;
import com.campusconnect.security.SecurityUtils;
import com.campusconnect.service.QuestionService;
import com.campusconnect.service.QuestionVoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @Autowired
    private QuestionVoteService questionVoteService;


    @PostMapping("/ask")
    public Question askQuestion(@RequestBody QuestionDTO dto) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        if (currentUserId == null) throw new RuntimeException("Unauthorized");
        dto.setUserId(currentUserId); // override any client-provided userId
        return questionService.askQuestion(dto);
    }



    @GetMapping("/{id}")
    public QuestionResponseDTO getQuestion(@PathVariable Long id) {
        Question q = questionService.getQuestion(id);
        return QuestionMapper.toDTO(q);
    }

    @GetMapping("/all")
    public List<QuestionResponseDTO> getAllQuestions() {
        return questionService.getAllQuestions()
                .stream()
                .map(QuestionMapper::toDTO)
                .toList();
    }

    @PostMapping("/{id}/upvote")
    public QuestionResponseDTO upvoteQuestion(@PathVariable Long id) {
        Question q = questionService.upvoteQuestion(id);
        return QuestionMapper.toDTO(q);
    }

    @PostMapping("/{id}/vote")
    public int voteQuestion(@PathVariable Long id, @RequestParam int value) {
        Long userId = SecurityUtils.getCurrentUserId();
        return questionVoteService.voteQuestion(id, userId, value);
    }

    @GetMapping
    public Page<QuestionResponseDTO> searchQuestions(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "latest") String sort
    ) {
        Page<Question> result = questionService.searchQuestions(search, page, size, sort);

        return result.map(QuestionMapper::toDTO);
    }

    @PutMapping("/{id}/edit")
    public QuestionResponseDTO editQuestion(@PathVariable Long id, @RequestBody QuestionDTO dto) {
        Long userId = SecurityUtils.getCurrentUserId();
        Question q = questionService.editQuestion(id, userId, dto);
        return QuestionMapper.toDTO(q);
    }

    @DeleteMapping("/{id}")
    public String deleteQuestion(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        questionService.deleteQuestion(id, userId);
        return "Question deleted successfully";
    }


}
