-- ============================================
-- FIX NEW_TUTOR RLS POLICIES
-- Date: 2026-01-27
-- Purpose: Ensure users can read their own pending tutor applications
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own application" ON new_tutor;
DROP POLICY IF EXISTS "Users can insert own application" ON new_tutor;
DROP POLICY IF EXISTS "Users can update own pending application" ON new_tutor;
DROP POLICY IF EXISTS "Admin can read all applications" ON new_tutor;
DROP POLICY IF EXISTS "Admin can update applications" ON new_tutor;

-- Enable RLS (if not already enabled)
ALTER TABLE new_tutor ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can read their own application
CREATE POLICY "Users can read own application" 
ON new_tutor FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Policy 2: Users can insert their own application
CREATE POLICY "Users can insert own application" 
ON new_tutor FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can update their own pending application
CREATE POLICY "Users can update own pending application" 
ON new_tutor FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id AND status = 'pending')
WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- Policy 4: Admin can read all applications
CREATE POLICY "Admin can read all applications" 
ON new_tutor FOR SELECT 
TO authenticated
USING (auth.uid() = '469a4b17-1d4a-469d-aebf-731c447f49cb'::uuid);

-- Policy 5: Admin can update any application
CREATE POLICY "Admin can update applications" 
ON new_tutor FOR UPDATE 
TO authenticated
USING (auth.uid() = '469a4b17-1d4a-469d-aebf-731c447f49cb'::uuid)
WITH CHECK (auth.uid() = '469a4b17-1d4a-469d-aebf-731c447f49cb'::uuid);

-- Verify policies
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'new_tutor' 
        AND policyname = 'Users can read own application'
    ) THEN
        RAISE NOTICE '✅ User read policy created successfully';
    ELSE
        RAISE EXCEPTION '❌ Failed to create user read policy';
    END IF;
    
    RAISE NOTICE '';
    RAISE NOTICE '╔════════════════════════════════════════════════╗';
    RAISE NOTICE '║  NEW_TUTOR RLS POLICIES FIXED SUCCESSFULLY!   ║';
    RAISE NOTICE '╚════════════════════════════════════════════════╝';
    RAISE NOTICE '';
    RAISE NOTICE 'Users can now:';
    RAISE NOTICE '1. ✅ Read their own tutor applications';
    RAISE NOTICE '2. ✅ Insert new applications';
    RAISE NOTICE '3. ✅ Update pending applications';
    RAISE NOTICE '';
    RAISE NOTICE 'Admin can:';
    RAISE NOTICE '1. ✅ Read all applications';
    RAISE NOTICE '2. ✅ Update any application';
    RAISE NOTICE '';
END $$;
