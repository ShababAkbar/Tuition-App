/*
  # Add Profile Fields to Tutor Table

  1. New Columns
    - `profile_picture` (text, nullable) - URL to profile picture
    - `address` (text, nullable) - Tutor's address
    - `subjects` (text array) - Array of subjects the tutor teaches
    - `mode_of_tuition` (text, default 'Both') - Online, Home, or Both
    - `city` (text, nullable) - City where tutor is located
    - `biography` (text, nullable) - Tutor's biography/description
    - `password_reset_email` (text, nullable) - Email for password reset

  2. Changes
    - Add new columns to support enhanced tutor profile functionality
    - Set appropriate defaults for mode_of_tuition
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tutor' AND column_name = 'profile_picture'
  ) THEN
    ALTER TABLE tutor ADD COLUMN profile_picture text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tutor' AND column_name = 'address'
  ) THEN
    ALTER TABLE tutor ADD COLUMN address text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tutor' AND column_name = 'subjects'
  ) THEN
    ALTER TABLE tutor ADD COLUMN subjects text[] DEFAULT ARRAY[]::text[];
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tutor' AND column_name = 'mode_of_tuition'
  ) THEN
    ALTER TABLE tutor ADD COLUMN mode_of_tuition text DEFAULT 'Both';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tutor' AND column_name = 'city'
  ) THEN
    ALTER TABLE tutor ADD COLUMN city text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tutor' AND column_name = 'biography'
  ) THEN
    ALTER TABLE tutor ADD COLUMN biography text;
  END IF;
END $$;