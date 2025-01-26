-- Function to ensure specialist record exists
CREATE OR REPLACE FUNCTION ensure_specialist_record_exists(
  p_user_id uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_specialist_id uuid;
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

  -- Verify user is a specialist
  IF v_user_role != 'specialist' THEN
    RAISE EXCEPTION 'User is not a specialist';
  END IF;

  -- Check if specialist record already exists
  SELECT id INTO v_specialist_id
  FROM specialists
  WHERE auth_user_id = p_user_id;

  -- Create new record if none exists
  IF v_specialist_id IS NULL THEN
    INSERT INTO specialists (
      auth_user_id,
      name,
      email,
      active,
      verification_status
    ) VALUES (
      p_user_id,
      COALESCE(v_user_name, split_part(v_user_email, '@', 1)),
      v_user_email,
      true,
      'pending'
    )
    RETURNING id INTO v_specialist_id;
  END IF;

  RETURN v_specialist_id;
END;
$$;

-- Function to check if user exists
CREATE OR REPLACE FUNCTION check_user_exists(
  p_email text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE email = p_email
  );
END;
$$;

-- Add comments
COMMENT ON FUNCTION ensure_specialist_record_exists IS 'Ensures a specialist record exists for the given user ID';
COMMENT ON FUNCTION check_user_exists IS 'Checks if a user exists with the given email';