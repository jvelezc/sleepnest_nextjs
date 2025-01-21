/*
  # Add archive functionality

  1. New Functions
    - `get_specialist_caregivers_with_archive`: Enhanced version of get_specialist_caregivers that includes archive filtering
    - `toggle_caregiver_archive`: Function to toggle archive status

  2. Changes
    - Add archived column to specialist_caregiver table
    - Add index for better query performance
*/

-- Add archived column if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'specialist_caregiver' 
    AND column_name = 'archived'
  ) THEN
    ALTER TABLE specialist_caregiver
    ADD COLUMN archived boolean NOT NULL DEFAULT false;
  END IF;
END $$;

-- Add index for archived status
CREATE INDEX IF NOT EXISTS idx_specialist_caregiver_archived 
ON specialist_caregiver(specialist_id, archived);

-- Function to get caregivers with archive filtering
CREATE OR REPLACE FUNCTION get_specialist_caregivers_with_archive(
  p_specialist_id uuid,
  p_sort_field text DEFAULT 'last_activity',
  p_sort_order text DEFAULT 'desc',
  p_limit int DEFAULT 50,
  p_offset int DEFAULT 0,
  p_include_archived boolean DEFAULT false,
  p_archived_only boolean DEFAULT false
)
RETURNS TABLE (
  caregiver_id uuid,
  user_id uuid,
  caregiver_name text,
  caregiver_email text,
  last_activity timestamptz,
  status text,
  archived boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Validate sort order
  IF p_sort_order NOT IN ('asc', 'desc') THEN
    RAISE EXCEPTION 'Invalid sort order. Must be "asc" or "desc"';
  END IF;

  -- Validate sort field
  IF p_sort_field NOT IN ('last_activity', 'caregiver_name', 'caregiver_email') THEN
    RAISE EXCEPTION 'Invalid sort field';
  END IF;

  -- Build and execute dynamic query
  RETURN QUERY EXECUTE format(
    'SELECT 
      c.id as caregiver_id,
      c.auth_user_id as user_id,
      c.name as caregiver_name,
      au.email::text as caregiver_email,
      c.last_activity,
      sc.status,
      sc.archived
    FROM caregivers c
    JOIN auth.users au ON c.auth_user_id = au.id
    JOIN specialist_caregiver sc ON c.id = sc.caregiver_id
    WHERE sc.specialist_id = $1
    AND CASE 
      WHEN $4 THEN true  -- Include all if include_archived is true
      WHEN $5 THEN sc.archived = true  -- Only archived if archived_only is true
      ELSE NOT sc.archived  -- Only non-archived by default
    END
    ORDER BY %I %s
    LIMIT $2 OFFSET $3',
    p_sort_field,
    p_sort_order
  )
  USING 
    p_specialist_id, 
    p_limit, 
    p_offset,
    p_include_archived,
    p_archived_only;
END;
$$;

-- Function to toggle archive status
CREATE OR REPLACE FUNCTION toggle_caregiver_archive(
  p_specialist_id uuid,
  p_caregiver_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_archived boolean;
BEGIN
  -- Get current archived status
  SELECT archived INTO v_current_archived
  FROM specialist_caregiver
  WHERE specialist_id = p_specialist_id
  AND caregiver_id = p_caregiver_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Relationship not found';
  END IF;

  -- Toggle archived status
  UPDATE specialist_caregiver
  SET 
    archived = NOT v_current_archived,
    updated_at = now()
  WHERE specialist_id = p_specialist_id
  AND caregiver_id = p_caregiver_id;

  RETURN NOT v_current_archived;
END;
$$;

-- Add RLS policies for archive operations
CREATE POLICY "Specialists can archive their caregivers"
  ON specialist_caregiver
  FOR UPDATE
  TO authenticated
  USING (specialist_id = auth.uid())
  WITH CHECK (specialist_id = auth.uid());

-- Add comments for documentation
COMMENT ON COLUMN specialist_caregiver.archived IS 'Indicates if the caregiver is archived';
COMMENT ON FUNCTION get_specialist_caregivers_with_archive IS 'Gets specialist''s caregivers with archive filtering options';
COMMENT ON FUNCTION toggle_caregiver_archive IS 'Toggles archive status for a caregiver';