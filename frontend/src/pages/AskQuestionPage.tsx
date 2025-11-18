import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuestions } from '../hooks/useQuestions';
import { useAuth } from '../contexts/AuthContext';

export default function AskQuestionPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createQuestion } = useQuestions();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate('/login', { state: { from: '/ask' } });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !body.trim()) {
      return setError('Please fill in all required fields');
    }

    setIsSubmitting(true);

    try {
      await createQuestion({
        title,
        body,
      });
      navigate('/');
    } catch (err) {
      setError('Failed to post question. Please try again.');
      console.error('Error posting question:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Ask a Question</h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
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
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
            <span className="text-red-500 ml-1">*</span>
          </label>
          <p className="mt-1 text-sm text-gray-500">
            Be specific and imagine you're asking a question to another person
          </p>
          <div className="mt-1">
            <input
              type="text"
              id="title"
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="e.g. How do I implement authentication in React?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="body"
            className="block text-sm font-medium text-gray-700"
          >
            What are the details of your problem?
            <span className="text-red-500 ml-1">*</span>
          </label>
          <p className="mt-1 text-sm text-gray-500">
            Include all the information someone would need to answer your question
          </p>
          <div className="mt-1">
            <textarea
              id="body"
              rows={10}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Posting...' : 'Post Question'}
          </button>
        </div>
      </form>
    </div>
  );
}