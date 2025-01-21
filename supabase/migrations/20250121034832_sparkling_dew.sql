/*
  # Add Message Handling Functions
  
  1. New Functions
    - save_message: Securely save new messages
    - mark_messages_read: Mark messages as read
    - get_unread_count: Get count of unread messages
    
  2. Security
    - Proper access control for message operations
    - Validation of user permissions
    - Secure message handling
*/

-- Function to save a new message
CREATE OR REPLACE FUNCTION save_message(
  p_room_id uuid,
  p_content text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_message_id uuid;
  v_user_role text;
  v_room_exists boolean;
BEGIN
  -- Determine if user is specialist or caregiver
  SELECT 
    CASE
      WHEN EXISTS (SELECT 1 FROM specialists WHERE auth_user_id = auth.uid()) THEN 'specialist'
      WHEN EXISTS (SELECT 1 FROM caregivers WHERE auth_user_id = auth.uid()) THEN 'caregiver'
      ELSE NULL
    END INTO v_user_role;

  IF v_user_role IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  -- Verify room exists and user has access
  SELECT EXISTS (
    SELECT 1 FROM chat_rooms cr
    WHERE cr.id = p_room_id
    AND (
      (v_user_role = 'specialist' AND cr.specialist_id IN (
        SELECT id FROM specialists WHERE auth_user_id = auth.uid()
      ))
      OR
      (v_user_role = 'caregiver' AND cr.caregiver_id IN (
        SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
      ))
    )
  ) INTO v_room_exists;

  IF NOT v_room_exists THEN
    RAISE EXCEPTION 'Access denied to chat room';
  END IF;

  -- Insert message
  INSERT INTO messages (
    room_id,
    sender_id,
    content
  )
  VALUES (
    p_room_id,
    auth.uid(),
    p_content
  )
  RETURNING id INTO v_message_id;

  -- Update room's updated_at timestamp
  UPDATE chat_rooms
  SET updated_at = now()
  WHERE id = p_room_id;

  RETURN v_message_id;
END;
$$;

-- Function to mark messages as read
CREATE OR REPLACE FUNCTION mark_messages_read(
  p_room_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_role text;
  v_room_exists boolean;
BEGIN
  -- Determine if user is specialist or caregiver
  SELECT 
    CASE
      WHEN EXISTS (SELECT 1 FROM specialists WHERE auth_user_id = auth.uid()) THEN 'specialist'
      WHEN EXISTS (SELECT 1 FROM caregivers WHERE auth_user_id = auth.uid()) THEN 'caregiver'
      ELSE NULL
    END INTO v_user_role;

  IF v_user_role IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  -- Verify room exists and user has access
  SELECT EXISTS (
    SELECT 1 FROM chat_rooms cr
    WHERE cr.id = p_room_id
    AND (
      (v_user_role = 'specialist' AND cr.specialist_id IN (
        SELECT id FROM specialists WHERE auth_user_id = auth.uid()
      ))
      OR
      (v_user_role = 'caregiver' AND cr.caregiver_id IN (
        SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
      ))
    )
  ) INTO v_room_exists;

  IF NOT v_room_exists THEN
    RAISE EXCEPTION 'Access denied to chat room';
  END IF;

  -- Mark messages as read
  UPDATE messages
  SET read = true
  WHERE room_id = p_room_id
  AND sender_id != auth.uid()
  AND NOT read;

  RETURN true;
END;
$$;

-- Function to get unread message count
CREATE OR REPLACE FUNCTION get_unread_count(
  p_room_id uuid
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count integer;
  v_user_role text;
  v_room_exists boolean;
BEGIN
  -- Determine if user is specialist or caregiver
  SELECT 
    CASE
      WHEN EXISTS (SELECT 1 FROM specialists WHERE auth_user_id = auth.uid()) THEN 'specialist'
      WHEN EXISTS (SELECT 1 FROM caregivers WHERE auth_user_id = auth.uid()) THEN 'caregiver'
      ELSE NULL
    END INTO v_user_role;

  IF v_user_role IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  -- Verify room exists and user has access
  SELECT EXISTS (
    SELECT 1 FROM chat_rooms cr
    WHERE cr.id = p_room_id
    AND (
      (v_user_role = 'specialist' AND cr.specialist_id IN (
        SELECT id FROM specialists WHERE auth_user_id = auth.uid()
      ))
      OR
      (v_user_role = 'caregiver' AND cr.caregiver_id IN (
        SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
      ))
    )
  ) INTO v_room_exists;

  IF NOT v_room_exists THEN
    RAISE EXCEPTION 'Access denied to chat room';
  END IF;

  -- Get unread count
  SELECT COUNT(*)
  INTO v_count
  FROM messages
  WHERE room_id = p_room_id
  AND sender_id != auth.uid()
  AND NOT read;

  RETURN v_count;
END;
$$;

-- Add comments for documentation
COMMENT ON FUNCTION save_message IS 'Saves a new message in a chat room with proper access control';
COMMENT ON FUNCTION mark_messages_read IS 'Marks all unread messages in a room as read';
COMMENT ON FUNCTION get_unread_count IS 'Gets count of unread messages in a chat room';