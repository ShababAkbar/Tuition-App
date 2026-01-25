import { useNavigate, useParams } from "react-router-dom";
import { Calendar, User, ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";
import { useState, useEffect } from "react";

// Blog data - should match Blog.tsx data
const allBlogs = [
  {
    id: "1",
    title: "How to Choose the Right Tutor for Your Child in Pakistan",
    excerpt: "Finding the perfect tutor can transform your child's academic journey. Learn the essential factors to consider when selecting a home tutor...",
    content: `Finding the right tutor for your child is one of the most important decisions you'll make as a parent. In Pakistan's competitive educational landscape, a good tutor can be the difference between struggling with subjects and achieving academic excellence.

Understanding Your Child's Needs

Before you start searching for a tutor, take time to understand exactly what your child needs. Is it help with a specific subject like mathematics or science? Do they need support with exam preparation for O-Levels or A-Levels? Or perhaps they're struggling with foundational concepts that need reinforcement?

Different students have different learning styles. Some children are visual learners who benefit from diagrams and demonstrations, while others are auditory learners who grasp concepts better through verbal explanations. Understanding your child's learning style will help you find a tutor whose teaching methods align with how your child learns best.

Qualifications Matter

When evaluating potential tutors, their educational background should be your first consideration. Look for tutors who have:

- Strong academic credentials in the subject they teach
- Relevant teaching certifications or experience
- Experience with your child's specific curriculum (Cambridge, Federal Board, etc.)
- Proven track record with students at your child's level

Don't hesitate to ask for credentials and references. Professional tutors will be happy to share their qualifications and success stories.

**Teaching Experience and Style**

Experience matters, but it's not just about years. A tutor who has successfully taught hundreds of students over five years brings valuable insights into common challenges students face and proven strategies to overcome them.

Ask potential tutors about their teaching methodology. Do they:
- Customize lessons based on individual student needs?
- Provide regular progress assessments?
- Communicate with parents about student performance?
- Offer additional support materials and practice exercises?

Trial Sessions Are Essential

Never commit to a tutor without a trial session. This allows you to observe:
- How the tutor interacts with your child
- Whether they can explain complex concepts in simple terms
- If your child feels comfortable asking questions
- The tutor's punctuality and professionalism

Most quality tutors on platforms like ApnaTuition offer free or low-cost trial sessions. Use this opportunity wisely.

Location and Schedule Flexibility

Consider practical factors like:
- Travel distance if it's in-person tutoring
- Traffic patterns in your city (especially relevant in Karachi and Lahore)
- The tutor's availability matching your child's schedule
- Backup plans for holidays or emergencies

Online tutoring has become increasingly popular, offering flexibility and access to specialized tutors regardless of location.

Investment in Your Child's Future

While budget is important, remember that quality education is an investment in your child's future. The right tutor doesn't just improve grades – they build confidence, develop study skills, and instill a love of learning that lasts a lifetime.

At ApnaTuition, we carefully vet all our tutors to ensure they meet high standards of qualification, experience, and teaching excellence. Our platform makes it easy to find, compare, and connect with the perfect tutor for your child's unique needs.`,
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200",
    author: "Shabab Akbar, Founder & CEO",
    date: "January 20, 2026",
    readTime: "6 min read",
    category: "Education Tips",
    slug: "how-to-choose-right-tutor"
  },
  {
    id: "2",
    title: "O-Level & A-Level Exam Preparation: A Complete Guide for Pakistani Students",
    excerpt: "Comprehensive strategies to excel in Cambridge O-Level and A-Level examinations, from study techniques to exam day tips...",
    content: `The Cambridge O-Level and A-Level examinations represent a critical milestone in every student's academic journey in Pakistan. These internationally recognized qualifications open doors to top universities worldwide, but success requires strategic preparation and dedication.

Understanding the Cambridge System

The Cambridge examination system differs significantly from traditional rote-learning approaches. These exams test:
- Critical thinking and analytical skills
- Application of knowledge to real-world scenarios
- Clear, structured written communication
- Time management and exam techniques

Success requires more than just memorizing textbooks – it demands deep understanding and the ability to apply concepts.

Creating Your Study Schedule

Start preparing at least 6-8 months before your exams. Break down your preparation into phases:

Phase 1: Foundation Building (3-4 months before exams)
- Complete your syllabus coverage
- Create comprehensive notes for each subject
- Identify weak areas that need extra attention
- Build a strong conceptual understanding

Phase 2: Practice and Application (2-3 months before exams)
- Solve past papers from the last 10 years
- Practice mark scheme based answering
- Time yourself to improve speed
- Review and understand examiner reports

Phase 3: Revision and Fine-tuning (Final month)
- Quick revision of all topics
- Focus on high-weightage areas
- Solve recent past papers under exam conditions
- Work on exam techniques and time management

Subject-Specific Strategies

Sciences (Physics, Chemistry, Biology):
- Master the practical component thoroughly
- Understand question patterns in theory papers
- Practice numerical problems daily
- Create formula sheets for quick revision

Mathematics:
- Practice is key – solve at least 2 papers weekly
- Understand concepts, don't just memorize formulas
- Focus on time management
- Review mistakes carefully

Languages (English, Urdu):
- Read extensively to improve comprehension
- Practice essay writing regularly
- Build vocabulary systematically
- Analyze sample answers from mark schemes

Social Sciences (Economics, Business Studies, Pak Studies):
- Create mind maps for complex topics
- Use real-world examples in answers
- Understand case study analysis techniques
- Practice structured answer writing

The Role of Quality Tutoring

Even the brightest students benefit from expert guidance. A qualified tutor can:
- Clarify difficult concepts quickly
- Provide personalized study strategies
- Offer regular mock tests and feedback
- Keep you motivated during challenging times

At ApnaTuition, our Cambridge-specialized tutors have helped hundreds of students achieve A* grades. They understand exactly what examiners look for and teach you how to structure answers for maximum marks.

Exam Day Success

On exam day, remember to:
- Arrive early to stay calm and composed
- Read questions carefully before answering
- Manage your time – don't spend too long on any question
- Attempt all questions, even if you're unsure
- Review your answers if time permits

Mental Health Matters

Exam stress is real. Take care of your mental health by:
- Getting 7-8 hours of sleep nightly
- Taking regular study breaks
- Exercising to reduce stress
- Talking to parents or counselors about anxiety

Remember, these exams are important, but they don't define your worth. With proper preparation, strategic studying, and expert support, you can achieve your target grades and unlock exciting opportunities for your future.`,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200",
    author: "Shabab Akbar, Founder & CEO",
    date: "January 15, 2026",
    readTime: "8 min read",
    category: "Exam Preparation",
    slug: "olevel-alevel-exam-guide"
  },
  {
    id: "3",
    title: "The Rise of Online Tutoring in Pakistan: Benefits and Best Practices",
    excerpt: "Online tutoring has revolutionized education in Pakistan. Discover how virtual learning is making quality education accessible to everyone...",
    content: `The COVID-19 pandemic accelerated a transformation that was already underway – the shift from traditional classroom-based tutoring to online learning. In Pakistan, online tutoring has emerged as a powerful solution that addresses many challenges of our educational system.

Why Online Tutoring is Growing in Pakistan

Several factors have contributed to the explosive growth of online tutoring across Pakistani cities:

Access to Expert Tutors
Geography is no longer a barrier. A student in Multan can now learn from a top Cambridge specialist based in Lahore or Karachi. This democratization of access to quality education is revolutionary for students in smaller cities who previously had limited tutor options.

Cost-Effectiveness
Online tutoring eliminates travel costs for both students and tutors. This often results in lower fees while maintaining – or even improving – the quality of instruction. Students can access premium education without the premium price tag associated with travel and location-based services.

Flexibility and Convenience
Online sessions can be scheduled around family commitments, after-school activities, and other responsibilities. Recorded sessions allow students to review difficult concepts multiple times, reinforcing learning at their own pace.

Safety and Comfort
Parents appreciate the safety of home-based learning. There's no need to worry about traffic, late-night travel, or allowing unknown individuals into your home. Students can learn in their comfortable, familiar environment, which often enhances focus and retention.

Benefits for Students

Personalized Learning Experience
Online platforms enable tutors to share screens, use digital whiteboards, and employ interactive tools that make learning engaging and effective. Concepts can be visualized better than traditional blackboard teaching.

One-on-One Attention
Unlike crowded coaching centers, online tutoring typically offers individual attention. Your tutor can focus entirely on your child's specific needs, questions, and learning pace.

Access to Resources
Digital learning materials, practice questions, video explanations, and interactive quizzes can be easily shared and accessed during and after sessions.

Regular Progress Tracking
Most online tutoring platforms maintain detailed records of sessions, assignments, and progress, making it easier for parents to stay informed about their child's development.

Making Online Tutoring Effective

To maximize the benefits of online tutoring, follow these best practices:

Create a Dedicated Learning Space
- Set up a quiet area with good lighting
- Ensure a stable internet connection
- Keep all study materials organized nearby
- Minimize distractions from family members or devices

Technical Requirements
- Reliable internet connection (at least 4-5 Mbps)
- Computer, laptop, or tablet with webcam
- Good quality headphones or speakers
- Updated software for video calls (Zoom, Google Meet, etc.)

Student Participation
- Encourage your child to ask questions freely
- Take notes during sessions
- Complete assignments on time
- Review recorded sessions when needed

Communication with Tutors
- Share specific learning goals and challenges
- Provide feedback on teaching methods
- Discuss progress regularly
- Maintain open lines of communication

Choosing the Right Platform

When selecting an online tutoring service, consider:
- Tutor qualifications and verification process
- Platform stability and features
- Customer support and dispute resolution
- Trial session availability
- Fee structure and payment flexibility

ApnaTuition's Approach

At ApnaTuition, we've designed our platform specifically for the Pakistani education system. All our online tutors are:
- Verified with proper credentials
- Experienced in online teaching methodologies
- Familiar with Cambridge, Federal Board, and provincial curricula
- Rated by previous students and parents

We provide seamless video conferencing, digital whiteboard tools, and comprehensive progress tracking. Our support team ensures smooth technical operation so both tutors and students can focus on what matters – learning.

The Future of Education

Online tutoring isn't replacing traditional education – it's complementing it. As internet penetration increases across Pakistan and digital literacy improves, online tutoring will become increasingly mainstream. It represents an opportunity to level the educational playing field, giving every Pakistani student access to quality instruction regardless of their location or economic background.

Whether you're preparing for board exams, need help with daily homework, or want to excel in competitive examinations, online tutoring offers a flexible, effective, and affordable solution. The future of education is digital, and that future is already here.`,
    image: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=1200",
    author: "Shabab Akbar, Founder & CEO",
    date: "December 10, 2025",
    readTime: "7 min read",
    category: "Online Learning",
    slug: "rise-of-online-tutoring-pakistan"
  }
];

const BlogDetail = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [blog, setBlog] = useState(allBlogs[0]);

  useEffect(() => {
    // Find blog by slug
    const foundBlog = allBlogs.find(b => b.slug === slug);
    if (foundBlog) {
      setBlog(foundBlog);
    }
  }, [slug]);

  // Format content with proper HTML styling
  const formatContent = (content: string) => {
    return content
      .split('\n\n')
      .map(paragraph => {
        // Remove ** from start and end, treat as heading
        if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
          const headingText = paragraph.replace(/\*\*/g, '').trim();
          return `<h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6 pb-3 border-b-2 border-blue-600">${headingText}</h2>`;
        } 
        // Bullet list
        else if (paragraph.startsWith('- ')) {
          const items = paragraph.split('\n').map(item => 
            `<li class="ml-6 mb-2 text-gray-700">${item.substring(2)}</li>`
          ).join('');
          return `<ul class="list-disc list-inside space-y-2 my-6 pl-4">${items}</ul>`;
        } 
        // Regular paragraph
        else {
          return `<p class="text-gray-700 text-lg leading-relaxed mb-6">${paragraph}</p>`;
        }
      })
      .join('');
  };

  const relatedBlogs = allBlogs.filter(b => b.id !== blog.id).slice(0, 2);

  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />

      {/* Back Button */}
      <div className="bg-gray-50 py-4 border-b">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/blog")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src={blog.image} 
          alt={blog.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="max-w-4xl">
              <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 inline-block">
                {blog.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {blog.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 pb-8 border-b mb-8">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{blog.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{blog.readTime}</span>
              </div>
            </div>

            {/* Content */}
            <div 
              className="max-w-none"
              dangerouslySetInnerHTML={{ __html: formatContent(blog.content) }}
            />

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Share this article</h3>
              <div className="flex gap-4">
                <Button variant="outline" size="sm">
                  Facebook
                </Button>
                <Button variant="outline" size="sm">
                  Twitter
                </Button>
                <Button variant="outline" size="sm">
                  LinkedIn
                </Button>
                <Button variant="outline" size="sm">
                  WhatsApp
                </Button>
              </div>
            </div>

            {/* Related Articles */}
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedBlogs.map((relatedBlog) => (
                  <div 
                    key={relatedBlog.id}
                    className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/blog/${relatedBlog.slug}`)}
                  >
                    <img 
                      src={relatedBlog.image}
                      alt={relatedBlog.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <span className="text-xs font-semibold text-blue-600 mb-2 block">{relatedBlog.category}</span>
                      <h4 className="font-bold text-lg mb-2 hover:text-blue-600 line-clamp-2">
                        {relatedBlog.title}
                      </h4>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {relatedBlog.excerpt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </article>

      <LandingFooter />
    </div>
  );
};

export default BlogDetail;
