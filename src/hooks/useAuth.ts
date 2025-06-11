import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../utils/api';
import { AuthState } from '../types';

export const useAuth = (): AuthState & {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
} => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false,
  });
  
  const navigate = useNavigate();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          setAuthState({ user: null, loading: false, isAuthenticated: false });
          return;
        }

        const response = await adminApi.checkAuth();
        setAuthState({ 
          user: response.admin, 
          loading: false, 
          isAuthenticated: true 
        });
      } catch (error) {
        // Token is invalid, remove it
        localStorage.removeItem('adminToken');
        setAuthState({ 
          user: null, 
          loading: false, 
          isAuthenticated: false 
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      const response = await adminApi.login(password);
      
      // Store token
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
      adminApi.logout().catch(console.error);
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

  return {
    ...authState,
    login,
    logout,
  };
};