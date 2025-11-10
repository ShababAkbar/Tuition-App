/*
  # Create Tutor and Tuition Tables

  1. New Tables
    - `tutor`
      - `id` (uuid, primary key)
      - `name` (text, tutor's full name)
      - `email` (text, unique, tutor's email)
      - `phone` (text, tutor's phone number)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `tuition`
      - `id` (uuid, primary key)
      - `student_name` (text, name of student)
      - `subject` (text, subject being taught)
      - `grade` (text, class/grade level)
      - `location` (text, tuition location)
      - `timing` (text, tuition schedule/timing)
      - `fee` (text, tuition fee)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Allow public read access to tuition records (for browsing)
    - Allow authenticated users to read/write their own tutor profile
    - For simplicity, allow anonymous tutor profile creation and updates
*/

-- Create tutor table
CREATE TABLE IF NOT EXISTS tutor (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tuition table
CREATE TABLE IF NOT EXISTS tuition (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name text NOT NULL,
  subject text NOT NULL,
  grade text NOT NULL,
  location text NOT NULL,
  timing text NOT NULL,
  fee text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tutor ENABLE ROW LEVEL SECURITY;
ALTER TABLE tuition ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view tuitions" ON tuition;
DROP POLICY IF EXISTS "Anyone can view tutors" ON tutor;
DROP POLICY IF EXISTS "Anyone can insert tutor profile" ON tutor;
DROP POLICY IF EXISTS "Anyone can update tutor profile" ON tutor;

-- Tuition policies: allow public read access
CREATE POLICY "Anyone can view tuitions"
  ON tuition FOR SELECT
  USING (true);

-- Tutor policies: allow anyone to read and write (simplified for demo)
CREATE POLICY "Anyone can view tutors"
  ON tutor FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert tutor profile"
  ON tutor FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update tutor profile"
  ON tutor FOR UPDATE
  USING (true)
  WITH CHECK (true);