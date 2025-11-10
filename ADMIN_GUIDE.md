# Admin Approval Guide

## How to Approve/Reject Tutor Applications

### View Pending Applications

```sql
-- See all pending applications
SELECT 
    id,
    user_id,
    first_name || ' ' || last_name as full_name,
    contact,
    city,
    experience_years,
    status,
    created_at
FROM new_tutor
WHERE status = 'pending'
ORDER BY created_at DESC;
```

### Approve an Application

```sql
-- Method 1: Using the helper function (RECOMMENDED)
SELECT approve_tutor_application('APPLICATION_ID_HERE');

-- Method 2: Manual approval (if you want custom control)
-- Step 1: Copy to tutors table
INSERT INTO tutors (
    user_id, first_name, last_name, father_name, contact, other_contact,
    city, state, address, postal_code, cnic_front_url, cnic_back_url,
    education, work_experience, experience_years, courses,
    short_about, detailed_description, status
)
SELECT 
    user_id, first_name, last_name, father_name, contact, other_contact,
    city, state, address, postal_code, cnic_front_url, cnic_back_url,
    education, work_experience, experience_years, courses,
    short_about, detailed_description, 'approved'
FROM new_tutor
WHERE id = 'APPLICATION_ID_HERE';

-- Step 2: Create editable profile
INSERT INTO tutor (id, name, email, phone, city, bio, experience_years, subjects)
SELECT 
    nt.user_id,
    nt.first_name || ' ' || nt.last_name,
    u.email,
    nt.contact,
    nt.city,
    nt.short_about,
    nt.experience_years,
    nt.courses
FROM new_tutor nt
JOIN auth.users u ON u.id = nt.user_id
WHERE nt.id = 'APPLICATION_ID_HERE';

-- Step 3: Update application status
UPDATE new_tutor
SET status = 'approved', reviewed_at = NOW()
WHERE id = 'APPLICATION_ID_HERE';
```

### Reject an Application

```sql
-- Method 1: Using helper function
SELECT reject_tutor_application(
    'APPLICATION_ID_HERE',
    NULL, -- admin_id (optional)
    'Reason for rejection' -- rejection reason
);

-- Method 2: Manual rejection
UPDATE new_tutor
SET 
    status = 'rejected',
    admin_notes = 'Reason for rejection here',
    reviewed_at = NOW()
WHERE id = 'APPLICATION_ID_HERE';
```

### Bulk Operations

```sql
-- Approve multiple applications at once
DO $$
DECLARE
    app_id uuid;
BEGIN
    FOR app_id IN 
        SELECT id FROM new_tutor 
        WHERE status = 'pending' 
        AND city = 'Karachi' -- or any other filter
    LOOP
        PERFORM approve_tutor_application(app_id);
    END LOOP;
END $$;

-- View approval statistics
SELECT 
    status,
    COUNT(*) as count,
    MIN(created_at) as oldest,
    MAX(created_at) as newest
FROM new_tutor
GROUP BY status;
```

### Check Application Details

```sql
-- View full application details
SELECT 
    nt.*,
    u.email,
    u.created_at as user_registered_at
FROM new_tutor nt
JOIN auth.users u ON u.id = nt.user_id
WHERE nt.id = 'APPLICATION_ID_HERE';

-- View education and experience
SELECT 
    first_name || ' ' || last_name as name,
    jsonb_pretty(education) as education_details,
    jsonb_pretty(work_experience) as work_experience_details
FROM new_tutor
WHERE id = 'APPLICATION_ID_HERE';
```

### View Approved Tutors

```sql
-- See all approved tutors
SELECT 
    t.id,
    t.first_name || ' ' || t.last_name as full_name,
    tp.name as profile_name,
    tp.city,
    tp.subjects,
    t.experience_years,
    t.status,
    t.created_at
FROM tutors t
LEFT JOIN tutor tp ON tp.id = t.user_id
WHERE t.status = 'approved'
ORDER BY t.created_at DESC;
```

### Troubleshooting

```sql
-- If approval fails, check for conflicts
SELECT * FROM tutors WHERE user_id = 'USER_ID_HERE';
SELECT * FROM tutor WHERE id = 'USER_ID_HERE';

-- Delete and re-approve if needed
DELETE FROM tutors WHERE user_id = 'USER_ID_HERE';
DELETE FROM tutor WHERE id = 'USER_ID_HERE';
SELECT approve_tutor_application('APPLICATION_ID_HERE');
```

## Important Notes

1. **Authentication is automatic** - Supabase `auth.users` table handles login/logout automatically
2. **new_tutor** - Temporary table for pending applications
3. **tutors** - Permanent storage of all tutor data (non-editable)
4. **tutor** - Editable profile data (what users see and can edit)
5. **User stays logged in** - Supabase handles session persistence automatically

## Quick Admin Panel Query

```sql
-- Admin dashboard view
SELECT 
    'Pending' as category,
    COUNT(*) as count
FROM new_tutor WHERE status = 'pending'
UNION ALL
SELECT 
    'Approved',
    COUNT(*)
FROM tutors WHERE status = 'approved'
UNION ALL
SELECT 
    'Rejected',
    COUNT(*)
FROM new_tutor WHERE status = 'rejected';
```
