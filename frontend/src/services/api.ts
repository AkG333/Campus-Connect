import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { Question } from '../types';

const API_BASE_URL = 'http://localhost:8080/api'; // Update with your actual API base URL

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Extend the AxiosInstance interface to include our custom methods
interface QuestionsAPI {
  getQuestions: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    tag?: string;
  }) => Promise<{ data: Question[] }>;
  
  getQuestion: (id: string) => Promise<{ data: Question }>;
  
  createQuestion: (questionData: {
    title: string;
    content: string;
  }) => Promise<{ data: Question }>;
  
  updateQuestion: (id: string, questionData: {
    title?: string;
    content?: string;
  }) => Promise<{ data: Question }>;
  
  deleteQuestion: (id: string) => Promise<void>;
  
  voteQuestion: (id: string, vote: 'up' | 'down') => Promise<{ data: { votes: number } }>;
}

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Create typed API client
const questionsAPI: QuestionsAPI = {
  // Get all questions with optional pagination and filtering
  getQuestions: (params = {}) => {
    return api.get<Question[]>('/questions/all', { params });
  },

  // Get a single question by ID
  getQuestion: (id) => {
    return api.get<Question>(`/questions/${id}`);
  },

  // Create a new question
  createQuestion: (questionData) => {
    return api.post<Question>('/questions/ask', questionData);
  },

  // Update a question
  updateQuestion: (id, questionData) => {
    return api.put<Question>(`/questions/${id}`, questionData);
  },

  // Delete a question
  deleteQuestion: (id) => {
    return api.delete(`/questions/${id}`) as Promise<void>;
  },

  // Vote on a question
  voteQuestion: (id, vote) => {
    return api.post<{ votes: number }>(`/questions/${id}/vote`, { vote });
  }
};

export { api, questionsAPI };
export default questionsAPI;