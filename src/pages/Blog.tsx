import { useState } from "react";
import { Calendar, User, ArrowRight, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";
import { Card, CardContent } from "@/components/ui/card";

// Blog interface - later connect to database
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
  slug: string;
}

const Blog = () => {
  const navigate = useNavigate();
  
  // Professional blog posts
  const [blogs] = useState<BlogPost[]>([
    {
      id: "1",
      title: "How to Find the Best Home Tutor in Pakistan",
      excerpt: "Finding the right home tutor for your child can make a significant difference in their academic performance and confidence. With the rise of online platforms like Apna Tuition, connecting with qualified tutors in Karachi, Lahore, Islamabad, and other cities has become easier than ever.",
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

Teaching Experience and Style

Experience matters, but it's not just about years. A tutor who has successfully taught hundreds of students over five years brings valuable insights into common challenges students face and proven strategies to overcome them.

Ask potential tutors about their teaching methodology:

- Do they customize lessons based on individual student needs?
- Do they provide regular progress assessments?
- Do they communicate with parents about student performance?
- Do they offer additional support materials and practice exercises?

Trial Sessions Are Essential

Never commit to a tutor without a trial session. This allows you to observe how the tutor interacts with your child, whether they can explain complex concepts in simple terms, if your child feels comfortable asking questions, and the tutor's punctuality and professionalism.

Most quality tutors on platforms like ApnaTuition offer free or low-cost trial sessions. Use this opportunity wisely.

Location and Schedule Flexibility

Consider practical factors like travel distance if it's in-person tutoring, traffic patterns in your city (especially relevant in Karachi and Lahore), the tutor's availability matching your child's schedule, and backup plans for holidays or emergencies.

Online tutoring has become increasingly popular, offering flexibility and access to specialized tutors regardless of location.

Investment in Your Child's Future

While budget is important, remember that quality education is an investment in your child's future. The right tutor doesn't just improve grades – they build confidence, develop study skills, and instill a love of learning that lasts a lifetime.

At ApnaTuition, we carefully vet all our tutors to ensure they meet high standards of qualification, experience, and teaching excellence. Our platform makes it easy to find, compare, and connect with the perfect tutor for your child's unique needs.`,
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600",
      author: "Shabab Akbar",
      date: "Feb 1, 2026",
      category: "Education Tips",
      slug: "how-to-find-best-home-tutor-pakistan"
    },
    {
      id: "2",
      title: "Online vs Home Tuition: Which is Better for Your Child?",
      excerpt: "The education landscape has evolved dramatically, especially after the pandemic. Parents now have two main options: traditional home tuition where a tutor visits your home, or online tuition conducted via video calls. Both methods have their advantages and drawbacks.",
      content: `The education landscape has evolved dramatically, especially after the pandemic. Parents now have two main options: traditional home tuition where a tutor visits your home, or online tuition conducted via video calls. Both methods have their advantages and drawbacks. This guide will help you decide which option is best for your child's learning style and circumstances.

Understanding Home Tuition

Home tuition involves a qualified tutor visiting your home to provide customized instruction. Advantages include face-to-face interaction that builds stronger teacher-student relationships, better focus with fewer digital distractions, hands-on learning with physical materials, immediate feedback on posture and problem-solving, personalized attention based on body language, and no technical issues.

However, disadvantages include higher costs due to travel expenses, limited tutor options restricted to your locality, scheduling constraints from traffic and weather, safety concerns about allowing strangers in your home, and geographic limitations in smaller cities.

Understanding Online Tuition

Online tuition provides instruction via video calls from anywhere. Advantages include access to top tutors from across Pakistan, cost-effectiveness (20-30% cheaper), flexible scheduling, digital resources like shared screens and PDFs, recorded sessions for review, safe and convenient learning, and no commute time.

Disadvantages include internet dependency, screen fatigue, potential distractions from apps, limited hands-on activities, and technical skills requirements.

Which Option for Different Scenarios?

Choose home tuition if your child is in primary classes needing physical presence, preparing for board exams requiring extensive practice, struggles with focus during online classes, needs subjects like Mathematics benefiting from physical problem-solving, has unreliable internet, or learns better face-to-face.

Choose online tuition if you're looking for specialized tutors (O/A-Level, IELTS, SAT), have budget limitations, live in cities with fewer qualified tutors, need flexible convenient timings, your child is comfortable with technology, or you want access to expert tutors across Pakistan.

Hybrid Approach

Many families adopt a hybrid model: weekly home tuition for core subjects (2-3 times/week), online tuition for supplementary subjects, and online doubt-clearing between home sessions. This maximizes benefits while minimizing costs.

Apna Tuition offers both options! Whether you need a home tutor in Karachi, Lahore, Islamabad, or prefer online tuition from anywhere in Pakistan, you can find qualified tutors on our platform.`,
      image: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=600",
      author: "Shabab Akbar",
      date: "Jan 30, 2026",
      category: "Online Learning",
      slug: "online-vs-home-tuition-comparison"
    },
    {
      id: "3",
      title: "Top Tips for Board Exam Preparation with Home Tutors",
      excerpt: "Board exams (Matric and FSc) are critical milestones in every Pakistani student's academic journey. These exams determine university admissions and future career paths. While school education provides the foundation, personalized guidance from an experienced home tutor can make the difference.",
      content: `Board exams (Matric and FSc) are critical milestones in every Pakistani student's academic journey. These exams determine university admissions and future career paths. While school education provides the foundation, personalized guidance from an experienced home tutor can make the difference between average scores and exceptional results.

Why Home Tutors for Board Exams?

Home tutors provide personalized attention, targeted weak area improvement, flexible pace, past paper practice, stress management, and time management skills. Start early, at least 6 months before exams. The Matric and FSc syllabi are extensive, and rushing leads to surface-level understanding.

Choose a Tutor with Board Exam Experience

Look for 3+ years of experience preparing students for Matric/FSc, track record of students scoring 80%+, familiarity with your specific board (Lahore Board, Karachi Board, Rawalpindi Board), and subject specialization. Ask about their student success rates, past papers provision, and time management strategies.

Focus on High-Weightage Topics

Not all chapters carry equal marks. Smart students focus more on high-weightage areas. For Matric: Mathematics (Trigonometry, Algebra, Geometry carry 60%+ marks), Physics (Electricity, Magnetism, Heat), Chemistry (Chemical Bonding, Acids & Bases, Organic Chemistry), Biology (Cell Biology, Genetics, Human Systems), and English (Comprehension, Essay Writing, Grammar).

For FSc: Mathematics (Calculus, Trigonometry, Vectors carry 70%+ marks), Physics (Electromagnetism, Modern Physics, Thermodynamics), Chemistry (Organic Chemistry, Physical Chemistry), and Biology (Molecular Biology, Genetics, Ecology).

Practice Past Papers

40-50% of questions repeat in similar forms. Start with chapter-wise questions 6 months before, attempt complete timed papers 3 months before, and do 2-3 past papers per week for each subject 1 month before exams. Tutors should provide 10 years of past papers, mark using official schemes, and explain common mistakes.

Master Exam Writing Techniques

Common mistakes include poor handwriting, not following official format, incomplete answers from poor time management, and not attempting all questions. Tutors should guide practice writing, essay structure, examiner expectations, and handwriting improvement.

At Apna Tuition, find experienced board exam tutors in Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, and other cities. Browse verified profiles, check qualifications, and request a trial session today!`,
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600",
      author: "Shabab Akbar",
      date: "Jan 28, 2026",
      category: "Exam Preparation",
      slug: "board-exam-preparation-tips-home-tutors"
    },
    {
      id: "4",
      title: "Benefits of Personalized Home Tuition in Major Pakistani Cities",
      excerpt: "As education becomes increasingly competitive in Pakistan, parents are turning to personalized home tuition to give their children an academic edge. Unlike crowded classrooms where teachers must cater to 40-50 students, home tuition provides one-on-one attention.",
      content: `As education becomes increasingly competitive in Pakistan, parents are turning to personalized home tuition to give their children an academic edge. Unlike crowded classrooms where teachers must cater to 40-50 students, home tuition provides one-on-one attention tailored to each child's unique learning needs.

Key Benefits of Personalized Home Tuition

Customized Learning Experience: Tutors dedicate 100% focus to your child with no distractions, questions answered immediately, and learning pace adjusted to understanding. Every child learns differently - visual learners benefit from diagrams, auditory learners from discussions, and kinesthetic learners from hands-on activities. Personalized tutors adapt accordingly.

Flexible Scheduling: Choose timings that work for your family (evening, weekend, early morning), reschedule when needed, adjust session duration, and plan intensive sessions before exams. No commute time saves 1-2 hours daily.

Improved Academic Performance: Tutors identify specific knowledge gaps and provide targeted improvement. Studies show students with personalized tuition typically improve grades by 15-30%. Real results from Pakistani students show significant score improvements.

Builds Confidence and Reduces Anxiety: Safe learning environment with no fear of being mocked, students feel comfortable making mistakes, positive reinforcement boosts self-esteem, and personalized encouragement builds growth mindset. For shy or introverted students, home tuition provides a judgment-free space.

Convenient and Safe: Study in familiar comfortable environment, access to own books and materials, no heavy bags to carry, parents can monitor sessions, no travel risks, and verified tutors through platforms like Apna Tuition. Especially important in Pakistan with traffic congestion and safety concerns.

Better Communication with Parents: Direct communication between parents and tutors, weekly progress reports, immediate feedback, and collaborative goal-setting. Parents can occasionally sit in sessions and receive exam preparation strategies.

City-Specific Benefits

Karachi: Save 2-3 hours daily in traffic, tutors available in all major areas (Gulshan, Defence, Clifton, Nazimabad), safe learning at home.

Lahore: Large pool of qualified tutors including university professors, competitive rates, strong O/A-Level tutor availability, cultural preference for home-based education.

Islamabad/Rawalpindi: Access to tutors from top universities (NUST, COMSATS, QAU), growing demand for IELTS/SAT/international curriculum, twin cities provide wider selection, safer environment with less traffic.

Use Apna Tuition to browse verified tutor profiles, check qualifications and experience, read reviews, filter by subject/location/fee, and request tutors for free!`,
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600",
      author: "Shabab Akbar",
      date: "Jan 25, 2026",
      category: "Education Tips",
      slug: "benefits-personalized-home-tuition-pakistan"
    },
    {
      id: "5",
      title: "How to Choose the Right Tutor for O-Level and A-Level Students",
      excerpt: "O-Level and A-Level qualifications from Cambridge International are among the most respected educational certifications globally. However, these exams require a fundamentally different approach compared to Pakistani board exams.",
      content: `O-Level and A-Level qualifications from Cambridge International are among the most respected educational certifications globally. However, these exams require a fundamentally different approach compared to Pakistani board exams (Matric/FSc). The teaching methodology, exam patterns, grading criteria, and depth of understanding required are significantly different.

Why O/A-Level Students Need Specialized Tutors

Different Exam Philosophy: Pakistani boards focus on memorization and reproducing textbook content with predictable questions and lenient marking. Cambridge O/A-Levels emphasize conceptual understanding, application, critical thinking, analysis, and strict marking schemes requiring specific keywords.

A tutor experienced only in board exams may not understand Cambridge assessment objectives, teaching methodologies, or marking criteria. You need a tutor who has studied or taught O/A-Levels extensively, understands Cambridge marking schemes, can teach concepts (not just facts), and prepares students for application-based questions.

Essential Qualities of an O/A-Level Tutor

Educational Background: Best qualifications include completing O/A-Levels themselves plus relevant degree, BS/MS in the subject from reputable university, and international qualifications or Cambridge training certification.

Teaching Experience: Minimum 2-3 years teaching O/A-Level students. Ask about years of teaching, number of students prepared, typical grade outcomes, and experience with CIE and Edexcel boards. Green flags include 5+ years of teaching, students consistently achieving A/A* grades, and experience with multiple exam boards.

Subject Specialization: O/A-Level subjects are vast and complex. Tutors should specialize in specific subjects rather than claiming to teach everything. Sciences require strong conceptual foundation and practical skills, Mathematics needs Pure Math/Statistics/Mechanics knowledge, English requires essay writing and literary analysis, and Business subjects need real-world application.

Familiarity with Cambridge Resources: Qualified tutors should have Cambridge Past Papers (10+ years), Mark Schemes and Examiner Reports, updated Syllabus documents, Specimen papers, and recommended textbooks.

Finding Tutors in Major Cities

Karachi: Largest pool of Cambridge-certified tutors, many international school teachers, rates PKR 8,000-25,000/month per subject.

Lahore: Growing Cambridge market, access to tutors from Aitchison/LGS/Beaconhouse, rates PKR 7,000-20,000/month.

Islamabad: High-quality tutors from international schools, many with UK/US education background, rates PKR 8,000-22,000/month.

Use Apna Tuition to filter by O/A-Level qualification, read reviews from Cambridge students, verify educational background, compare rates, and find tutors in your neighborhood!`,
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600",
      author: "Shabab Akbar",
      date: "Jan 22, 2026",
      category: "Exam Preparation",
      slug: "choose-right-tutor-o-level-a-level"
    },
    {
      id: "6",
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

Sciences (Physics, Chemistry, Biology)

- Master the practical component thoroughly
- Understand question patterns in theory papers
- Practice numerical problems daily
- Create formula sheets for quick revision

Mathematics

- Practice is key – solve at least 2 papers weekly
- Understand concepts, don't just memorize formulas
- Focus on time management
- Review mistakes carefully

Languages (English, Urdu)

- Read extensively to improve comprehension
- Practice essay writing regularly
- Build vocabulary systematically
- Analyze sample answers from mark schemes

Social Sciences (Economics, Business Studies, Pak Studies)

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
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600",
      author: "Shabab Akbar",
      date: "Jan 15, 2026",
      category: "Exam Preparation",
      slug: "olevel-alevel-exam-guide"
    },
    {
      id: "7",
      title: "The Rise of Online Tutoring in Pakistan: Benefits and Best Practices",
      excerpt: "Online tutoring has revolutionized education in Pakistan. Discover how virtual learning is making quality education accessible to everyone...",
      content: `The COVID-19 pandemic accelerated a transformation that was already underway – the shift from traditional classroom-based tutoring to online learning. In Pakistan, online tutoring has emerged as a powerful solution that addresses many challenges of our educational system.

Why Online Tutoring is Growing in Pakistan

Several factors have contributed to the explosive growth of online tutoring across Pakistani cities.

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

To maximize the benefits of online tutoring, follow these best practices.

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
      image: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=600",
      author: "Shabab Akbar",
      date: "Jan 10, 2026",
      category: "Online Learning",
      slug: "rise-of-online-tutoring-pakistan"
    }
  ]);

  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Blog</h1>
            <p className="text-xl text-blue-100">
              Educational insights, tips, and resources for students and parents
            </p>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <Card 
                  key={blog.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => navigate(`/blog/${blog.slug}`)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={blog.image} 
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {blog.category}
                      </span>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{blog.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{blog.author}</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {blog.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {blog.excerpt}
                    </p>

                    <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default Blog;
