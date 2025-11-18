import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import type { User, Question } from '../types';

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();

  const [profile, setProfile] = useState<User | null>(null);
  const [userQuestions, setUserQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const isCurrentUser = currentUser && currentUser.id === Number(id);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // FIX: remove duplicate /api
        const userResponse = await api.get(`/users/${id}`);
        setProfile(userResponse.data);

        // FIX: remove duplicate /api
        const questionsResponse = await api.get(`/users/${id}/questions`);

        // Normalize backend → frontend format
        const mapped = questionsResponse.data.map((q: any) => ({
          id: q.id,
          title: q.title,
          body: q.body,
          userId: q.userId,
          authorName: q.authorName,
          createdAt: q.createdAt,
          upvotes: q.upvotes ?? 0,
          answerCount: q.answerCount ?? 0
        }));

        setUserQuestions(mapped);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

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
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h2 className="text-2xl font-bold">User not found</h2>
        <p className="text-gray-600 mt-2">This user does not exist.</p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex items-center">
          <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div className="ml-6">
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <p className="text-sm text-gray-500">
              Member since{' '}
              {new Date(profile.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long'
              })}
            </p>
          </div>

          {isCurrentUser && (
            <Link
              to="/profile/edit"
              className="ml-auto px-4 py-2 text-sm rounded-md bg-white border border-gray-300 hover:bg-gray-50"
            >
              Edit Profile
            </Link>
          )}
        </div>

        <div className="border-t px-4 py-5">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm">{profile.email}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Role</dt>
              <dd className="mt-1 text-sm">{profile.role ?? "User"}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-6">Questions</h2>

        {userQuestions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No questions yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {userQuestions.map((q) => (
              <div key={q.id} className="p-4 border rounded-lg hover:shadow">
                <Link
                  to={`/questions/${q.id}`}
                  className="text-lg font-medium text-blue-600"
                >
                  {q.title}
                </Link>
                <p className="text-sm text-gray-500 mt-1">
                  {q.answerCount} answers •{' '}
                  {new Date(q.createdAt).toLocaleDateString('en-US')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
