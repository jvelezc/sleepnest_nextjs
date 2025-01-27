/*
  # Add solids feeding tracking

  1. New Tables
    - solids_sessions
      - id (uuid, primary key)
      - session_id (uuid, references feeding_sessions)
      - foods (text array)
      - amount_eaten (enum)
      - reaction (enum)
      - texture_preference (enum)
      - timing_relative_to_sleep (enum)
      - created_at (timestamptz)
      - updated_at (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for access control
    - Add indexes for performance

  3. Changes
    - Add enums for amount eaten, reaction, texture preference
    - Add constraints and validation
*/

-- Create enums for solids tracking
CREATE TYPE amount_eaten_enum AS ENUM ('none', 'taste', 'some', 'most', 'all');
CREATE TYPE food_reaction_enum AS ENUM ('enjoyed', 'neutral', 'disliked', 'allergic');
CREATE TYPE texture_preference_enum AS ENUM ('pureed', 'mashed', 'soft', 'finger_foods');
CREATE TYPE sleep_timing_enum AS ENUM ('well_before', 'close_to', 'during_night');

-- Modify solids_sessions table
ALTER TABLE solids_sessions
  DROP COLUMN IF EXISTS amount_eaten,
  DROP COLUMN IF EXISTS reaction,
  DROP COLUMN IF EXISTS texture_preference,
  DROP COLUMN IF EXISTS timing_relative_to_sleep;

ALTER TABLE solids_sessions
  ADD COLUMN amount_eaten amount_eaten_enum,
  ADD COLUMN reaction food_reaction_enum,
  ADD COLUMN texture_preference texture_preference_enum,
  ADD COLUMN timing_relative_to_sleep sleep_timing_enum;

-- Add constraints
ALTER TABLE solids_sessions
  ADD CONSTRAINT foods_not_empty CHECK (array_length(foods, 1) > 0),
  ADD CONSTRAINT max_foods CHECK (array_length(foods, 1) <= 20);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_solids_sessions_session_id ON solids_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_solids_sessions_amount_eaten ON solids_sessions(amount_eaten);
CREATE INDEX IF NOT EXISTS idx_solids_sessions_reaction ON solids_sessions(reaction);

-- Enable RLS
ALTER TABLE solids_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view solids sessions through feeding records"
  ON solids_sessions
  FOR SELECT
  TO authenticated
  USING (
    session_id IN (
      SELECT id FROM feeding_sessions
      WHERE caregiver_id IN (
        -- Direct caregiver access
        SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
      )
      OR caregiver_id IN (
        -- Specialist access through relationships
        SELECT sc.caregiver_id
        FROM specialist_caregiver sc
        JOIN specialists s ON s.id = sc.specialist_id
        WHERE s.auth_user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Caregivers can create solids sessions"
  ON solids_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    session_id IN (
      SELECT id FROM feeding_sessions
      WHERE caregiver_id IN (
        SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
      )
    )
  );

-- Add comments for documentation
COMMENT ON TABLE solids_sessions IS 'Records of solid food feeding sessions';
COMMENT ON COLUMN solids_sessions.foods IS 'Array of foods offered during the session';
COMMENT ON COLUMN solids_sessions.amount_eaten IS 'How much of the offered food was consumed';
COMMENT ON COLUMN solids_sessions.reaction IS 'Baby''s reaction to the food';
COMMENT ON COLUMN solids_sessions.texture_preference IS 'Preferred food texture during feeding';
COMMENT ON COLUMN solids_sessions.timing_relative_to_sleep IS 'When feeding occurred relative to sleep schedule';