package com.campusconnect.service.impl;

import com.campusconnect.model.Question;
import com.campusconnect.model.QuestionVote;
import com.campusconnect.repository.QuestionRepository;
import com.campusconnect.repository.QuestionVoteRepository;
import com.campusconnect.service.QuestionVoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class QuestionVoteServiceImpl implements QuestionVoteService {

    private final QuestionVoteRepository voteRepo;
    private final QuestionRepository questionRepo;

    @Override
    public int voteQuestion(Long questionId, Long userId, int voteValue) {

        Question q = questionRepo.findById(questionId).orElseThrow();

        // Check if user already voted
        var existingVoteOpt = voteRepo.findByUserIdAndQuestionId(userId, questionId);

        if (existingVoteOpt.isEmpty()) {
            // No previous vote
            QuestionVote vote = QuestionVote.builder()
                    .voteValue(voteValue)
                    .question(q)
                    .user(q.getUser())
                    .build();

            voteRepo.save(vote);
            q.setUpvotes(q.getUpvotes() + voteValue);
        }
        else {
            QuestionVote existing = existingVoteOpt.get();

            if (existing.getVoteValue() == voteValue) {
                // Toggle (remove vote)
                q.setUpvotes(q.getUpvotes() - voteValue);
                voteRepo.delete(existing);
            } else {
                // Change vote (switch)
                q.setUpvotes(q.getUpvotes() + (voteValue * 2));
                existing.setVoteValue(voteValue);
                voteRepo.save(existing);
            }
        }

        questionRepo.save(q);
        return q.getUpvotes();
    }
}
