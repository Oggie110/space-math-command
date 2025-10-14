export interface Question {
  num1: number;
  num2: number;
  answer: number;
  userAnswer?: number;
  correct?: boolean;
}

export interface GameSettings {
  selectedTables: number[];
  maxMultiplier: number;
  questionsPerRound: number;
}

export interface PlayerStats {
  totalXP: number;
  weakAreas: Record<string, number>; // "7x8": missCount
}

export interface RoundResult {
  questions: Question[];
  score: number;
  xpEarned: number;
  timestamp: number;
}
