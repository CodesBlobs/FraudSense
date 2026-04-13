'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Shield, LogIn, UserPlus, Loader2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'register' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  if (!isOpen) return null;

  const isLogin = mode === 'login';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);

    try {
      if (isLogin) {
        await login(username, password);
      } else {
        await register(username, password);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className={`animate-slide-up w-full max-w-sm max-h-[95vh] overflow-y-auto rounded-xl p-6 shadow-xl ${
          isLogin ? 'bg-white' : 'bg-emerald-50 border border-emerald-200'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-5">
          <Shield size={28} className={isLogin ? 'text-blue-600 mb-2' : 'text-emerald-600 mb-2'} />
          <h2 className="text-xl font-bold text-slate-900">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {isLogin
              ? 'Log in to track your scores'
              : 'Sign up to save scores & join the leaderboard'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="auth-username" className="mb-1 block text-sm font-medium text-slate-700">
              Username
            </label>
            <input
              id="auth-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              minLength={3}
              maxLength={20}
              className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus:outline-none focus:ring-2 ${
                isLogin
                  ? 'border-slate-200 focus:ring-blue-500 focus:border-blue-500'
                  : 'border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500'
              }`}
            />
          </div>

          <div>
            <label htmlFor="auth-password" className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              minLength={6}
              className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus:outline-none focus:ring-2 ${
                isLogin
                  ? 'border-slate-200 focus:ring-blue-500 focus:border-blue-500'
                  : 'border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500'
              }`}
            />
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="auth-confirm-password" className="mb-1 block text-sm font-medium text-slate-700">
                Confirm Password
              </label>
              <input
                id="auth-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Type password again"
                required
                minLength={6}
                className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isLogin ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {loading ? (
              <><Loader2 size={16} className="mr-1.5 animate-spin" /> Please wait...</>
            ) : isLogin ? (
              <><LogIn size={16} className="mr-1.5" /> Log In</>
            ) : (
              <><UserPlus size={16} className="mr-1.5" /> Create Account</>
            )}
          </button>
        </form>

        {/* Switch */}
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setMode(isLogin ? 'register' : 'login');
              setError('');
              setPassword('');
              setConfirmPassword('');
            }}
            className="text-sm text-slate-500 hover:text-slate-700 underline underline-offset-2"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
          </button>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50"
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
}
