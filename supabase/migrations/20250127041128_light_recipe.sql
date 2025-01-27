-- Drop the milk_type and warmed columns and their constraints
ALTER TABLE bottle_sessions 
DROP COLUMN IF EXISTS milk_type,
DROP COLUMN IF EXISTS warmed;

-- Update comments
COMMENT ON TABLE bottle_sessions IS 'Details specific to bottle feeding sessions without milk type tracking';