/*
  # Fix get_specialist_caregivers function

  1. Changes
    - Fix type mismatch in get_specialist_caregivers function
    - Ensure consistent return types between function definition and query
    - Add proper type casting for email field

  2. Technical Details
    - Changed email field to use text type consistently
    - Updated function return type to match actual query output
    - Added explicit type casting for auth.users.email
*/

-- Drop existing function
DROP FUNCTION IF EXISTS get_specialist_caregivers;

-- Recreate function with fixed types
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

  -- Build and execute dynamic query with explicit type casting
  RETURN QUERY EXECUTE format(
    'SELECT 
      c.id as caregiver_id,
      c.auth_user_id as user_id,
      c.name as caregiver_name,
      au.email::text as caregiver_email,
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