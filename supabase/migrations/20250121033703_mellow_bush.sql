/*
  # Fix RLS Policies

  1. Changes
    - Fix infinite recursion in caregivers RLS policy
    - Add proper RLS policies for chat_rooms
    - Add function to get or create chat room
    
  2. Security
    - Ensure proper access control
    - Prevent recursion issues
    - Add proper error handling
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view own caregiver data" ON caregivers;
DROP POLICY IF EXISTS "Users can update own caregiver data" ON caregivers;

-- Create new policies for caregivers
CREATE POLICY "Caregivers can view own data"
  ON caregivers
  FOR SELECT
  TO authenticated
  USING (
    -- Direct access for caregiver
    auth_user_id = auth.uid()
    OR
    -- Access for specialists through specialist_caregiver table
    EXISTS (
      SELECT 1 
      FROM specialist_caregiver sc
      WHERE sc.caregiver_id = caregivers.id
      AND sc.specialist_id = auth.uid()
    )
  );

CREATE POLICY "Caregivers can update own data"
  ON caregivers
  FOR UPDATE
  TO authenticated
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

-- Function to get or create chat room
CREATE OR REPLACE FUNCTION get_or_create_chat_room(
  p_specialist_id uuid,
  p_caregiver_id uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_room_id uuid;
  v_specialist_exists boolean;
  v_caregiver_exists boolean;
  v_relationship_exists boolean;
BEGIN
  -- Verify specialist exists
  SELECT EXISTS (
    SELECT 1 FROM specialists 
    WHERE id = p_specialist_id
  ) INTO v_specialist_exists;

  IF NOT v_specialist_exists THEN
    RAISE EXCEPTION 'Specialist not found';
  END IF;

  -- Verify caregiver exists
  SELECT EXISTS (
    SELECT 1 FROM caregivers 
    WHERE id = p_caregiver_id
  ) INTO v_caregiver_exists;

  IF NOT v_caregiver_exists THEN
    RAISE EXCEPTION 'Caregiver not found';
  END IF;

  -- Verify relationship exists
  SELECT EXISTS (
    SELECT 1 FROM specialist_caregiver
    WHERE specialist_id = p_specialist_id
    AND caregiver_id = p_caregiver_id
  ) INTO v_relationship_exists;

  IF NOT v_relationship_exists THEN
    RAISE EXCEPTION 'No relationship exists between specialist and caregiver';
  END IF;

  -- Get existing room or create new one
  SELECT id INTO v_room_id
  FROM chat_rooms
  WHERE specialist_id = p_specialist_id
  AND caregiver_id = p_caregiver_id;

  IF v_room_id IS NULL THEN
    INSERT INTO chat_rooms (specialist_id, caregiver_id)
    VALUES (p_specialist_id, p_caregiver_id)
    RETURNING id INTO v_room_id;
  END IF;

  RETURN v_room_id;
END;
$$;

-- Update chat_rooms policies
DROP POLICY IF EXISTS "Users can access their chat rooms" ON chat_rooms;

CREATE POLICY "Users can view their chat rooms"
  ON chat_rooms
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = specialist_id 
    OR 
    auth.uid() IN (
      SELECT auth_user_id 
      FROM caregivers 
      WHERE id = caregiver_id
    )
  );

CREATE POLICY "Users can create their chat rooms"
  ON chat_rooms
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Only specialists can create rooms
    auth.uid() = specialist_id
    AND
    -- Must have relationship with caregiver
    EXISTS (
      SELECT 1 
      FROM specialist_caregiver
      WHERE specialist_id = auth.uid()
      AND caregiver_id = chat_rooms.caregiver_id
    )
  );

-- Add comments
COMMENT ON FUNCTION get_or_create_chat_room IS 'Gets existing chat room or creates new one between specialist and caregiver';