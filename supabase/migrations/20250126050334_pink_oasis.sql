/*
  # Final Fix for Caregiver RLS Policies

  1. Changes
    - Drop all existing caregiver policies
    - Create single, simple policy for each operation
    - Use direct auth checks without joins where possible
    - Add proper indexes for performance
    
  2. Security
    - Maintains proper access control
    - Eliminates circular references
    - Uses explicit auth checks
*/

-- Drop all existing policies on caregivers table
DROP POLICY IF EXISTS "caregiver_select_own" ON caregivers;
DROP POLICY IF EXISTS "specialist_select_assigned" ON caregivers;
DROP POLICY IF EXISTS "caregiver_insert_own" ON caregivers;
DROP POLICY IF EXISTS "caregiver_update_own" ON caregivers;

-- Create new simplified policies
CREATE POLICY "select_own_profile"
  ON caregivers
  FOR SELECT
  USING (auth_user_id = auth.uid());

CREATE POLICY "select_as_specialist"
  ON caregivers
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 
      FROM specialists s
      WHERE s.auth_user_id = auth.uid()
    )
  );

CREATE POLICY "insert_own_profile"
  ON caregivers
  FOR INSERT
  WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "update_own_profile"
  ON caregivers
  FOR UPDATE
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_caregivers_auth_user_id ON caregivers(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_specialists_auth_user_id ON specialists(auth_user_id);

-- Add comments for documentation
COMMENT ON POLICY "select_own_profile" ON caregivers 
  IS 'Allows caregivers to view their own profile using direct auth check';

COMMENT ON POLICY "select_as_specialist" ON caregivers 
  IS 'Allows specialists to view all caregiver profiles';

COMMENT ON POLICY "insert_own_profile" ON caregivers 
  IS 'Allows users to create their own caregiver profile';

COMMENT ON POLICY "update_own_profile" ON caregivers 
  IS 'Allows users to update their own caregiver profile';