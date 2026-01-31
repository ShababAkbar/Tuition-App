-- Update Admin User ID across all policies
-- New Admin ID: a43652ff-1008-4730-9b59-33503ba34ea5

-- Drop and recreate is_admin function with new admin ID
DROP FUNCTION IF EXISTS is_admin();

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN auth.uid() = 'a43652ff-1008-4730-9b59-33503ba34ea5'::uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update tuition_requests policies
DROP POLICY IF EXISTS "Admin can view all tuition requests" ON tuition_requests;
CREATE POLICY "Admin can view all tuition requests"
ON tuition_requests FOR SELECT
USING (auth.uid() = 'a43652ff-1008-4730-9b59-33503ba34ea5'::uuid);

DROP POLICY IF EXISTS "Admin can update tuition requests" ON tuition_requests;
CREATE POLICY "Admin can update tuition requests"
ON tuition_requests FOR UPDATE
USING (auth.uid() = 'a43652ff-1008-4730-9b59-33503ba34ea5'::uuid)
WITH CHECK (auth.uid() = 'a43652ff-1008-4730-9b59-33503ba34ea5'::uuid);

-- Update tuition policies
DROP POLICY IF EXISTS "Admin can view all tuitions" ON tuition;
CREATE POLICY "Admin can view all tuitions"
ON tuition FOR SELECT
USING (auth.uid() = 'a43652ff-1008-4730-9b59-33503ba34ea5'::uuid);

DROP POLICY IF EXISTS "Admin can insert tuitions" ON tuition;
CREATE POLICY "Admin can insert tuitions"
ON tuition FOR INSERT
WITH CHECK (auth.uid() = 'a43652ff-1008-4730-9b59-33503ba34ea5'::uuid);

DROP POLICY IF EXISTS "Admin can update tuitions" ON tuition;
CREATE POLICY "Admin can update tuitions"
ON tuition FOR UPDATE
USING (auth.uid() = 'a43652ff-1008-4730-9b59-33503ba34ea5'::uuid)
WITH CHECK (auth.uid() = 'a43652ff-1008-4730-9b59-33503ba34ea5'::uuid);

DROP POLICY IF EXISTS "Admin can delete tuitions" ON tuition;
CREATE POLICY "Admin can delete tuitions"
ON tuition FOR DELETE
USING (auth.uid() = 'a43652ff-1008-4730-9b59-33503ba34ea5'::uuid);

-- Update new_tutor policies
DROP POLICY IF EXISTS "Admin can view all new tutor applications" ON new_tutor;
CREATE POLICY "Admin can view all new tutor applications"
ON new_tutor FOR SELECT
USING (auth.uid() = 'a43652ff-1008-4730-9b59-33503ba34ea5'::uuid);

DROP POLICY IF EXISTS "Admin can update new tutor applications" ON new_tutor;
CREATE POLICY "Admin can update new tutor applications"
ON new_tutor FOR UPDATE
USING (auth.uid() = 'a43652ff-1008-4730-9b59-33503ba34ea5'::uuid);

DROP POLICY IF EXISTS "Admin can delete new tutor applications" ON new_tutor;
CREATE POLICY "Admin can delete new tutor applications"
ON new_tutor FOR DELETE
USING (auth.uid() = 'a43652ff-1008-4730-9b59-33503ba34ea5'::uuid);

-- Update tutors policies  
DROP POLICY IF EXISTS "Admin can view all tutors" ON tutors;
CREATE POLICY "Admin can view all tutors"
ON tutors FOR SELECT
USING (auth.uid() = 'a43652ff-1008-4730-9b59-33503ba34ea5'::uuid);

DROP POLICY IF EXISTS "Admin can insert tutors" ON tutors;
CREATE POLICY "Admin can insert tutors"
ON tutors FOR INSERT
WITH CHECK (auth.uid() = 'a43652ff-1008-4730-9b59-33503ba34ea5'::uuid);

DROP POLICY IF EXISTS "Admin can update tutors" ON tutors;
CREATE POLICY "Admin can update tutors"
ON tutors FOR UPDATE
USING (auth.uid() = 'a43652ff-1008-4730-9b59-33503ba34ea5'::uuid)
WITH CHECK (auth.uid() = 'a43652ff-1008-4730-9b59-33503ba34ea5'::uuid);

-- Update user_profiles policies
DROP POLICY IF EXISTS "Admin can view all profiles" ON user_profiles;
CREATE POLICY "Admin can view all profiles"
ON user_profiles FOR SELECT
USING (auth.uid() = 'a43652ff-1008-4730-9b59-33503ba34ea5'::uuid);

DROP POLICY IF EXISTS "Admin can update profiles" ON user_profiles;
CREATE POLICY "Admin can update profiles"
ON user_profiles FOR UPDATE
USING (auth.uid() = 'a43652ff-1008-4730-9b59-33503ba34ea5'::uuid);

-- Update tutor_applications policies
DROP POLICY IF EXISTS "Admin can view all applications" ON tutor_applications;
CREATE POLICY "Admin can view all applications"
ON tutor_applications FOR SELECT
USING (auth.uid() = 'a43652ff-1008-4730-9b59-33503ba34ea5'::uuid);

DROP POLICY IF EXISTS "Admin can update applications" ON tutor_applications;
CREATE POLICY "Admin can update applications"
ON tutor_applications FOR UPDATE
USING (auth.uid() = 'a43652ff-1008-4730-9b59-33503ba34ea5'::uuid);

-- Update tuition_assignments policies
DROP POLICY IF EXISTS "Admin can view all assignments" ON tuition_assignments;
CREATE POLICY "Admin can view all assignments"
ON tuition_assignments FOR SELECT
USING (auth.uid() = 'a43652ff-1008-4730-9b59-33503ba34ea5'::uuid);

DROP POLICY IF EXISTS "Admin can insert assignments" ON tuition_assignments;
CREATE POLICY "Admin can insert assignments"
ON tuition_assignments FOR INSERT
WITH CHECK (auth.uid() = 'a43652ff-1008-4730-9b59-33503ba34ea5'::uuid);

DROP POLICY IF EXISTS "Admin can update assignments" ON tuition_assignments;
CREATE POLICY "Admin can update assignments"
ON tuition_assignments FOR UPDATE
USING (auth.uid() = 'a43652ff-1008-4730-9b59-33503ba34ea5'::uuid);

-- Update get_tuition_applications function
DROP FUNCTION IF EXISTS get_tuition_applications(uuid);

CREATE OR REPLACE FUNCTION get_tuition_applications(tuition_id_param uuid DEFAULT NULL)
RETURNS TABLE (
    application_id uuid,
    tuition_id uuid,
    tuition_code text,
    tutor_id uuid,
    tutor_name text,
    tutor_email text,
    tutor_phone text,
    application_status text,
    applied_at timestamptz,
    updated_at timestamptz,
    notes text
) AS $$
BEGIN
    -- Check if user is admin
    IF NOT (
        SELECT auth.uid() = 'a43652ff-1008-4730-9b59-33503ba34ea5'::uuid
    ) THEN
        RAISE EXCEPTION 'Access denied. Admin only.';
    END IF;

    -- Return applications
    RETURN QUERY
    SELECT 
        ta.id as application_id,
        ta.tuition_id,
        t.tuition_code,
        ta.tutor_id,
        tu.full_name as tutor_name,
        tu.email as tutor_email,
        tu.contact as tutor_phone,
        ta.status as application_status,
        ta.applied_at,
        ta.updated_at,
        ta.notes
    FROM tutor_applications ta
    INNER JOIN tuition t ON ta.tuition_id = t.id
    INNER JOIN tutors tu ON ta.tutor_id = tu.id
    WHERE tuition_id_param IS NULL OR ta.tuition_id = tuition_id_param
    ORDER BY ta.applied_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
