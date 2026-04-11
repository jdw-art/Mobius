import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, LoginRequest, RegisterRequest } from '../services/authService';
import { request } from '../utils/request';

interface AuthContextType {
  isAuthenticated: boolean;
  user: string | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const validateToken = async () => {
      console.log('[DEBUG] validateToken: starting');
      const token = localStorage.getItem('mobius_token');
      console.log('[DEBUG] validateToken: token from localStorage:', token);
      if (!token) {
        console.log('[DEBUG] validateToken: no token, setting loading=false');
        setLoading(false);
        return;
      }
      try {
        // Validate token with backend
        console.log('[DEBUG] validateToken: calling /verify');
        await request.get('/api/v1/auth/verify');
        console.log('[DEBUG] validateToken: verify succeeded, isAuthenticated=true');
        setIsAuthenticated(true);
      } catch (error) {
        console.log('[DEBUG] validateToken: verify failed, error:', error);
        // Token invalid, clear it
        localStorage.removeItem('mobius_token');
        setIsAuthenticated(false);
      } finally {
        console.log('[DEBUG] validateToken: setting loading=false');
        setLoading(false);
      }
    };
    validateToken();
  }, []);

  const login = async (data: LoginRequest) => {
    const response = await authService.login(data);
    console.log('[DEBUG] Login response:', response);
    console.log('[DEBUG] Token to store:', response.accessToken);
    localStorage.setItem('mobius_token', response.accessToken);
    console.log('[DEBUG] Token stored in localStorage:', localStorage.getItem('mobius_token'));
    setUser(data.username);
    setIsAuthenticated(true);
    console.log('[DEBUG] isAuthenticated set to true');
  };

  const register = async (data: RegisterRequest) => {
    await authService.register(data);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Ignore logout errors, clear local state anyway
    }
    localStorage.removeItem('mobius_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
