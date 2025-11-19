import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuestions } from "../hooks/useQuestions";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../services/api";
import type { Question, Answer } from "../types";

export default function QuestionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getQuestion, voteQuestion, fetchQuestions } = useQuestions();
  const { user, isAuthenticated } = useAuth();

  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [answerText, setAnswerText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editingAnswerId, setEditingAnswerId] = useState<number | null>(null);
  const [editAnswerText, setEditAnswerText] = useState("");

  // ⭐ NEW: inline question editing
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ---------------------------------------------------
  // Load question + answers
  // ---------------------------------------------------
  const loadData = async () => {
    try {
      const q = await getQuestion(id!);
      setQuestion(q);

      const ansRes = await api.get(`/answers/question/${id}`);
      setAnswers(ansRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  // ---------------------------------------------------
  // Vote on question
  // ---------------------------------------------------
  const handleVote = async (vote: "up" | "down") => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      const newVotes = await voteQuestion(id!, vote);

      setQuestion((prev) =>
        prev ? { ...prev, upvotes: newVotes } : prev
      );

      await fetchQuestions({ search: "" });
    } catch (err) {
      console.error(err);
      setError("Failed to vote");
    }
  };

  // ---------------------------------------------------
  // Vote on answer
  // ---------------------------------------------------
  const voteAnswer = async (answerId: number, vote: "up" | "down") => {
    if (!isAuthenticated) return navigate("/login");

    try {
      const value = vote === "up" ? 1 : -1;
      const res = await api.post(`/answers/${answerId}/vote?value=${value}`);
      const updatedVotes = res.data;

      setAnswers((prev) =>
        prev.map((a) =>
          a.id === answerId ? { ...a, upvotes: updatedVotes } : a
        )
      );

      await fetchQuestions({ search: "" });
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------------------------------------------
  // Submit new answer
  // ---------------------------------------------------
  const submitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return navigate("/login");

    if (!answerText.trim()) {
      setError("Enter an answer");
      return;
    }

    try {
      setIsSubmitting(true);

      await api.post("/answers/post", {
        questionId: Number(id),
        body: answerText,
      });

      setAnswerText("");

      await loadData();
      await fetchQuestions({ search: "" });
    } catch (err) {
      console.error(err);
      setError("Failed to post answer");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------------------------------------------
  // Delete Question
  // ---------------------------------------------------
  const deleteQuestion = async () => {
    if (!confirm("Delete this question permanently?")) return;

    await api.delete(`/questions/${id}`);
    await fetchQuestions({ search: "" });
    navigate("/");
  };

  // ---------------------------------------------------
  // Edit Answer
  // ---------------------------------------------------
  const saveEditedAnswer = async (answerId: number) => {
    try {
      await api.put(`/answers/${answerId}/edit`, { body: editAnswerText });

      setEditingAnswerId(null);
      setEditAnswerText("");

      await loadData();
    } catch (err) {
      console.error(err);
      setError("Failed to edit answer");
    }
  };

  // ---------------------------------------------------
  // Delete Answer
  // ---------------------------------------------------
  const deleteAnswer = async (answerId: number) => {
    if (!confirm("Delete this answer?")) return;

    try {
      await api.delete(`/answers/${answerId}`);
      await loadData();
      await fetchQuestions({ search: "" });
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------------------------------------------
  // Loading
  // ---------------------------------------------------
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-blue-600 rounded-full"></div>
      </div>
    );

  if (!question)
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold">Question not found</h2>
      </div>
    );

  const isQuestionOwner = user && user.id === question.userId;

  // ---------------------------------------------------
  // RENDER
  // ---------------------------------------------------
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* QUESTION SECTION */}
      <div className="mb-10">
        <div className="flex items-start">

          {/* QUESTION VOTING */}
          <div className="mr-6 text-center">
            <button onClick={() => handleVote("up")} className="text-gray-600 hover:text-blue-600">▲</button>
            <div className="text-xl font-semibold">{question.upvotes}</div>
            <button onClick={() => handleVote("down")} className="text-gray-600 hover:text-blue-600">▼</button>
          </div>

          {/* QUESTION CONTENT */}
          <div className="flex-1">

            {/* ⭐ INLINE EDIT MODE */}
            {isEditingQuestion ? (
              <>
                <input
                  className="border p-2 w-full text-xl font-semibold mb-3"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />

                <textarea
                  rows={6}
                  className="border p-2 w-full"
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                />

                <div className="flex gap-3 mt-3">
                  <button
                    onClick={async () => {
                      try {
                        await api.put(`/questions/${id}/edit`, {
                          title: editTitle,
                          body: editBody,
                        });

                        setQuestion((prev) =>
                          prev
                            ? { ...prev, title: editTitle, body: editBody }
                            : prev
                        );

                        await fetchQuestions();

                        setIsEditingQuestion(false);
                      } catch (err) {
                        console.error(err);
                        setError("Failed to update question");
                      }
                    }}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setIsEditingQuestion(false)}
                    className="px-3 py-1 bg-gray-400 text-white rounded"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold mb-4">{question.title}</h1>
                <p className="text-gray-800 mb-4">{question.body}</p>
              </>
            )}

            <div className="text-sm text-gray-500">
              Asked on {new Date(question.createdAt).toLocaleDateString("en-US")} •{" "}
              <Link to={`/users/${question.userId}`} className="text-blue-600 hover:underline">
                {question.authorName}
              </Link>
            </div>

            {/* QUESTION OWNER ACTION BUTTONS */}
            {isQuestionOwner && !isEditingQuestion && (
              <div className="mt-4 flex gap-4 text-sm">
                <button
                  onClick={() => {
                    setIsEditingQuestion(true);
                    setEditTitle(question.title);
                    setEditBody(question.body);
                  }}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>

                <button
                  onClick={deleteQuestion}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ANSWER LIST */}
      <div className="border-t pt-8">
        <h2 className="text-xl font-bold mb-6">{answers.length} Answers</h2>

        {answers.map((ans) => {
          const isAnswerOwner = user && user.id === ans.userId;

          return (
            <div key={ans.id} className="p-4 bg-white shadow rounded border flex">

              {/* ANSWER VOTES */}
              <div className="mr-4 text-center">
                <button onClick={() => voteAnswer(ans.id, "up")} className="text-gray-600 hover:text-blue-600">▲</button>
                <div className="font-semibold">{ans.upvotes}</div>
                <button onClick={() => voteAnswer(ans.id, "down")} className="text-gray-600 hover:text-blue-600">▼</button>
              </div>

              {/* ANSWER CONTENT */}
              <div className="flex-1">
                {editingAnswerId === ans.id ? (
                  <div>
                    <textarea
                      rows={4}
                      className="border p-2 w-full"
                      value={editAnswerText}
                      onChange={(e) => setEditAnswerText(e.target.value)}
                    />

                    <div className="flex gap-3 mt-2">
                      <button
                        onClick={() => saveEditedAnswer(ans.id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingAnswerId(null)}
                        className="px-3 py-1 bg-gray-400 text-white rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-900">{ans.body}</p>
                    <div className="text-sm text-gray-500 mt-2">
                      Answered by{" "}
                      <Link to={`/users/${ans.userId}`} className="text-blue-600 hover:underline">
                        {ans.authorName}
                      </Link>{" "}
                      on {new Date(ans.createdAt).toLocaleDateString("en-US")}
                    </div>
                  </>
                )}

                {/* ANSWER OWNER BUTTONS */}
                {isAnswerOwner && editingAnswerId !== ans.id && (
                  <div className="flex gap-3 text-sm mt-3">
                    <button
                      onClick={() => {
                        setEditingAnswerId(ans.id);
                        setEditAnswerText(ans.body);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteAnswer(ans.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD ANSWER */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Your Answer</h2>

        <form onSubmit={submitAnswer} className="space-y-4">
          <textarea
            rows={6}
            className="w-full border rounded p-2"
            placeholder="Write your answer..."
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
          >
            {isSubmitting ? "Posting..." : "Post Answer"}
          </button>
        </form>
      </div>
    </div>
  );
}
