package com.campusconnect.service;

public interface QuestionVoteService {
    int voteQuestion(Long questionId, Long userId, int voteValue);
}
