/*
  # Add Messages Table and Functions

  1. New Tables
    - `messages`
      - `id` (uuid, primary key)
      - `room_id` (uuid, foreign key)
      - `sender_id` (uuid)
      - `content` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `edited` (boolean)
      - `deleted` (boolean)
      - `read` (boolean)

  2. Functions
    - `save_message` - Saves a new message or updates existing one
    - `get_messages` - Retrieves messages for a chat room
    
  3. Security
    - Enable RLS on messages table
    - Add policies for message access and modification
*/

-- Create messages table if it doesn't exist
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  edited boolean DEFAULT false,
  deleted boolean DEFAULT false,
  read boolean DEFAULT false
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_messages_room_id ON messages(room_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view messages in their rooms"
  ON messages
  FOR SELECT
  USING (
    room_id IN (
      SELECT id FROM chat_rooms
      WHERE specialist_id = auth.uid()
      OR caregiver_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages in their rooms"
  ON messages
  FOR INSERT
  WITH CHECK (
    room_id IN (
      SELECT id FROM chat_rooms
      WHERE specialist_id = auth.uid()
      OR caregiver_id = auth.uid()
    )
    AND
    sender_id = auth.uid()
  );

CREATE POLICY "Users can update their own messages"
  ON messages
  FOR UPDATE
  USING (sender_id = auth.uid())
  WITH CHECK (sender_id = auth.uid());

-- Function to save or update a message
CREATE OR REPLACE FUNCTION save_message(
  p_room_id uuid,
  p_content text,
  p_message_id uuid DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_message_id uuid;
BEGIN
  -- Verify user has access to room
  IF NOT EXISTS (
    SELECT 1 FROM chat_rooms
    WHERE id = p_room_id
    AND (specialist_id = auth.uid() OR caregiver_id = auth.uid())
  ) THEN
    RAISE EXCEPTION 'Access denied to chat room';
  END IF;

  IF p_message_id IS NOT NULL THEN
    -- Update existing message
    UPDATE messages
    SET 
      content = p_content,
      updated_at = now(),
      edited = true
    WHERE id = p_message_id
    AND sender_id = auth.uid()
    RETURNING id INTO v_message_id;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Message not found or access denied';
    END IF;
  ELSE
    -- Insert new message
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
  END IF;

  RETURN v_message_id;
END;
$$;

-- Function to get messages for a room
CREATE OR REPLACE FUNCTION get_messages(
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
    SELECT 1 FROM chat_rooms
    WHERE id = p_room_id
    AND (specialist_id = auth.uid() OR caregiver_id = auth.uid())
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
COMMENT ON TABLE messages IS 'Chat messages between specialists and caregivers';
COMMENT ON FUNCTION save_message IS 'Saves a new message or updates an existing one';
COMMENT ON FUNCTION get_messages IS 'Gets messages for a chat room with pagination';