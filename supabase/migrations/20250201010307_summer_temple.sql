/*
  # Add Nap Tracking Schema

  1. New Tables
    - sleep_environment
      - id (uuid, primary key)
      - description (text, unique)
    - sleep_onset_method  
      - id (uuid, primary key)
      - description (text, unique)
    - restfulness_rating
      - id (uuid, primary key) 
      - description (text, unique)
    - nap_sessions
      - id (uuid, primary key)
      - caregiver_id (uuid, foreign key)
      - child_id (uuid, foreign key)
      - start_time (timestamptz)
      - end_time (timestamptz)
      - total_duration (integer, generated)
      - location (text)
      - environment_id (uuid, foreign key)
      - onset_method_id (uuid, foreign key)
      - sleep_latency (integer)
      - restfulness_id (uuid, foreign key)
      - signs_of_sleep_debt (boolean)
      - notes (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for proper access control
    
  3. Seed Data
    - Initial values for environment types
    - Initial values for onset methods
    - Initial values for restfulness ratings
*/

-- Create sleep environment table
CREATE TABLE public.sleep_environment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    description TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sleep onset method table
CREATE TABLE public.sleep_onset_method (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    description TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create restfulness rating table
CREATE TABLE public.restfulness_rating (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    description TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create nap sessions table
CREATE TABLE public.nap_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    caregiver_id UUID NOT NULL REFERENCES public.caregivers(id) ON DELETE CASCADE,
    child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    total_duration INTEGER GENERATED ALWAYS AS (
        EXTRACT(EPOCH FROM (end_time - start_time)) / 60
    ) STORED,
    location TEXT NOT NULL,
    environment_id UUID REFERENCES public.sleep_environment(id) ON DELETE SET NULL,
    onset_method_id UUID REFERENCES public.sleep_onset_method(id) ON DELETE SET NULL,
    sleep_latency INTEGER NOT NULL CHECK (sleep_latency >= 0),
    restfulness_id UUID REFERENCES public.restfulness_rating(id) ON DELETE SET NULL,
    signs_of_sleep_debt BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_nap_sessions_caregiver_id ON nap_sessions(caregiver_id);
CREATE INDEX idx_nap_sessions_child_id ON nap_sessions(child_id);
CREATE INDEX idx_nap_sessions_start_time ON nap_sessions(start_time);
CREATE INDEX idx_nap_sessions_environment_id ON nap_sessions(environment_id);
CREATE INDEX idx_nap_sessions_onset_method_id ON nap_sessions(onset_method_id);
CREATE INDEX idx_nap_sessions_restfulness_id ON nap_sessions(restfulness_id);

-- Enable RLS
ALTER TABLE sleep_environment ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_onset_method ENABLE ROW LEVEL SECURITY;
ALTER TABLE restfulness_rating ENABLE ROW LEVEL SECURITY;
ALTER TABLE nap_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Sleep environment policies
CREATE POLICY "Allow read access to sleep environment"
  ON sleep_environment
  FOR SELECT
  TO authenticated
  USING (true);

-- Sleep onset method policies
CREATE POLICY "Allow read access to sleep onset method"
  ON sleep_onset_method
  FOR SELECT
  TO authenticated
  USING (true);

-- Restfulness rating policies
CREATE POLICY "Allow read access to restfulness rating"
  ON restfulness_rating
  FOR SELECT
  TO authenticated
  USING (true);

-- Nap sessions policies
CREATE POLICY "Allow caregivers to manage own nap sessions"
  ON nap_sessions
  FOR ALL
  TO authenticated
  USING (
    -- Direct access for caregiver
    caregiver_id IN (
      SELECT id FROM caregivers 
      WHERE auth_user_id = auth.uid()
    )
    OR
    -- Access for specialists through relationships
    EXISTS (
      SELECT 1 
      FROM specialist_caregiver sc
      JOIN specialists s ON s.id = sc.specialist_id
      WHERE sc.caregiver_id = nap_sessions.caregiver_id
      AND s.auth_user_id = auth.uid()
    )
  );

-- Seed data
INSERT INTO public.sleep_environment (description) VALUES
    ('Blackout curtains, white noise, 68°F'),
    ('Dim lights, fan running, no white noise'),
    ('Bright room, no sound machine'),
    ('Outside in stroller'),
    ('Car seat while driving'),
    ('Contact nap with caregiver');

INSERT INTO public.sleep_onset_method (description) VALUES
    ('Independent sleep (no assistance)'),
    ('Rocked to sleep'),
    ('Nursed to sleep'),
    ('Held until drowsy'),
    ('Pacifier used for sleep'),
    ('Motion-assisted sleep (stroller, car)');

INSERT INTO public.restfulness_rating (description) VALUES
    ('Restful, woke up happy'),
    ('Fussy on wake-up'),
    ('Woke up crying'),
    ('Restless nap, tossing/turning'),
    ('Needed resettling but continued napping'),
    ('Startled awake, did not fall back asleep');

-- Add comments for documentation
COMMENT ON TABLE sleep_environment IS 'Sleep environment options for nap tracking';
COMMENT ON TABLE sleep_onset_method IS 'Methods used to help baby fall asleep';
COMMENT ON TABLE restfulness_rating IS 'Rating options for nap quality';
COMMENT ON TABLE nap_sessions IS 'Records of baby nap sessions';

-- Helper function to get nap sessions
CREATE OR REPLACE FUNCTION get_child_nap_sessions(
  p_child_id uuid,
  p_start_date timestamptz DEFAULT NULL,
  p_end_date timestamptz DEFAULT NULL,
  p_limit integer DEFAULT 50,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  start_time timestamptz,
  end_time timestamptz,
  total_duration integer,
  location text,
  environment_description text,
  onset_method_description text,
  sleep_latency integer,
  restfulness_description text,
  signs_of_sleep_debt boolean,
  notes text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verify access
  IF NOT EXISTS (
    SELECT 1 FROM children c
    WHERE c.id = p_child_id
    AND (
      -- Direct caregiver access
      c.caregiver_id IN (
        SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
      )
      OR
      -- Specialist access
      EXISTS (
        SELECT 1 
        FROM specialist_caregiver sc
        JOIN specialists s ON s.id = sc.specialist_id
        WHERE sc.caregiver_id = c.caregiver_id
        AND s.auth_user_id = auth.uid()
      )
    )
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  SELECT 
    ns.id,
    ns.start_time,
    ns.end_time,
    ns.total_duration,
    ns.location,
    se.description as environment_description,
    som.description as onset_method_description,
    ns.sleep_latency,
    rr.description as restfulness_description,
    ns.signs_of_sleep_debt,
    ns.notes
  FROM nap_sessions ns
  LEFT JOIN sleep_environment se ON ns.environment_id = se.id
  LEFT JOIN sleep_onset_method som ON ns.onset_method_id = som.id
  LEFT JOIN restfulness_rating rr ON ns.restfulness_id = rr.id
  WHERE ns.child_id = p_child_id
  AND (p_start_date IS NULL OR ns.start_time >= p_start_date)
  AND (p_end_date IS NULL OR ns.end_time <= p_end_date)
  ORDER BY ns.start_time DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

COMMENT ON FUNCTION get_child_nap_sessions IS 'Gets paginated nap sessions for a child with optional date filtering';