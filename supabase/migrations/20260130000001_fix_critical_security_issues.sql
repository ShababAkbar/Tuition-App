-- ===============================================
-- CRITICAL SECURITY FIXES
-- Date: 2026-01-30
-- Purpose: Fix data privacy and security issues
-- ===============================================

-- ============================================
-- 1. FIX TUITION_APPLICATIONS PUBLIC ACCESS
-- ============================================

-- Remove dangerous public access policy
DROP POLICY IF EXISTS "Anyone can view applications" ON public.tuition_applications;

-- Tutors can view their own applications
CREATE POLICY "Tutors can view own applications"
  ON public.tuition_applications
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tutors 
      WHERE tutors.id = tuition_applications.tutor_id 
      AND tutors.user_id = auth.uid()
    )
  );

-- Admin can view all applications
CREATE POLICY "Admin can view all applications"
  ON public.tuition_applications
  FOR SELECT
  USING (auth.uid() = 'a43652ff-1008-4730-9b59-33503ba34ea5'::uuid);

-- ============================================
-- 2. FIX TUTORS TABLE EMAIL EXPOSURE
-- ============================================

-- Remove public access policy (keeps emails private)
DROP POLICY IF EXISTS "Anyone can read approved tutors" ON public.tutors;

-- Create public view WITHOUT sensitive data (email, contact, address, CNIC)
CREATE OR REPLACE VIEW public.tutors_public AS
SELECT 
  id,
  first_name,
  last_name,
  city,
  state,
  subjects,
  experience_years,
  short_bio,
  detailed_description,
  profile_picture,
  education,
  work_experience,
  mode_of_tuition,
  status,
  created_at
  -- EXCLUDED: email, contact, other_contact, address, postal_code, cnic_front_url, cnic_back_url
FROM public.tutors 
WHERE status = 'approved';

-- Grant public access to safe view only
GRANT SELECT ON public.tutors_public TO anon, authenticated;

-- Tutors can still see their own full data
-- (This policy already exists, just ensuring it's there)
DROP POLICY IF EXISTS "Users can read own tutor data" ON public.tutors;
CREATE POLICY "Tutors can read own data" 
  ON public.tutors 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Admin can see all tutor data
-- (This policy already exists from previous migration)

-- ============================================
-- 3. FIX STORAGE BUCKET SECURITY
-- ============================================

-- Make storage bucket private
UPDATE storage.buckets 
SET public = false 
WHERE id = 'tutor-documents';

-- Ensure authenticated users can access their own documents
DROP POLICY IF EXISTS "Users can read own documents" ON storage.objects;
CREATE POLICY "Users can read own documents"
  ON storage.objects 
  FOR SELECT
  USING (
    bucket_id = 'tutor-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admin can read all documents
DROP POLICY IF EXISTS "Admin can read all documents" ON storage.objects;
CREATE POLICY "Admin can read all documents"
  ON storage.objects 
  FOR SELECT
  USING (
    bucket_id = 'tutor-documents' AND
    auth.uid() = 'a43652ff-1008-4730-9b59-33503ba34ea5'::uuid
  );

-- ============================================
-- 4. VERIFY TUITION TABLE HAS PROPER POLICIES
-- ============================================

-- Ensure tuition table doesn't expose student names publicly
-- Drop any overly permissive policies
DROP POLICY IF EXISTS "Anyone can read tuitions" ON public.tuition;
DROP POLICY IF EXISTS "Public can view tuitions" ON public.tuition;

-- Authenticated users can view available tuitions (for browsing)
DROP POLICY IF EXISTS "Authenticated users can view available tuitions" ON public.tuition;
CREATE POLICY "Authenticated users can view available tuitions"
  ON public.tuition
  FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    status = 'available'
  );

-- Assigned tutors can see their tuition details
DROP POLICY IF EXISTS "Tutors can view assigned tuitions" ON public.tuition;
CREATE POLICY "Tutors can view assigned tuitions"
  ON public.tuition
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tutors
      WHERE tutors.id = tuition.tutor_id
      AND tutors.user_id = auth.uid()
    )
  );

-- Admin can see all tuitions (already exists from previous migration)

-- ============================================
-- VERIFICATION QUERIES (RUN TO CHECK)
-- ============================================

-- Uncomment to verify policies are correct:
-- SELECT * FROM pg_policies WHERE tablename = 'tuition_applications';
-- SELECT * FROM pg_policies WHERE tablename = 'tutors';
-- SELECT * FROM pg_policies WHERE tablename = 'tuition';
-- SELECT * FROM storage.buckets WHERE id = 'tutor-documents';
