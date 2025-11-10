-- Update tutor table structure to be editable profile data only
-- This table will contain data that tutors can edit
-- Sensitive data (CNIC, education) will be in tutors table

-- Make phone nullable
ALTER TABLE tutor 
ALTER COLUMN phone DROP NOT NULL;

-- Add missing columns if they don't exist
DO $$
BEGIN
  -- Add profile_picture if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tutor' AND column_name = 'profile_picture'
  ) THEN
    ALTER TABLE tutor ADD COLUMN profile_picture text;
  END IF;

  -- Add bio if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tutor' AND column_name = 'bio'
  ) THEN
    ALTER TABLE tutor ADD COLUMN bio text;
  END IF;

  -- Add city if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tutor' AND column_name = 'city'
  ) THEN
    ALTER TABLE tutor ADD COLUMN city text;
  END IF;

  -- Add subjects if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tutor' AND column_name = 'subjects'
  ) THEN
    ALTER TABLE tutor ADD COLUMN subjects text[] DEFAULT ARRAY[]::text[];
  END IF;

  -- Add experience_years if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tutor' AND column_name = 'experience_years'
  ) THEN
    ALTER TABLE tutor ADD COLUMN experience_years integer DEFAULT 0;
  END IF;
END $$;

-- Update RLS policies for tutor table
DROP POLICY IF EXISTS "Users can read own tutor profile" ON tutor;
DROP POLICY IF EXISTS "Users can update own tutor profile" ON tutor;

-- Allow users to read their own tutor profile
CREATE POLICY "Users can read own tutor profile"
  ON tutor FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update their own tutor profile
CREATE POLICY "Users can update own tutor profile"
  ON tutor FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Public can read approved tutors
CREATE POLICY "Anyone can read approved tutors"
  ON tutor FOR SELECT
  USING (true);
