import { useState, useCallback } from "react";
import { api } from "../services/api";
import type { Answer } from "../types";

export function useAnswers() {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -----------------------------
  // GET answers for a question
  // -----------------------------
  const fetchAnswers = useCallback(async (questionId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/answers/question/${questionId}`);
      setAnswers(response.data);
    } catch (err) {
      console.error("Error fetching answers:", err);
      setError("Failed to load answers");
    } finally {
      setLoading(false);
    }
  }, []);

  // -----------------------------
  // POST an answer
  // -----------------------------
  const createAnswer = async (questionId: string, body: string) => {
    try {
      const response = await api.post(`/answers/post`, {
        questionId: Number(questionId),
        body,
      });

      // Add new answer to list
      setAnswers((prev) => [...prev, response.data]);

      return response.data;
    } catch (err) {
      console.error("Error posting answer:", err);
      throw err;
    }
  };

  // -----------------------------
  // VOTE answer (upvote/downvote)
  // -----------------------------
  const voteAnswer = async (answerId: string, voteType: "up" | "down") => {
    try {
      const value = voteType === "up" ? 1 : -1;
      const response = await api.post(
        `/answers/${answerId}/vote?value=${value}`
      );

      // update answer votes
      setAnswers((prev) =>
        prev.map((a) =>
          a.id === Number(answerId)
            ? { ...a, upvotes: response.data }
            : a
        )
      );

      return response.data;
    } catch (err) {
      console.error("Error voting answer:", err);
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
  };
}
