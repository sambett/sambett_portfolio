import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi, isBackendAvailable } from '../utils/api';
import { AuthState } from '../types';

export const useAuth = (): AuthState & {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
} => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: false, // Changed to false to avoid immediate API call
    isAuthenticated: false,
  });
  
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      // If backend is not available, don't attempt auth check
      if (!isBackendAvailable()) {
        setAuthState({ user: null, loading: false, isAuthenticated: false });
        return;
      }

      // Check if we have a token in localStorage
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setAuthState({ user: null, loading: false, isAuthenticated: false });
        return;
      }

      // Only verify token if we have one
      setAuthState(prev => ({ ...prev, loading: true }));
      const response = await adminApi.checkAuth();
      setAuthState({ 
        user: response.admin, 
        loading: false, 
        isAuthenticated: true 
      });
    } catch (error) {
      console.error('Auth check failed:', error);
      // Token is invalid, remove it
      localStorage.removeItem('adminToken');
      setAuthState({ 
        user: null, 
        loading: false, 
        isAuthenticated: false 
      });
    }
  };

  const login = async (username: string, password: string): Promise<void> => {
    try {
      const response = await adminApi.login(password);
      
      // Store token in localStorage
      if (response.token) {
        localStorage.setItem('adminToken', response.token);
      }
      
      setAuthState({ 
        user: { username }, 
        loading: false, 
        isAuthenticated: true 
      });
      
      // Navigate to dashboard
      navigate('/admin/dashboard');
    } catch (error: any) {
      setAuthState({ 
        user: null, 
        loading: false, 
        isAuthenticated: false 
      });
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  };

  const logout = (): void => {
    try {
      adminApi.logout().catch(console.error); // Don't wait for this
      localStorage.removeItem('adminToken');
      setAuthState({ 
        user: null, 
        loading: false, 
        isAuthenticated: false 
      });
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Only check auth if we have a token and backend is available
  useEffect(() => {
    if (isBackendAvailable()) {
      const token = localStorage.getItem('adminToken');
      if (token) {
        checkAuth();
      }
    }
  }, []);

  return {
    ...authState,
    login,
    logout,
  };
};