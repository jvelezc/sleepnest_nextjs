-- Drop existing check constraint
ALTER TABLE formula_sessions 
DROP CONSTRAINT IF EXISTS chk_amount_consistency;

-- Add new check constraints
ALTER TABLE formula_sessions
ADD CONSTRAINT chk_amount_ml CHECK (amount_ml > 0 AND amount_ml <= 500),
ADD CONSTRAINT chk_amount_oz CHECK (amount_oz > 0 AND amount_oz <= 16),
ADD CONSTRAINT chk_concentration CHECK (concentration IN ('standard', 'concentrated', 'diluted'));

-- Add trigger to automatically calculate oz from ml
CREATE OR REPLACE FUNCTION calculate_formula_amounts()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.amount_ml IS NOT NULL AND NEW.amount_oz IS NULL THEN
    -- Convert ml to oz with 1 decimal place
    NEW.amount_oz := ROUND((NEW.amount_ml * 0.033814)::numeric, 1);
  ELSIF NEW.amount_oz IS NOT NULL AND NEW.amount_ml IS NULL THEN
    -- Convert oz to ml and round to nearest whole number
    NEW.amount_ml := ROUND((NEW.amount_oz / 0.033814)::numeric);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_formula_amounts
  BEFORE INSERT OR UPDATE ON formula_sessions
  FOR EACH ROW
  EXECUTE FUNCTION calculate_formula_amounts();

-- Add comments
COMMENT ON CONSTRAINT chk_amount_ml ON formula_sessions IS 'Ensures amount in ml is between 1 and 500';
COMMENT ON CONSTRAINT chk_amount_oz ON formula_sessions IS 'Ensures amount in oz is between 1 and 16';
COMMENT ON CONSTRAINT chk_concentration ON formula_sessions IS 'Ensures concentration is one of standard, concentrated, or diluted';
COMMENT ON FUNCTION calculate_formula_amounts IS 'Automatically calculates and converts between ml and oz measurements';