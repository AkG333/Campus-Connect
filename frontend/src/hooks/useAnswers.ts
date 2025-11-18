import { useState, useCallback } from 'react';
import { api } from '../services/api';
import type { Answer } from '../types';

export function useAnswers() {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnswers = useCallback(async (questionId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/api/questions/${questionId}/answers`);
      setAnswers(response.data);
    } catch (err) {
      setError('Failed to fetch answers');
      console.error('Error fetching answers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createAnswer = async (questionId: string, body: string) => {
    try {
      const response = await api.post(`/api/questions/${questionId}/answers`, { body });
      return response.data;
    } catch (err) {
      console.error('Error creating answer:', err);
      throw err;
    }
  };

  const voteAnswer = async (answerId: string, voteType: 'up' | 'down') => {
    try {
      const response = await api.post(`/api/answers/${answerId}/vote`, { voteType });
      return response.data;
    } catch (err) {
      console.error('Error voting on answer:', err);
      throw err;
    }
  };

  const acceptAnswer = async (answerId: string) => {
    try {
      const response = await api.post(`/api/answers/${answerId}/accept`);
      return response.data;
    } catch (err) {
      console.error('Error accepting answer:', err);
      throw err;
    }
  };

  return {
    answers,
    loading,
    error,
    fetchAnswers,
    createAnswer,
    voteAnswer,
    acceptAnswer,
  };
}