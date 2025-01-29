-- Enable RLS on levels table
ALTER TABLE levels ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read levels
CREATE POLICY "Allow public read access to levels"
ON levels
FOR SELECT
TO public
USING (true);

-- Verify the policy
SELECT * FROM pg_policies WHERE tablename = 'levels';
