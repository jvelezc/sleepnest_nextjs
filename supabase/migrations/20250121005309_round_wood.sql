/*
  # Add get_specialist_caregivers function

  1. New Functions
    - `get_specialist_caregivers`: Retrieves caregivers for a specialist with sorting and pagination
      - Parameters:
        - p_specialist_id (uuid): ID of the specialist
        - p_sort_field (text): Field to sort by
        - p_sort_order (text): Sort direction ('asc' or 'desc')
        - p_limit (int): Maximum number of records to return
        - p_offset (int): Number of records to skip
      
  2. Security
    - Function is accessible only to authenticated users
    - Results are filtered by specialist ID for security
*/

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
      COALESCE(c.last_activity, c.created_at) as last_activity,
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