package com.campusconnect.repository;

import com.campusconnect.model.AnswerVote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AnswerVoteRepository extends JpaRepository<AnswerVote, Long> {

    Optional<AnswerVote> findByUserIdAndAnswerId(Long userId, Long answerId);
}
