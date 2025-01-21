/*
  # Fix Chat Functions

  1. Changes
    - Fix ambiguous column references in chat functions
    - Add explicit table aliases
    - Improve error handling
    - Add more specific access control checks

  2. Security
    - Maintain existing RLS policies
    - Add additional validation checks
*/

-- Drop existing functions
DROP FUNCTION IF EXISTS chat_get_messages;
DROP FUNCTION IF EXISTS chat_save_message;

-- Recreate get_messages with explicit column references
CREATE OR REPLACE FUNCTION chat_get_messages(
  p_room_id uuid,
  p_limit int DEFAULT 50,
  p_offset int DEFAULT 0
)
RETURNS TABLE (
  message_id uuid,
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
DECLARE
  v_user_id uuid;
  v_user_role text;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();
  
  -- Determine user role
  SELECT 
    CASE
      WHEN EXISTS (SELECT 1 FROM specialists s WHERE s.auth_user_id = v_user_id) THEN 'specialist'
      WHEN EXISTS (SELECT 1 FROM caregivers c WHERE c.auth_user_id = v_user_id) THEN 'caregiver'
      ELSE NULL
    END INTO v_user_role;

  IF v_user_role IS NULL THEN
    RAISE EXCEPTION 'User not found or invalid role';
  END IF;

  -- Verify user has access to room
  IF NOT EXISTS (
    SELECT 1 
    FROM chat_rooms cr
    WHERE cr.id = p_room_id
    AND (
      (v_user_role = 'specialist' AND cr.specialist_id IN (
        SELECT s.id FROM specialists s WHERE s.auth_user_id = v_user_id
      ))
      OR 
      (v_user_role = 'caregiver' AND cr.caregiver_id IN (
        SELECT c.id FROM caregivers c WHERE c.auth_user_id = v_user_id
      ))
    )
  ) THEN
    RAISE EXCEPTION 'Access denied to chat room';
  END IF;

  RETURN QUERY
  SELECT 
    m.id AS message_id,
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

-- Recreate save_message with explicit column references
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
  v_user_id uuid;
  v_user_role text;
  v_room_exists boolean;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();
  
  -- Determine user role
  SELECT 
    CASE
      WHEN EXISTS (SELECT 1 FROM specialists s WHERE s.auth_user_id = v_user_id) THEN 'specialist'
      WHEN EXISTS (SELECT 1 FROM caregivers c WHERE c.auth_user_id = v_user_id) THEN 'caregiver'
      ELSE NULL
    END INTO v_user_role;

  IF v_user_role IS NULL THEN
    RAISE EXCEPTION 'User not found or invalid role';
  END IF;

  -- Verify room exists and user has access
  SELECT EXISTS (
    SELECT 1 
    FROM chat_rooms cr
    WHERE cr.id = p_room_id
    AND (
      (v_user_role = 'specialist' AND cr.specialist_id IN (
        SELECT s.id FROM specialists s WHERE s.auth_user_id = v_user_id
      ))
      OR
      (v_user_role = 'caregiver' AND cr.caregiver_id IN (
        SELECT c.id FROM caregivers c WHERE c.auth_user_id = v_user_id
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
    content,
    created_at,
    updated_at
  )
  VALUES (
    p_room_id,
    v_user_id,
    p_content,
    now(),
    now()
  )
  RETURNING id INTO v_message_id;

  -- Update room's updated_at timestamp
  UPDATE chat_rooms cr
  SET updated_at = now()
  WHERE cr.id = p_room_id;

  RETURN v_message_id;
END;
$$;

-- Add comments for documentation
COMMENT ON FUNCTION chat_get_messages IS 'Gets paginated messages for a chat room with explicit column references';
COMMENT ON FUNCTION chat_save_message IS 'Saves a new message in a chat room with explicit column references and improved access control';