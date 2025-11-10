-- Complete database structure for Tutor Hub
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. USER PROFILES TABLE (Basic user info)
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid NOT NULL,
  email text NOT NULL,
  username text NOT NULL,
  user_type text NOT NULL,
  avatar_url text NULL,
  phone text NULL,
  is_active boolean NOT NULL DEFAULT true,
  email_verified boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT user_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT user_profiles_email_key UNIQUE (email),
  CONSTRAINT user_profiles_username_key UNIQUE (username),
  CONSTRAINT user_profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT user_profiles_user_type_check CHECK (user_type = ANY (ARRAY['parent'::text, 'tutor'::text]))
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON public.user_profiles USING btree (username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_type ON public.user_profiles USING btree (user_type);
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_active ON public.user_profiles USING btree (is_active);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles USING btree (email);

-- Trigger function for user_profiles
CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_user_profiles_timestamp ON user_profiles;
CREATE TRIGGER update_user_profiles_timestamp
BEFORE UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION update_user_profiles_updated_at();

-- Trigger function to auto-create user_profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, username, user_type, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'tutor'),
    NEW.phone
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2. NEW_TUTOR TABLE (Pending applications)
-- ============================================
CREATE TABLE IF NOT EXISTS public.new_tutor (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  father_name text NULL,
  contact text NOT NULL,
  other_contact text NULL,
  city text NOT NULL,
  state text NOT NULL,
  address text NOT NULL,
  postal_code text NOT NULL,
  cnic_front_url text NULL,
  cnic_back_url text NULL,
  education jsonb NULL DEFAULT '[]'::jsonb,
  work_experience jsonb NULL DEFAULT '[]'::jsonb,
  experience_years integer NULL DEFAULT 0,
  courses text[] NULL DEFAULT ARRAY[]::text[],
  short_about text NULL,
  detailed_description text NULL,
  status text NULL DEFAULT 'pending'::text,
  admin_notes text NULL,
  reviewed_at timestamp with time zone NULL,
  reviewed_by uuid NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT new_tutor_pkey PRIMARY KEY (id),
  CONSTRAINT new_tutor_user_id_key UNIQUE (user_id),
  CONSTRAINT new_tutor_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT new_tutor_status_check CHECK (status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text]))
);

CREATE INDEX IF NOT EXISTS idx_new_tutor_user_id ON public.new_tutor USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_new_tutor_status ON public.new_tutor USING btree (status);
CREATE INDEX IF NOT EXISTS idx_new_tutor_created_at ON public.new_tutor USING btree (created_at DESC);

DROP TRIGGER IF EXISTS update_new_tutor_updated_at ON new_tutor;
CREATE TRIGGER update_new_tutor_updated_at
BEFORE UPDATE ON new_tutor
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 3. TUTORS TABLE (Single unified table for all tutor data)
-- ============================================
-- Drop old table structure if it exists
DROP TABLE IF EXISTS public.tutors CASCADE;

CREATE TABLE public.tutors (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  
  -- Basic Info (Non-editable after approval)
  first_name text NOT NULL,
  last_name text NOT NULL,
  father_name text NULL,
  email text NOT NULL,
  
  -- Contact Info (Editable)
  contact text NOT NULL,
  other_contact text NULL,
  
  -- Location (Editable)
  city text NOT NULL,
  state text NOT NULL,
  address text NOT NULL,
  postal_code text NOT NULL,
  
  -- Documents (Non-editable)
  cnic_front_url text NULL,
  cnic_back_url text NULL,
  
  -- Education & Experience (Editable in profile)
  education jsonb NULL DEFAULT '[]'::jsonb,
  work_experience jsonb NULL DEFAULT '[]'::jsonb,
  experience_years integer NULL DEFAULT 0,
  
  -- Subjects & Teaching (Editable in profile)
  subjects text[] NULL DEFAULT ARRAY[]::text[],
  mode_of_tuition text NULL DEFAULT 'Both'::text,
  
  -- Bio & Description (Editable in profile)
  short_bio text NULL,
  detailed_description text NULL,
  
  -- Profile Picture (Editable)
  profile_picture text NULL,
  
  -- Status
  status text NULL DEFAULT 'approved'::text,
  
  -- Timestamps
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  
  CONSTRAINT tutors_pkey PRIMARY KEY (id),
  CONSTRAINT tutors_user_id_key UNIQUE (user_id),
  CONSTRAINT tutors_email_key UNIQUE (email),
  CONSTRAINT tutors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT tutors_status_check CHECK (status = ANY (ARRAY['approved'::text, 'rejected'::text]))
);

CREATE INDEX IF NOT EXISTS idx_tutors_user_id ON public.tutors USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_tutors_email ON public.tutors USING btree (email);
CREATE INDEX IF NOT EXISTS idx_tutors_status ON public.tutors USING btree (status);
CREATE INDEX IF NOT EXISTS idx_tutors_city ON public.tutors USING btree (city);

DROP TRIGGER IF EXISTS update_tutors_updated_at ON tutors;
CREATE TRIGGER update_tutors_updated_at
BEFORE UPDATE ON tutors
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. HELPER FUNCTIONS
-- ============================================

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to approve tutor application
CREATE OR REPLACE FUNCTION approve_tutor_application(application_id uuid, admin_id uuid DEFAULT NULL)
RETURNS void AS $$
DECLARE
    app_record RECORD;
    user_email text;
BEGIN
    -- Get the application
    SELECT * INTO app_record FROM new_tutor WHERE id = application_id AND status = 'pending';
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Application not found or already processed';
    END IF;
    
    -- Get user email from auth.users
    SELECT au.email INTO user_email 
    FROM auth.users au 
    WHERE au.id = app_record.user_id;
    
    -- Insert into single tutors table with all data
    INSERT INTO tutors (
        user_id, first_name, last_name, father_name, email,
        contact, other_contact, city, state, address, postal_code,
        cnic_front_url, cnic_back_url,
        education, work_experience, experience_years,
        subjects, mode_of_tuition,
        short_bio, detailed_description,
        status
    ) VALUES (
        app_record.user_id, 
        app_record.first_name, 
        app_record.last_name, 
        app_record.father_name,
        user_email,
        app_record.contact, 
        app_record.other_contact,
        app_record.city, 
        app_record.state, 
        app_record.address, 
        app_record.postal_code,
        app_record.cnic_front_url, 
        app_record.cnic_back_url,
        app_record.education, 
        app_record.work_experience, 
        app_record.experience_years,
        app_record.courses,
        'Both',  -- default mode_of_tuition
        app_record.short_about, 
        app_record.detailed_description,
        'approved'
    ) ON CONFLICT (user_id) DO UPDATE SET
        contact = EXCLUDED.contact,
        other_contact = EXCLUDED.other_contact,
        city = EXCLUDED.city,
        state = EXCLUDED.state,
        address = EXCLUDED.address,
        postal_code = EXCLUDED.postal_code,
        education = EXCLUDED.education,
        work_experience = EXCLUDED.work_experience,
        experience_years = EXCLUDED.experience_years,
        subjects = EXCLUDED.subjects,
        short_bio = EXCLUDED.short_bio,
        detailed_description = EXCLUDED.detailed_description,
        updated_at = NOW();
    
    -- Update application status
    UPDATE new_tutor
    SET 
        status = 'approved',
        reviewed_at = NOW(),
        reviewed_by = admin_id,
        updated_at = NOW()
    WHERE id = application_id;
END;
$$ LANGUAGE plpgsql;

-- Function to reject tutor application
CREATE OR REPLACE FUNCTION reject_tutor_application(application_id uuid, admin_id uuid DEFAULT NULL, rejection_reason text DEFAULT NULL)
RETURNS void AS $$
BEGIN
    UPDATE new_tutor
    SET 
        status = 'rejected',
        admin_notes = rejection_reason,
        reviewed_at = NOW(),
        reviewed_by = admin_id,
        updated_at = NOW()
    WHERE id = application_id AND status = 'pending';
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Application not found or already processed';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 6. ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE new_tutor ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutors ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Anyone can insert user profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can read own application" ON new_tutor;
DROP POLICY IF EXISTS "Users can insert own application" ON new_tutor;
DROP POLICY IF EXISTS "Users can update own pending application" ON new_tutor;
DROP POLICY IF EXISTS "Anyone can read approved tutors" ON tutors;
DROP POLICY IF EXISTS "Users can read own tutor data" ON tutors;
DROP POLICY IF EXISTS "Users can update own tutor profile" ON tutors;

-- User Profiles Policies
CREATE POLICY "Users can read own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Anyone can insert user profile" ON user_profiles FOR INSERT WITH CHECK (true);

-- New Tutor Policies (pending applications)
CREATE POLICY "Users can read own application" ON new_tutor FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own application" ON new_tutor FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pending application" ON new_tutor FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Tutors Policies (single table for all tutor data)
CREATE POLICY "Anyone can read approved tutors" ON tutors FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can read own tutor data" ON tutors FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own tutor profile" ON tutors FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- 7. STORAGE BUCKETS
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('tutor-documents', 'tutor-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies
DROP POLICY IF EXISTS "Tutors can upload own documents" ON storage.objects;
DROP POLICY IF EXISTS "Tutors can read own documents" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can read documents" ON storage.objects;

-- Storage policies
CREATE POLICY "Tutors can upload own documents"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'tutor-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Tutors can read own documents"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'tutor-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Anyone can read documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'tutor-documents');
