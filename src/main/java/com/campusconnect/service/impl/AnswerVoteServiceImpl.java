package com.campusconnect.service.impl;

import com.campusconnect.model.Answer;
import com.campusconnect.model.AnswerVote;
import com.campusconnect.repository.AnswerRepository;
import com.campusconnect.repository.AnswerVoteRepository;
import com.campusconnect.service.AnswerVoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AnswerVoteServiceImpl implements AnswerVoteService {

    private final AnswerVoteRepository voteRepo;
    private final AnswerRepository answerRepo;

    @Override
    public int voteAnswer(Long answerId, Long userId, int voteValue) {

        Answer answer = answerRepo.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        var existingVoteOpt = voteRepo.findByUserIdAndAnswerId(userId, answerId);

        if (existingVoteOpt.isEmpty()) {
            // User never voted before
            AnswerVote vote = AnswerVote.builder()
                    .voteValue(voteValue)
                    .answer(answer)
                    .user(answer.getUser())
                    .build();

            voteRepo.save(vote);
            answer.setUpvotes(answer.getUpvotes() + voteValue);
        }
        else {
            AnswerVote existing = existingVoteOpt.get();

            if (existing.getVoteValue() == voteValue) {
                // Toggle (remove vote)
                answer.setUpvotes(answer.getUpvotes() - voteValue);
                voteRepo.delete(existing);
            } else {
                // Switching vote (e.g., upvote → downvote)
                answer.setUpvotes(answer.getUpvotes() + (voteValue * 2));
                existing.setVoteValue(voteValue);
                voteRepo.save(existing);
            }
        }

        answerRepo.save(answer);
        return answer.getUpvotes();
    }
}
