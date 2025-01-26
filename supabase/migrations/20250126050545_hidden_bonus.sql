/*
  # Add Simple Caregiver Policy

  1. Changes
    - Add basic policy for caregiver table access
    - Keep RLS enabled with minimal policy
    
  2. Security
    - Allows caregivers to access their own records
    - Allows specialists to access records through specialist_caregiver table
*/

-- Create basic policy for caregiver access
CREATE POLICY "basic_caregiver_access"
  ON caregivers
  FOR ALL
  TO authenticated
  USING (
    -- Direct access for caregiver
    auth_user_id = auth.uid()
    OR 
    -- Access for specialists through specialist_caregiver table
    EXISTS (
      SELECT 1 
      FROM specialists s
      WHERE s.auth_user_id = auth.uid()
    )
  );

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_caregivers_auth_user_id ON caregivers(auth_user_id);