-- ===============================================
-- CREATE TUITION ASSIGNMENTS TABLE
-- ===============================================
-- This table stores finalized tuition assignments (after demo acceptance)
CREATE TABLE IF NOT EXISTS public.tuition_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tuition_request_id UUID REFERENCES public.tuition_requests(id) ON DELETE CASCADE,
    tutor_id UUID REFERENCES public.tutors(id) ON DELETE CASCADE,
    tutor_name TEXT NOT NULL,
    student_name TEXT NOT NULL,
    subject TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    demo_held_at TIMESTAMP WITH TIME ZONE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tuition_assignments_tutor ON public.tuition_assignments(tutor_id);
CREATE INDEX IF NOT EXISTS idx_tuition_assignments_status ON public.tuition_assignments(status);
CREATE INDEX IF NOT EXISTS idx_tuition_assignments_assigned_at ON public.tuition_assignments(assigned_at DESC);

-- Enable RLS
ALTER TABLE public.tuition_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Anyone can view assignments" ON public.tuition_assignments;
CREATE POLICY "Anyone can view assignments"
    ON public.tuition_assignments
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert assignments" ON public.tuition_assignments;
CREATE POLICY "Authenticated users can insert assignments"
    ON public.tuition_assignments
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update assignments" ON public.tuition_assignments;
CREATE POLICY "Authenticated users can update assignments"
    ON public.tuition_assignments
    FOR UPDATE
    USING (auth.role() = 'authenticated');

-- ===============================================
-- UPDATE EXISTING APP_STATS TABLE
-- ===============================================
-- Table already exists, just update the data
UPDATE public.app_stats 
SET 
    google_rating = 4.5,
    years_of_legacy = 1,  -- 1 month = 1 (you can change label in frontend)
    updated_at = NOW()
WHERE id IS NOT NULL;

-- If no row exists, insert one
INSERT INTO public.app_stats (total_tutors, total_students, google_rating, years_of_legacy)
SELECT 0, 0, 4.5, 1
WHERE NOT EXISTS (SELECT 1 FROM public.app_stats LIMIT 1);

-- ===============================================
-- CREATE VIEW FOR DYNAMIC STATS
-- ===============================================
CREATE OR REPLACE VIEW public.dashboard_stats AS
SELECT
    (SELECT COUNT(*) FROM public.tutors WHERE status = 'approved')::TEXT as active_tutors,
    (SELECT COUNT(*) FROM public.tuition_assignments WHERE status IN ('active', 'completed'))::TEXT as happy_students,
    (SELECT google_rating::TEXT FROM public.app_stats LIMIT 1) as rating,
    '1 Month' as legacy;  -- Hardcoded for now, change in app_stats if needed

-- ===============================================
-- CREATE VIEW FOR CITIES STATS
-- ===============================================
CREATE OR REPLACE VIEW public.cities_stats AS
SELECT 
    city,
    COUNT(*)::TEXT || '+' as tutor_count
FROM public.tutors 
WHERE status = 'approved' AND city IS NOT NULL
GROUP BY city
ORDER BY COUNT(*) DESC;

-- ===============================================
-- SAMPLE DATA (for testing)
-- ===============================================
-- Insert a sample assignment (remove in production)
-- INSERT INTO public.tuition_assignments (tuition_request_id, tutor_id, tutor_name, student_name, subject)
-- VALUES (
--     (SELECT id FROM public.tuition_requests LIMIT 1),
--     (SELECT id FROM public.tutors LIMIT 1),
--     'John Doe',
--     'Ali Ahmed',
--     'Mathematics'
-- );
