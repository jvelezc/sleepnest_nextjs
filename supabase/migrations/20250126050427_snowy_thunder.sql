/*
  # Remove All Caregiver Policies

  1. Changes
    - Drop all existing policies from caregivers table
    - Keep RLS enabled but with no policies for now
    
  2. Security
    - Temporarily removes all access control policies
    - Maintains RLS enabled state
*/

-- Drop all existing policies on caregivers table
DROP POLICY IF EXISTS "select_own_profile" ON caregivers;
DROP POLICY IF EXISTS "select_as_specialist" ON caregivers;
DROP POLICY IF EXISTS "insert_own_profile" ON caregivers;
DROP POLICY IF EXISTS "update_own_profile" ON caregivers;
DROP POLICY IF EXISTS "caregiver_select_own" ON caregivers;
DROP POLICY IF EXISTS "specialist_select_assigned" ON caregivers;
DROP POLICY IF EXISTS "caregiver_insert_own" ON caregivers;
DROP POLICY IF EXISTS "caregiver_update_own" ON caregivers;
DROP POLICY IF EXISTS "Allow users to view own caregiver profile" ON caregivers;
DROP POLICY IF EXISTS "Allow specialists to view assigned caregivers" ON caregivers;
DROP POLICY IF EXISTS "Allow users to update own caregiver profile" ON caregivers;
DROP POLICY IF EXISTS "Allow users to insert own caregiver profile" ON caregivers;
DROP POLICY IF EXISTS "Caregivers can view own profile" ON caregivers;
DROP POLICY IF EXISTS "Specialists can view assigned caregivers" ON caregivers;
DROP POLICY IF EXISTS "Caregivers can update own profile" ON caregivers;
DROP POLICY IF EXISTS "Users can view own caregiver data" ON caregivers;
DROP POLICY IF EXISTS "Users can update own caregiver data" ON caregivers;
DROP POLICY IF EXISTS "Caregivers can view own data" ON caregivers;
DROP POLICY IF EXISTS "Caregivers can update own data" ON caregivers;

-- Keep RLS enabled
ALTER TABLE caregivers DISABLE ROW LEVEL SECURITY;
ALTER TABLE caregivers ENABLE ROW LEVEL SECURITY;