// types/penalty-game.ts
export type PenaltyAttempt = {
  round: number;
  shooterId: string;
  goalkeeperId: string;
  result: 'scored' | 'saved' | 'missed';
  timestamp: string;
};

export type PenaltyGameState = {
  shooterId: string;
  goalkeeperId: string;
  round: number;
  attempts: PenaltyAttempt[];
  score: { shooter: number; goalkeeper: number };
  turn: 'shooter' | 'goalkeeper';
  winnerId: string | null;
  status: string;
  isInitialized: boolean;
  currentRound: number;
};