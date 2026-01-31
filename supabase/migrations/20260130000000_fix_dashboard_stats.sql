-- ===============================================
-- FIX DASHBOARD STATS VIEW
-- Date: 2026-01-30
-- Purpose: Update stats to use real data from tuition table
-- ===============================================

-- Drop old view
DROP VIEW IF EXISTS public.dashboard_stats;

-- Create updated view with real counts
CREATE OR REPLACE VIEW public.dashboard_stats AS
SELECT
    (SELECT COUNT(*) FROM public.tutors WHERE status = 'approved')::TEXT as active_tutors,
    (SELECT COUNT(*) FROM public.tuition WHERE status = 'assigned')::TEXT as happy_students,
    (SELECT google_rating::TEXT FROM public.app_stats LIMIT 1) as rating,
    '1 Month' as legacy;

-- Grant access
GRANT SELECT ON public.dashboard_stats TO anon, authenticated;
