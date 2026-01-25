-- ===============================================
-- COMPLETE DATABASE SETUP FOR APNATUITION
-- Run this ONCE on fresh Supabase project
-- ===============================================

-- This file includes all necessary tables:
-- 1. user_profiles
-- 2. tutors (approved)
-- 3. new_tutor (pending applications)
-- 4. tuition
-- 5. tuition_requests
-- 6. blog_posts
-- Plus all RLS policies and functions

-- ===============================================
-- STEP 1: USER PROFILES
-- ===============================================

-- Note: This assumes the complete_database_structure migration has been run
-- If not, first run: 20251109000002_complete_database_structure.sql

-- ===============================================
-- STEP 2: TUITION REQUESTS TABLE
-- ===============================================

-- Create tuition_requests table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.tuition_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    parent_name TEXT NOT NULL,
    parent_phone TEXT NOT NULL,
    parent_email TEXT,
    student_name TEXT NOT NULL,
    student_class TEXT NOT NULL,
    subjects TEXT[] NOT NULL,
    tuition_type TEXT NOT NULL CHECK (tuition_type IN ('home', 'online', 'both')),
    address TEXT,
    city TEXT NOT NULL,
    budget_min INTEGER,
    budget_max INTEGER,
    preferred_days TEXT[],
    preferred_time TEXT,
    additional_requirements TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.tuition_requests ENABLE ROW LEVEL SECURITY;

-- Create index
CREATE INDEX IF NOT EXISTS idx_tuition_requests_status ON public.tuition_requests(status);
CREATE INDEX IF NOT EXISTS idx_tuition_requests_city ON public.tuition_requests(city);
CREATE INDEX IF NOT EXISTS idx_tuition_requests_created_at ON public.tuition_requests(created_at DESC);

-- RLS Policies for tuition_requests
DROP POLICY IF EXISTS "Anyone can submit tuition requests" ON public.tuition_requests;
CREATE POLICY "Anyone can submit tuition requests"
    ON public.tuition_requests
    FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view all tuition requests" ON public.tuition_requests;
CREATE POLICY "Admins can view all tuition requests"
    ON public.tuition_requests
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins can update tuition requests" ON public.tuition_requests;
CREATE POLICY "Admins can update tuition requests"
    ON public.tuition_requests
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- ===============================================
-- STEP 3: BLOG POSTS TABLE
-- ===============================================

-- Create blog posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    author TEXT DEFAULT 'Admin',
    category TEXT NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes on blog_posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at DESC);

-- Enable Row Level Security
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for blog_posts
DROP POLICY IF EXISTS "Blog posts are viewable by everyone" ON public.blog_posts;
CREATE POLICY "Blog posts are viewable by everyone" 
    ON public.blog_posts
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Only admins can insert blog posts" ON public.blog_posts;
CREATE POLICY "Only admins can insert blog posts"
    ON public.blog_posts
    FOR INSERT
    WITH CHECK (
        auth.role() = 'authenticated' 
        AND EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Only admins can update blog posts" ON public.blog_posts;
CREATE POLICY "Only admins can update blog posts"
    ON public.blog_posts
    FOR UPDATE
    USING (
        auth.role() = 'authenticated' 
        AND EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Only admins can delete blog posts" ON public.blog_posts;
CREATE POLICY "Only admins can delete blog posts"
    ON public.blog_posts
    FOR DELETE
    USING (
        auth.role() = 'authenticated' 
        AND EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- ===============================================
-- STEP 4: INSERT SAMPLE BLOG POSTS
-- ===============================================

-- Only insert if table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.blog_posts LIMIT 1) THEN
        INSERT INTO public.blog_posts (title, slug, excerpt, content, image_url, category) VALUES
        (
            'STEM vs Humanities in Pakistan – Career Paths, Salaries & Future Trends',
            'stem-vs-humanities-pakistan',
            'Explore the differences between STEM and Humanities fields in Pakistan, including career opportunities, salary expectations, and future trends in both sectors.',
            '<p>Choosing between STEM (Science, Technology, Engineering, Mathematics) and Humanities can be one of the most critical decisions in a student''s academic journey. In Pakistan, this choice often determines not just career paths but also future earning potential and job security.</p><h2>Understanding STEM Fields</h2><p>STEM fields in Pakistan include Computer Science, Engineering, Medicine, Mathematics, and Physics. These fields are typically associated with higher starting salaries, more job opportunities in the growing tech sector, and international career prospects.</p><h2>Exploring Humanities</h2><p>Humanities include disciplines like Literature, History, Political Science, and Social Sciences. These fields offer critical thinking skills, understanding of society and culture, and careers in media, education, law, and public policy.</p>',
            'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200',
            'Education'
        ),
        (
            'University vs. Vocational Training in Pakistan: Which Path Leads to Success?',
            'university-vs-vocational-training',
            'Should you pursue a university degree or vocational training? We compare both paths to help you make an informed decision about your future career.',
            '<p>The debate between university education and vocational training continues to be relevant in Pakistan''s evolving job market. Each path offers unique advantages and challenges.</p>',
            'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200',
            'Career'
        ),
        (
            'Starting Quran Memorization: Age, Methods & Tips',
            'quran-memorization-guide',
            'Learn about the best age to start Quran memorization, proven methods, and practical tips for parents and students to make the journey easier.',
            '<p>Memorizing the Quran is a blessed journey that requires dedication, patience, and the right approach. This guide covers everything you need to know about starting this noble endeavor.</p>',
            'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=1200',
            'Islamic Studies'
        ),
        (
            'Finding Balance in a Hyperconnected World',
            'balance-hyperconnected-world',
            'How to maintain work-life balance and mental health in today''s digital age with practical strategies for students and professionals.',
            '<p>In our hyperconnected world, finding balance has become more challenging yet more important than ever. This article explores practical strategies for maintaining mental health and productivity.</p>',
            'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200',
            'Lifestyle'
        ),
        (
            'The Prophet ﷺ as the Ultimate Teacher: Lessons in Education',
            'prophet-ultimate-teacher',
            'Discover the teaching methods of Prophet Muhammad (PBUH) and how they can be applied in modern education to inspire effective learning.',
            '<p>Prophet Muhammad (peace be upon him) was not only a messenger but also the greatest teacher humanity has ever known. His teaching methods remain relevant for modern educators.</p>',
            'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1200',
            'Islamic Studies'
        ),
        (
            'How Social Media Impacts Student Performance',
            'social-media-impacts-students',
            'Understanding the effects of social media on academic performance and how to use it positively for educational growth.',
            '<p>Social media has become an integral part of students'' lives, but its impact on academic performance is a growing concern. This article explores both positive and negative effects.</p>',
            'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200',
            'Technology'
        );
    END IF;
END $$;

-- ===============================================
-- VERIFICATION QUERIES
-- ===============================================

-- Run these queries to verify everything is working:

-- Check if all tables exist:
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('user_profiles', 'tutors', 'new_tutor', 'tuition', 'tuition_requests', 'blog_posts')
ORDER BY table_name;

-- Check blog posts count:
SELECT COUNT(*) as blog_count FROM public.blog_posts;

-- Check tuition requests table:
SELECT COUNT(*) as request_count FROM public.tuition_requests;

-- ===============================================
-- SETUP COMPLETE!
-- ===============================================
