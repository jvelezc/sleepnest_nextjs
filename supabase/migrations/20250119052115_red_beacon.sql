/*
  # Create invitations and specialists tables

  1. New Tables
    - `specialists`
      - `id` (uuid, primary key) - Links to auth.users
      - `name` (text) - Specialist's name
      - `email` (text) - Specialist's email
      - `created_at` (timestamp)
    
    - `invitations`
      - `id` (uuid, primary key)
      - `specialist_id` (uuid) - References specialists.id
      - `caregiver_email` (text)
      - `caregiver_name` (text)
      - `status` (text) - Can be 'pending', 'accepted', or 'expired'
      - `created_at` (timestamp)
      - `expires_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for specialists to manage their invitations
    - Add policy for specialists to read their own data
*/

-- Create specialists table
CREATE TABLE IF NOT EXISTS specialists (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  name text,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create invitations table
CREATE TABLE IF NOT EXISTS invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  specialist_id uuid REFERENCES specialists(id) NOT NULL,
  caregiver_email text NOT NULL,
  caregiver_name text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '7 days'),
  UNIQUE(specialist_id, caregiver_email)
);

-- Enable RLS
ALTER TABLE specialists ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Specialists can read their own data
CREATE POLICY "Specialists can read own data"
  ON specialists
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Specialists can manage their invitations
CREATE POLICY "Specialists can manage own invitations"
  ON invitations
  FOR ALL
  TO authenticated
  USING (specialist_id = auth.uid());

-- Function to invite a caregiver
CREATE OR REPLACE FUNCTION invite_caregiver(
  caregiver_email text,
  caregiver_name text,
  resend boolean DEFAULT false
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  invitation_id uuid;
  existing_invitation_id uuid;
BEGIN
  -- Check for existing invitation
  SELECT id INTO existing_invitation_id
  FROM invitations
  WHERE specialist_id = auth.uid()
  AND caregiver_email = invite_caregiver.caregiver_email
  AND status = 'pending';
  
  IF existing_invitation_id IS NOT NULL THEN
    IF NOT resend THEN
      RAISE EXCEPTION 'An invitation has already been sent to this email.';
    END IF;
    
    -- Update existing invitation
    UPDATE invitations
    SET created_at = now(),
        expires_at = now() + interval '7 days'
    WHERE id = existing_invitation_id
    RETURNING id INTO invitation_id;
  ELSE
    -- Create new invitation
    INSERT INTO invitations (specialist_id, caregiver_email, caregiver_name)
    VALUES (auth.uid(), caregiver_email, caregiver_name)
    RETURNING id INTO invitation_id;
  END IF;
  
  RETURN invitation_id;
END;
$$;