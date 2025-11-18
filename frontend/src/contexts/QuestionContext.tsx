import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { questionsAPI } from "../services/api";
import type { Question, QuestionPage } from "../types";

interface QuestionContextType {
  questions: Question[];
  loading: boolean;
  error: string | null;
  fetchQuestions: (params?: {
    page?: number;
    size?: number;
    search?: string;
  }) => Promise<void>;
  createQuestion: (questionData: {
    title: string;
    body: string;
  }) => Promise<Question>;
  voteQuestion: (id: string, vote: "up" | "down") => Promise<number>;
  getQuestion: (id: string) => Promise<Question>;
}

const QuestionContext = createContext<QuestionContextType | undefined>(
  undefined
);

export const QuestionProvider = ({ children }: { children: ReactNode }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // -------------------------
  // FETCH QUESTIONS
  // -------------------------
  const fetchQuestions = async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await questionsAPI.getQuestions(params);
      const page: QuestionPage = response.data;

      // Ensure "questions" is ALWAYS an array
      setQuestions(Array.isArray(page.content) ? page.content : []);
    } catch (err) {
      setError("Failed to fetch questions");
      console.error("Error fetching questions:", err);
      setQuestions([]); // safety fallback
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // CREATE QUESTION
  // -------------------------
  const createQuestion = async (questionData: {
    title: string;
    body: string;
  }) => {
    try {
      const response = await questionsAPI.createQuestion(questionData);
      const newQuestion = response.data;

      // Add new question to local state
      setQuestions((prev) => [newQuestion, ...prev]);

      return newQuestion;
    } catch (err) {
      console.error("Error creating question:", err);
      throw err;
    }
  };

  // -------------------------
  // VOTE ON QUESTION
  // -------------------------
  const voteQuestion = async (id: string, vote: "up" | "down") => {
    try {
      const response = await questionsAPI.voteQuestion(id, vote);
      const updatedVotes = response.data; // backend returns a number

      // update local state
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === Number(id) ? { ...q, upvotes: updatedVotes } : q
        )
      );

      return updatedVotes;
    } catch (err) {
      console.error("Error voting on question:", err);
      throw err;
    }
  };

  // -------------------------
  // GET SINGLE QUESTION
  // -------------------------
  const getQuestion = async (id: string) => {
    try {
      const response = await questionsAPI.getQuestion(id);
      return response.data;
    } catch (err) {
      console.error("Error fetching question:", err);
      throw err;
    }
  };

  return (
    <QuestionContext.Provider
      value={{
        questions,
        loading,
        error,
        fetchQuestions,
        createQuestion,
        voteQuestion,
        getQuestion,
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
};

export const useQuestions = (): QuestionContextType => {
  const context = useContext(QuestionContext);
  if (!context) {
    throw new Error("useQuestions must be used within a QuestionProvider");
  }
  return context;
};

export default QuestionContext;
