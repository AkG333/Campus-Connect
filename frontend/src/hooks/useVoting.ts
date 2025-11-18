import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function useVoting() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const vote = async (type: 'question' | 'answer', id: string, voteType: 'up' | 'down') => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    try {
      const endpoint = type === 'question' 
        ? `/api/questions/${id}/vote` 
        : `/api/answers/${id}/vote`;
      
      const response = await api.post(endpoint, { voteType });
      return response.data;
    } catch (err) {
      console.error(`Error voting on ${type}:`, err);
      throw err;
    }
  };

  return { vote };
}