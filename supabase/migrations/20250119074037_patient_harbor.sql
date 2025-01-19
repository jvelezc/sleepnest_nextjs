/*
  # Complete Database Schema Setup

  1. New Tables
    - admin_users: For platform administrators
    - chat_rooms: For specialist-caregiver communication
    - messages: For chat messages
    - specialist_caregiver: For managing relationships

  2. Updates
    - specialists: Add additional fields
    - caregivers: Add active status
    - caregiver_invitations: Add tracking fields

  3. Security
    - Enable RLS on all tables
    - Add appropriate policies
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Update specialists table with new columns
ALTER TABLE specialists
ADD COLUMN IF NOT EXISTS auth_user_id uuid NOT NULL,
ADD COLUMN IF NOT EXISTS active boolean,
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now(),
ADD COLUMN IF NOT EXISTS business_name text,
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS school text,
ADD COLUMN IF NOT EXISTS school_email text,
ADD COLUMN IF NOT EXISTS verification_status text,
ADD COLUMN IF NOT EXISTS last_sign_in_at timestamptz;

-- Update caregivers table
ALTER TABLE caregivers
ADD COLUMN IF NOT EXISTS active boolean NOT NULL DEFAULT true;

-- Update caregiver_invitations table with tracking columns
ALTER TABLE caregiver_invitations
ADD COLUMN IF NOT EXISTS resend_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_resent_at timestamptz,
ADD COLUMN IF NOT EXISTS error text,
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Create chat_rooms table
CREATE TABLE IF NOT EXISTS chat_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  specialist_id uuid NOT NULL REFERENCES specialists(id),
  caregiver_id uuid NOT NULL REFERENCES caregivers(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(specialist_id, caregiver_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES chat_rooms(id),
  sender_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  read boolean DEFAULT false
);

-- Create specialist_caregiver relationship table
CREATE TABLE IF NOT EXISTS specialist_caregiver (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  specialist_id uuid NOT NULL REFERENCES specialists(id),
  caregiver_id uuid NOT NULL REFERENCES caregivers(id),
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(specialist_id, caregiver_id)
);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE specialist_caregiver ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Admin users can only access their own data
CREATE POLICY "Admin users can access own data"
  ON admin_users
  FOR ALL
  USING (auth.uid()::text = id::text);

-- Chat room access
CREATE POLICY "Users can access their chat rooms"
  ON chat_rooms
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM specialists WHERE id = specialist_id
      UNION
      SELECT id FROM caregivers WHERE id = caregiver_id
    )
  );

-- Message access
CREATE POLICY "Users can access messages in their rooms"
  ON messages
  FOR ALL
  USING (
    room_id IN (
      SELECT id FROM chat_rooms
      WHERE specialist_id = auth.uid()
      OR caregiver_id = auth.uid()
    )
  );

-- Specialist-Caregiver relationship access
CREATE POLICY "Users can access their relationships"
  ON specialist_caregiver
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM specialists WHERE id = specialist_id
      UNION
      SELECT id FROM caregivers WHERE id = caregiver_id
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_chat_rooms_specialist_id ON chat_rooms(specialist_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_caregiver_id ON chat_rooms(caregiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_room_id ON messages(room_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_specialist_caregiver_specialist_id ON specialist_caregiver(specialist_id);
CREATE INDEX IF NOT EXISTS idx_specialist_caregiver_caregiver_id ON specialist_caregiver(caregiver_id);

-- Update types/database.types.ts file
COMMENT ON TABLE admin_users IS 'Platform administrators';
COMMENT ON TABLE chat_rooms IS 'Communication channels between specialists and caregivers';
COMMENT ON TABLE messages IS 'Chat messages between specialists and caregivers';
COMMENT ON TABLE specialist_caregiver IS 'Relationships between specialists and caregivers';