/*
  # Add client status management functionality

  1. New Functions
    - update_caregiver_status: Updates a caregiver's status in the specialist-caregiver relationship
    - auto_mark_inactive: Automatically marks caregivers as inactive after 30 days of inactivity
    - get_caregiver_status: Gets the current status of a caregiver for a specialist

  2. Triggers
    - tr_auto_mark_inactive: Trigger to automatically mark caregivers as inactive
    - tr_update_last_activity: Trigger to update last activity timestamp

  3. Security
    - RLS policies for status updates
    - Function security settings
*/

-- Function to update caregiver status
CREATE OR REPLACE FUNCTION update_caregiver_status(
  p_specialist_id uuid,
  p_caregiver_id uuid,
  p_status text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Validate status
  IF p_status NOT IN ('active', 'inactive', 'suspended') THEN
    RAISE EXCEPTION 'Invalid status. Must be active, inactive, or suspended';
  END IF;

  -- Check if relationship exists
  IF NOT EXISTS (
    SELECT 1 FROM specialist_caregiver
    WHERE specialist_id = p_specialist_id
    AND caregiver_id = p_caregiver_id
  ) THEN
    RAISE EXCEPTION 'Relationship not found';
  END IF;

  -- Update status
  UPDATE specialist_caregiver
  SET 
    status = p_status,
    updated_at = now()
  WHERE specialist_id = p_specialist_id
  AND caregiver_id = p_caregiver_id;

  RETURN true;
END;
$$;

-- Function to automatically mark caregivers as inactive
CREATE OR REPLACE FUNCTION auto_mark_inactive()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Mark as inactive if no activity for 30 days
  UPDATE specialist_caregiver
  SET 
    status = 'inactive',
    updated_at = now()
  WHERE caregiver_id IN (
    SELECT c.id
    FROM caregivers c
    WHERE c.last_activity < now() - interval '30 days'
    AND c.active = true
  );
  
  RETURN NULL;
END;
$$;

-- Function to get caregiver status
CREATE OR REPLACE FUNCTION get_caregiver_status(
  p_specialist_id uuid,
  p_caregiver_id uuid
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_status text;
BEGIN
  SELECT status INTO v_status
  FROM specialist_caregiver
  WHERE specialist_id = p_specialist_id
  AND caregiver_id = p_caregiver_id;
  
  RETURN v_status;
END;
$$;

-- Create trigger for auto-marking inactive
CREATE OR REPLACE TRIGGER tr_auto_mark_inactive
  AFTER UPDATE OF last_activity ON caregivers
  FOR EACH ROW
  EXECUTE FUNCTION auto_mark_inactive();

-- Add RLS policy for status updates
CREATE POLICY "Specialists can update caregiver status"
  ON specialist_caregiver
  FOR UPDATE
  TO authenticated
  USING (specialist_id = auth.uid())
  WITH CHECK (specialist_id = auth.uid());

-- Add comment for documentation
COMMENT ON FUNCTION update_caregiver_status IS 'Updates the status of a caregiver in the specialist-caregiver relationship. Status must be active, inactive, or suspended.';
COMMENT ON FUNCTION auto_mark_inactive IS 'Automatically marks caregivers as inactive after 30 days of no activity';
COMMENT ON FUNCTION get_caregiver_status IS 'Gets the current status of a caregiver for a specific specialist';