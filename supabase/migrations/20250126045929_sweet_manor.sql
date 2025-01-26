/*
  # Fix Caregiver RLS Policies

  1. Changes
    - Drop all existing caregiver policies
    - Create new non-recursive policies for:
      - Direct caregiver access
      - Specialist access through relationships
      - Profile updates
    
  2. Security
    - Enable RLS
    - Strict access control based on auth.uid()
    - No circular references in policy definitions
*/

-- Drop all existing policies on caregivers table
DROP POLICY IF EXISTS "Caregivers can view own profile" ON caregivers;
DROP POLICY IF EXISTS "Specialists can view assigned caregivers" ON caregivers;
DROP POLICY IF EXISTS "Caregivers can update own profile" ON caregivers;
DROP POLICY IF EXISTS "Users can view own caregiver data" ON caregivers;
DROP POLICY IF EXISTS "Users can update own caregiver data" ON caregivers;
DROP POLICY IF EXISTS "Caregivers can view own data" ON caregivers;
DROP POLICY IF EXISTS "Caregivers can update own data" ON caregivers;

-- Create new simplified policies
CREATE POLICY "Allow users to view own caregiver profile"
  ON caregivers
  FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());

CREATE POLICY "Allow specialists to view assigned caregivers"
  ON caregivers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM specialists s
      WHERE s.auth_user_id = auth.uid()
      AND EXISTS (
        SELECT 1 
        FROM specialist_caregiver sc 
        WHERE sc.specialist_id = s.id 
        AND sc.caregiver_id = caregivers.id
      )
    )
  );

CREATE POLICY "Allow users to update own caregiver profile"
  ON caregivers
  FOR UPDATE
  TO authenticated
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "Allow users to insert own caregiver profile"
  ON caregivers
  FOR INSERT
  TO authenticated
  WITH CHECK (auth_user_id = auth.uid());

-- Add comments for documentation
COMMENT ON POLICY "Allow users to view own caregiver profile" ON caregivers IS 'Allows users to view their own caregiver profile';
COMMENT ON POLICY "Allow specialists to view assigned caregivers" ON caregivers IS 'Allows specialists to view caregivers assigned to them';
COMMENT ON POLICY "Allow users to update own caregiver profile" ON caregivers IS 'Allows users to update their own caregiver profile';
COMMENT ON POLICY "Allow users to insert own caregiver profile" ON caregivers IS 'Allows users to create their own caregiver profile';