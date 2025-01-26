/*
  # Feeding Types Schema

  1. New Tables
    - `feeding_sessions` (base table)
      - `id` (uuid, primary key)
      - `caregiver_id` (uuid, foreign key)
      - `type` (text) - breastfeeding, bottle, formula, solids
      - `start_time` (timestamptz)
      - `end_time` (timestamptz)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `breastfeeding_sessions`
      - `id` (uuid, primary key)
      - `session_id` (uuid, foreign key)
      - `left_duration` (integer) - in minutes
      - `right_duration` (integer) - in minutes
      - `feeding_order` (text[]) - array of sides in order
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `bottle_sessions`
      - `id` (uuid, primary key)
      - `session_id` (uuid, foreign key)
      - `milk_type` (text) - expressed, donor
      - `amount_ml` (integer)
      - `amount_oz` (decimal)
      - `warmed` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `formula_sessions`
      - `id` (uuid, primary key)
      - `session_id` (uuid, foreign key)
      - `brand` (text)
      - `amount_ml` (integer)
      - `amount_oz` (decimal)
      - `concentration` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `solids_sessions`
      - `id` (uuid, primary key)
      - `session_id` (uuid, foreign key)
      - `foods` (text[])
      - `amount_eaten` (text)
      - `reaction` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for caregiver access
    - Add policies for specialist access through relationships
*/

-- Create feeding_sessions table
CREATE TABLE feeding_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  caregiver_id uuid NOT NULL REFERENCES caregivers(id),
  type text NOT NULL CHECK (type IN ('breastfeeding', 'bottle', 'formula', 'solids')),
  start_time timestamptz NOT NULL DEFAULT now(),
  end_time timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create breastfeeding_sessions table
CREATE TABLE breastfeeding_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES feeding_sessions(id) ON DELETE CASCADE,
  left_duration integer CHECK (left_duration IS NULL OR (left_duration > 0 AND left_duration <= 60)),
  right_duration integer CHECK (right_duration IS NULL OR (right_duration > 0 AND right_duration <= 60)),
  feeding_order text[] CHECK (array_length(feeding_order, 1) <= 10),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT require_one_side CHECK (
    left_duration IS NOT NULL OR right_duration IS NOT NULL
  )
);

-- Create bottle_sessions table
CREATE TABLE bottle_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES feeding_sessions(id) ON DELETE CASCADE,
  milk_type text NOT NULL CHECK (milk_type IN ('expressed', 'donor')),
  amount_ml integer CHECK (amount_ml > 0 AND amount_ml <= 500),
  amount_oz decimal(4,1) CHECK (amount_oz > 0 AND amount_oz <= 16),
  warmed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT require_one_amount CHECK (
    amount_ml IS NOT NULL OR amount_oz IS NOT NULL
  )
);

-- Create formula_sessions table
CREATE TABLE formula_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES feeding_sessions(id) ON DELETE CASCADE,
  brand text,
  amount_ml integer CHECK (amount_ml > 0 AND amount_ml <= 500),
  amount_oz decimal(4,1) CHECK (amount_oz > 0 AND amount_oz <= 16),
  concentration text CHECK (concentration IN ('standard', 'concentrated', 'diluted')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT require_one_amount CHECK (
    amount_ml IS NOT NULL OR amount_oz IS NOT NULL
  )
);

-- Create solids_sessions table
CREATE TABLE solids_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES feeding_sessions(id) ON DELETE CASCADE,
  foods text[] NOT NULL,
  amount_eaten text CHECK (amount_eaten IN ('none', 'taste', 'some', 'most', 'all')),
  reaction text CHECK (reaction IN ('enjoyed', 'neutral', 'disliked', 'allergic')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_feeding_sessions_caregiver ON feeding_sessions(caregiver_id);
CREATE INDEX idx_feeding_sessions_type ON feeding_sessions(type);
CREATE INDEX idx_feeding_sessions_start_time ON feeding_sessions(start_time);
CREATE INDEX idx_breastfeeding_sessions_session ON breastfeeding_sessions(session_id);
CREATE INDEX idx_bottle_sessions_session ON bottle_sessions(session_id);
CREATE INDEX idx_formula_sessions_session ON formula_sessions(session_id);
CREATE INDEX idx_solids_sessions_session ON solids_sessions(session_id);

-- Enable RLS
ALTER TABLE feeding_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE breastfeeding_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bottle_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE formula_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE solids_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for feeding_sessions
CREATE POLICY "Caregivers can view own feeding sessions"
  ON feeding_sessions
  FOR SELECT
  TO authenticated
  USING (
    caregiver_id IN (
      SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 
      FROM specialist_caregiver sc
      JOIN specialists s ON s.id = sc.specialist_id
      WHERE sc.caregiver_id = feeding_sessions.caregiver_id
      AND s.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Caregivers can create own feeding sessions"
  ON feeding_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    caregiver_id IN (
      SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
    )
  );

-- RLS Policies for detail tables (breastfeeding, bottle, formula, solids)
CREATE POLICY "Users can view feeding details through sessions"
  ON breastfeeding_sessions
  FOR SELECT
  TO authenticated
  USING (
    session_id IN (
      SELECT id FROM feeding_sessions
      WHERE caregiver_id IN (
        SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
      )
      OR caregiver_id IN (
        SELECT sc.caregiver_id
        FROM specialist_caregiver sc
        JOIN specialists s ON s.id = sc.specialist_id
        WHERE s.auth_user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Caregivers can create feeding details"
  ON breastfeeding_sessions
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

-- Repeat similar policies for other detail tables
CREATE POLICY "Users can view bottle details"
  ON bottle_sessions FOR SELECT TO authenticated
  USING (session_id IN (SELECT id FROM feeding_sessions WHERE caregiver_id IN (
    SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
  ) OR caregiver_id IN (
    SELECT sc.caregiver_id FROM specialist_caregiver sc
    JOIN specialists s ON s.id = sc.specialist_id WHERE s.auth_user_id = auth.uid()
  )));

CREATE POLICY "Users can view formula details"
  ON formula_sessions FOR SELECT TO authenticated
  USING (session_id IN (SELECT id FROM feeding_sessions WHERE caregiver_id IN (
    SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
  ) OR caregiver_id IN (
    SELECT sc.caregiver_id FROM specialist_caregiver sc
    JOIN specialists s ON s.id = sc.specialist_id WHERE s.auth_user_id = auth.uid()
  )));

CREATE POLICY "Users can view solids details"
  ON solids_sessions FOR SELECT TO authenticated
  USING (session_id IN (SELECT id FROM feeding_sessions WHERE caregiver_id IN (
    SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
  ) OR caregiver_id IN (
    SELECT sc.caregiver_id FROM specialist_caregiver sc
    JOIN specialists s ON s.id = sc.specialist_id WHERE s.auth_user_id = auth.uid()
  )));

CREATE POLICY "Caregivers can create bottle details"
  ON bottle_sessions FOR INSERT TO authenticated
  WITH CHECK (session_id IN (
    SELECT id FROM feeding_sessions WHERE caregiver_id IN (
      SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
    )
  ));

CREATE POLICY "Caregivers can create formula details"
  ON formula_sessions FOR INSERT TO authenticated
  WITH CHECK (session_id IN (
    SELECT id FROM feeding_sessions WHERE caregiver_id IN (
      SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
    )
  ));

CREATE POLICY "Caregivers can create solids details"
  ON solids_sessions FOR INSERT TO authenticated
  WITH CHECK (session_id IN (
    SELECT id FROM feeding_sessions WHERE caregiver_id IN (
      SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
    )
  ));

-- Add comments for documentation
COMMENT ON TABLE feeding_sessions IS 'Base table for all feeding records';
COMMENT ON TABLE breastfeeding_sessions IS 'Details specific to breastfeeding sessions';
COMMENT ON TABLE bottle_sessions IS 'Details specific to bottle feeding sessions';
COMMENT ON TABLE formula_sessions IS 'Details specific to formula feeding sessions';
COMMENT ON TABLE solids_sessions IS 'Details specific to solid food feeding sessions';