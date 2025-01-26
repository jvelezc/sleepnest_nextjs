/*
  # Fix Caregiver RLS Policies

  1. Changes
    - Drop existing problematic RLS policies
    - Create new non-recursive policies for caregivers table
    - Add proper access control for both caregivers and specialists
  
  2. Security
    - Enable RLS on caregivers table
    - Add policies for SELECT and UPDATE operations
    - Ensure proper access control based on user role
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Caregivers can view own data" ON caregivers;
DROP POLICY IF EXISTS "Caregivers can update own data" ON caregivers;
DROP POLICY IF EXISTS "Users can view own caregiver data" ON caregivers;
DROP POLICY IF EXISTS "Users can update own caregiver data" ON caregivers;

-- Create new non-recursive policies
CREATE POLICY "Caregivers can view own profile"
  ON caregivers
  FOR SELECT
  TO authenticated
  USING (auth_user_id = auth.uid());

CREATE POLICY "Specialists can view assigned caregivers"
  ON caregivers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 
      FROM specialists s
      JOIN specialist_caregiver sc ON s.id = sc.specialist_id
      WHERE s.auth_user_id = auth.uid()
      AND sc.caregiver_id = caregivers.id
    )
  );

CREATE POLICY "Caregivers can update own profile"
  ON caregivers
  FOR UPDATE
  TO authenticated
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

-- Add comments for documentation
COMMENT ON POLICY "Caregivers can view own profile" ON caregivers IS 'Allows caregivers to view their own profile data';
COMMENT ON POLICY "Specialists can view assigned caregivers" ON caregivers IS 'Allows specialists to view data of caregivers assigned to them';
COMMENT ON POLICY "Caregivers can update own profile" ON caregivers IS 'Allows caregivers to update their own profile data';