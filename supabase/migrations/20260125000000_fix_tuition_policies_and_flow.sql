-- Fix tuition table policies and flow
-- Date: 2026-01-25

-- ============================================
-- 1. DROP PROBLEMATIC POLICY
-- ============================================
DROP POLICY IF EXISTS "Anyone can update tuition assignments" ON public.tuition;

-- ============================================
-- 2. ADD ADMIN-ONLY POLICY FOR TUITION TABLE
-- ============================================
-- Drop existing policies first
DROP POLICY IF EXISTS "Only admin can update tuition" ON public.tuition;
DROP POLICY IF EXISTS "Only admin can insert tuition" ON public.tuition;

-- Only admin (specific user) can update tuition
CREATE POLICY "Only admin can update tuition"
ON public.tuition
FOR UPDATE
TO authenticated
USING (
  -- Replace with your admin user ID
  auth.uid() = '469a4b17-1d4a-469d-aebf-731c447f49cb'::uuid
)
WITH CHECK (
  auth.uid() = '469a4b17-1d4a-469d-aebf-731c447f49cb'::uuid
);

-- Only admin can insert tuition
CREATE POLICY "Only admin can insert tuition"
ON public.tuition
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = '469a4b17-1d4a-469d-aebf-731c447f49cb'::uuid
);

-- ============================================
-- 3. FIX TUITION_REQUESTS POLICIES
-- ============================================
-- Drop ALL existing policies (cleanup)
DROP POLICY IF EXISTS "Tutors can view assigned requests" ON public.tuition_requests;
DROP POLICY IF EXISTS "Users can view own tuition requests" ON public.tuition_requests;
DROP POLICY IF EXISTS "Users can update own tuition requests" ON public.tuition_requests;
DROP POLICY IF EXISTS "Users can create tuition requests" ON public.tuition_requests;
DROP POLICY IF EXISTS "Admin can view all requests" ON public.tuition_requests;
DROP POLICY IF EXISTS "Admin can update all requests" ON public.tuition_requests;

-- POLICY 1: Anyone can submit tuition request (no login required)
CREATE POLICY "Anyone can submit tuition request"
ON public.tuition_requests
FOR INSERT
TO public
WITH CHECK (true);

-- POLICY 2: Only admin can view ALL requests
CREATE POLICY "Admin can view all requests"
ON public.tuition_requests
FOR SELECT
TO authenticated
USING (
  auth.uid() = '469a4b17-1d4a-469d-aebf-731c447f49cb'::uuid
);

-- POLICY 3: Tutors can ONLY view requests assigned to them
CREATE POLICY "Tutors can view assigned requests"
ON public.tuition_requests
FOR SELECT
TO authenticated
USING (
  assigned_tutor_id IS NOT NULL 
  AND assigned_tutor_id IN (
    SELECT id FROM public.tutors WHERE user_id = auth.uid()
  )
);

-- POLICY 4: Only admin can update requests (for approval/assignment)
CREATE POLICY "Admin can update all requests"
ON public.tuition_requests
FOR UPDATE
TO authenticated
USING (
  auth.uid() = '469a4b17-1d4a-469d-aebf-731c447f49cb'::uuid
)
WITH CHECK (
  auth.uid() = '469a4b17-1d4a-469d-aebf-731c447f49cb'::uuid
);

-- ============================================
-- 4. FIX TUITION_ASSIGNMENTS POLICIES
-- ============================================
DROP POLICY IF EXISTS "Authenticated users can insert assignments" ON public.tuition_assignments;
DROP POLICY IF EXISTS "Authenticated users can update assignments" ON public.tuition_assignments;
DROP POLICY IF EXISTS "Only admin can insert assignments" ON public.tuition_assignments;
DROP POLICY IF EXISTS "Only admin can update assignments" ON public.tuition_assignments;

-- Only admin can insert assignments
CREATE POLICY "Only admin can insert assignments"
ON public.tuition_assignments
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = '469a4b17-1d4a-469d-aebf-731c447f49cb'::uuid
);

-- Only admin can update assignments
CREATE POLICY "Only admin can update assignments"
ON public.tuition_assignments
FOR UPDATE
TO authenticated
USING (
  auth.uid() = '469a4b17-1d4a-469d-aebf-731c447f49cb'::uuid
)
WITH CHECK (
  auth.uid() = '469a4b17-1d4a-469d-aebf-731c447f49cb'::uuid
);

-- ============================================
-- NOTES: CORRECT FLOW
-- ============================================
-- 1. User fills tuition-request form (no login required)
--    → INSERT into tuition_requests (status=pending)
--    → User can submit MULTIPLE requests
--    → User CANNOT view or edit submitted requests
--
-- 2. Admin dashboard
--    → View ALL requests (pending/assigned/completed)
--    → Approve request → UPDATE SET status='assigned', assigned_tutor_id=<tutor_id>
--
-- 3. "All Tuitions" screen (for tutors)
--    → Shows approved requests from tuition_requests WHERE status != 'pending'
--    → Only approved tutors can apply
--
-- 4. "My Tuitions" screen (for assigned tutors)
--    → SELECT FROM tuition_requests WHERE assigned_tutor_id = current_tutor_id
--
-- Security:
-- ✅ Anyone can submit requests (public)
-- ✅ Only YOU can view/update ALL requests
-- ✅ Tutors can ONLY see their assigned tuitions
-- ✅ Users CANNOT view/edit their own requests (submit & forget)
-- ✅ Tuition_assignments only YOU can manage
