'use client';

import type { EvaluationResult } from '@/lib/api';

interface ResultDisplayProps {
  evaluation: EvaluationResult;
  userAnswer: 'scam' | 'safe';
  onNext: () => void;
  questionNumber: number;
  totalQuestions: number;
}

export default function ResultDisplay({ evaluation, userAnswer, onNext, questionNumber, totalQuestions }: ResultDisplayProps) {
  const isCorrect = evaluation.isCorrect;

  return (
    <div className="animate-slide-up space-y-4">
      {/* Result header */}
      <div className={`rounded-xl p-5 text-center ${
        isCorrect
          ? 'bg-emerald-50 border border-emerald-200'
          : 'bg-red-50 border border-red-200'
      }`}>
        <div className="text-3xl mb-2">
          {isCorrect ? '✓' : '✗'}
        </div>
        <h2 className={`text-xl font-bold ${
          isCorrect ? 'text-emerald-800' : 'text-red-800'
        }`}>
          {isCorrect ? 'Correct' : 'Incorrect'}
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          You said <strong>{userAnswer === 'scam' ? 'Scam' : 'Safe'}</strong>
          {' — '}this was <strong>{evaluation.verdict === 'SCAM' ? 'a scam' : 'legitimate'}</strong>
        </p>
      </div>

      {/* Explanation */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <h3 className="mb-2 text-sm font-bold text-slate-900 uppercase tracking-wide">Why?</h3>
        <p className="text-sm leading-relaxed text-slate-600">
          {evaluation.explanation}
        </p>
      </div>

      {/* Red Flags */}
      {evaluation.redFlags && evaluation.redFlags.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <h3 className="mb-2 text-sm font-bold text-red-800 uppercase tracking-wide">Warning Signs</h3>
          <ul className="space-y-1.5">
            {evaluation.redFlags.map((flag, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                <span className="mt-0.5 text-red-400">•</span>
                {flag}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Safety Tips */}
      {evaluation.safetyTips && evaluation.safetyTips.length > 0 && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <h3 className="mb-2 text-sm font-bold text-emerald-800 uppercase tracking-wide">Safety Tips</h3>
          <ul className="space-y-1.5">
            {evaluation.safetyTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-emerald-700">
                <span className="mt-0.5 text-emerald-400">✓</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Next button */}
      <button
        onClick={onNext}
        className="w-full rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white hover:bg-blue-700 transition-colors"
      >
        {questionNumber < totalQuestions ? 'Next Scenario →' : 'See Results'}
      </button>
    </div>
  );
}
