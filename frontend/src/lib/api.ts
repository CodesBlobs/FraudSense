// In production, we'll use a Next.js rewrite (proxy) to talk to the backend.
// This allows us to use relative paths like '/api/...' which bypasses HTTPS/HTTP blocks.
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

interface FetchOptions extends RequestInit {
  auth?: boolean;
}

/**
 * Wrapper around fetch that handles API base URL, auth headers, and JSON parsing.
 */
async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { auth = false, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  // Attach JWT if authenticated
  if (auth) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('scamshield_token') : null;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `API Error: ${res.status}`);
  }

  return res.json();
}

// ===== Scenario APIs =====

export interface Scenario {
  id: string;
  content: string;
  category: string;
  difficulty: string;
  senderName: string;
  messageType: string;
}

export async function fetchRandomScenario(difficulty?: string): Promise<Scenario> {
  const params = difficulty ? `?difficulty=${difficulty}` : '';
  return apiFetch<Scenario>(`/api/scenarios/random${params}`);
}

export async function fetchScenarioBatch(count = 10, difficulty?: string): Promise<{ scenarios: Scenario[]; total: number }> {
  const params = new URLSearchParams();
  params.set('count', String(count));
  if (difficulty) params.set('difficulty', difficulty);
  return apiFetch(`/api/scenarios/batch?${params.toString()}`);
}

export async function fetchHint(scenarioId: string): Promise<{ hint: string }> {
  return apiFetch(`/api/scenarios/${scenarioId}/hint`);
}

export async function generateFakeLink(category: string, senderName: string, content: string): Promise<{ link: string }> {
  return apiFetch<{ link: string }>('/api/scenarios/generate-link', {
    method: 'POST',
    body: JSON.stringify({ category, senderName, content }),
  });
}

// ===== Evaluate APIs =====

export interface EvaluationResult {
  verdict: 'SCAM' | 'LEGIT';
  isCorrect: boolean;
  explanation: string;
  redFlags: string[];
  safetyTips: string[];
}

export async function evaluateAnswer(
  scenarioId: string,
  message: string,
  userAnswer: 'scam' | 'safe'
): Promise<EvaluationResult> {
  return apiFetch<EvaluationResult>('/api/evaluate', {
    method: 'POST',
    auth: true,
    body: JSON.stringify({ scenarioId, message, userAnswer }),
  });
}

// ===== Auth APIs =====

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    highScore: number;
    totalGames: number;
  };
}

export async function register(username: string, password: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

// ===== Score APIs =====

export interface SaveScoreResponse {
  saved: boolean;
  highScore: number;
  bestDuration: number;
  totalGames: number;
}

export async function saveScore(score: number, totalQuestions: number, duration?: number): Promise<SaveScoreResponse> {
  return apiFetch<SaveScoreResponse>('/api/scores', {
    method: 'POST',
    auth: true,
    body: JSON.stringify({ score, totalQuestions, duration }),
  });
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  highScore: number;
  bestDuration: number;
  totalGames: number;
}

export async function fetchLeaderboard(): Promise<{ leaderboard: LeaderboardEntry[] }> {
  return apiFetch('/api/scores/leaderboard');
}
