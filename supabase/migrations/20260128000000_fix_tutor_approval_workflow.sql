-- ============================================
-- FIX TUTOR APPROVAL WORKFLOW
-- Date: 2026-01-28
-- Purpose: Automate tutor approval to copy data from new_tutor to tutors table
-- ============================================

-- Step 1: Add email column to new_tutor table for easier data transfer
ALTER TABLE public.new_tutor 
ADD COLUMN IF NOT EXISTS email TEXT;

-- Step 2: Create function to automatically copy approved tutor to tutors table
CREATE OR REPLACE FUNCTION approve_tutor_application()
RETURNS TRIGGER AS $$
DECLARE
  user_email TEXT;
BEGIN
  -- Only proceed if status changed to 'approved'
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    
    -- Get user email from auth.users
    SELECT email INTO user_email
    FROM auth.users
    WHERE id = NEW.user_id;
    
    -- Insert into tutors table (only if not already exists)
    INSERT INTO public.tutors (
      user_id,
      first_name,
      last_name,
      father_name,
      email,
      contact,
      other_contact,
      city,
      state,
      address,
      postal_code,
      cnic_front_url,
      cnic_back_url,
      education,
      work_experience,
      experience_years,
      subjects,
      short_bio,
      detailed_description,
      status
    )
    VALUES (
      NEW.user_id,
      NEW.first_name,
      NEW.last_name,
      NEW.father_name,
      COALESCE(user_email, 'noemail@temp.com'),
      NEW.contact,
      NEW.other_contact,
      NEW.city,
      NEW.state,
      NEW.address,
      NEW.postal_code,
      NEW.cnic_front_url,
      NEW.cnic_back_url,
      NEW.education,
      NEW.work_experience,
      NEW.experience_years,
      NEW.courses, -- Map courses to subjects
      NEW.short_about,
      NEW.detailed_description,
      'approved'
    )
    ON CONFLICT (user_id) DO NOTHING; -- Prevent duplicate entries
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Create trigger to execute function on new_tutor status update
DROP TRIGGER IF EXISTS auto_approve_tutor ON public.new_tutor;
CREATE TRIGGER auto_approve_tutor
  AFTER UPDATE ON public.new_tutor
  FOR EACH ROW
  EXECUTE FUNCTION approve_tutor_application();

-- Step 4: Migrate existing approved tutors (if any)
DO $$
DECLARE
  tutor_rec RECORD;
  user_email TEXT;
BEGIN
  FOR tutor_rec IN 
    SELECT * FROM public.new_tutor 
    WHERE status = 'approved'
    AND user_id NOT IN (SELECT user_id FROM public.tutors)
  LOOP
    -- Get user email
    SELECT email INTO user_email
    FROM auth.users
    WHERE id = tutor_rec.user_id;
    
    -- Insert into tutors table
    INSERT INTO public.tutors (
      user_id,
      first_name,
      last_name,
      father_name,
      email,
      contact,
      other_contact,
      city,
      state,
      address,
      postal_code,
      cnic_front_url,
      cnic_back_url,
      education,
      work_experience,
      experience_years,
      subjects,
      short_bio,
      detailed_description,
      status
    )
    VALUES (
      tutor_rec.user_id,
      tutor_rec.first_name,
      tutor_rec.last_name,
      tutor_rec.father_name,
      COALESCE(user_email, 'noemail@temp.com'),
      tutor_rec.contact,
      tutor_rec.other_contact,
      tutor_rec.city,
      tutor_rec.state,
      tutor_rec.address,
      tutor_rec.postal_code,
      tutor_rec.cnic_front_url,
      tutor_rec.cnic_back_url,
      tutor_rec.education,
      tutor_rec.work_experience,
      tutor_rec.experience_years,
      tutor_rec.courses,
      tutor_rec.short_about,
      tutor_rec.detailed_description,
      'approved'
    )
    ON CONFLICT (user_id) DO NOTHING;
  END LOOP;
END $$;

-- Show results
DO $$
DECLARE
  approved_count INT;
  tutors_count INT;
BEGIN
  SELECT COUNT(*) INTO approved_count FROM public.new_tutor WHERE status = 'approved';
  SELECT COUNT(*) INTO tutors_count FROM public.tutors;
  
  RAISE NOTICE '';
  RAISE NOTICE '╔══════════════════════════════════════════════╗';
  RAISE NOTICE '║  TUTOR APPROVAL WORKFLOW FIXED!             ║';
  RAISE NOTICE '╚══════════════════════════════════════════════╝';
  RAISE NOTICE '';
  RAISE NOTICE 'Summary:';
  RAISE NOTICE '- Approved applications: %', approved_count;
  RAISE NOTICE '- Active tutors in system: %', tutors_count;
  RAISE NOTICE '';
  RAISE NOTICE 'Trigger created: auto_approve_tutor';
  RAISE NOTICE 'Future approvals will automatically create tutor entries!';
  RAISE NOTICE '';
END $$;
