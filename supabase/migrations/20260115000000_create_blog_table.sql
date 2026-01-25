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

-- Create index on slug for faster lookups
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);

-- Create index on category for filtering
CREATE INDEX idx_blog_posts_category ON public.blog_posts(category);

-- Create index on published_at for sorting
CREATE INDEX idx_blog_posts_published_at ON public.blog_posts(published_at DESC);

-- Enable Row Level Security
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Anyone can read published blog posts
CREATE POLICY "Blog posts are viewable by everyone" 
    ON public.blog_posts
    FOR SELECT
    USING (true);

-- No one can insert/update/delete through app (only through SQL Editor)
-- This keeps blogs secure - you'll add them manually when needed

-- Insert some sample blog posts
INSERT INTO public.blog_posts (title, slug, excerpt, content, image_url, category) VALUES
(
    'STEM vs Humanities in Pakistan – Career Paths, Salaries & Future Trends',
    'stem-vs-humanities-pakistan',
    'Explore the differences between STEM and Humanities fields in Pakistan, including career opportunities, salary expectations, and future trends in both sectors.',
    '<p>Choosing between STEM (Science, Technology, Engineering, Mathematics) and Humanities can be one of the most critical decisions in a student''s academic journey. In Pakistan, this choice often determines not just career paths but also future earning potential and job security.</p><h2>Understanding STEM Fields</h2><p>STEM fields in Pakistan include Computer Science, Engineering, Medicine, Mathematics, and Physics.</p>',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200',
    'Education'
),
(
    'University vs. Vocational Training in Pakistan: Which Path Leads to Success?',
    'university-vs-vocational-training',
    'Should you pursue a university degree or vocational training? We compare both paths to help you make an informed decision about your future career.',
    '<p>The debate between university education and vocational training continues to be relevant in Pakistan''s evolving job market.</p>',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200',
    'Career'
),
(
    'Starting Quran Memorization: Age, Methods & Tips',
    'quran-memorization-guide',
    'Learn about the best age to start Quran memorization, proven methods, and practical tips for parents and students to make the journey easier.',
    '<p>Memorizing the Quran is a blessed journey that requires dedication, patience, and the right approach.</p>',
    'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=1200',
    'Islamic Studies'
),
(
    'Finding Balance in a Hyperconnected World',
    'balance-hyperconnected-world',
    'How to maintain work-life balance and mental health in today''s digital age with practical strategies for students and professionals.',
    '<p>In our hyperconnected world, finding balance has become more challenging yet more important than ever.</p>',
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200',
    'Lifestyle'
),
(
    'The Prophet ﷺ as the Ultimate Teacher: Lessons in Education',
    'prophet-ultimate-teacher',
    'Discover the teaching methods of Prophet Muhammad (PBUH) and how they can be applied in modern education to inspire effective learning.',
    '<p>Prophet Muhammad (peace be upon him) was not only a messenger but also the greatest teacher humanity has ever known.</p>',
    'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1200',
    'Islamic Studies'
),
(
    'How Social Media Impacts Student Performance',
    'social-media-impacts-students',
    'Understanding the effects of social media on academic performance and how to use it positively for educational growth.',
    '<p>Social media has become an integral part of students'' lives, but its impact on academic performance is a growing concern.</p>',
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200',
    'Technology'
);
