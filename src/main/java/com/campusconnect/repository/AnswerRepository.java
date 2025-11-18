package com.campusconnect.repository;

import com.campusconnect.model.Answer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AnswerRepository extends JpaRepository<Answer, Long> {

    List<Answer> findByQuestionId(Long questionId);

    List<Answer> findByUserId(Long userId);

    Page<Answer> findByQuestionId(Long questionId, Pageable pageable);
}
