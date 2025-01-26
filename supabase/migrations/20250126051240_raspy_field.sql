/*
  # Add children table and functions

  1. New Tables
    - `children`
      - `id` (uuid, primary key)
      - `caregiver_id` (uuid, foreign key)
      - `name` (text)
      - `date_of_birth` (date)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on children table
    - Add policies for caregiver and specialist access
*/

-- Create children table if it doesn't exist
CREATE TABLE IF NOT EXISTS children (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  caregiver_id uuid NOT NULL REFERENCES caregivers(id),
  name text NOT NULL,
  date_of_birth date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_children_caregiver_id ON children(caregiver_id);

-- Enable RLS
ALTER TABLE children ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow caregivers to manage own children"
  ON children
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
      WHERE sc.caregiver_id = children.caregiver_id
      AND s.auth_user_id = auth.uid()
    )
  );

-- Function to get children for a caregiver
CREATE OR REPLACE FUNCTION get_caregiver_children(
  p_caregiver_id uuid
)
RETURNS TABLE (
  id uuid,
  name text,
  date_of_birth date,
  created_at timestamptz
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
    c.id,
    c.name,
    c.date_of_birth,
    c.created_at
  FROM children c
  WHERE c.caregiver_id = p_caregiver_id
  ORDER BY c.created_at DESC;
END;
$$;

-- Add comments
COMMENT ON TABLE children IS 'Children records for caregivers';
COMMENT ON FUNCTION get_caregiver_children IS 'Gets all children for a caregiver with access control';