-- ============================================
-- TUITION APPLICATIONS SYSTEM
-- Date: 2026-01-29
-- Purpose: Handle multiple tutors applying for same tuition
-- ============================================

-- Step 1: Create tuition_applications table
CREATE TABLE IF NOT EXISTS public.tuition_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tuition_id UUID NOT NULL REFERENCES public.tuition(id) ON DELETE CASCADE,
  tutor_id UUID NOT NULL REFERENCES public.tutors(id) ON DELETE CASCADE,
  
  -- Tutor details (cached for quick reference)
  tutor_name TEXT NOT NULL,
  tutor_contact TEXT NOT NULL,
  tutor_city TEXT,
  tutor_subjects TEXT[],
  
  -- Application details
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  cover_letter TEXT, -- Optional message from tutor
  
  -- Timestamps
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id),
  
  -- Prevent duplicate applications
  CONSTRAINT unique_tutor_tuition UNIQUE (tuition_id, tutor_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_applications_tuition ON public.tuition_applications(tuition_id);
CREATE INDEX IF NOT EXISTS idx_applications_tutor ON public.tuition_applications(tutor_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.tuition_applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_applied_at ON public.tuition_applications(applied_at DESC);

-- Enable RLS
ALTER TABLE public.tuition_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Anyone can view applications" ON public.tuition_applications;
CREATE POLICY "Anyone can view applications"
  ON public.tuition_applications
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Tutors can create applications" ON public.tuition_applications;
CREATE POLICY "Tutors can create applications"
  ON public.tuition_applications
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin can update applications" ON public.tuition_applications;
CREATE POLICY "Admin can update applications"
  ON public.tuition_applications
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Step 2: Create function to handle application acceptance
CREATE OR REPLACE FUNCTION accept_tuition_application()
RETURNS TRIGGER AS $$
BEGIN
  -- When application accepted, update tuition table
  IF NEW.status = 'accepted' AND (OLD.status IS NULL OR OLD.status != 'accepted') THEN
    
    -- Update tuition with assigned tutor
    UPDATE public.tuition
    SET 
      tutor_id = NEW.tutor_id,
      status = 'assigned',
      assigned_at = NOW()
    WHERE id = NEW.tuition_id;
    
    -- Reject all other pending applications for this tuition
    UPDATE public.tuition_applications
    SET 
      status = 'rejected',
      reviewed_at = NOW(),
      reviewed_by = NEW.reviewed_by
    WHERE tuition_id = NEW.tuition_id
      AND id != NEW.id
      AND status = 'pending';
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Create trigger
DROP TRIGGER IF EXISTS auto_assign_tuition ON public.tuition_applications;
CREATE TRIGGER auto_assign_tuition
  AFTER UPDATE ON public.tuition_applications
  FOR EACH ROW
  EXECUTE FUNCTION accept_tuition_application();

-- Step 4: Add application_count to tuition table (optional, for quick reference)
ALTER TABLE public.tuition 
ADD COLUMN IF NOT EXISTS application_count INTEGER DEFAULT 0;

-- Create function to update application count
CREATE OR REPLACE FUNCTION update_tuition_application_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.tuition
    SET application_count = application_count + 1
    WHERE id = NEW.tuition_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.tuition
    SET application_count = GREATEST(application_count - 1, 0)
    WHERE id = OLD.tuition_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for application count
DROP TRIGGER IF EXISTS update_application_count ON public.tuition_applications;
CREATE TRIGGER update_application_count
  AFTER INSERT OR DELETE ON public.tuition_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_tuition_application_count();

-- Show summary
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '╔══════════════════════════════════════════════╗';
  RAISE NOTICE '║  TUITION APPLICATIONS SYSTEM CREATED!       ║';
  RAISE NOTICE '╚══════════════════════════════════════════════╝';
  RAISE NOTICE '';
  RAISE NOTICE 'New Table: tuition_applications';
  RAISE NOTICE '- Tracks all tutor applications';
  RAISE NOTICE '- Supports multiple tutors per tuition';
  RAISE NOTICE '- Admin can accept/reject applications';
  RAISE NOTICE '';
  RAISE NOTICE 'Auto-triggers:';
  RAISE NOTICE '- Accept → Updates tuition.tutor_id + rejects others';
  RAISE NOTICE '- Application count auto-updated';
  RAISE NOTICE '';
END $$;
