/*
  # Add Application Statistics Table

  1. New Table
    - `app_stats`
      - `id` (uuid, primary key)
      - `total_tutors` (integer, count of tutors)
      - `total_students` (integer, count of students served)
      - `google_rating` (numeric, rating on google)
      - `years_of_legacy` (integer, years in business)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS
    - Allow public read access
    - Allow admin updates only

  3. Initial Data
    - Insert initial statistics row
*/

-- Create app_stats table
CREATE TABLE IF NOT EXISTS app_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  total_tutors integer NOT NULL DEFAULT 0,
  total_students integer NOT NULL DEFAULT 0,
  google_rating numeric(2,1) NOT NULL DEFAULT 4.5,
  years_of_legacy integer NOT NULL DEFAULT 9,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE app_stats ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read stats
CREATE POLICY "Anyone can view app stats"
  ON app_stats FOR SELECT
  USING (true);

-- Insert initial stats
INSERT INTO app_stats (total_tutors, total_students, google_rating, years_of_legacy)
VALUES (3019, 5000, 4.5, 9)
ON CONFLICT DO NOTHING;

-- Create a function to update stats automatically
CREATE OR REPLACE FUNCTION update_app_stats()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE app_stats
  SET 
    total_tutors = (SELECT COUNT(*) FROM tutor),
    total_students = (SELECT COUNT(*) FROM tuition),
    updated_at = now()
  WHERE id = (SELECT id FROM app_stats LIMIT 1);
END;
$$;

-- Create a view for easy stats access with real-time counts
CREATE OR REPLACE VIEW current_stats AS
SELECT 
  COALESCE((SELECT COUNT(*) FROM tutor), 0) as total_tutors,
  COALESCE((SELECT COUNT(*) FROM tuition), 0) as total_students,
  COALESCE((SELECT google_rating FROM app_stats LIMIT 1), 4.5) as google_rating,
  COALESCE((SELECT years_of_legacy FROM app_stats LIMIT 1), 9) as years_of_legacy,
  now() as updated_at;

-- Allow anyone to read the stats view
CREATE POLICY "Anyone can view current stats"
  ON app_stats FOR SELECT
  USING (true);
