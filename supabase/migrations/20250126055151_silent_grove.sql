/*
  # Fix breastfeeding durations schema

  1. Changes
    - Modify breastfeeding_sessions table to default durations to 0
    - Remove null constraint from durations
    - Add check constraints to ensure valid durations

  2. Security
    - No changes to RLS policies
*/

-- Modify breastfeeding_sessions table
ALTER TABLE breastfeeding_sessions
  ALTER COLUMN left_duration SET DEFAULT 0,
  ALTER COLUMN right_duration SET DEFAULT 0,
  ALTER COLUMN left_duration SET NOT NULL,
  ALTER COLUMN right_duration SET NOT NULL,
  DROP CONSTRAINT IF EXISTS "breastfeeding_sessions_left_duration_check",
  DROP CONSTRAINT IF EXISTS "breastfeeding_sessions_right_duration_check",
  ADD CONSTRAINT "breastfeeding_sessions_left_duration_check" 
    CHECK (left_duration >= 0 AND left_duration <= 60),
  ADD CONSTRAINT "breastfeeding_sessions_right_duration_check" 
    CHECK (right_duration >= 0 AND right_duration <= 60);

-- Add comments
COMMENT ON COLUMN breastfeeding_sessions.left_duration IS 'Duration in minutes for left side feeding, defaults to 0';
COMMENT ON COLUMN breastfeeding_sessions.right_duration IS 'Duration in minutes for right side feeding, defaults to 0';