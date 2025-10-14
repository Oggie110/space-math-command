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

export interface CelestialBody {
  id: string;
  name: string;
  type: 'planet' | 'moon' | 'asteroid' | 'dwarf' | 'kuiper';
  fact: string;
  focusTables: number[];
  color: string;
  emoji: string;
}

export interface Leg {
  id: string;
  fromBodyId: string;
  toBodyId: string;
  waypointsRequired: 5;
  chapter: 'inner' | 'giants' | 'outer' | 'kuiper';
}

export interface WaypointProgress {
  legId: string;
  waypointIndex: number; // 0-4
  stars: 0 | 1 | 2 | 3;
  completed: boolean;
  accuracy: number;
  timestamp?: number;
}

export interface CampaignProgress {
  currentLegId: string;
  currentWaypointIndex: number;
  completedWaypoints: WaypointProgress[];
  unlockedLegIds: string[];
  totalMissionsCompleted: number;
}

export interface PlayerStats {
  totalXP: number;
  weakAreas: Record<string, number>; // "7x8": missCount
  campaignProgress?: CampaignProgress;
}

export interface RoundResult {
  questions: Question[];
  score: number;
  xpEarned: number;
  timestamp: number;
}
