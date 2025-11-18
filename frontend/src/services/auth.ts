import { api } from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      const { token, user } = response.data;
      
      // Store the token in localStorage
      localStorage.setItem('token', token);
      
      return { token, user };
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  logout(): void {
    // Remove the token from localStorage
    localStorage.removeItem('token');
    // Redirect to login page
    window.location.href = '/login';
  },

  getCurrentUser(): User | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    // In a real app, you might want to decode the JWT to get user info
    // or make an API call to get the current user
    // For now, we'll just return null and let the app handle it
    return null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  getAuthHeader(): { Authorization: string } | {} {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
};

export default authService;
