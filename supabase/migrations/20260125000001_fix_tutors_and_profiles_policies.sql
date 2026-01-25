-- Fix tutors and user_profiles policies
-- Date: 2026-01-25
-- Purpose: Remove unnecessary policies, implement correct access control

-- ============================================
-- 1. TUTORS TABLE - FIX POLICIES
-- ============================================
-- Drop ALL existing tutor policies
DROP POLICY IF EXISTS "Anyone can read approved tutors" ON public.tutors;
DROP POLICY IF EXISTS "Users can read own tutor data" ON public.tutors;
DROP POLICY IF EXISTS "Users can update own tutor profile" ON public.tutors;
DROP POLICY IF EXISTS "Admin can view all tutors" ON public.tutors;
DROP POLICY IF EXISTS "Tutor can view own profile" ON public.tutors;
DROP POLICY IF EXISTS "Tutor can update own profile" ON public.tutors;
DROP POLICY IF EXISTS "Admin can insert tutors" ON public.tutors;

-- POLICY 1: Only admin can view all tutors
CREATE POLICY "Admin can view all tutors"
ON public.tutors
FOR SELECT
TO authenticated
USING (
  auth.uid() = '469a4b17-1d4a-469d-aebf-731c447f49cb'::uuid
);

-- POLICY 2: Tutor can view ONLY their own profile
CREATE POLICY "Tutor can view own profile"
ON public.tutors
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
);

-- POLICY 3: Tutor can update ONLY their own profile
CREATE POLICY "Tutor can update own profile"
ON public.tutors
FOR UPDATE
TO authenticated
USING (
  user_id = auth.uid()
)
WITH CHECK (
  user_id = auth.uid()
);

-- POLICY 4: Only admin can insert tutors (for manual entry)
CREATE POLICY "Admin can insert tutors"
ON public.tutors
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = '469a4b17-1d4a-469d-aebf-731c447f49cb'::uuid
);

-- ============================================
-- 2. USER_PROFILES TABLE - FIX POLICIES
-- ============================================
-- Drop ALL existing user_profiles policies (users don't create accounts)
DROP POLICY IF EXISTS "Allow insert during signup" ON public.user_profiles;
DROP POLICY IF EXISTS "Anyone can insert user profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Public can view active profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Service role can manage profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;

-- POLICY 1: Only admin can view all user profiles
CREATE POLICY "Admin can view all profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() = '469a4b17-1d4a-469d-aebf-731c447f49cb'::uuid
);

-- POLICY 2: Only admin can insert user profiles
CREATE POLICY "Admin can insert profiles"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = '469a4b17-1d4a-469d-aebf-731c447f49cb'::uuid
);

-- POLICY 3: Only admin can update user profiles
CREATE POLICY "Admin can update profiles"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (
  auth.uid() = '469a4b17-1d4a-469d-aebf-731c447f49cb'::uuid
)
WITH CHECK (
  auth.uid() = '469a4b17-1d4a-469d-aebf-731c447f49cb'::uuid
);

-- POLICY 4: Only admin can delete user profiles
CREATE POLICY "Admin can delete profiles"
ON public.user_profiles
FOR DELETE
TO authenticated
USING (
  auth.uid() = '469a4b17-1d4a-469d-aebf-731c447f49cb'::uuid
);

-- ============================================
-- 3. NEW_TUTOR TABLE - REVIEW POLICIES
-- ============================================
-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert own application" ON public.new_tutor;
DROP POLICY IF EXISTS "Users can read own application" ON public.new_tutor;
DROP POLICY IF EXISTS "Users can update own pending application" ON public.new_tutor;

-- POLICY 1: Anyone can submit tutor application (no login required)
CREATE POLICY "Anyone can submit tutor application"
ON public.new_tutor
FOR INSERT
TO public
WITH CHECK (true);

-- POLICY 2: Only admin can view all applications
CREATE POLICY "Admin can view all applications"
ON public.new_tutor
FOR SELECT
TO authenticated
USING (
  auth.uid() = '469a4b17-1d4a-469d-aebf-731c447f49cb'::uuid
);

-- POLICY 3: Only admin can update applications (approve/reject)
CREATE POLICY "Admin can update applications"
ON public.new_tutor
FOR UPDATE
TO authenticated
USING (
  auth.uid() = '469a4b17-1d4a-469d-aebf-731c447f49cb'::uuid
)
WITH CHECK (
  auth.uid() = '469a4b17-1d4a-469d-aebf-731c447f49cb'::uuid
);

-- ============================================
-- NOTES: CORRECTED ACCESS CONTROL
-- ============================================
-- TUTORS TABLE:
-- ✅ Admin can view/insert/update all tutors
-- ✅ Tutors can ONLY view/update their own profile
-- ✅ Tutors CANNOT see other tutors
-- ❌ No public access to tutor data
--
-- USER_PROFILES TABLE:
-- ✅ Only admin can view/insert/update/delete profiles
-- ❌ Users don't create accounts - data comes from forms
-- ❌ No public or user access
--
-- NEW_TUTOR TABLE:
-- ✅ Anyone can submit application (form submission)
-- ✅ Only admin can view/update applications
-- ❌ Applicants cannot view/edit their submissions
