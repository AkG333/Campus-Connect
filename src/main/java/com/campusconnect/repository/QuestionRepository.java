package com.campusconnect.repository;

import com.campusconnect.model.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findByUserId(Long userId);

    Page<Question> findByTitleContainingIgnoreCase(String keyword, Pageable pageable);


}
