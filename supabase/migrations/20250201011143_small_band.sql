/*
  # Add Nap Location Lookup Table and Update Nap Sessions Schema

  1. New Tables
    - nap_location
      - id (uuid, primary key)
      - description (text, unique)
      - created_at (timestamptz)
      - updated_at (timestamptz)

  2. Schema Changes
    - Modify nap_sessions table to use location_id instead of location text field
    
  3. Security
    - Enable RLS on new table
    - Add policies for proper access control
    
  4. Data Migration
    - Add initial nap location options
*/

-- Create nap location table
CREATE TABLE public.nap_location (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    description TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index
CREATE INDEX idx_nap_location_description ON nap_location(description);

-- Enable RLS
ALTER TABLE nap_location ENABLE ROW LEVEL SECURITY;

-- Add RLS policy for read access
CREATE POLICY "Allow read access to nap location"
  ON nap_location
  FOR SELECT
  TO authenticated
  USING (true);

-- Add location_id column to nap_sessions
ALTER TABLE nap_sessions 
ADD COLUMN location_id UUID REFERENCES public.nap_location(id) ON DELETE SET NULL;

-- Create index for new column
CREATE INDEX idx_nap_sessions_location_id ON nap_sessions(location_id);

-- Seed data
INSERT INTO public.nap_location (description) VALUES
    ('Crib'),
    ('Bassinet'),
    ('Stroller'),
    ('Car seat (while driving)'),
    ('Contact nap (on caregiver)'),
    ('Swing or bouncer'),
    ('Playpen'),
    ('Floor mat'),
    ('Other');

-- Update helper function to include location description
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
  location_description text,
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
    nl.description as location_description,
    se.description as environment_description,
    som.description as onset_method_description,
    ns.sleep_latency,
    rr.description as restfulness_description,
    ns.signs_of_sleep_debt,
    ns.notes
  FROM nap_sessions ns
  LEFT JOIN nap_location nl ON ns.location_id = nl.id
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

-- Add comments for documentation
COMMENT ON TABLE nap_location IS 'Lookup table for nap locations';
COMMENT ON COLUMN nap_location.description IS 'Description of the nap location';
COMMENT ON COLUMN nap_sessions.location_id IS 'Reference to the nap location lookup table';
COMMENT ON FUNCTION get_child_nap_sessions IS 'Gets paginated nap sessions for a child with location description';