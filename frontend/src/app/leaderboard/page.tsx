'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { fetchLeaderboard, type LeaderboardEntry } from '@/lib/api';
import { Trophy, AlertCircle, Medal } from 'lucide-react';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaderboard()
      .then((data) => setLeaderboard(data.leaderboard))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const getRankDisplay = (rank: number) => {
    if (rank === 1) return <span className="text-lg">🥇</span>;
    if (rank === 2) return <span className="text-lg">🥈</span>;
    if (rank === 3) return <span className="text-lg">🥉</span>;
    return <span className="text-sm font-bold text-slate-400">#{rank}</span>;
  };

  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col items-center px-4 py-12">
        <div className="mx-auto max-w-lg w-full">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Trophy size={24} className="text-blue-600" />
              Leaderboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">Top scam-spotting scores</p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton h-16 w-full" />
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
              <p className="flex items-center gap-2 text-sm text-red-700">
                <AlertCircle size={16} /> Could not load leaderboard: {error}
              </p>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && leaderboard.length === 0 && (
            <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
              <Trophy size={32} className="mx-auto mb-3 text-slate-300" />
              <h3 className="mb-1 text-base font-semibold text-slate-900">No scores yet</h3>
              <p className="text-sm text-slate-500">Be the first to complete training and save your score.</p>
            </div>
          )}

          {/* List */}
          {!loading && leaderboard.length > 0 && (
            <div className="space-y-2">
              {leaderboard.map((entry) => (
                <div
                  key={entry.rank}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                    entry.rank <= 3
                      ? 'bg-amber-50 border border-amber-200'
                      : 'bg-white border border-slate-200'
                  }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center shrink-0">
                    {getRankDisplay(entry.rank)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{entry.username}</p>
                    <p className="text-xs text-slate-400">
                      {entry.totalGames} game{entry.totalGames !== 1 ? 's' : ''}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-lg font-black text-blue-700 leading-none">{entry.highScore}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                      {entry.bestDuration}s
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
