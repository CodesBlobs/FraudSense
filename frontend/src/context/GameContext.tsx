'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Scenario, EvaluationResult } from '@/lib/api';
import { fetchScenarioBatch, evaluateAnswer } from '@/lib/api';

interface GameState {
  scenarios: Scenario[];
  currentIndex: number;
  score: number;
  totalAnswered: number;
  results: Array<{
    scenario: Scenario;
    userAnswer: 'scam' | 'safe';
    evaluation: EvaluationResult;
  }>;
  status: 'idle' | 'loading' | 'playing' | 'evaluating' | 'showing-result' | 'finished';
  currentEvaluation: EvaluationResult | null;
  totalQuestions: number;
  startTime: number | null;
  duration: number | null;
}

interface GameContextType extends GameState {
  startGame: (totalQuestions?: number, difficulty?: string) => Promise<void>;
  submitAnswer: (answer: 'scam' | 'safe') => Promise<void>;
  nextQuestion: () => void;
  resetGame: () => void;
  currentScenario: Scenario | null;
}

const GameContext = createContext<GameContextType | null>(null);

const initialState: GameState = {
  scenarios: [],
  currentIndex: 0,
  score: 0,
  totalAnswered: 0,
  results: [],
  status: 'idle',
  currentEvaluation: null,
  totalQuestions: 10,
  startTime: null,
  duration: null,
};

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(initialState);

  const startGame = useCallback(async (totalQuestions = 10, difficulty?: string) => {
    setState(prev => ({ ...prev, status: 'loading' }));
    try {
      const { scenarios } = await fetchScenarioBatch(totalQuestions, difficulty);
      setState({
        ...initialState,
        scenarios,
        totalQuestions: scenarios.length,
        status: 'playing',
        startTime: Date.now(),
      });
    } catch (err) {
      console.error('Failed to start game:', err);
      setState(prev => ({ ...prev, status: 'idle' }));
    }
  }, []);

  const submitAnswer = useCallback(async (answer: 'scam' | 'safe') => {
    const scenario = state.scenarios[state.currentIndex];
    if (!scenario) return;

    setState(prev => ({ ...prev, status: 'evaluating' }));

    try {
      const evaluation = await evaluateAnswer(scenario.id, scenario.content, answer);

      setState(prev => ({
        ...prev,
        status: 'showing-result',
        currentEvaluation: evaluation,
        score: evaluation.isCorrect ? prev.score + 1 : prev.score,
        totalAnswered: prev.totalAnswered + 1,
        results: [...prev.results, { scenario, userAnswer: answer, evaluation }],
      }));
    } catch (err) {
      console.error('Failed to evaluate:', err);
      setState(prev => ({ ...prev, status: 'playing' }));
    }
  }, [state.scenarios, state.currentIndex]);

  const nextQuestion = useCallback(() => {
    setState(prev => {
      const nextIndex = prev.currentIndex + 1;
      if (nextIndex >= prev.scenarios.length) {
        const endTime = Date.now();
        const durationSeconds = prev.startTime ? Math.floor((endTime - prev.startTime) / 1000) : 0;
        return { 
          ...prev, 
          status: 'finished', 
          currentEvaluation: null,
          duration: durationSeconds 
        };
      }
      return { ...prev, currentIndex: nextIndex, status: 'playing', currentEvaluation: null };
    });
  }, []);

  const resetGame = useCallback(() => {
    setState(initialState);
  }, []);

  const currentScenario = state.scenarios[state.currentIndex] || null;

  return (
    <GameContext.Provider value={{
      ...state,
      startGame,
      submitAnswer,
      nextQuestion,
      resetGame,
      currentScenario,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
