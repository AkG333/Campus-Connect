import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { api } from '../services/api';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Set the default auth header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Fetch user data
      const fetchUser = async () => {
        try {
          const response = await api.get('/api/users/me');
          setUser(response.data);
        } catch (err) {
          console.error('Error fetching user data:', err);
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
        } finally {
          setLoading(false);
        }
      };
      
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  const { token } = response.data; // Backend only returns token
  
  // Store the token in localStorage
  localStorage.setItem('token', token);
  
  // Set the default auth header
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
  // Fetch user data after login
  try {
    const userResponse = await api.get('/users/me');
    setUser(userResponse.data);
  } catch (err) {
    console.error('Error fetching user data:', err);
    // Don't log out on this error, as the token is still valid
  }
};

  const register = async (name: string, email: string, password: string) => {
  await api.post('/auth/register', { 
    name, 
    email, 
    password,
    // Add any other required fields that your RegisterRequestDTO expects
  });
  // After registration, log the user in
  await login(email, password);
};

  const logout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('token');
    
    // Remove the auth header
    delete api.defaults.headers.common['Authorization'];
    
    // Clear the user state
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}