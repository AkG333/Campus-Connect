import { useState, useCallback } from 'react';
import { api } from '../services/api';
import type { Question } from '../types';

export function useQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = useCallback(async (params: { search?: string } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/questions', { params });
      setQuestions(response.data);
    } catch (err) {
      setError('Failed to fetch questions');
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createQuestion = async (questionData: { title: string; body: string }) => {
    try {
      const response = await api.post('/api/questions', questionData);
      return response.data;
    } catch (err) {
      console.error('Error creating question:', err);
      throw err;
    }
  };

  const getQuestion = async (id: string) => {
    try {
      const response = await api.get(`/api/questions/${id}`);
      return response.data;
    } catch (err) {
      console.error('Error fetching question:', err);
      throw err;
    }
  };

  const voteQuestion = async (id: string, voteType: 'up' | 'down') => {
    try {
      const response = await api.post(`/api/questions/${id}/vote`, { voteType });
      return response.data;
    } catch (err) {
      console.error('Error voting on question:', err);
      throw err;
    }
  };

  return {
    questions,
    loading,
    error,
    fetchQuestions,
    createQuestion,
    getQuestion,
    voteQuestion,
  };
}