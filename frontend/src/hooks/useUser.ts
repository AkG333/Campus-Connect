import { useState, useCallback } from 'react';
import { api } from '../services/api';
import type { User } from '../types';

// Map backend user → frontend user
function mapUser(u: any): User {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role ?? "user",
    createdAt: u.createdAt,
  };
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ----------------------------
  // FETCH USER
  // ----------------------------
  const fetchUser = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);

    try {
      // FIX: remove duplicate /api
      const response = await api.get(`/users/${userId}`);

      setUser(mapUser(response.data));
    } catch (err) {
      console.error("Error fetching user:", err);
      setError("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  }, []);

  // ----------------------------
  // UPDATE USER
  // Backend expects:
  // PUT /api/users/update
  // Body = UserDTO (backend extracts userId from token)
  // ----------------------------
  const updateUser = async (userData: Partial<User>) => {
    try {
      const response = await api.put(`/users/update`, userData);

      setUser(mapUser(response.data));
      return mapUser(response.data);
    } catch (err) {
      console.error("Error updating user:", err);
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
