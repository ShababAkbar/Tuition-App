-- Create tutors table for storing tutor profile information
CREATE TABLE IF NOT EXISTS tutors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    father_name TEXT,
    contact TEXT NOT NULL,
    other_contact TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    address TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    cnic_front_url TEXT,
    cnic_back_url TEXT,
    education JSONB DEFAULT '[]'::jsonb,
    work_experience JSONB DEFAULT '[]'::jsonb,
    experience_years INTEGER DEFAULT 0,
    courses TEXT[] DEFAULT ARRAY[]::TEXT[],
    short_about TEXT,
    detailed_description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create an index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_tutors_user_id ON tutors(user_id);

-- Create an index on status for filtering
CREATE INDEX IF NOT EXISTS idx_tutors_status ON tutors(status);

-- Enable Row Level Security
ALTER TABLE tutors ENABLE ROW LEVEL SECURITY;

-- Policy: Tutors can read their own profile
CREATE POLICY "Tutors can read own profile"
    ON tutors
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Tutors can insert their own profile
CREATE POLICY "Tutors can insert own profile"
    ON tutors
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Tutors can update their own profile
CREATE POLICY "Tutors can update own profile"
    ON tutors
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Policy: Everyone can read approved tutor profiles (for public browsing)
CREATE POLICY "Anyone can read approved tutors"
    ON tutors
    FOR SELECT
    USING (status = 'approved');

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_tutors_updated_at
    BEFORE UPDATE ON tutors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for tutor documents if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('tutor-documents', 'tutor-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for tutor-documents bucket
CREATE POLICY "Tutors can upload own documents"
    ON storage.objects
    FOR INSERT
    WITH CHECK (
        bucket_id = 'tutor-documents' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Tutors can read own documents"
    ON storage.objects
    FOR SELECT
    USING (
        bucket_id = 'tutor-documents' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Anyone can read approved tutor documents"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'tutor-documents');
