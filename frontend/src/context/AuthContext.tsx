'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, register as apiRegister, type AuthResponse } from '@/lib/api';

interface User {
  id: string;
  username: string;
  highScore: number;
  totalGames: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Restore session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('scamshield_token');
    const savedUser = localStorage.getItem('scamshield_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('scamshield_token');
        localStorage.removeItem('scamshield_user');
      }
    }
  }, []);

  const handleAuthResponse = useCallback((data: AuthResponse) => {
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('scamshield_token', data.token);
    localStorage.setItem('scamshield_user', JSON.stringify(data.user));
  }, []);

  const loginHandler = useCallback(async (username: string, password: string) => {
    const data = await apiLogin(username, password);
    handleAuthResponse(data);
  }, [handleAuthResponse]);

  const registerHandler = useCallback(async (username: string, password: string) => {
    const data = await apiRegister(username, password);
    handleAuthResponse(data);
  }, [handleAuthResponse]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('scamshield_token');
    localStorage.removeItem('scamshield_user');
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem('scamshield_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoggedIn: !!user,
      login: loginHandler,
      register: registerHandler,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
