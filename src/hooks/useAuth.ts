import { useState, useEffect } from 'react';
import { adminApi } from '../utils/api';
import { AuthState } from '../types';

export const useAuth = (): AuthState & {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
} => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false,
  });

  const checkAuth = async () => {
    try {
      const response = await adminApi.checkAuth();
      setAuthState({ 
        user: response.admin || { username: 'admin' }, 
        loading: false, 
        isAuthenticated: true 
      });
    } catch (error) {
      setAuthState({ 
        user: null, 
        loading: false, 
        isAuthenticated: false 
      });
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      await adminApi.login(password);
      setAuthState({ 
        user: { username }, 
        loading: false, 
        isAuthenticated: true 
      });
      return true;
    } catch (error) {
      setAuthState({ 
        user: null, 
        loading: false, 
        isAuthenticated: false 
      });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await adminApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuthState({ 
        user: null, 
        loading: false, 
        isAuthenticated: false 
      });
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    ...authState,
    login,
    logout,
  };
};