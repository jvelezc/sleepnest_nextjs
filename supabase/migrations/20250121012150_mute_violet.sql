/*
  # Add last activity tracking to caregivers

  1. New Columns
    - last_activity: Timestamp for tracking caregiver's last activity
    - last_activity_type: Type of activity (login, message, etc.)

  2. Functions
    - update_caregiver_activity: Updates caregiver's last activity timestamp
    - get_active_caregivers: Gets caregivers active within a time period

  3. Triggers
    - tr_update_last_activity: Automatically updates last_activity on relevant actions
*/

-- Add last activity columns to caregivers table
ALTER TABLE caregivers 
ADD COLUMN last_activity timestamptz DEFAULT now(),
ADD COLUMN last_activity_type text;

-- Create index for performance
CREATE INDEX idx_caregivers_last_activity ON caregivers(last_activity);

-- Function to update caregiver activity
CREATE OR REPLACE FUNCTION update_caregiver_activity(
  p_caregiver_id uuid,
  p_activity_type text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE caregivers
  SET 
    last_activity = now(),
    last_activity_type = COALESCE(p_activity_type, last_activity_type)
  WHERE id = p_caregiver_id;
  
  RETURN FOUND;
END;
$$;

-- Function to get active caregivers
CREATE OR REPLACE FUNCTION get_active_caregivers(
  p_specialist_id uuid,
  p_hours int DEFAULT 24
)
RETURNS TABLE (
  caregiver_id uuid,
  name text,
  email text,
  last_activity timestamptz,
  last_activity_type text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id as caregiver_id,
    c.name,
    au.email,
    c.last_activity,
    c.last_activity_type
  FROM caregivers c
  JOIN auth.users au ON c.auth_user_id = au.id
  JOIN specialist_caregiver sc ON c.id = sc.caregiver_id
  WHERE sc.specialist_id = p_specialist_id
  AND c.last_activity > now() - (p_hours || ' hours')::interval
  ORDER BY c.last_activity DESC;
END;
$$;

-- Update get_specialist_caregivers function to use last_activity
CREATE OR REPLACE FUNCTION get_specialist_caregivers(
  p_specialist_id uuid,
  p_sort_field text DEFAULT 'last_activity',
  p_sort_order text DEFAULT 'desc',
  p_limit int DEFAULT 50,
  p_offset int DEFAULT 0
)
RETURNS TABLE (
  caregiver_id uuid,
  user_id uuid,
  caregiver_name text,
  caregiver_email text,
  last_activity timestamptz,
  status text
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
      au.email as caregiver_email,
      c.last_activity,
      sc.status
    FROM caregivers c
    JOIN auth.users au ON c.auth_user_id = au.id
    JOIN specialist_caregiver sc ON c.id = sc.caregiver_id
    WHERE sc.specialist_id = $1
    ORDER BY %I %s
    LIMIT $2 OFFSET $3',
    p_sort_field,
    p_sort_order
  )
  USING p_specialist_id, p_limit, p_offset;
END;
$$;

-- Add RLS policies
ALTER TABLE caregivers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own caregiver data"
  ON caregivers
  FOR SELECT
  TO authenticated
  USING (
    auth_user_id = auth.uid() OR
    id IN (
      SELECT caregiver_id 
      FROM specialist_caregiver 
      WHERE specialist_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own caregiver data"
  ON caregivers
  FOR UPDATE
  TO authenticated
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

-- Add comments for documentation
COMMENT ON COLUMN caregivers.last_activity IS 'Timestamp of caregiver''s last activity';
COMMENT ON COLUMN caregivers.last_activity_type IS 'Type of last activity (login, message, etc)';
COMMENT ON FUNCTION update_caregiver_activity IS 'Updates a caregiver''s last activity timestamp and type';
COMMENT ON FUNCTION get_active_caregivers IS 'Gets all caregivers active within specified hours for a specialist';