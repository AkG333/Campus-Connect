import { useState, useCallback } from "react";
import { api } from "../services/api";
import type { Question } from "../types";

/**
 * Map a backend question object -> frontend Question type
 *
 * Backend shape (example):
 * {
 *   id: 7,
 *   title: "...",
 *   body: "...",
 *   userId: 9,
 *   authorName: "Aditya",
 *   upvotes: 0,
 *   answerCount: 2,
 *   createdAt: "2025-11-18T21:13:52"
 * }
 *
 * Frontend Question type expected:
 * {
 *   id: number,
 *   title: string,
 *   body: string,
 *   userId: number,
 *   authorName: string,
 *   createdAt: string,
 *   upvotes: number,
 *   answerCount: number
 * }
 */
function mapQuestion(q: any): Question {
  return {
    id: Number(q.id),
    title: q.title,
    body: q.body ?? "",
    userId: Number(q.userId),
    authorName: q.authorName ?? "",
    createdAt: q.createdAt ?? "",
    upvotes: q.upvotes ?? 0,
    answerCount: q.answerCount ?? 0,
  };
}

export function useQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ------------------------------
  // GET ALL QUESTIONS (paginated)
  // ------------------------------
  const fetchQuestions = useCallback(async (params: { search?: string } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/questions", { params });
      const page = response.data;

      // page.content should be the array of backend question objects
      if (Array.isArray(page?.content)) {
        setQuestions(page.content.map(mapQuestion));
      } else {
        setQuestions([]);
        console.warn("Unexpected /questions response shape:", response.data);
      }
    } catch (err) {
      setError("Failed to fetch questions");
      console.error("Error fetching questions:", err);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ------------------------------
  // CREATE QUESTION
  // ------------------------------
  // Accepts { title, body } and posts to backend which expects { title, body }
  const createQuestion = async (questionData: { title: string; body: string }) => {
    try {
      const response = await api.post("/questions/ask", {
        title: questionData.title,
        body: questionData.body,
      });
      // Backend returns the created question object
      const created = mapQuestion(response.data);
      // Prepend to local list
      setQuestions((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      console.error("Error creating question:", err);
      throw err;
    }
  };

  // ------------------------------
  // GET SINGLE QUESTION
  // ------------------------------
  const getQuestion = async (id: string) => {
    try {
      const response = await api.get(`/questions/${id}`);
      return mapQuestion(response.data);
    } catch (err) {
      console.error("Error fetching question:", err);
      throw err;
    }
  };

  // ------------------------------
  // VOTE QUESTION
  // ------------------------------
  const voteQuestion = async (id: string, voteType: "up" | "down") => {
    try {
      const value = voteType === "up" ? 1 : -1;
      const response = await api.post(`/questions/${id}/vote?value=${value}`);
      const updatedVotes: number = response.data;

      // update local cache if present
      setQuestions((prev) =>
        prev.map((q) => (q.id === Number(id) ? { ...q, upvotes: updatedVotes } : q))
      );

      return updatedVotes;
    } catch (err) {
      console.error("Error voting on question:", err);
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
