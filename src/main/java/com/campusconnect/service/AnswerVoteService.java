package com.campusconnect.service;

public interface AnswerVoteService {
    int voteAnswer(Long answerId, Long userId, int voteValue);
}
