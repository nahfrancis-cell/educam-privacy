-- Insert levels
INSERT INTO levels (level_name, created_at, updated_at)
VALUES 
  ('O/L', NOW(), NOW()),
  ('A/L', NOW(), NOW())
ON CONFLICT (level_name) DO NOTHING;
