/*
  # Fix caregiver RLS policies

  1. Changes
    - Drop all existing policies
    - Create new simplified policies for insert/select/update
    - Add policy for inserting new caregiver records
    - Add policy for selecting own profile
    - Add policy for specialists viewing caregiver profiles
    - Add policy for updating own profile

  2. Security
    - Enable RLS
    - Ensure proper access control
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "basic_caregiver_access" ON caregivers;

-- Create new policies
CREATE POLICY "allow_insert_own_profile"
  ON caregivers
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth_user_id = auth.uid()
  );

CREATE POLICY "allow_select_own_profile"
  ON caregivers
  FOR SELECT
  TO authenticated
  USING (
    auth_user_id = auth.uid()
    OR 
    EXISTS (
      SELECT 1 
      FROM specialists s
      WHERE s.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "allow_update_own_profile"
  ON caregivers
  FOR UPDATE
  TO authenticated
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

-- Add comments
COMMENT ON POLICY "allow_insert_own_profile" ON caregivers IS 'Allows users to create their own caregiver profile';
COMMENT ON POLICY "allow_select_own_profile" ON caregivers IS 'Allows users to view their own profile and specialists to view all profiles';
COMMENT ON POLICY "allow_update_own_profile" ON caregivers IS 'Allows users to update their own profile';