-- Add campaign_progress column to player_stats table
ALTER TABLE player_stats 
ADD COLUMN IF NOT EXISTS campaign_progress JSONB DEFAULT NULL;