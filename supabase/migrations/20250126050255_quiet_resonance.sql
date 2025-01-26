/*
  # Final Fix for Caregiver RLS Policies

  1. Changes
    - Drop all existing caregiver policies
    - Create new simplified policies with direct auth checks
    - Add explicit INSERT policy
    - Remove all recursive policy definitions
    
  2. Security
    - Direct auth.uid() checks for ownership
    - Clear separation between caregiver and specialist access
    - No circular references in policy definitions
*/

-- Drop all existing policies on caregivers table
DROP POLICY IF EXISTS "Allow users to view own caregiver profile" ON caregivers;
DROP POLICY IF EXISTS "Allow specialists to view assigned caregivers" ON caregivers;
DROP POLICY IF EXISTS "Allow users to update own caregiver profile" ON caregivers;
DROP POLICY IF EXISTS "Allow users to insert own caregiver profile" ON caregivers;

-- Create new simplified policies
CREATE POLICY "caregiver_select_own"
  ON caregivers
  FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());

CREATE POLICY "specialist_select_assigned"
  ON caregivers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM specialists s
      INNER JOIN specialist_caregiver sc ON s.id = sc.specialist_id
      WHERE s.auth_user_id = auth.uid()
      AND sc.caregiver_id = caregivers.id
    )
  );

CREATE POLICY "caregiver_insert_own"
  ON caregivers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "caregiver_update_own"
  ON caregivers
  FOR UPDATE
  TO authenticated
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

-- Add indexes to improve policy performance
CREATE INDEX IF NOT EXISTS idx_caregivers_auth_user_id ON caregivers(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_specialists_auth_user_id ON specialists(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_specialist_caregiver_composite 
  ON specialist_caregiver(specialist_id, caregiver_id);

-- Add comments for documentation
COMMENT ON POLICY "caregiver_select_own" ON caregivers 
  IS 'Allows caregivers to view their own profile using direct auth check';

COMMENT ON POLICY "specialist_select_assigned" ON caregivers 
  IS 'Allows specialists to view profiles of assigned caregivers using joins';

COMMENT ON POLICY "caregiver_insert_own" ON caregivers 
  IS 'Allows caregivers to create their own profile';

COMMENT ON POLICY "caregiver_update_own" ON caregivers 
  IS 'Allows caregivers to update their own profile using direct auth check';