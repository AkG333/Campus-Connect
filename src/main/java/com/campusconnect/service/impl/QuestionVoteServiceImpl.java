package com.campusconnect.service.impl;

import com.campusconnect.model.Question;
import com.campusconnect.model.QuestionVote;
import com.campusconnect.model.User;
import com.campusconnect.repository.QuestionRepository;
import com.campusconnect.repository.QuestionVoteRepository;
import com.campusconnect.repository.UserRepository;
import com.campusconnect.service.QuestionVoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class QuestionVoteServiceImpl implements QuestionVoteService {

    private final QuestionVoteRepository voteRepo;
    private final QuestionRepository questionRepo;
    private final UserRepository userRepository;

    @Override
    public int voteQuestion(Long questionId, Long userId, int voteValue) {

        Question q = questionRepo.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        var existingOpt = voteRepo.findByUser_IdAndQuestion_Id(userId, questionId);

        if (existingOpt.isEmpty()) {
            // First time voting
            QuestionVote vote = QuestionVote.builder()
                    .voteValue(voteValue)
                    .question(q)
                    .user(user)     // ✔ correct
                    .build();

            voteRepo.save(vote);
            q.setUpvotes(q.getUpvotes() + voteValue);
        }
        else {
            QuestionVote existing = existingOpt.get();

            if (existing.getVoteValue() == voteValue) {
                // Same vote again → remove vote
                q.setUpvotes(q.getUpvotes() - voteValue);
                voteRepo.delete(existing);
            } else {
                // Change vote
                q.setUpvotes(q.getUpvotes() + (voteValue * 2));
                existing.setVoteValue(voteValue);
                voteRepo.save(existing);
            }
        }

        questionRepo.save(q);
        return q.getUpvotes();
    }
}
