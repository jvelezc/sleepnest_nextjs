/*
  # Add Feeding Records Schema

  1. New Tables
    - `feeding_records`
      - `id` (uuid, primary key)
      - `caregiver_id` (uuid, foreign key to caregivers)
      - `type` (text) - breastfeeding, bottle, formula, solids
      - `start_time` (timestamptz)
      - `end_time` (timestamptz)
      - `notes` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `breastfeeding_details`
      - `id` (uuid, primary key) 
      - `feeding_record_id` (uuid, foreign key to feeding_records)
      - `side` (text) - Left or Right
      - `duration` (integer) - in minutes
      - `order` (integer) - sequence of sides used
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for caregiver access
    - Add policies for specialist access through relationships

  3. Functions
    - save_feeding_record: Creates a new feeding record with optional breastfeeding details
    - get_caregiver_feedings: Gets feeding records for a caregiver with pagination
*/

-- Create feeding_records table
CREATE TABLE feeding_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  caregiver_id uuid NOT NULL REFERENCES caregivers(id),
  type text NOT NULL CHECK (type IN ('breastfeeding', 'bottle', 'formula', 'solids')),
  start_time timestamptz NOT NULL DEFAULT now(),
  end_time timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create breastfeeding_details table
CREATE TABLE breastfeeding_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feeding_record_id uuid NOT NULL REFERENCES feeding_records(id) ON DELETE CASCADE,
  side text NOT NULL CHECK (side IN ('Left', 'Right')),
  duration integer NOT NULL CHECK (duration > 0 AND duration <= 60),
  "order" integer NOT NULL CHECK ("order" >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_feeding_records_caregiver_id ON feeding_records(caregiver_id);
CREATE INDEX idx_feeding_records_type ON feeding_records(type);
CREATE INDEX idx_feeding_records_start_time ON feeding_records(start_time);
CREATE INDEX idx_breastfeeding_details_feeding_record_id ON breastfeeding_details(feeding_record_id);

-- Enable RLS
ALTER TABLE feeding_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE breastfeeding_details ENABLE ROW LEVEL SECURITY;

-- RLS Policies for feeding_records
CREATE POLICY "Caregivers can view own feeding records"
  ON feeding_records
  FOR SELECT
  TO authenticated
  USING (
    -- Direct access for caregiver
    caregiver_id IN (
      SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
    )
    OR
    -- Access for specialists through relationships
    EXISTS (
      SELECT 1 
      FROM specialist_caregiver sc
      JOIN specialists s ON s.id = sc.specialist_id
      WHERE sc.caregiver_id = feeding_records.caregiver_id
      AND s.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Caregivers can create own feeding records"
  ON feeding_records
  FOR INSERT
  TO authenticated
  WITH CHECK (
    caregiver_id IN (
      SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Caregivers can update own feeding records"
  ON feeding_records
  FOR UPDATE
  TO authenticated
  USING (
    caregiver_id IN (
      SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
    )
  )
  WITH CHECK (
    caregiver_id IN (
      SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
    )
  );

-- RLS Policies for breastfeeding_details
CREATE POLICY "Users can view breastfeeding details through feeding records"
  ON breastfeeding_details
  FOR SELECT
  TO authenticated
  USING (
    feeding_record_id IN (
      SELECT id FROM feeding_records
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

CREATE POLICY "Caregivers can create breastfeeding details"
  ON breastfeeding_details
  FOR INSERT
  TO authenticated
  WITH CHECK (
    feeding_record_id IN (
      SELECT id FROM feeding_records
      WHERE caregiver_id IN (
        SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
      )
    )
  );

-- Function to save a feeding record with breastfeeding details
CREATE OR REPLACE FUNCTION save_feeding_record(
  p_caregiver_id uuid,
  p_type text,
  p_start_time timestamptz DEFAULT now(),
  p_notes text DEFAULT NULL,
  p_breastfeeding_details jsonb DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_record_id uuid;
  v_detail record;
BEGIN
  -- Verify caregiver access
  IF NOT EXISTS (
    SELECT 1 FROM caregivers
    WHERE id = p_caregiver_id
    AND auth_user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  -- Create feeding record
  INSERT INTO feeding_records (
    caregiver_id,
    type,
    start_time,
    end_time,
    notes
  ) VALUES (
    p_caregiver_id,
    p_type,
    p_start_time,
    CASE 
      WHEN p_type = 'breastfeeding' AND p_breastfeeding_details IS NOT NULL 
      THEN p_start_time + (
        (SELECT COALESCE(SUM(duration), 0) 
         FROM jsonb_to_recordset(p_breastfeeding_details) AS x(duration int)
        ) * interval '1 minute'
      )
      ELSE NULL
    END,
    p_notes
  )
  RETURNING id INTO v_record_id;

  -- Add breastfeeding details if provided
  IF p_type = 'breastfeeding' AND p_breastfeeding_details IS NOT NULL THEN
    FOR v_detail IN 
      SELECT * FROM jsonb_to_recordset(p_breastfeeding_details) 
      AS x(side text, duration integer, "order" integer)
    LOOP
      INSERT INTO breastfeeding_details (
        feeding_record_id,
        side,
        duration,
        "order"
      ) VALUES (
        v_record_id,
        v_detail.side,
        v_detail.duration,
        v_detail."order"
      );
    END LOOP;
  END IF;

  RETURN v_record_id;
END;
$$;

-- Function to get feeding records for a caregiver
CREATE OR REPLACE FUNCTION get_caregiver_feedings(
  p_caregiver_id uuid,
  p_limit int DEFAULT 50,
  p_offset int DEFAULT 0,
  p_start_date timestamptz DEFAULT NULL,
  p_end_date timestamptz DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  type text,
  start_time timestamptz,
  end_time timestamptz,
  notes text,
  breastfeeding_details jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verify access
  IF NOT (
    -- Direct caregiver access
    EXISTS (
      SELECT 1 FROM caregivers
      WHERE id = p_caregiver_id
      AND auth_user_id = auth.uid()
    )
    OR
    -- Specialist access
    EXISTS (
      SELECT 1 
      FROM specialist_caregiver sc
      JOIN specialists s ON s.id = sc.specialist_id
      WHERE sc.caregiver_id = p_caregiver_id
      AND s.auth_user_id = auth.uid()
    )
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  SELECT 
    fr.id,
    fr.type,
    fr.start_time,
    fr.end_time,
    fr.notes,
    CASE 
      WHEN fr.type = 'breastfeeding' THEN
        jsonb_agg(
          jsonb_build_object(
            'side', bd.side,
            'duration', bd.duration,
            'order', bd."order"
          )
        )
      ELSE NULL
    END as breastfeeding_details
  FROM feeding_records fr
  LEFT JOIN breastfeeding_details bd ON fr.id = bd.feeding_record_id
  WHERE fr.caregiver_id = p_caregiver_id
  AND (p_start_date IS NULL OR fr.start_time >= p_start_date)
  AND (p_end_date IS NULL OR fr.start_time <= p_end_date)
  GROUP BY fr.id
  ORDER BY fr.start_time DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- Add comments
COMMENT ON TABLE feeding_records IS 'Records of all feeding sessions';
COMMENT ON TABLE breastfeeding_details IS 'Detailed tracking for breastfeeding sessions';
COMMENT ON FUNCTION save_feeding_record IS 'Creates a new feeding record with optional breastfeeding details';
COMMENT ON FUNCTION get_caregiver_feedings IS 'Gets paginated feeding records for a caregiver with optional date filtering';