-- ============================================
-- SIMPLIFY TUITION TABLES
-- Date: 2026-01-27
-- Purpose: Remove redundant tuition_assignments table and add missing columns
-- ============================================

-- Drop tuition_assignments table (redundant - tuition table handles assignments)
DROP TABLE IF EXISTS public.tuition_assignments CASCADE;

-- Add missing columns to tuition table
ALTER TABLE public.tuition 
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS tuition_type TEXT DEFAULT 'Home Tuition',
ADD COLUMN IF NOT EXISTS tuition_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'available' CHECK (status IN ('available', 'assigned', 'completed', 'cancelled')),
ADD COLUMN IF NOT EXISTS tutor_id UUID REFERENCES public.tutors(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tuition_status ON public.tuition(status);
CREATE INDEX IF NOT EXISTS idx_tuition_tutor_id ON public.tuition(tutor_id);
CREATE INDEX IF NOT EXISTS idx_tuition_code ON public.tuition(tuition_code);

-- Generate tuition codes for existing records
DO $$
DECLARE
    rec RECORD;
    counter INT;
BEGIN
    counter := (SELECT COALESCE(MAX(CAST(SUBSTRING(tuition_code FROM 4) AS INT)), 8500000) + 1 
                FROM public.tuition 
                WHERE tuition_code IS NOT NULL);
    
    FOR rec IN SELECT id FROM public.tuition WHERE tuition_code IS NULL ORDER BY created_at
    LOOP
        UPDATE public.tuition 
        SET tuition_code = 'KT-' || counter::TEXT
        WHERE id = rec.id;
        counter := counter + 1;
    END LOOP;
END $$;
