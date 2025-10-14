-- Create player_stats table for anonymous cloud sync
CREATE TABLE IF NOT EXISTS public.player_stats (
  player_id TEXT PRIMARY KEY,
  total_xp INTEGER NOT NULL DEFAULT 0,
  weak_areas JSONB NOT NULL DEFAULT '{}'::jsonb,
  last_synced TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.player_stats ENABLE ROW LEVEL SECURITY;

-- Players can read and write only their own stats
CREATE POLICY "Players can manage their own stats"
ON public.player_stats
FOR ALL
USING (true)
WITH CHECK (true);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_player_stats_player_id ON public.player_stats(player_id);
CREATE INDEX IF NOT EXISTS idx_player_stats_last_synced ON public.player_stats(last_synced);