/*
  # Add Tuition Assignment Support

  1. Changes to Existing Tables
    - Add `tutor_id` column to `tuition` table to track assignments
    - Add `city` column to `tuition` table for filtering
    - Add `tuition_type` column to distinguish between Home/Online tuition
    - Add `tuition_code` column for unique identification

  2. Security
    - Update RLS policies to support assignment queries
*/

-- Add new columns to tuition table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tuition' AND column_name = 'tutor_id'
  ) THEN
    ALTER TABLE tuition ADD COLUMN tutor_id uuid REFERENCES tutor(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tuition' AND column_name = 'city'
  ) THEN
    ALTER TABLE tuition ADD COLUMN city text NOT NULL DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tuition' AND column_name = 'tuition_type'
  ) THEN
    ALTER TABLE tuition ADD COLUMN tuition_type text NOT NULL DEFAULT 'Home Tuition';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tuition' AND column_name = 'tuition_code'
  ) THEN
    ALTER TABLE tuition ADD COLUMN tuition_code text;
  END IF;
END $$;

-- Update existing tuition records with sample data
UPDATE tuition SET 
  city = CASE 
    WHEN location LIKE '%Downtown%' THEN 'Islamabad'
    WHEN location LIKE '%North%' THEN 'Karachi'
    WHEN location LIKE '%East%' THEN 'Lahore'
    WHEN location LIKE '%South%' THEN 'Karachi'
    WHEN location LIKE '%West%' THEN 'Lahore'
    ELSE 'Islamabad'
  END,
  tuition_type = CASE 
    WHEN id IN (SELECT id FROM tuition LIMIT 2) THEN 'Online Tuition'
    ELSE 'Home Tuition'
  END,
  tuition_code = 'KT-' || LPAD(floor(random() * 9000000 + 1000000)::text, 7, '0')
WHERE city IS NULL OR city = '';

-- Add policy for assigning tuitions
CREATE POLICY "Anyone can update tuition assignments"
  ON tuition FOR UPDATE
  USING (true)
  WITH CHECK (true);