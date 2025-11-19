package com.campusconnect.controller;

import com.campusconnect.dto.AnswerDTO;
import com.campusconnect.dto.response.AnswerResponseDTO;
import com.campusconnect.mapper.AnswerMapper;
import com.campusconnect.model.Answer;
import com.campusconnect.security.SecurityUtils;
import com.campusconnect.service.AnswerService;
import com.campusconnect.service.AnswerVoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/answers")
@CrossOrigin
public class AnswerController {

    @Autowired
    private AnswerService answerService;

    @Autowired
    private AnswerVoteService answerVoteService;


    @GetMapping("/question/{questionId}")
    public List<AnswerResponseDTO> getAnswers(@PathVariable Long questionId) {
        return answerService.getAnswersForQuestion(questionId)
                .stream()
                .map(AnswerMapper::toDTO)
                .toList();
    }

    @PostMapping("/post")
    public AnswerResponseDTO postAnswer(@RequestBody AnswerDTO dto) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        dto.setUserId(currentUserId);

        Answer answer = answerService.postAnswer(dto);
        return AnswerMapper.toDTO(answer);
    }

    @PostMapping("/{id}/upvote")
    public AnswerResponseDTO upvoteAnswer(@PathVariable Long id) {
        Answer a = answerService.upvoteAnswer(id);
        return AnswerMapper.toDTO(a);
    }

    @PostMapping("/{id}/vote")
    public int voteAnswer(@PathVariable Long id, @RequestParam int value) {
        Long userId = SecurityUtils.getCurrentUserId();
        return answerVoteService.voteAnswer(id, userId, value);
    }

    @GetMapping
    public Page<AnswerResponseDTO> getAnswers(
            @RequestParam Long questionId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "latest") String sort) {

        Page<Answer> result = answerService.getAnswers(questionId, page, size, sort);

        return result.map(AnswerMapper::toDTO);
    }

    @PutMapping("/{id}/edit")
    public AnswerResponseDTO editAnswer(@PathVariable Long id, @RequestBody AnswerDTO dto) {
        Long userId = SecurityUtils.getCurrentUserId();
        Answer updated = answerService.editAnswer(id, userId, dto);
        return AnswerMapper.toDTO(updated);
    }

    @DeleteMapping("/{id}")
    public String deleteAnswer(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        answerService.deleteAnswer(id, userId);
        return "Answer deleted successfully";
    }


}
