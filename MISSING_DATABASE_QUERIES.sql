-- ============================================
-- MISSING DATABASE INFORMATION QUERIES
-- Run these in Supabase SQL Editor
-- ============================================

-- 1. CONTACT_MESSAGES TABLE (Missing from output)
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'contact_messages' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. ALL FOREIGN KEY RELATIONSHIPS (CRITICAL!)
SELECT
    tc.table_name AS "From Table",
    kcu.column_name AS "From Column",
    ccu.table_name AS "To Table",
    ccu.column_name AS "To Column",
    rc.update_rule AS "On Update",
    rc.delete_rule AS "On Delete"
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu
    ON tc.constraint_name = ccu.constraint_name
JOIN information_schema.referential_constraints rc
    ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- 3. ALL DATABASE TRIGGERS (Automation)
SELECT 
    event_object_table AS "Table",
    trigger_name AS "Trigger Name",
    event_manipulation AS "Event",
    action_timing AS "When (BEFORE/AFTER)",
    action_statement AS "What it does"
FROM information_schema.triggers
WHERE event_object_schema = 'public'
ORDER BY event_object_table;

-- 4. ALL FUNCTIONS/STORED PROCEDURES
SELECT 
    p.proname AS "Function Name",
    pg_get_function_arguments(p.oid) AS "Parameters",
    pg_get_functiondef(p.oid) AS "Complete Definition"
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
    AND p.proname NOT LIKE 'pg_%'
ORDER BY p.proname;

-- 5. AUTH USERS STRUCTURE (Important!)
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'users' 
    AND table_schema = 'auth'
ORDER BY ordinal_position;

-- 6. CHECK CONSTRAINTS (Validation Rules)
SELECT
    tc.table_name AS "Table",
    cc.constraint_name AS "Constraint",
    cc.check_clause AS "Validation Rule"
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc
    ON tc.constraint_name = cc.constraint_name
WHERE tc.table_schema = 'public'
    AND tc.constraint_type = 'CHECK'
ORDER BY tc.table_name;

-- 7. DEFAULT VALUES & AUTO-INCREMENT
SELECT 
    table_name,
    column_name,
    column_default,
    data_type
FROM information_schema.columns
WHERE table_schema = 'public'
    AND column_default IS NOT NULL
    AND column_default NOT IN ('now()', 'timezone(''utc''::text, now())')
ORDER BY table_name, ordinal_position;

-- 8. ENUM TYPES (If any)
SELECT 
    t.typname AS "Enum Name",
    string_agg(e.enumlabel, ', ' ORDER BY e.enumsortorder) AS "Possible Values"
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE n.nspname = 'public'
GROUP BY t.typname;

-- 9. TABLE SIZES (Storage info)
SELECT 
    schemaname AS "Schema",
    tablename AS "Table",
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS "Total Size",
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS "Table Size",
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS "Index Size"
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- 10. ROW COUNTS (Actual data)
SELECT 
    schemaname AS "Schema",
    tablename AS "Table",
    n_live_tup AS "Approximate Rows"
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY n_live_tup DESC;

-- 11. RLS STATUS FOR ALL TABLES
SELECT 
    schemaname,
    tablename,
    rowsecurity AS "RLS Enabled",
    CASE 
        WHEN rowsecurity THEN 'Protected'
        ELSE '⚠️ UNPROTECTED'
    END AS "Security Status"
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY rowsecurity, tablename;

-- 12. COMPLETE WORKFLOW CHAIN
-- This shows the relationship between new_tutor → auth.users → user_profiles → tutors
SELECT 
    'new_tutor' AS "Step 1: Application",
    'Manual Admin Review' AS "Step 2",
    'auth.users (Admin creates account)' AS "Step 3",
    'user_profiles (Admin creates profile)' AS "Step 4",
    'tutors (Admin inserts approved tutor)' AS "Step 5",
    '⚠️ NO AUTOMATIC TRIGGER - ALL MANUAL' AS "Important Note";






[
  {
    "From Table": "tuition_assignments",
    "From Column": "tuition_request_id",
    "To Table": "tuition_requests",
    "To Column": "id",
    "On Update": "NO ACTION",
    "On Delete": "CASCADE"
  },
  {
    "From Table": "tuition_assignments",
    "From Column": "tutor_id",
    "To Table": "tutors",
    "To Column": "id",
    "On Update": "NO ACTION",
    "On Delete": "CASCADE"
  },
  {
    "From Table": "tuition_requests",
    "From Column": "assigned_tutor_id",
    "To Table": "tutors",
    "To Column": "id",
    "On Update": "NO ACTION",
    "On Delete": "SET NULL"
  }
]


[
  {
    "Table": "new_tutor",
    "Trigger Name": "update_new_tutor_updated_at",
    "Event": "UPDATE",
    "When (BEFORE/AFTER)": "BEFORE",
    "What it does": "EXECUTE FUNCTION update_updated_at_column()"
  },
  {
    "Table": "tuition_requests",
    "Trigger Name": "update_tuition_requests_timestamp",
    "Event": "UPDATE",
    "When (BEFORE/AFTER)": "BEFORE",
    "What it does": "EXECUTE FUNCTION update_tuition_requests_updated_at()"
  },
  {
    "Table": "tutors",
    "Trigger Name": "update_tutors_updated_at",
    "Event": "UPDATE",
    "When (BEFORE/AFTER)": "BEFORE",
    "What it does": "EXECUTE FUNCTION update_updated_at_column()"
  },
  {
    "Table": "user_profiles",
    "Trigger Name": "update_user_profiles_timestamp",
    "Event": "UPDATE",
    "When (BEFORE/AFTER)": "BEFORE",
    "What it does": "EXECUTE FUNCTION update_user_profiles_updated_at()"
  }
]

[
  {
    "Function Name": "approve_tutor_application",
    "Parameters": "application_id uuid, admin_id uuid DEFAULT NULL::uuid",
    "Complete Definition": "CREATE OR REPLACE FUNCTION public.approve_tutor_application(application_id uuid, admin_id uuid DEFAULT NULL::uuid)\n RETURNS void\n LANGUAGE plpgsql\nAS $function$\r\nDECLARE\r\n    app_record RECORD;\r\n    user_email text;\r\nBEGIN\r\n    -- Get the application\r\n    SELECT * INTO app_record FROM new_tutor WHERE id = application_id AND status = 'pending';\r\n    \r\n    IF NOT FOUND THEN\r\n        RAISE EXCEPTION 'Application not found or already processed';\r\n    END IF;\r\n    \r\n    -- Get user email from auth.users\r\n    SELECT au.email INTO user_email \r\n    FROM auth.users au \r\n    WHERE au.id = app_record.user_id;\r\n    \r\n    -- Insert into single tutors table with all data\r\n    INSERT INTO tutors (\r\n        user_id, first_name, last_name, father_name, email,\r\n        contact, other_contact, city, state, address, postal_code,\r\n        cnic_front_url, cnic_back_url,\r\n        education, work_experience, experience_years,\r\n        subjects, mode_of_tuition,\r\n        short_bio, detailed_description,\r\n        status\r\n    ) VALUES (\r\n        app_record.user_id, \r\n        app_record.first_name, \r\n        app_record.last_name, \r\n        app_record.father_name,\r\n        user_email,\r\n        app_record.contact, \r\n        app_record.other_contact,\r\n        app_record.city, \r\n        app_record.state, \r\n        app_record.address, \r\n        app_record.postal_code,\r\n        app_record.cnic_front_url, \r\n        app_record.cnic_back_url,\r\n        app_record.education, \r\n        app_record.work_experience, \r\n        app_record.experience_years,\r\n        app_record.courses,\r\n        'Both',  -- default mode_of_tuition\r\n        app_record.short_about, \r\n        app_record.detailed_description,\r\n        'approved'\r\n    ) ON CONFLICT (user_id) DO UPDATE SET\r\n        contact = EXCLUDED.contact,\r\n        other_contact = EXCLUDED.other_contact,\r\n        city = EXCLUDED.city,\r\n        state = EXCLUDED.state,\r\n        address = EXCLUDED.address,\r\n        postal_code = EXCLUDED.postal_code,\r\n        education = EXCLUDED.education,\r\n        work_experience = EXCLUDED.work_experience,\r\n        experience_years = EXCLUDED.experience_years,\r\n        subjects = EXCLUDED.subjects,\r\n        short_bio = EXCLUDED.short_bio,\r\n        detailed_description = EXCLUDED.detailed_description,\r\n        updated_at = NOW();\r\n    \r\n    -- Update application status\r\n    UPDATE new_tutor\r\n    SET \r\n        status = 'approved',\r\n        reviewed_at = NOW(),\r\n        reviewed_by = admin_id,\r\n        updated_at = NOW()\r\n    WHERE id = application_id;\r\nEND;\r\n$function$\n"
  },
  {
    "Function Name": "handle_new_user",
    "Parameters": "",
    "Complete Definition": "CREATE OR REPLACE FUNCTION public.handle_new_user()\n RETURNS trigger\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\r\nBEGIN\r\n  INSERT INTO public.user_profiles (id, email, username, user_type, phone)\r\n  VALUES (\r\n    NEW.id,\r\n    NEW.email,\r\n    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),\r\n    COALESCE(NEW.raw_user_meta_data->>'role', 'tutor'),\r\n    NEW.phone\r\n  );\r\n  RETURN NEW;\r\nEND;\r\n$function$\n"
  },
  {
    "Function Name": "reject_tutor_application",
    "Parameters": "application_id uuid, admin_id uuid DEFAULT NULL::uuid, rejection_reason text DEFAULT NULL::text",
    "Complete Definition": "CREATE OR REPLACE FUNCTION public.reject_tutor_application(application_id uuid, admin_id uuid DEFAULT NULL::uuid, rejection_reason text DEFAULT NULL::text)\n RETURNS void\n LANGUAGE plpgsql\nAS $function$\r\nBEGIN\r\n    UPDATE new_tutor\r\n    SET \r\n        status = 'rejected',\r\n        admin_notes = rejection_reason,\r\n        reviewed_at = NOW(),\r\n        reviewed_by = admin_id,\r\n        updated_at = NOW()\r\n    WHERE id = application_id AND status = 'pending';\r\n    \r\n    IF NOT FOUND THEN\r\n        RAISE EXCEPTION 'Application not found or already processed';\r\n    END IF;\r\nEND;\r\n$function$\n"
  },
  {
    "Function Name": "update_app_stats",
    "Parameters": "",
    "Complete Definition": "CREATE OR REPLACE FUNCTION public.update_app_stats()\n RETURNS void\n LANGUAGE plpgsql\nAS $function$\r\nBEGIN\r\n  UPDATE app_stats\r\n  SET \r\n    total_tutors = (SELECT COUNT(*) FROM tutor),\r\n    total_students = (SELECT COUNT(*) FROM tuition),\r\n    updated_at = now()\r\n  WHERE id = (SELECT id FROM app_stats LIMIT 1);\r\nEND;\r\n$function$\n"
  },
  {
    "Function Name": "update_tuition_requests_updated_at",
    "Parameters": "",
    "Complete Definition": "CREATE OR REPLACE FUNCTION public.update_tuition_requests_updated_at()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\r\nBEGIN\r\n    NEW.updated_at = TIMEZONE('utc', NOW());\r\n    RETURN NEW;\r\nEND;\r\n$function$\n"
  },
  {
    "Function Name": "update_updated_at_column",
    "Parameters": "",
    "Complete Definition": "CREATE OR REPLACE FUNCTION public.update_updated_at_column()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\r\nBEGIN\r\n    NEW.updated_at = NOW();\r\n    RETURN NEW;\r\nEND;\r\n$function$\n"
  },
  {
    "Function Name": "update_user_profiles_updated_at",
    "Parameters": "",
    "Complete Definition": "CREATE OR REPLACE FUNCTION public.update_user_profiles_updated_at()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\r\nBEGIN\r\n    NEW.updated_at = timezone('utc'::text, now());\r\n    RETURN NEW;\r\nEND;\r\n$function$\n"
  }
]


[
  {
    "column_name": "instance_id",
    "data_type": "uuid",
    "is_nullable": "YES"
  },
  {
    "column_name": "id",
    "data_type": "uuid",
    "is_nullable": "NO"
  },
  {
    "column_name": "aud",
    "data_type": "character varying",
    "is_nullable": "YES"
  },
  {
    "column_name": "role",
    "data_type": "character varying",
    "is_nullable": "YES"
  },
  {
    "column_name": "email",
    "data_type": "character varying",
    "is_nullable": "YES"
  },
  {
    "column_name": "encrypted_password",
    "data_type": "character varying",
    "is_nullable": "YES"
  },
  {
    "column_name": "email_confirmed_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES"
  },
  {
    "column_name": "invited_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES"
  },
  {
    "column_name": "confirmation_token",
    "data_type": "character varying",
    "is_nullable": "YES"
  },
  {
    "column_name": "confirmation_sent_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES"
  },
  {
    "column_name": "recovery_token",
    "data_type": "character varying",
    "is_nullable": "YES"
  },
  {
    "column_name": "recovery_sent_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES"
  },
  {
    "column_name": "email_change_token_new",
    "data_type": "character varying",
    "is_nullable": "YES"
  },
  {
    "column_name": "email_change",
    "data_type": "character varying",
    "is_nullable": "YES"
  },
  {
    "column_name": "email_change_sent_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES"
  },
  {
    "column_name": "last_sign_in_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES"
  },
  {
    "column_name": "raw_app_meta_data",
    "data_type": "jsonb",
    "is_nullable": "YES"
  },
  {
    "column_name": "raw_user_meta_data",
    "data_type": "jsonb",
    "is_nullable": "YES"
  },
  {
    "column_name": "is_super_admin",
    "data_type": "boolean",
    "is_nullable": "YES"
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES"
  },
  {
    "column_name": "updated_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES"
  },
  {
    "column_name": "phone",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "column_name": "phone_confirmed_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES"
  },
  {
    "column_name": "phone_change",
    "data_type": "text",
    "is_nullable": "YES"
  },
  {
    "column_name": "phone_change_token",
    "data_type": "character varying",
    "is_nullable": "YES"
  },
  {
    "column_name": "phone_change_sent_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES"
  },
  {
    "column_name": "confirmed_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES"
  },
  {
    "column_name": "email_change_token_current",
    "data_type": "character varying",
    "is_nullable": "YES"
  },
  {
    "column_name": "email_change_confirm_status",
    "data_type": "smallint",
    "is_nullable": "YES"
  },
  {
    "column_name": "banned_until",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES"
  },
  {
    "column_name": "reauthentication_token",
    "data_type": "character varying",
    "is_nullable": "YES"
  },
  {
    "column_name": "reauthentication_sent_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES"
  },
  {
    "column_name": "is_sso_user",
    "data_type": "boolean",
    "is_nullable": "NO"
  },
  {
    "column_name": "deleted_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "YES"
  },
  {
    "column_name": "is_anonymous",
    "data_type": "boolean",
    "is_nullable": "NO"
  }
]

[
  {
    "Table": "app_stats",
    "Constraint": "2200_26388_1_not_null",
    "Validation Rule": "id IS NOT NULL"
  },
  {
    "Table": "app_stats",
    "Constraint": "2200_26388_5_not_null",
    "Validation Rule": "years_of_legacy IS NOT NULL"
  },
  {
    "Table": "app_stats",
    "Constraint": "2200_26388_4_not_null",
    "Validation Rule": "google_rating IS NOT NULL"
  },
  {
    "Table": "app_stats",
    "Constraint": "2200_26388_3_not_null",
    "Validation Rule": "total_students IS NOT NULL"
  },
  {
    "Table": "app_stats",
    "Constraint": "2200_26388_2_not_null",
    "Validation Rule": "total_tutors IS NOT NULL"
  },
  {
    "Table": "blog_posts",
    "Constraint": "2200_84099_1_not_null",
    "Validation Rule": "id IS NOT NULL"
  },
  {
    "Table": "blog_posts",
    "Constraint": "2200_84099_8_not_null",
    "Validation Rule": "category IS NOT NULL"
  },
  {
    "Table": "blog_posts",
    "Constraint": "2200_84099_5_not_null",
    "Validation Rule": "content IS NOT NULL"
  },
  {
    "Table": "blog_posts",
    "Constraint": "2200_84099_4_not_null",
    "Validation Rule": "excerpt IS NOT NULL"
  },
  {
    "Table": "blog_posts",
    "Constraint": "2200_84099_3_not_null",
    "Validation Rule": "slug IS NOT NULL"
  },
  {
    "Table": "blog_posts",
    "Constraint": "2200_84099_2_not_null",
    "Validation Rule": "title IS NOT NULL"
  },
  {
    "Table": "new_tutor",
    "Constraint": "2200_34801_11_not_null",
    "Validation Rule": "postal_code IS NOT NULL"
  },
  {
    "Table": "new_tutor",
    "Constraint": "2200_34801_1_not_null",
    "Validation Rule": "id IS NOT NULL"
  },
  {
    "Table": "new_tutor",
    "Constraint": "2200_34801_2_not_null",
    "Validation Rule": "user_id IS NOT NULL"
  },
  {
    "Table": "new_tutor",
    "Constraint": "2200_34801_3_not_null",
    "Validation Rule": "first_name IS NOT NULL"
  },
  {
    "Table": "new_tutor",
    "Constraint": "new_tutor_status_check",
    "Validation Rule": "(status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text]))"
  },
  {
    "Table": "new_tutor",
    "Constraint": "2200_34801_4_not_null",
    "Validation Rule": "last_name IS NOT NULL"
  },
  {
    "Table": "new_tutor",
    "Constraint": "2200_34801_6_not_null",
    "Validation Rule": "contact IS NOT NULL"
  },
  {
    "Table": "new_tutor",
    "Constraint": "2200_34801_8_not_null",
    "Validation Rule": "city IS NOT NULL"
  },
  {
    "Table": "new_tutor",
    "Constraint": "2200_34801_9_not_null",
    "Validation Rule": "state IS NOT NULL"
  },
  {
    "Table": "new_tutor",
    "Constraint": "2200_34801_10_not_null",
    "Validation Rule": "address IS NOT NULL"
  },
  {
    "Table": "tuition",
    "Constraint": "2200_18585_3_not_null",
    "Validation Rule": "subject IS NOT NULL"
  },
  {
    "Table": "tuition",
    "Constraint": "2200_18585_1_not_null",
    "Validation Rule": "id IS NOT NULL"
  },
  {
    "Table": "tuition",
    "Constraint": "2200_18585_11_not_null",
    "Validation Rule": "tuition_type IS NOT NULL"
  },
  {
    "Table": "tuition",
    "Constraint": "2200_18585_10_not_null",
    "Validation Rule": "city IS NOT NULL"
  },
  {
    "Table": "tuition",
    "Constraint": "2200_18585_5_not_null",
    "Validation Rule": "location IS NOT NULL"
  },
  {
    "Table": "tuition",
    "Constraint": "2200_18585_6_not_null",
    "Validation Rule": "timing IS NOT NULL"
  },
  {
    "Table": "tuition",
    "Constraint": "2200_18585_7_not_null",
    "Validation Rule": "fee IS NOT NULL"
  },
  {
    "Table": "tuition",
    "Constraint": "2200_18585_4_not_null",
    "Validation Rule": "grade IS NOT NULL"
  },
  {
    "Table": "tuition",
    "Constraint": "2200_18585_2_not_null",
    "Validation Rule": "student_name IS NOT NULL"
  },
  {
    "Table": "tuition_assignments",
    "Constraint": "2200_84225_5_not_null",
    "Validation Rule": "student_name IS NOT NULL"
  },
  {
    "Table": "tuition_assignments",
    "Constraint": "2200_84225_1_not_null",
    "Validation Rule": "id IS NOT NULL"
  },
  {
    "Table": "tuition_assignments",
    "Constraint": "2200_84225_4_not_null",
    "Validation Rule": "tutor_name IS NOT NULL"
  },
  {
    "Table": "tuition_assignments",
    "Constraint": "2200_84225_6_not_null",
    "Validation Rule": "subject IS NOT NULL"
  },
  {
    "Table": "tuition_assignments",
    "Constraint": "tuition_assignments_status_check",
    "Validation Rule": "(status = ANY (ARRAY['active'::text, 'completed'::text, 'cancelled'::text]))"
  },
  {
    "Table": "tuition_requests",
    "Constraint": "2200_58792_9_not_null",
    "Validation Rule": "subject IS NOT NULL"
  },
  {
    "Table": "tuition_requests",
    "Constraint": "2200_58792_12_not_null",
    "Validation Rule": "mode_of_tuition IS NOT NULL"
  },
  {
    "Table": "tuition_requests",
    "Constraint": "2200_58792_15_not_null",
    "Validation Rule": "status IS NOT NULL"
  },
  {
    "Table": "tuition_requests",
    "Constraint": "tuition_requests_mode_of_tuition_check",
    "Validation Rule": "(mode_of_tuition = ANY (ARRAY['home'::text, 'online'::text, 'both'::text]))"
  },
  {
    "Table": "tuition_requests",
    "Constraint": "tuition_requests_status_check",
    "Validation Rule": "(status = ANY (ARRAY['pending'::text, 'assigned'::text, 'completed'::text, 'cancelled'::text]))"
  },
  {
    "Table": "tuition_requests",
    "Constraint": "tuition_requests_preferred_gender_check",
    "Validation Rule": "(preferred_gender = ANY (ARRAY['male'::text, 'female'::text, 'no_preference'::text]))"
  },
  {
    "Table": "tuition_requests",
    "Constraint": "2200_58792_1_not_null",
    "Validation Rule": "id IS NOT NULL"
  },
  {
    "Table": "tuition_requests",
    "Constraint": "2200_58792_3_not_null",
    "Validation Rule": "name IS NOT NULL"
  },
  {
    "Table": "tuition_requests",
    "Constraint": "2200_58792_4_not_null",
    "Validation Rule": "phone IS NOT NULL"
  },
  {
    "Table": "tuition_requests",
    "Constraint": "2200_58792_6_not_null",
    "Validation Rule": "city IS NOT NULL"
  },
  {
    "Table": "tuition_requests",
    "Constraint": "2200_58792_7_not_null",
    "Validation Rule": "area IS NOT NULL"
  },
  {
    "Table": "tuition_requests",
    "Constraint": "2200_58792_8_not_null",
    "Validation Rule": "class IS NOT NULL"
  },
  {
    "Table": "tutors",
    "Constraint": "2200_35004_4_not_null",
    "Validation Rule": "last_name IS NOT NULL"
  },
  {
    "Table": "tutors",
    "Constraint": "2200_35004_6_not_null",
    "Validation Rule": "email IS NOT NULL"
  },
  {
    "Table": "tutors",
    "Constraint": "2200_35004_7_not_null",
    "Validation Rule": "contact IS NOT NULL"
  },
  {
    "Table": "tutors",
    "Constraint": "2200_35004_9_not_null",
    "Validation Rule": "city IS NOT NULL"
  },
  {
    "Table": "tutors",
    "Constraint": "2200_35004_11_not_null",
    "Validation Rule": "address IS NOT NULL"
  },
  {
    "Table": "tutors",
    "Constraint": "2200_35004_10_not_null",
    "Validation Rule": "state IS NOT NULL"
  },
  {
    "Table": "tutors",
    "Constraint": "tutors_status_check",
    "Validation Rule": "(status = ANY (ARRAY['approved'::text, 'rejected'::text]))"
  },
  {
    "Table": "tutors",
    "Constraint": "2200_35004_12_not_null",
    "Validation Rule": "postal_code IS NOT NULL"
  },
  {
    "Table": "tutors",
    "Constraint": "2200_35004_1_not_null",
    "Validation Rule": "id IS NOT NULL"
  },
  {
    "Table": "tutors",
    "Constraint": "2200_35004_2_not_null",
    "Validation Rule": "user_id IS NOT NULL"
  },
  {
    "Table": "tutors",
    "Constraint": "2200_35004_3_not_null",
    "Validation Rule": "first_name IS NOT NULL"
  },
  {
    "Table": "user_profiles",
    "Constraint": "2200_34170_1_not_null",
    "Validation Rule": "id IS NOT NULL"
  },
  {
    "Table": "user_profiles",
    "Constraint": "user_profiles_user_type_check",
    "Validation Rule": "(user_type = ANY (ARRAY['parent'::text, 'tutor'::text]))"
  },
  {
    "Table": "user_profiles",
    "Constraint": "2200_34170_3_not_null",
    "Validation Rule": "username IS NOT NULL"
  },
  {
    "Table": "user_profiles",
    "Constraint": "2200_34170_4_not_null",
    "Validation Rule": "user_type IS NOT NULL"
  },
  {
    "Table": "user_profiles",
    "Constraint": "2200_34170_7_not_null",
    "Validation Rule": "is_active IS NOT NULL"
  },
  {
    "Table": "user_profiles",
    "Constraint": "2200_34170_2_not_null",
    "Validation Rule": "email IS NOT NULL"
  },
  {
    "Table": "user_profiles",
    "Constraint": "2200_34170_8_not_null",
    "Validation Rule": "email_verified IS NOT NULL"
  }
]


[
  {
    "table_name": "app_stats",
    "column_name": "id",
    "column_default": "gen_random_uuid()",
    "data_type": "uuid"
  },
  {
    "table_name": "app_stats",
    "column_name": "total_tutors",
    "column_default": "0",
    "data_type": "integer"
  },
  {
    "table_name": "app_stats",
    "column_name": "total_students",
    "column_default": "0",
    "data_type": "integer"
  },
  {
    "table_name": "app_stats",
    "column_name": "google_rating",
    "column_default": "4.5",
    "data_type": "numeric"
  },
  {
    "table_name": "app_stats",
    "column_name": "years_of_legacy",
    "column_default": "9",
    "data_type": "integer"
  },
  {
    "table_name": "blog_posts",
    "column_name": "id",
    "column_default": "gen_random_uuid()",
    "data_type": "uuid"
  },
  {
    "table_name": "blog_posts",
    "column_name": "author",
    "column_default": "'Admin'::text",
    "data_type": "text"
  },
  {
    "table_name": "new_tutor",
    "column_name": "id",
    "column_default": "gen_random_uuid()",
    "data_type": "uuid"
  },
  {
    "table_name": "new_tutor",
    "column_name": "education",
    "column_default": "'[]'::jsonb",
    "data_type": "jsonb"
  },
  {
    "table_name": "new_tutor",
    "column_name": "work_experience",
    "column_default": "'[]'::jsonb",
    "data_type": "jsonb"
  },
  {
    "table_name": "new_tutor",
    "column_name": "experience_years",
    "column_default": "0",
    "data_type": "integer"
  },
  {
    "table_name": "new_tutor",
    "column_name": "courses",
    "column_default": "ARRAY[]::text[]",
    "data_type": "ARRAY"
  },
  {
    "table_name": "new_tutor",
    "column_name": "status",
    "column_default": "'pending'::text",
    "data_type": "text"
  },
  {
    "table_name": "tuition",
    "column_name": "id",
    "column_default": "gen_random_uuid()",
    "data_type": "uuid"
  },
  {
    "table_name": "tuition",
    "column_name": "city",
    "column_default": "''::text",
    "data_type": "text"
  },
  {
    "table_name": "tuition",
    "column_name": "tuition_type",
    "column_default": "'Home Tuition'::text",
    "data_type": "text"
  },
  {
    "table_name": "tuition_assignments",
    "column_name": "id",
    "column_default": "gen_random_uuid()",
    "data_type": "uuid"
  },
  {
    "table_name": "tuition_assignments",
    "column_name": "status",
    "column_default": "'active'::text",
    "data_type": "text"
  },
  {
    "table_name": "tuition_requests",
    "column_name": "id",
    "column_default": "gen_random_uuid()",
    "data_type": "uuid"
  },
  {
    "table_name": "tuition_requests",
    "column_name": "status",
    "column_default": "'pending'::text",
    "data_type": "text"
  },
  {
    "table_name": "tutors",
    "column_name": "id",
    "column_default": "gen_random_uuid()",
    "data_type": "uuid"
  },
  {
    "table_name": "tutors",
    "column_name": "education",
    "column_default": "'[]'::jsonb",
    "data_type": "jsonb"
  },
  {
    "table_name": "tutors",
    "column_name": "work_experience",
    "column_default": "'[]'::jsonb",
    "data_type": "jsonb"
  },
  {
    "table_name": "tutors",
    "column_name": "experience_years",
    "column_default": "0",
    "data_type": "integer"
  },
  {
    "table_name": "tutors",
    "column_name": "subjects",
    "column_default": "ARRAY[]::text[]",
    "data_type": "ARRAY"
  },
  {
    "table_name": "tutors",
    "column_name": "mode_of_tuition",
    "column_default": "'Both'::text",
    "data_type": "text"
  },
  {
    "table_name": "tutors",
    "column_name": "status",
    "column_default": "'approved'::text",
    "data_type": "text"
  },
  {
    "table_name": "user_profiles",
    "column_name": "is_active",
    "column_default": "true",
    "data_type": "boolean"
  },
  {
    "table_name": "user_profiles",
    "column_name": "email_verified",
    "column_default": "false",
    "data_type": "boolean"
  }
]


[
  {
    "Schema": "public",
    "Table": "user_profiles",
    "Total Size": "128 kB",
    "Table Size": "8192 bytes",
    "Index Size": "120 kB"
  },
  {
    "Schema": "public",
    "Table": "tutors",
    "Total Size": "128 kB",
    "Table Size": "8192 bytes",
    "Index Size": "120 kB"
  },
  {
    "Schema": "public",
    "Table": "tuition_requests",
    "Total Size": "112 kB",
    "Table Size": "8192 bytes",
    "Index Size": "104 kB"
  },
  {
    "Schema": "public",
    "Table": "blog_posts",
    "Total Size": "96 kB",
    "Table Size": "8192 bytes",
    "Index Size": "88 kB"
  },
  {
    "Schema": "public",
    "Table": "new_tutor",
    "Total Size": "96 kB",
    "Table Size": "8192 bytes",
    "Index Size": "88 kB"
  },
  {
    "Schema": "public",
    "Table": "tuition_assignments",
    "Total Size": "40 kB",
    "Table Size": "0 bytes",
    "Index Size": "40 kB"
  },
  {
    "Schema": "public",
    "Table": "tuition",
    "Total Size": "32 kB",
    "Table Size": "8192 bytes",
    "Index Size": "24 kB"
  },
  {
    "Schema": "public",
    "Table": "app_stats",
    "Total Size": "24 kB",
    "Table Size": "8192 bytes",
    "Index Size": "16 kB"
  }
]


Error: Failed to run sql query: ERROR: 42703: column "tablename" does not exist LINE 3: tablename AS "Table", ^

Note: A limit of 100 was applied to your query. If this was the cause of a syntax error, try selecting "No limit" instead and re-run the query.


[
  {
    "schemaname": "public",
    "tablename": "app_stats",
    "RLS Enabled": true,
    "Security Status": "Protected"
  },
  {
    "schemaname": "public",
    "tablename": "blog_posts",
    "RLS Enabled": true,
    "Security Status": "Protected"
  },
  {
    "schemaname": "public",
    "tablename": "new_tutor",
    "RLS Enabled": true,
    "Security Status": "Protected"
  },
  {
    "schemaname": "public",
    "tablename": "tuition",
    "RLS Enabled": true,
    "Security Status": "Protected"
  },
  {
    "schemaname": "public",
    "tablename": "tuition_assignments",
    "RLS Enabled": true,
    "Security Status": "Protected"
  },
  {
    "schemaname": "public",
    "tablename": "tuition_requests",
    "RLS Enabled": true,
    "Security Status": "Protected"
  },
  {
    "schemaname": "public",
    "tablename": "tutors",
    "RLS Enabled": true,
    "Security Status": "Protected"
  },
  {
    "schemaname": "public",
    "tablename": "user_profiles",
    "RLS Enabled": true,
    "Security Status": "Protected"
  }
]



[
  {
    "Step 1: Application": "new_tutor",
    "Step 2": "Manual Admin Review",
    "Step 3": "auth.users (Admin creates account)",
    "Step 4": "user_profiles (Admin creates profile)",
    "Step 5": "tutors (Admin inserts approved tutor)",
    "Important Note": "⚠️ NO AUTOMATIC TRIGGER - ALL MANUAL"
  }
]


