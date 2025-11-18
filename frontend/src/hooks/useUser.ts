import { useState, useCallback } from 'react';
import { api } from '../services/api';
import type { User } from '../types';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/api/users/${userId}`);
      setUser(response.data);
    } catch (err) {
      setError('Failed to fetch user data');
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = async (userId: string, userData: Partial<User>) => {
    try {
      const response = await api.put(`/api/users/${userId}`, userData);
      setUser(response.data);
      return response.data;
    } catch (err) {
      console.error('Error updating user:', err);
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    fetchUser,
    updateUser,
  };
}