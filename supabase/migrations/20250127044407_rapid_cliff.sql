-- Add feeding duration column to bottle_sessions
ALTER TABLE bottle_sessions
ADD COLUMN feeding_duration integer;

-- Add comment explaining the purpose
COMMENT ON COLUMN bottle_sessions.feeding_duration IS 'Duration of bottle feeding in minutes - unusually long durations may indicate feeding difficulties';

-- Update table comment
COMMENT ON TABLE bottle_sessions IS 'Details specific to bottle feeding sessions including duration tracking for identifying potential feeding issues';