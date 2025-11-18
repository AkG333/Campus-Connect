import { createContext, useContext, useState} from 'react';
import type { ReactNode } from 'react';
import { questionsAPI } from '../services/api';
import type { Question } from '../types';

interface QuestionContextType {
  questions: Question[];
  loading: boolean;
  error: string | null;
  fetchQuestions: (params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    tag?: string 
  }) => Promise<void>;
  createQuestion: (questionData: { 
    title: string; 
    content: string;
  }) => Promise<Question>;
  updateQuestion: (id: string, questionData: { 
    title?: string; 
    content?: string;
  }) => Promise<Question>;
  deleteQuestion: (id: string) => Promise<void>;
  voteQuestion: (id: string, vote: 'up' | 'down') => Promise<number>;
  getQuestion: (id: string) => Promise<Question>;
}

const QuestionContext = createContext<QuestionContextType | undefined>(undefined);

export const QuestionProvider = ({ children }: { children: ReactNode }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await questionsAPI.getQuestions(params);
      // The API returns { data: Question[] } so we can directly set the questions
      setQuestions(response.data);
    } catch (err) {
      setError('Failed to fetch questions');
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const createQuestion = async (questionData: { 
    title: string; 
    content: string;
  }) => {
  try {
    const response = await questionsAPI.createQuestion(questionData);
    setQuestions(prev => [response.data, ...prev]);
    return response.data;
  } catch (err) {
    console.error('Error creating question:', err);
    throw err;
  }
};

  const updateQuestion = async (id: string, questionData: { 
    title?: string; 
    content?: string;
  }) => {
    try {
      const response = await questionsAPI.updateQuestion(id, questionData);
      setQuestions(prev => 
        prev.map(q => q.id.toString() === id.toString() ? response.data : q)
      );
      return response.data;
    } catch (err) {
      console.error('Error updating question:', err);
      throw err;
    }
  };

  const deleteQuestion = async (id: string) => {
    try {
      await questionsAPI.deleteQuestion(id);
      setQuestions(prev => prev.filter(q => q.id.toString() !== id.toString()));
    } catch (err) {
      console.error('Error deleting question:', err);
      throw err;
    }
  };

  const voteQuestion = async (id: string, vote: 'up' | 'down') => {
    try {
      const response = await questionsAPI.voteQuestion(id, vote);
      setQuestions(prev => 
        prev.map(q => q.id.toString() === id.toString() ? { ...q, votes: response.data.votes } : q)
      );
      return response.data.votes;
    } catch (err) {
      console.error('Error voting on question:', err);
      throw err;
    }
  };

  const getQuestion = async (id: string) => {
    try {
      const response = await questionsAPI.getQuestion(id);
      return response.data;
    } catch (err) {
      console.error('Error fetching question:', err);
      throw err;
    }
  };

  const value = {
    questions,
    loading,
    error,
    fetchQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    voteQuestion,
    getQuestion,
  };

  return (
    <QuestionContext.Provider value={value}>
      {children}
    </QuestionContext.Provider>
  );
};

export const useQuestions = (): QuestionContextType => {
  const context = useContext(QuestionContext);
  if (context === undefined) {
    throw new Error('useQuestions must be used within a QuestionProvider');
  }
  return context;
};

export default QuestionContext;
