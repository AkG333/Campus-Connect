import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuestions } from '../hooks/useQuestions';
import { useAuth } from '../contexts/AuthContext';
import type { Question } from '../types';

export default function QuestionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getQuestion, voteQuestion } = useQuestions();
  const { isAuthenticated } = useAuth();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestionData = async () => {
      try {
        const data = await getQuestion(id!);
        setQuestion(data);
      } catch (err) {
        setError('Failed to load question');
        console.error('Error fetching question:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestionData();
  }, [id, getQuestion]);

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/questions/${id}` } });
      return;
    }

    try {
      await voteQuestion(id!, voteType);
      // Update the question with the new vote count
      setQuestion(prev => prev ? {
        ...prev,
        upvotes: voteType === 'up' ? prev.upvotes + 1 : prev.upvotes - 1
      } : null);
    } catch (err) {
      setError('Failed to register vote');
      console.error('Error voting:', err);
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/questions/${id}` } });
      return;
    }

    if (!answer.trim()) {
      return setError('Please enter your answer');
    }

    setIsSubmitting(true);
    setError('');

    try {
      // TODO: Implement answer submission
      // await api.post(`/api/questions/${id}/answers`, { body: answer });
      // Refresh the question to show the new answer
      // const data = await getQuestion(id!);
      // setQuestion(data);
      setAnswer('');
    } catch (err) {
      setError('Failed to post answer');
      console.error('Error posting answer:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Question not found</h2>
          <p className="mt-2 text-gray-600">The question you're looking for doesn't exist or has been deleted.</p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-start">
          <div className="flex-shrink-0 flex flex-col items-center mr-4 w-12">
            <button
              onClick={() => handleVote('up')}
              className="text-gray-400 hover:text-blue-500 focus:outline-none"
              aria-label="Upvote"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>
            <span className="text-lg font-medium my-1">{question.upvotes}</span>
            <button
              onClick={() => handleVote('down')}
              className="text-gray-400 hover:text-blue-500 focus:outline-none"
              aria-label="Downvote"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {question.title}
            </h1>
            <div className="prose max-w-none mb-6">
              <p>{question.body}</p>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <span>
                Asked{' '}
                {new Date(question.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span className="mx-2">•</span>
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

      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-xl font-semibold mb-6">
          {question.answerCount || 0} {question.answerCount === 1 ? 'Answer' : 'Answers'}
        </h2>

        {/* TODO: Display answers here */}
        {question.answerCount === 0 && (
          <p className="text-gray-500 text-center py-8">
            No answers yet. Be the first to answer!
          </p>
        )}

        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-6">Your Answer</h2>
          <form onSubmit={handleSubmitAnswer} className="space-y-4">
            <div>
              <label htmlFor="answer" className="sr-only">
                Your Answer
              </label>
              <textarea
                id="answer"
                rows={8}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                placeholder="Write your answer here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                required
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Posting...' : 'Post Your Answer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}