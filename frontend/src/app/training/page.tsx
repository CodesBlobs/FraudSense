'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import MessageCard from '@/components/MessageCard';
import ResultDisplay from '@/components/ResultDisplay';
import AuthModal from '@/components/AuthModal';
import { useGame } from '@/context/GameContext';
import { useAuth } from '@/context/AuthContext';
import { saveScore, fetchHint } from '@/lib/api';
import { Star, Award, Medal, BookOpen, Trophy, Save, Loader2, CheckCircle, RefreshCw, HelpCircle, AlertTriangle, ShieldCheck, Bot, Lightbulb } from 'lucide-react';

export default function TrainingPage() {
  const router = useRouter();
  const {
    status,
    currentScenario,
    currentEvaluation,
    score,
    duration,
    totalAnswered,
    totalQuestions,
    results,
    startGame,
    submitAnswer,
    nextQuestion,
    resetGame,
  } = useGame();

  const { isLoggedIn, updateUser } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [savingScore, setSavingScore] = useState(false);
  
  const [hint, setHint] = useState<string | null>(null);
  const [isLoadingHint, setIsLoadingHint] = useState(false);
  const [fakeProgress, setFakeProgress] = useState(0);

  useEffect(() => {
    if (status === 'loading') {
      const interval = setInterval(() => {
        setFakeProgress(prev => {
          if (prev >= 95) return 95;
          const increment = Math.max(0.2, (95 - prev) * 0.05);
          return prev + increment;
        });
      }, 300);
      return () => clearInterval(interval);
    } else {
      setFakeProgress(0);
    }
  }, [status]);

  const lastResult = results[results.length - 1];

  useEffect(() => {
    setHint(null);
    setIsLoadingHint(false);
  }, [currentScenario?.id]);

  useEffect(() => {
    if (status === 'idle') {
      startGame(10);
    }
  }, [status, startGame]);

  const handleSaveScore = async () => {
    if (!isLoggedIn || scoreSaved) return;
    setSavingScore(true);
    try {
      const result = await saveScore(score, totalQuestions, duration || 0);
      updateUser({ highScore: result.highScore, totalGames: result.totalGames });
      setScoreSaved(true);
    } catch (err) {
      console.error('Failed to save score:', err);
    } finally {
      setSavingScore(false);
    }
  };

  const handleGetHint = async () => {
    if (!currentScenario || isLoadingHint || hint) return;
    setIsLoadingHint(true);
    try {
      const data = await fetchHint(currentScenario.id);
      setHint(data.hint);
    } catch (err) {
      console.error('Failed to get hint:', err);
    } finally {
      setIsLoadingHint(false);
    }
  };

  // Loading state
  if (status === 'loading') {
    return (
      <>
        <Navbar />
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
          <div className="mx-auto max-w-md w-full text-center">
            <div className="mb-6">
              <Loader2 size={36} className="mx-auto text-blue-600 animate-spin" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-slate-900">
              Generating scenarios...
            </h2>
            <p className="mb-6 text-sm text-slate-500">
              The AI is building a fresh batch of training messages
            </p>
            
            <div className="mx-auto w-full max-w-xs">
              <div className="mb-1 flex justify-between text-xs font-medium text-slate-500">
                <span>Preparing</span>
                <span>{Math.round(fakeProgress)}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all ease-out"
                  style={{ width: `${fakeProgress}%`, transitionDuration: '300ms' }}
                />
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  // Finished state
  if (status === 'finished') {
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const ScoreIcon = percentage >= 80 ? Star : percentage >= 60 ? Award : percentage >= 40 ? Medal : BookOpen;

    return (
      <>
        <Navbar />
        <main className="flex flex-1 flex-col items-center px-4 py-12">
          <div className="animate-slide-up mx-auto max-w-lg w-full space-y-5">
            {/* Score card */}
            <div className="rounded-xl bg-white border border-slate-200 p-8 text-center shadow-sm">
              <ScoreIcon size={40} className="mx-auto mb-3 text-blue-600" />
              <h2 className="mb-1 text-2xl font-bold text-slate-900">Training Complete</h2>
              <div className="my-4 flex items-baseline justify-center gap-1">
                <span className="text-5xl font-extrabold text-blue-700">{score}</span>
                <span className="text-2xl text-slate-400">/</span>
                <span className="text-3xl font-bold text-slate-500">{totalQuestions}</span>
              </div>
              <p className="text-lg text-slate-500">{percentage}% correct</p>
              <div className="mt-4 flex items-center justify-center gap-1.5 text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Time</span>
                <span className="h-1 w-1 rounded-full bg-slate-200" />
                <span className="text-sm font-bold text-slate-700">{duration || 0}s</span>
              </div>
              <p className="mt-3 text-sm text-slate-400">
                {percentage >= 80
                  ? "Excellent — you're sharp!"
                  : percentage >= 60
                  ? "Good work. Keep at it."
                  : "No worries — practice makes perfect."}
              </p>
            </div>

            {/* Save score prompt */}
            {!isLoggedIn && (
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-center">
                <h3 className="mb-1 flex items-center justify-center gap-2 text-base font-semibold text-blue-800">
                  <Trophy size={18} /> Save your score?
                </h3>
                <p className="mb-3 text-sm text-blue-700/70">
                  Sign up to save scores and join the leaderboard.
                </p>
                <button
                  onClick={() => setShowAuth(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Sign Up & Save
                </button>
              </div>
            )}

            {isLoggedIn && !scoreSaved && (
              <button
                onClick={handleSaveScore}
                disabled={savingScore}
                className="w-full inline-flex justify-center items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-base font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {savingScore ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {savingScore ? 'Saving...' : 'Save to Leaderboard'}
              </button>
            )}

            {scoreSaved && (
              <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm font-medium text-emerald-700">
                <CheckCircle size={18} /> Score saved
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  resetGame();
                  setScoreSaved(false);
                  startGame(10);
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-base font-semibold text-white hover:bg-blue-700"
              >
                <RefreshCw size={18} /> Play Again
              </button>
              <button
                onClick={() => router.push('/leaderboard')}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-base font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Trophy size={18} /> Leaderboard
              </button>
            </div>
          </div>
        </main>

        <AuthModal
          isOpen={showAuth}
          onClose={() => {
            setShowAuth(false);
            if (isLoggedIn && !scoreSaved) {
              handleSaveScore();
            }
          }}
          defaultMode="register"
        />
      </>
    );
  }

  // Playing / evaluating / showing-result
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col items-center px-4 py-6">
        <div className="mx-auto max-w-2xl w-full space-y-5">
          {/* Progress */}
          <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-3">
            <span className="text-sm font-medium text-slate-600">
              Question {Math.min(totalAnswered + 1, totalQuestions)} of {totalQuestions}
            </span>
            <span className="text-sm font-bold text-blue-700">
              Score: {score}/{totalAnswered}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500 ease-out"
              style={{ width: `${(totalAnswered / totalQuestions) * 100}%` }}
            />
          </div>

          {/* Showing result */}
          {status === 'showing-result' && currentEvaluation && lastResult && (
            <ResultDisplay
              evaluation={currentEvaluation}
              userAnswer={lastResult.userAnswer}
              onNext={nextQuestion}
              questionNumber={totalAnswered}
              totalQuestions={totalQuestions}
            />
          )}

          {/* Playing or evaluating */}
          {(status === 'playing' || status === 'evaluating') && currentScenario && (
            <>
              <div className="text-center py-1">
                <h2 className="flex items-center justify-center gap-2 text-lg font-bold text-slate-900">
                  <HelpCircle size={20} className="text-blue-600" /> Is this a scam?
                </h2>
              </div>

              <MessageCard scenario={currentScenario} />

              {/* Hint */}
              {status === 'playing' && (
                <div className="text-center">
                  {!hint && !isLoadingHint && (
                    <button
                      onClick={handleGetHint}
                      className="inline-flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:text-blue-800 underline underline-offset-2"
                    >
                      <Lightbulb size={16} /> Need a hint?
                    </button>
                  )}
                  {isLoadingHint && (
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                      <Loader2 size={16} className="animate-spin" /> Getting hint...
                    </div>
                  )}
                  {hint && (
                    <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-left text-sm text-amber-800 animate-fade-in">
                      <div className="font-semibold flex items-center gap-1.5 mb-1">
                        <Lightbulb size={16} /> Hint
                      </div>
                      {hint}
                    </div>
                  )}
                </div>
              )}

              {/* Scam / Safe buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => submitAnswer('scam')}
                  disabled={status === 'evaluating'}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-4 text-lg font-bold text-white hover:bg-red-700 active:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  id="scam-button"
                >
                  <AlertTriangle size={22} /> Scam
                </button>
                <button
                  onClick={() => submitAnswer('safe')}
                  disabled={status === 'evaluating'}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-4 text-lg font-bold text-white hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  id="safe-button"
                >
                  <ShieldCheck size={22} /> Safe
                </button>
              </div>

              {/* Evaluating */}
              {status === 'evaluating' && (
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-5 text-center animate-fade-in">
                  <Bot size={28} className="mx-auto mb-2 text-blue-600 animate-pulse-gentle" />
                  <p className="text-sm font-medium text-blue-700">Analyzing your answer...</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
