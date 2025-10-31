-- Create tuition_requests table
CREATE TABLE IF NOT EXISTS public.tuition_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    preferred_gender TEXT CHECK (preferred_gender IN ('male', 'female', 'no_preference')),
    city TEXT NOT NULL,
    area TEXT NOT NULL,
    class TEXT NOT NULL,
    subject TEXT NOT NULL,
    school TEXT,
    board TEXT,
    mode_of_tuition TEXT NOT NULL CHECK (mode_of_tuition IN ('home', 'online', 'both')),
    additional_comments TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'completed', 'cancelled')),
    assigned_tutor_id UUID REFERENCES public.tutors(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tuition_requests_user_id ON public.tuition_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_tuition_requests_status ON public.tuition_requests(status);
CREATE INDEX IF NOT EXISTS idx_tuition_requests_city ON public.tuition_requests(city);
CREATE INDEX IF NOT EXISTS idx_tuition_requests_assigned_tutor ON public.tuition_requests(assigned_tutor_id);
CREATE INDEX IF NOT EXISTS idx_tuition_requests_created_at ON public.tuition_requests(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.tuition_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can view their own tuition requests
CREATE POLICY "Users can view own tuition requests"
    ON public.tuition_requests
    FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);

-- Users can insert their own tuition requests
CREATE POLICY "Users can create tuition requests"
    ON public.tuition_requests
    FOR INSERT
    WITH CHECK (true); -- Allow anyone to create requests (including anonymous users)

-- Users can update their own tuition requests
CREATE POLICY "Users can update own tuition requests"
    ON public.tuition_requests
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Tutors can view tuition requests assigned to them
CREATE POLICY "Tutors can view assigned requests"
    ON public.tuition_requests
    FOR SELECT
    USING (
        auth.uid() IN (
            SELECT user_id FROM public.tutors WHERE id = assigned_tutor_id
        )
    );

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_tuition_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_tuition_requests_timestamp ON public.tuition_requests;
CREATE TRIGGER update_tuition_requests_timestamp
    BEFORE UPDATE ON public.tuition_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_tuition_requests_updated_at();

-- Add comment to the table
COMMENT ON TABLE public.tuition_requests IS 'Stores tuition requests submitted by parents and students';
