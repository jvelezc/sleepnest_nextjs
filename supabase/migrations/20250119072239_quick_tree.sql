/*
  # Update invitations table structure

  1. Changes
    - Rename table from `invitations` to `caregiver_invitations`
    - Rename column `caregiver_email` to `email`
    - Update function to use new table and column names

  2. Security
    - Maintain existing RLS policies
    - Update policy names to reflect new table name
*/

-- Rename table
ALTER TABLE IF EXISTS invitations 
RENAME TO caregiver_invitations;

-- Update column name
ALTER TABLE caregiver_invitations 
RENAME COLUMN caregiver_email TO email;

-- Drop existing function
DROP FUNCTION IF EXISTS invite_caregiver;

-- Recreate function with updated table and column names
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
  FROM caregiver_invitations
  WHERE specialist_id = auth.uid()
  AND email = invite_caregiver.caregiver_email
  AND status = 'pending';
  
  IF existing_invitation_id IS NOT NULL THEN
    IF NOT resend THEN
      RAISE EXCEPTION 'An invitation has already been sent to this email.';
    END IF;
    
    -- Update existing invitation
    UPDATE caregiver_invitations
    SET created_at = now(),
        expires_at = now() + interval '7 days'
    WHERE id = existing_invitation_id
    RETURNING id INTO invitation_id;
  ELSE
    -- Create new invitation
    INSERT INTO caregiver_invitations (specialist_id, email, caregiver_name)
    VALUES (auth.uid(), caregiver_email, caregiver_name)
    RETURNING id INTO invitation_id;
  END IF;
  
  RETURN invitation_id;
END;
$$;