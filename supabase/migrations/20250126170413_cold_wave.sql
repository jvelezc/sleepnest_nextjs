/*
  # Fix Caregiver Feeding Error

  1. New Functions
    - ensure_caregiver_exists: Creates caregiver record if it doesn't exist
    - get_caregiver_id: Gets caregiver ID from auth user ID with auto-creation
  
  2. Changes
    - Modifies feeding_sessions constraints to use caregiver ID from functions
    - Adds helper functions for feeding operations
*/

-- Function to ensure caregiver record exists
CREATE OR REPLACE FUNCTION ensure_caregiver_exists(
  p_user_id uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_caregiver_id uuid;
  v_user_role text;
  v_user_name text;
  v_user_email text;
BEGIN
  -- Get user role and details from auth.users
  SELECT 
    raw_user_meta_data->>'role',
    raw_user_meta_data->>'name',
    email
  INTO v_user_role, v_user_name, v_user_email
  FROM auth.users
  WHERE id = p_user_id;

  -- Verify user is a caregiver
  IF v_user_role != 'caregiver' THEN
    RAISE EXCEPTION 'User is not a caregiver';
  END IF;

  -- Check if caregiver record already exists
  SELECT id INTO v_caregiver_id
  FROM caregivers
  WHERE auth_user_id = p_user_id;

  -- Create new record if none exists
  IF v_caregiver_id IS NULL THEN
    INSERT INTO caregivers (
      auth_user_id,
      name,
      active,
      last_activity
    ) VALUES (
      p_user_id,
      COALESCE(v_user_name, split_part(v_user_email, '@', 1)),
      true,
      now()
    )
    RETURNING id INTO v_caregiver_id;
  END IF;

  RETURN v_caregiver_id;
END;
$$;

-- Function to get caregiver ID with auto-creation
CREATE OR REPLACE FUNCTION get_caregiver_id(
  p_user_id uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_caregiver_id uuid;
BEGIN
  -- Try to get existing ID first
  SELECT id INTO v_caregiver_id
  FROM caregivers
  WHERE auth_user_id = p_user_id;

  -- Create record if it doesn't exist
  IF v_caregiver_id IS NULL THEN
    v_caregiver_id := ensure_caregiver_exists(p_user_id);
  END IF;

  RETURN v_caregiver_id;
END;
$$;

-- Add comments
COMMENT ON FUNCTION ensure_caregiver_exists IS 'Creates a caregiver record if it does not exist for the given user';
COMMENT ON FUNCTION get_caregiver_id IS 'Gets or creates a caregiver ID for the given user ID';