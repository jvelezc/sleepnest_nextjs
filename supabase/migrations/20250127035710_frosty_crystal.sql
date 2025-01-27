/*
  # Remove formula concentration field
  
  1. Changes
    - Drop concentration column from formula_sessions table
    - Drop concentration check constraint
    
  2. Notes
    - Removes unused formula concentration tracking
    - Simplifies formula feeding workflow
*/

-- Drop the concentration column and its constraint
ALTER TABLE formula_sessions 
DROP CONSTRAINT IF EXISTS chk_concentration,
DROP COLUMN IF EXISTS concentration;

-- Update comments
COMMENT ON TABLE formula_sessions IS 'Details specific to formula feeding sessions without concentration tracking';