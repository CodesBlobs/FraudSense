'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/AuthModal';
import { Shield, Trophy, User, BookOpen, Target, LogOut, X } from 'lucide-react';

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const handleSignOut = () => {
    logout();
    setShowSignOutConfirm(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-tighter text-slate-900 transition-opacity hover:opacity-70 shrink-0">
            <img src="/logo.png" alt="ScamShield Logo" className="h-8 w-8 object-contain" />
            ScamShield
          </Link>

          <div className="flex items-center gap-1 sm:gap-2 flex-nowrap whitespace-nowrap overflow-x-auto no-scrollbar">
            <Link
              href="/leaderboard"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              <Trophy size={16} />
              Leaderboard
            </Link>

            {isLoggedIn ? (
              <div className="flex items-center gap-1 sm:gap-2 flex-nowrap whitespace-nowrap shrink-0">
                <Link
                  href="/lessons"
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                >
                  <BookOpen size={16} />
                  Lessons
                </Link>
                <Link
                  href="/training"
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
                >
                  <Target size={16} />
                  Practice
                </Link>
                <div className="h-5 w-px bg-slate-200 mx-1" />
                <span className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                  <User size={14} />
                  {user?.username}
                </span>
                <button
                  onClick={() => setShowSignOutConfirm(true)}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Sign Out Confirmation Modal */}
      {showSignOutConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowSignOutConfirm(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Sign Out</h3>
              <button
                onClick={() => setShowSignOutConfirm(false)}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>
            <p className="mb-6 text-slate-600">
              Are you sure you want to sign out? Your progress is saved.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSignOutConfirm(false)}
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                <span className="flex items-center justify-center gap-1.5">
                  <LogOut size={16} /> Sign Out
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        defaultMode="login"
      />
    </>
  );
}
