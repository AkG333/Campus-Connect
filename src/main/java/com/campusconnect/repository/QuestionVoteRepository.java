package com.campusconnect.repository;

import com.campusconnect.model.QuestionVote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface QuestionVoteRepository extends JpaRepository<QuestionVote, Long> {
    Optional<QuestionVote> findByUser_IdAndQuestion_Id(Long userId, Long questionId);
}
