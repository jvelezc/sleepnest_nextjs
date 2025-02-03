-- Function to handle nap session creation and updates
CREATE OR REPLACE FUNCTION handle_nap_session(
  p_caregiver_id uuid,
  p_child_id uuid,
  p_start_time timestamptz,
  p_end_time timestamptz,
  p_location_id uuid,
  p_environment_id uuid,
  p_onset_method_id uuid,
  p_sleep_latency integer,
  p_restfulness_id uuid,
  p_signs_of_sleep_debt boolean DEFAULT false,
  p_notes text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_nap_id uuid;
  v_duration integer;
BEGIN
  -- Verify access
  IF NOT EXISTS (
    SELECT 1 FROM caregivers c
    WHERE c.id = p_caregiver_id
    AND (
      -- Direct caregiver access
      c.auth_user_id = auth.uid()
      OR
      -- Specialist access through relationships
      EXISTS (
        SELECT 1 
        FROM specialist_caregiver sc
        JOIN specialists s ON s.id = sc.specialist_id
        WHERE sc.caregiver_id = c.id
        AND s.auth_user_id = auth.uid()
      )
    )
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  -- Verify child belongs to caregiver
  IF NOT EXISTS (
    SELECT 1 FROM children
    WHERE id = p_child_id
    AND caregiver_id = p_caregiver_id
  ) THEN
    RAISE EXCEPTION 'Child does not belong to caregiver';
  END IF;

  -- Calculate duration
  v_duration := EXTRACT(EPOCH FROM (p_end_time - p_start_time)) / 60;

  -- Validate duration
  IF v_duration <= 0 THEN
    RAISE EXCEPTION 'End time must be after start time';
  END IF;

  -- Validate sleep latency
  IF p_sleep_latency < 0 OR p_sleep_latency > 60 THEN
    RAISE EXCEPTION 'Sleep latency must be between 0 and 60 minutes';
  END IF;

  -- Insert nap session
  INSERT INTO nap_sessions (
    caregiver_id,
    child_id,
    start_time,
    end_time,
    location_id,
    environment_id,
    onset_method_id,
    sleep_latency,
    restfulness_id,
    signs_of_sleep_debt,
    notes
  ) VALUES (
    p_caregiver_id,
    p_child_id,
    p_start_time,
    p_end_time,
    p_location_id,
    p_environment_id,
    p_onset_method_id,
    p_sleep_latency,
    p_restfulness_id,
    p_signs_of_sleep_debt,
    p_notes
  )
  RETURNING id INTO v_nap_id;

  -- Update summary metrics
  INSERT INTO summary_metrics (
    child_id,
    date,
    total_sleep_duration
  )
  VALUES (
    p_child_id,
    date_trunc('day', p_start_time),
    v_duration
  )
  ON CONFLICT (child_id, date) DO UPDATE
  SET 
    total_sleep_duration = COALESCE(summary_metrics.total_sleep_duration, 0) + v_duration,
    updated_at = now();

  RETURN v_nap_id;
END;
$$;

-- Add comments
COMMENT ON FUNCTION handle_nap_session IS 'Creates a nap session and updates summary metrics with proper access control';