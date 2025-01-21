/*
  # Fix Messages Table Schema

  1. Changes
    - Drop and recreate messages table with all required columns
    - Recreate indexes and policies
    - Update chat functions to use correct column references

  2. Security
    - Maintain existing RLS policies
    - No changes to access control
*/

-- Drop existing messages table and recreate with all columns
DROP TABLE IF EXISTS messages CASCADE;

CREATE TABLE messages (
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
CREATE INDEX idx_messages_room_id ON messages(room_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_messages_edited ON messages(edited);
CREATE INDEX idx_messages_deleted ON messages(deleted);
CREATE INDEX idx_messages_read ON messages(read);

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

-- Add comments for documentation
COMMENT ON TABLE messages IS 'Chat messages between specialists and caregivers';
COMMENT ON COLUMN messages.id IS 'Unique identifier for the message';
COMMENT ON COLUMN messages.room_id IS 'Reference to the chat room';
COMMENT ON COLUMN messages.sender_id IS 'User ID of the message sender';
COMMENT ON COLUMN messages.content IS 'Message content';
COMMENT ON COLUMN messages.created_at IS 'Timestamp when the message was created';
COMMENT ON COLUMN messages.updated_at IS 'Timestamp when the message was last updated';
COMMENT ON COLUMN messages.edited IS 'Flag indicating if the message has been edited';
COMMENT ON COLUMN messages.deleted IS 'Flag indicating if the message has been deleted';
COMMENT ON COLUMN messages.read IS 'Flag indicating if the message has been read';