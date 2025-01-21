/*
  # Fix Messages Table Schema

  1. Changes
    - Add missing updated_at column to messages table
    - Add missing edited column to messages table
    - Add missing deleted column to messages table
    - Update chat functions to use correct column references

  2. Security
    - Maintain existing RLS policies
    - No changes to access control
*/

-- Add missing columns to messages table if they don't exist
DO $$ 
BEGIN
  -- Add updated_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'messages' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE messages ADD COLUMN updated_at timestamptz DEFAULT now();
  END IF;

  -- Add edited column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'messages' 
    AND column_name = 'edited'
  ) THEN
    ALTER TABLE messages ADD COLUMN edited boolean DEFAULT false;
  END IF;

  -- Add deleted column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'messages' 
    AND column_name = 'deleted'
  ) THEN
    ALTER TABLE messages ADD COLUMN deleted boolean DEFAULT false;
  END IF;
END $$;

-- Update chat_get_messages function to handle new columns
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

  -- Return messages with all columns
  RETURN QUERY
  SELECT 
    m.id AS message_id,
    m.room_id,
    m.sender_id,
    m.content,
    m.created_at,
    m.updated_at,
    COALESCE(m.edited, false) as edited,
    COALESCE(m.deleted, false) as deleted,
    COALESCE(m.read, false) as read
  FROM messages m
  WHERE m.room_id = p_room_id
  ORDER BY m.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- Update chat_save_message function to handle new columns
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

  -- Insert message with all columns
  INSERT INTO messages (
    room_id,
    sender_id,
    content,
    created_at,
    updated_at,
    edited,
    deleted,
    read
  )
  VALUES (
    p_room_id,
    v_user_id,
    p_content,
    now(),
    now(),
    false,
    false,
    false
  )
  RETURNING id INTO v_message_id;

  -- Update room's updated_at timestamp
  UPDATE chat_rooms cr
  SET updated_at = now()
  WHERE cr.id = p_room_id;

  RETURN v_message_id;
END;
$$;

-- Add indexes for new columns
CREATE INDEX IF NOT EXISTS idx_messages_edited ON messages(edited);
CREATE INDEX IF NOT EXISTS idx_messages_deleted ON messages(deleted);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read);

-- Add comments for documentation
COMMENT ON COLUMN messages.updated_at IS 'Timestamp when the message was last updated';
COMMENT ON COLUMN messages.edited IS 'Flag indicating if the message has been edited';
COMMENT ON COLUMN messages.deleted IS 'Flag indicating if the message has been deleted';
COMMENT ON FUNCTION chat_get_messages IS 'Gets paginated messages for a chat room with all message attributes';
COMMENT ON FUNCTION chat_save_message IS 'Saves a new message with all required attributes';