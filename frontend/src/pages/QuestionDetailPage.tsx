import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuestions } from "../hooks/useQuestions";
import { useAuth } from "../contexts/AuthContext";
import type { Question } from "../types";

export default function QuestionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getQuestion, voteQuestion } = useQuestions();
  const { isAuthenticated } = useAuth();

  const [question, setQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  // -----------------------------
  // Fetch single question
  // -----------------------------
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getQuestion(id!);
        setQuestion(data);
      } catch (err) {
        setError("Failed to load question");
        console.error("Error fetching question:", err);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [id]);

  // -----------------------------
  // Voting handler
  // -----------------------------
  const handleVote = async (voteType: "up" | "down") => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/questions/${id}` } });
      return;
    }

    try {
      const newVoteCount = await voteQuestion(id!, voteType);

      setQuestion((prev) =>
        prev ? { ...prev, upvotes: newVoteCount } : prev
      );
    } catch (err) {
      console.error("Error voting:", err);
      setError("Failed to cast vote");
    }
  };

  // -----------------------------
  // Answer submit
  // (NOT IMPLEMENTED YET IN BACKEND)
  // -----------------------------
  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/questions/${id}` } });
      return;
    }

    if (!answer.trim()) {
      setError("Please enter your answer");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // TODO once backend exists:
      // await api.post(`/answers/${id}`, { body: answer });
      // reload question
      // const updated = await getQuestion(id!);
      // setQuestion(updated);

      setAnswer("");
    } catch (err) {
      console.error("Error posting answer:", err);
      setError("Failed to post answer");
    } finally {
      setIsSubmitting(false);
    }
  };

  // -----------------------------
  // Loading Screen
  // -----------------------------
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // -----------------------------
  // Error screen
  // -----------------------------
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  // -----------------------------
  // Not found
  // -----------------------------
  if (!question) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Question not found
        </h2>
        <Link
          to="/"
          className="mt-4 inline-flex items-center px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  // -----------------------------
  // MAIN UI
  // -----------------------------
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-start">
          {/* Voting */}
          <div className="flex flex-col items-center mr-4">
            <button
              onClick={() => handleVote("up")}
              className="text-gray-400 hover:text-blue-500"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>

            <span className="text-lg font-medium my-1">{question.upvotes}</span>

            <button
              onClick={() => handleVote("down")}
              className="text-gray-400 hover:text-blue-500"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Question Content */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-4">{question.title}</h1>

            <p className="mb-6 text-gray-800">{question.body}</p>

            <div className="text-sm text-gray-500">
              Asked{" "}
              {new Date(question.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              •{" "}
              <Link
                to={`/users/${question.userId}`}
                className="text-blue-600 hover:text-blue-800"
              >
                {question.authorName}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Answers Section */}
      <div className="border-t pt-8">
        <h2 className="text-xl font-semibold mb-6">
          {question.answerCount}{" "}
          {question.answerCount === 1 ? "Answer" : "Answers"}
        </h2>

        {question.answerCount === 0 && (
          <p className="text-gray-500 text-center py-8">
            No answers yet. Be the first to answer!
          </p>
        )}

        {/* Answer Form */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-6">Your Answer</h2>

          <form onSubmit={handleSubmitAnswer} className="space-y-4">
            <textarea
              rows={8}
              className="shadow-sm w-full border rounded-md p-2"
              placeholder="Write your answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            ></textarea>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Posting..." : "Post Your Answer"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
