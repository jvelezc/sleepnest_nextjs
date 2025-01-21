/*
  # Rename Chat Functions
  
  1. Changes
    - Rename save_message to chat_save_message
    - Rename mark_messages_read to chat_mark_messages_read
    - Rename get_unread_count to chat_get_unread_count
    - Rename get_messages to chat_get_messages
    
  2. Security
    - Maintain all existing security checks
    - Keep function behavior identical
*/

-- Drop existing functions
DROP FUNCTION IF EXISTS save_message(uuid, text);
DROP FUNCTION IF EXISTS mark_messages_read(uuid);
DROP FUNCTION IF EXISTS get_unread_count(uuid);
DROP FUNCTION IF EXISTS get_messages(uuid, int, int);

-- Recreate with new names
CREATE OR REPLACE FUNCTION chat_save_message(
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

CREATE OR REPLACE FUNCTION chat_mark_messages_read(
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

CREATE OR REPLACE FUNCTION chat_get_unread_count(
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

CREATE OR REPLACE FUNCTION chat_get_messages(
  p_room_id uuid,
  p_limit int DEFAULT 50,
  p_offset int DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  room_id uuid,
  sender_id uuid,
  content text,
  created_at timestamptz,
  updated_at timestamptz,
  edited boolean,
  deleted boolean,
  read boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verify user has access to room
  IF NOT EXISTS (
    SELECT 1 FROM chat_rooms cr
    WHERE cr.id = p_room_id
    AND (
      (cr.specialist_id IN (
        SELECT id FROM specialists WHERE auth_user_id = auth.uid()
      ))
      OR
      (cr.caregiver_id IN (
        SELECT id FROM caregivers WHERE auth_user_id = auth.uid()
      ))
    )
  ) THEN
    RAISE EXCEPTION 'Access denied to chat room';
  END IF;

  RETURN QUERY
  SELECT 
    m.id,
    m.room_id,
    m.sender_id,
    m.content,
    m.created_at,
    m.updated_at,
    m.edited,
    m.deleted,
    m.read
  FROM messages m
  WHERE m.room_id = p_room_id
  ORDER BY m.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- Add comments for documentation
COMMENT ON FUNCTION chat_save_message IS 'Saves a new message in a chat room with proper access control';
COMMENT ON FUNCTION chat_mark_messages_read IS 'Marks all unread messages in a room as read';
COMMENT ON FUNCTION chat_get_unread_count IS 'Gets count of unread messages in a chat room';
COMMENT ON FUNCTION chat_get_messages IS 'Gets paginated messages for a chat room';