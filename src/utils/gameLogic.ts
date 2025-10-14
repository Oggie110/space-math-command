import { Question, GameSettings, PlayerStats } from '@/types/game';
import { supabase } from '@/integrations/supabase/client';

export const generateQuestions = (
  settings: GameSettings,
  stats?: PlayerStats
): Question[] => {
  const questions: Question[] = [];
  const { selectedTables, maxMultiplier, questionsPerRound } = settings;

  // Create pool of all possible pairs with weighting
  const allPairs: [number, number][] = [];
  selectedTables.forEach(table => {
    for (let i = 1; i <= maxMultiplier; i++) {
      // Reduce frequency of x1 and x10 (only include 30% of the time)
      if (i === 1 || i === 10) {
        if (Math.random() < 0.3) {
          allPairs.push([table, i]);
        }
      } else {
        allPairs.push([table, i]);
      }
    }
  });

  // Sort pairs by weakness (if stats available)
  if (stats && Object.keys(stats.weakAreas).length > 0) {
    allPairs.sort((a, b) => {
      const keyA = `${a[0]}x${a[1]}`;
      const keyB = `${b[0]}x${b[1]}`;
      const weaknessA = stats.weakAreas[keyA] || 0;
      const weaknessB = stats.weakAreas[keyB] || 0;
      return weaknessB - weaknessA; // Higher weakness first
    });
  }

  // Select questions with bias towards weak areas
  const selectedPairs: [number, number][] = [];
  
  // 60% weak areas, 40% random
  const weakCount = Math.floor(questionsPerRound * 0.6);
  const randomCount = questionsPerRound - weakCount;

  // Add weak area questions
  for (let i = 0; i < weakCount && i < allPairs.length; i++) {
    selectedPairs.push(allPairs[i]);
  }

  // Add random questions
  const remainingPairs = allPairs.slice(weakCount);
  for (let i = 0; i < randomCount; i++) {
    const randomIndex = Math.floor(Math.random() * remainingPairs.length);
    selectedPairs.push(remainingPairs[randomIndex]);
  }

  // Shuffle and create question objects
  const shuffled = selectedPairs.sort(() => Math.random() - 0.5);
  
  shuffled.forEach(([num1, num2]) => {
    questions.push({
      num1,
      num2,
      answer: num1 * num2,
    });
  });

  return questions;
};

export const calculateXP = (score: number, totalQuestions: number): number => {
  const baseXP = 50;
  const bonusXP = Math.floor((score / totalQuestions) * 100);
  return baseXP + bonusXP;
};

export const updateWeakAreas = (
  questions: Question[],
  currentWeakAreas: Record<string, number>
): Record<string, number> => {
  const updated = { ...currentWeakAreas };

  questions.forEach(q => {
    if (q.correct === false) {
      const key = `${q.num1}x${q.num2}`;
      updated[key] = (updated[key] || 0) + 1;
    }
  });

  return updated;
};

// Generate a unique player ID
export const generatePlayerId = (): string => {
  const randomPart = Math.random().toString(36).substring(2, 9);
  return `space_math_${randomPart}`;
};

// Get or create player ID
export const getPlayerId = (): string => {
  let playerId = localStorage.getItem('spacemath_player_id');
  if (!playerId) {
    playerId = generatePlayerId();
    localStorage.setItem('spacemath_player_id', playerId);
  }
  return playerId;
};

export const loadPlayerStats = (): PlayerStats => {
  // Ensure player ID exists
  getPlayerId();
  
  const stored = localStorage.getItem('spacemath_stats');
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    totalXP: 0,
    weakAreas: {},
  };
};

export const savePlayerStats = (stats: PlayerStats): void => {
  localStorage.setItem('spacemath_stats', JSON.stringify(stats));
};

// Sync stats to cloud (non-blocking background operation)
export const syncStatsToCloud = async (stats: PlayerStats): Promise<void> => {
  try {
    const playerId = getPlayerId();
    
    const { error } = await supabase
      .from('player_stats')
      .upsert({
        player_id: playerId,
        total_xp: stats.totalXP,
        weak_areas: stats.weakAreas,
        campaign_progress: stats.campaignProgress || null,
        last_synced: new Date().toISOString(),
      });

    if (error) {
      console.warn('Background sync failed (this is OK):', error.message);
    }
  } catch (error) {
    // Silent fail - sync is optional, game works offline
    console.warn('Background sync error (this is OK):', error);
  }
};

// Pull stats from cloud by player ID
export const pullStatsFromCloud = async (playerId: string): Promise<PlayerStats | null> => {
  try {
    const { data, error } = await supabase
      .from('player_stats')
      .select('*')
      .eq('player_id', playerId)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
      totalXP: data.total_xp,
      weakAreas: data.weak_areas as Record<string, number>,
    };
  } catch (error) {
    console.error('Failed to pull stats from cloud:', error);
    return null;
  }
};

// Merge local and cloud stats (smart merge)
export const mergeStats = (local: PlayerStats, cloud: PlayerStats): PlayerStats => {
  // Take the higher XP
  const totalXP = Math.max(local.totalXP, cloud.totalXP);
  
  // Merge weak areas (combine counts)
  const weakAreas: Record<string, number> = { ...local.weakAreas };
  Object.entries(cloud.weakAreas).forEach(([key, count]) => {
    weakAreas[key] = Math.max(weakAreas[key] || 0, count);
  });

  return { totalXP, weakAreas };
};

// Restore progress from cloud
export const restoreProgressFromCloud = async (playerId: string): Promise<{ success: boolean; stats?: PlayerStats; error?: string }> => {
  try {
    const cloudStats = await pullStatsFromCloud(playerId);
    
    if (!cloudStats) {
      return { success: false, error: 'No progress found for this code' };
    }

    const localStats = loadPlayerStats();
    const mergedStats = mergeStats(localStats, cloudStats);
    
    // Update local storage with new player ID and merged stats
    localStorage.setItem('spacemath_player_id', playerId);
    savePlayerStats(mergedStats);
    
    // Sync back to cloud
    await syncStatsToCloud(mergedStats);

    return { success: true, stats: mergedStats };
  } catch (error) {
    console.error('Restore failed:', error);
    return { success: false, error: 'Failed to restore progress. Please try again.' };
  }
};
