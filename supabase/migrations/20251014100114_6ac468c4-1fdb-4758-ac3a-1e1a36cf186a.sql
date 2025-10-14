-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Players can manage their own stats" ON player_stats;

-- Allow anyone to read player stats (needed for restore functionality)
CREATE POLICY "Anyone can read player stats"
ON player_stats
FOR SELECT
USING (true);

-- Allow players to insert their own stats
CREATE POLICY "Players can insert their own stats"
ON player_stats
FOR INSERT
WITH CHECK (true);

-- Allow players to update their own stats
CREATE POLICY "Players can update their own stats"
ON player_stats
FOR UPDATE
USING (true);

-- Prevent all deletes
CREATE POLICY "No deletes allowed"
ON player_stats
FOR DELETE
USING (false);