import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";
import type { Question, QuestionPage } from "../types";

const API_BASE_URL = "http://localhost:8080/api";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ----------------------
// Correct API interface
// ----------------------
interface QuestionsAPI {
  getQuestions: (params?: {
    page?: number;
    size?: number;
    search?: string;
  }) => Promise<AxiosResponse<QuestionPage>>;

  getQuestion: (id: string) => Promise<AxiosResponse<Question>>;

  createQuestion: (questionData: {
    title: string;
    body: string; // frontend uses content
  }) => Promise<AxiosResponse<Question>>;

  voteQuestion: (id: string, vote: "up" | "down") => Promise<AxiosResponse<number>>;

  updateQuestion: (id: string, data: any) => Promise<never>;
  deleteQuestion: (id: string) => Promise<never>;
}

// ----------------------
// Attach token
// ----------------------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ----------------------
// Handle 401
// ----------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ----------------------
// Real API client
// ----------------------
const questionsAPI: QuestionsAPI = {
  getQuestions: (params = {}) => {
    return api.get<QuestionPage>("/questions", { params });
  },

  getQuestion: (id) => {
    return api.get<Question>(`/questions/${id}`);
  },

  createQuestion: ({ title, body}) => {
    return api.post<Question>("/questions/ask", {
      title,
      body: body, // backend requires "body"
    });
  },

  updateQuestion: async () => {
    throw new Error("Update question API not implemented in backend");
  },

  deleteQuestion: async () => {
    throw new Error("Delete question API not implemented in backend");
  },

  voteQuestion: (id, vote) => {
    const value = vote === "up" ? 1 : -1;
    return api.post<number>(`/questions/${id}/vote?value=${value}`);
  },
};

export { api, questionsAPI };
export default questionsAPI;
