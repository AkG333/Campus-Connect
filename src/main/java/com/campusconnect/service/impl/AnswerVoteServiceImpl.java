package com.campusconnect.service.impl;

import com.campusconnect.model.Answer;
import com.campusconnect.model.AnswerVote;
import com.campusconnect.model.User;
import com.campusconnect.repository.AnswerRepository;
import com.campusconnect.repository.AnswerVoteRepository;
import com.campusconnect.repository.UserRepository;
import com.campusconnect.service.AnswerVoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AnswerVoteServiceImpl implements AnswerVoteService {

    private final AnswerVoteRepository voteRepo;
    private final AnswerRepository answerRepo;
    private final UserRepository userRepo;

    @Override
    public int voteAnswer(Long answerId, Long userId, int voteValue) {

        Answer answer = answerRepo.findById(answerId).orElseThrow();
        User currentUser = userRepo.findById(userId).orElseThrow();

        var existingVoteOpt = voteRepo.findByUserIdAndAnswerId(userId, answerId);

        if (existingVoteOpt.isEmpty()) {
            // First time voting
            AnswerVote vote = AnswerVote.builder()
                    .voteValue(voteValue)
                    .answer(answer)
                    .user(currentUser)   // ✅ CORRECT USER
                    .build();

            voteRepo.save(vote);
            answer.setUpvotes(answer.getUpvotes() + voteValue);
        } else {
            AnswerVote existing = existingVoteOpt.get();

            if (existing.getVoteValue() == voteValue) {
                // toggle remove
                answer.setUpvotes(answer.getUpvotes() - voteValue);
                voteRepo.delete(existing);
            } else {
                // switch vote
                answer.setUpvotes(answer.getUpvotes() + (voteValue * 2));
                existing.setVoteValue(voteValue);
                voteRepo.save(existing);
            }
        }

        answerRepo.save(answer);
        return answer.getUpvotes();
    }

}
