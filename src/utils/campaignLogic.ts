import { CampaignProgress, WaypointProgress, GameSettings, PlayerStats } from '@/types/game';
import { campaignLegs, celestialBodies } from '@/data/campaignRoute';
import { calculateXP } from './gameLogic';

export const calculateStars = (score: number, totalQuestions: number): 1 | 2 | 3 => {
  const accuracy = (score / totalQuestions) * 100;
  
  if (accuracy >= 90) return 3; // 18+/20 correct
  if (accuracy >= 70) return 2; // 14+/20 correct
  return 1; // completed but <70%
};

export const initializeCampaignProgress = (): CampaignProgress => {
  return {
    currentLegId: 'leg-1',
    currentWaypointIndex: 0,
    completedWaypoints: [],
    unlockedLegIds: ['leg-1'],
    totalMissionsCompleted: 0,
  };
};

export const getWaypointProgress = (
  progress: CampaignProgress,
  legId: string,
  waypointIndex: number
): WaypointProgress | undefined => {
  return progress.completedWaypoints.find(
    wp => wp.legId === legId && wp.waypointIndex === waypointIndex
  );
};

export const isLegPerfected = (progress: CampaignProgress, legId: string): boolean => {
  for (let i = 0; i < 5; i++) {
    const wp = getWaypointProgress(progress, legId, i);
    if (!wp || wp.stars < 3) return false;
  }
  return true;
};

export const getNextLegId = (currentLegId: string): string | null => {
  const currentIndex = campaignLegs.findIndex(leg => leg.id === currentLegId);
  if (currentIndex === -1 || currentIndex === campaignLegs.length - 1) return null;
  return campaignLegs[currentIndex + 1].id;
};

export const canUnlockNextLeg = (progress: CampaignProgress): boolean => {
  return isLegPerfected(progress, progress.currentLegId);
};

export const completeWaypoint = (
  progress: CampaignProgress,
  legId: string,
  waypointIndex: number,
  score: number,
  totalQuestions: number
): CampaignProgress => {
  const accuracy = (score / totalQuestions) * 100;
  const stars = calculateStars(score, totalQuestions);
  
  const existingIndex = progress.completedWaypoints.findIndex(
    wp => wp.legId === legId && wp.waypointIndex === waypointIndex
  );
  
  const newWaypointProgress: WaypointProgress = {
    legId,
    waypointIndex,
    stars,
    completed: true,
    accuracy,
    timestamp: Date.now(),
  };
  
  let updatedWaypoints = [...progress.completedWaypoints];
  
  if (existingIndex >= 0) {
    if (stars > updatedWaypoints[existingIndex].stars) {
      updatedWaypoints[existingIndex] = newWaypointProgress;
    }
  } else {
    updatedWaypoints.push(newWaypointProgress);
  }
  
  let newCurrentLegId = legId;
  let newCurrentWaypointIndex = waypointIndex;
  let newUnlockedLegIds = [...progress.unlockedLegIds];
  
  const updatedProgress = { ...progress, completedWaypoints: updatedWaypoints };
  
  if (waypointIndex === 4 && isLegPerfected(updatedProgress, legId)) {
    const nextLegId = getNextLegId(legId);
    if (nextLegId && !newUnlockedLegIds.includes(nextLegId)) {
      newUnlockedLegIds.push(nextLegId);
      newCurrentLegId = nextLegId;
      newCurrentWaypointIndex = 0;
    }
  } else if (waypointIndex < 4 && legId === progress.currentLegId) {
    newCurrentWaypointIndex = waypointIndex + 1;
  }
  
  return {
    ...updatedProgress,
    currentLegId: newCurrentLegId,
    currentWaypointIndex: newCurrentWaypointIndex,
    unlockedLegIds: newUnlockedLegIds,
    totalMissionsCompleted: existingIndex >= 0 ? progress.totalMissionsCompleted : progress.totalMissionsCompleted + 1,
  };
};

export const generateCampaignMission = (legId: string): GameSettings => {
  const leg = campaignLegs.find(l => l.id === legId);
  if (!leg) throw new Error('Invalid leg ID');
  
  const body = celestialBodies[leg.toBodyId];
  
  return {
    selectedTables: body.focusTables,
    maxMultiplier: 12,
    questionsPerRound: 20,
  };
};

export const calculateCampaignXP = (
  score: number,
  totalQuestions: number,
  isReplay: boolean
): number => {
  const baseXP = calculateXP(score, totalQuestions);
  return isReplay ? Math.floor(baseXP * 0.5) : baseXP;
};

export const getLegById = (legId: string) => {
  return campaignLegs.find(leg => leg.id === legId);
};

export const getTotalWaypoints = (): number => {
  return campaignLegs.length * 5;
};

export const getCompletedWaypointsCount = (progress: CampaignProgress): number => {
  return progress.completedWaypoints.filter(wp => wp.completed).length;
};

export const getTotalStarsEarned = (progress: CampaignProgress): number => {
  return progress.completedWaypoints.reduce((sum, wp) => sum + wp.stars, 0);
};

export const isReplayAttempt = (
  progress: CampaignProgress,
  legId: string,
  waypointIndex: number
): boolean => {
  const existing = getWaypointProgress(progress, legId, waypointIndex);
  return existing !== undefined && existing.completed;
};
