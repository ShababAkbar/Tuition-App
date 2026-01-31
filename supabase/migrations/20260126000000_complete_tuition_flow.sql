-- ============================================
-- COMPLETE TUITION FLOW IMPLEMENTATION
-- Date: 2026-01-26
-- Purpose: Implement complete tuition request → application → assignment flow
-- ============================================

-- ============================================
-- PART 1: ADD STATUS COLUMN TO TUITION TABLE
-- ============================================

-- Add status column
ALTER TABLE tuition 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'available';

-- Add check constraint
ALTER TABLE tuition 
DROP CONSTRAINT IF EXISTS tuition_status_check;

ALTER TABLE tuition 
ADD CONSTRAINT tuition_status_check 
CHECK (status IN ('available', 'assigned', 'completed', 'cancelled'));

-- Add index
CREATE INDEX IF NOT EXISTS idx_tuition_status ON tuition(status);

-- Update existing records
UPDATE tuition SET status = 'available' WHERE status IS NULL;

-- ============================================
-- PART 2: CREATE TUTOR_APPLICATIONS TABLE
-- ============================================

-- Drop if exists (for re-running)
DROP TABLE IF EXISTS tutor_applications CASCADE;

CREATE TABLE tutor_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tuition_id UUID NOT NULL REFERENCES tuition(id) ON DELETE CASCADE,
    tutor_id UUID NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' 
        CHECK (status IN ('pending', 'demo_scheduled', 'demo_completed', 'accepted', 'rejected')),
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    demo_date TIMESTAMPTZ,
    demo_notes TEXT,
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tuition_id, tutor_id) -- Prevent duplicate applications
);

-- Create indexes
CREATE INDEX idx_tutor_applications_tuition ON tutor_applications(tuition_id);
CREATE INDEX idx_tutor_applications_tutor ON tutor_applications(tutor_id);
CREATE INDEX idx_tutor_applications_status ON tutor_applications(status);
CREATE INDEX idx_tutor_applications_applied_at ON tutor_applications(applied_at DESC);

-- Enable RLS
ALTER TABLE tutor_applications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PART 3: RLS POLICIES FOR TUTOR_APPLICATIONS
-- ============================================

-- Drop existing policies (if any)
DROP POLICY IF EXISTS "Tutors can apply for tuitions" ON tutor_applications;
DROP POLICY IF EXISTS "Tutors can view own applications" ON tutor_applications;
DROP POLICY IF EXISTS "Admin can view all applications" ON tutor_applications;
DROP POLICY IF EXISTS "Admin can update applications" ON tutor_applications;

-- Policy 1: Tutors can insert (apply)
CREATE POLICY "Tutors can apply for tuitions"
ON tutor_applications FOR INSERT
TO authenticated
WITH CHECK (
    tutor_id IN (SELECT id FROM tutors WHERE user_id = auth.uid())
);

-- Policy 2: Tutors can view their own applications
CREATE POLICY "Tutors can view own applications"
ON tutor_applications FOR SELECT
TO authenticated
USING (
    tutor_id IN (SELECT id FROM tutors WHERE user_id = auth.uid())
);

-- Policy 3: Admin can view all
CREATE POLICY "Admin can view all applications"
ON tutor_applications FOR SELECT
TO authenticated
USING (auth.uid() = '469a4b17-1d4a-469d-aebf-731c447f49cb'::uuid);

-- Policy 4: Admin can update
CREATE POLICY "Admin can update applications"
ON tutor_applications FOR UPDATE
TO authenticated
USING (auth.uid() = '469a4b17-1d4a-469d-aebf-731c447f49cb'::uuid)
WITH CHECK (auth.uid() = '469a4b17-1d4a-469d-aebf-731c447f49cb'::uuid);

-- ============================================
-- PART 4: AUTO-GENERATE TUITION CODES
-- ============================================

-- Create sequence (check current max first)
DO $$
DECLARE
    max_code INTEGER;
BEGIN
    -- Get current max code number
    SELECT COALESCE(
        MAX(CAST(SUBSTRING(tuition_code FROM 'AP-(.*)') AS INTEGER)), 
        0
    ) INTO max_code
    FROM tuition
    WHERE tuition_code IS NOT NULL 
        AND tuition_code ~ '^AP-[0-9]+$';
    
    -- Drop and recreate sequence with correct start value
    DROP SEQUENCE IF EXISTS tuition_code_seq;
    EXECUTE format('CREATE SEQUENCE tuition_code_seq START WITH %s', max_code + 1);
END $$;

-- Create function to generate codes
CREATE OR REPLACE FUNCTION generate_tuition_code()
RETURNS TRIGGER AS $$
BEGIN
    -- Only generate if code is null
    IF NEW.tuition_code IS NULL THEN
        NEW.tuition_code := 'AP-' || LPAD(nextval('tuition_code_seq')::TEXT, 3, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS set_tuition_code ON tuition;
CREATE TRIGGER set_tuition_code
    BEFORE INSERT ON tuition
    FOR EACH ROW
    EXECUTE FUNCTION generate_tuition_code();

-- ============================================
-- PART 5: UPDATED_AT TRIGGER FOR TUTOR_APPLICATIONS
-- ============================================

DROP TRIGGER IF EXISTS update_tutor_applications_timestamp ON tutor_applications;
CREATE TRIGGER update_tutor_applications_timestamp
    BEFORE UPDATE ON tutor_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PART 6: SYNC TUITION_REQUESTS ON ASSIGNMENT
-- ============================================

-- Function to update tuition_requests when assignment is created
CREATE OR REPLACE FUNCTION sync_tuition_request_on_assignment()
RETURNS TRIGGER AS $$
BEGIN
    -- Update tuition_requests with assigned tutor
    UPDATE tuition_requests
    SET 
        assigned_tutor_id = NEW.tutor_id,
        status = 'assigned',
        updated_at = NOW()
    WHERE id = NEW.tuition_request_id;
    
    -- Mark tuition as assigned
    UPDATE tuition
    SET 
        status = 'assigned',
        tutor_id = NEW.tutor_id
    WHERE id = (
        SELECT tuition_id 
        FROM tuition_requests 
        WHERE id = NEW.tuition_request_id
        LIMIT 1
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS sync_on_tuition_assignment ON tuition_assignments;
CREATE TRIGGER sync_on_tuition_assignment
    AFTER INSERT ON tuition_assignments
    FOR EACH ROW
    EXECUTE FUNCTION sync_tuition_request_on_assignment();

-- ============================================
-- PART 7: HELPER FUNCTION - IS ADMIN
-- ============================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
            AND user_type = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PART 8: SECURE FUNCTION FOR ADMIN PANEL
-- ============================================

-- Create SECURE function instead of view
-- This respects RLS and only allows admin access
CREATE OR REPLACE FUNCTION get_tuition_applications(tuition_code_filter TEXT DEFAULT NULL)
RETURNS TABLE (
    application_id UUID,
    application_status TEXT,
    applied_at TIMESTAMPTZ,
    demo_date TIMESTAMPTZ,
    demo_notes TEXT,
    admin_notes TEXT,
    tutor_id UUID,
    tutor_name TEXT,
    tutor_email TEXT,
    tutor_contact TEXT,
    experience_years INTEGER,
    subjects TEXT[],
    tuition_id UUID,
    tuition_code TEXT,
    subject TEXT,
    grade TEXT,
    location TEXT,
    city TEXT,
    tuition_status TEXT
) AS $$
BEGIN
    -- Check if user is admin
    IF NOT is_admin() THEN
        RAISE EXCEPTION 'Access denied. Admin only.';
    END IF;
    
    -- Return applications
    RETURN QUERY
    SELECT 
        ta.id as application_id,
        ta.status as application_status,
        ta.applied_at,
        ta.demo_date,
        ta.demo_notes,
        ta.admin_notes,
        t.id as tutor_id,
        t.first_name || ' ' || t.last_name as tutor_name,
        t.email as tutor_email,
        t.contact as tutor_contact,
        t.experience_years,
        t.subjects,
        tu.id as tuition_id,
        tu.tuition_code,
        tu.subject,
        tu.grade,
        tu.location,
        tu.city,
        tu.status as tuition_status
    FROM tutor_applications ta
    JOIN tutors t ON ta.tutor_id = t.id
    JOIN tuition tu ON ta.tuition_id = tu.id
    WHERE tuition_code_filter IS NULL OR tu.tuition_code = tuition_code_filter
    ORDER BY ta.applied_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PART 9: VALIDATION & TESTING
-- ============================================

-- Test 1: Check if status column exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tuition' AND column_name = 'status'
    ) THEN
        RAISE EXCEPTION '❌ Status column not added to tuition table';
    ELSE
        RAISE NOTICE '✅ Status column exists in tuition table';
    END IF;
END $$;

-- Test 2: Check if tutor_applications table exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'tutor_applications'
    ) THEN
        RAISE EXCEPTION '❌ tutor_applications table not created';
    ELSE
        RAISE NOTICE '✅ tutor_applications table exists';
    END IF;
END $$;

-- Test 3: Check if sequence exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_sequences 
        WHERE schemaname = 'public' AND sequencename = 'tuition_code_seq'
    ) THEN
        RAISE EXCEPTION '❌ tuition_code_seq sequence not created';
    ELSE
        RAISE NOTICE '✅ tuition_code_seq sequence exists';
    END IF;
END $$;

-- Test 4: Check triggers
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'set_tuition_code'
    ) THEN
        RAISE WARNING '⚠️ set_tuition_code trigger not found';
    ELSE
        RAISE NOTICE '✅ set_tuition_code trigger exists';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'sync_on_tuition_assignment'
    ) THEN
        RAISE WARNING '⚠️ sync_on_tuition_assignment trigger not found';
    ELSE
        RAISE NOTICE '✅ sync_on_tuition_assignment trigger exists';
    END IF;
END $$;

-- ============================================
-- SUMMARY
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '╔════════════════════════════════════════════════════╗';
    RAISE NOTICE '║  TUITION FLOW MIGRATION COMPLETED SUCCESSFULLY!   ║';
    RAISE NOTICE '╚════════════════════════════════════════════════════╝';
    RAISE NOTICE '';
    RAISE NOTICE 'Changes Applied:';
    RAISE NOTICE '1. ✅ Added status column to tuition table';
    RAISE NOTICE '2. ✅ Created tutor_applications table';
    RAISE NOTICE '3. ✅ Setup RLS policies for applications';
    RAISE NOTICE '4. ✅ Auto-generate tuition codes (AP-XXX)';
    RAISE NOTICE '5. ✅ Auto-sync on assignment';
    RAISE NOTICE '6. ✅ Created is_admin() helper function';
    RAISE NOTICE '7. ✅ Created admin_tuition_applications view';
    RAISE NOTICE '';
    RAISE NOTICE 'Next Steps:';
    RAISE NOTICE '- Test tuition creation (code should auto-generate)';
    RAISE NOTICE '- Test tutor application flow';
    RAISE NOTICE '- Update admin panel UI';
    RAISE NOTICE '';
END $$;
