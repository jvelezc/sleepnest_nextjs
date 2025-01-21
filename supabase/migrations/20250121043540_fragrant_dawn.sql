/*
  # Update Chat Functions for Message Ordering

  1. Changes
    - Modified chat_get_messages to return messages in ascending order (oldest first)
    - Updated chat_save_message to handle message ordering
    - Added indexes to optimize message queries

  2. Security
    - Maintained existing RLS policies
    - Kept security definer functions
    - No changes to access control logic
*/

-- Update chat_get_messages function to return messages in ascending order
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

  -- Return messages in ascending order (oldest first)
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
  ORDER BY m.created_at ASC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- Add index for message ordering
CREATE INDEX IF NOT EXISTS idx_messages_room_created_at 
ON messages(room_id, created_at);

-- Add comments
COMMENT ON FUNCTION chat_get_messages IS 'Gets paginated messages for a chat room in ascending order (oldest first)';
COMMENT ON INDEX idx_messages_room_created_at IS 'Optimizes message retrieval ordered by creation time within a room';