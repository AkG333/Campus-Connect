import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuestions } from '../contexts/QuestionContext';
import type { Question } from '../types';

export default function HomePage() {
  const { questions, loading, error, fetchQuestions } = useQuestions();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchQuestions({ search: searchTerm });
  }, [searchTerm]);


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">CampusConnect Q&A</h1>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Ask Question Button */}
        <div className="flex justify-end mb-6">
          <Link
            to="/ask"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Ask Question
          </Link>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {questions.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No questions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? 'Try adjusting your search to find what you\'re looking for.'
                : 'Be the first to ask a question!'}
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <Link
                  to="/ask"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  New Question
                </Link>
              </div>
            )}
          </div>
        ) : (
          questions.map((question: Question) => (
            <div
              key={question.id}
              className="bg-white shadow overflow-hidden sm:rounded-lg hover:shadow-md transition-shadow duration-200"
            >
              <div className="px-4 py-5 sm:px-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 flex flex-col items-center mr-4 w-12">
                    <div className="text-center">
                      <span className="text-gray-700 font-medium">{question.upvotes || 0}</span>
                      <div className="text-xs text-gray-500">votes</div>
                    </div>
                    <div className="mt-2 text-center">
                      <span className="text-gray-700 font-medium">
                        {question.answerCount || 0}
                      </span>
                      <div className="text-xs text-gray-500">
                        {question.answerCount === 1 ? 'answer' : 'answers'}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/questions/${question.id}`}
                      className="text-lg font-medium text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {question.title}
                    </Link>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                      {question.body}
                    </p>
                    <div className="mt-3 flex items-center text-sm text-gray-500">
                      <span>Asked by </span>
                      <Link
                        to={`/users/${question.userId}`}
                        className="ml-1 text-blue-600 hover:underline"
                      >
                        {question.authorName}
                      </Link>
                      <span className="mx-1">•</span>
                      <span>
                        {new Date(question.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}