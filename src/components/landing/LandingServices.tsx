import { useNavigate } from "react-router-dom";

const services = [
  {
    image: "https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=600&h=260&fit=crop&auto=format",
    alt: "Home tutor teaching student at home",
    tag: "Most Popular",
    tagColor: "bg-blue-600",
    title: "Home Tutoring",
    description:
      "Expert tutors come directly to your doorstep for personalized one-on-one sessions. Available for all grades — Primary, Matric, FSc, O/A Level, and University.",
  },
  {
    image: "https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=600&h=260&fit=crop&auto=format",
    alt: "Student attending online tuition session",
    tag: "Trending",
    tagColor: "bg-purple-600",
    title: "Online Tutoring",
    description:
      "Learn from the comfort of your home via interactive virtual sessions. Our online tutors cover all subjects and are available across all cities of Pakistan.",
  },
  {
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=260&fit=crop&auto=format",
    alt: "Female tutor teaching student",
    tag: "Preferred Choice",
    tagColor: "bg-pink-500",
    title: "Female Tutors",
    description:
      "Experienced female tutors available for both home and online sessions. Ideal for families who prefer a female teacher for their children.",
  },
  {
    image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&h=260&fit=crop&auto=format",
    alt: "Student preparing for exams",
    tag: "High Demand",
    tagColor: "bg-orange-500",
    title: "Exam Preparation",
    description:
      "Specialized coaching for board exams, entry tests, and university admissions. MDCAT, ECAT, SAT, GRE, IELTS — our experts ensure you score top marks.",
  },
  {
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=260&fit=crop&auto=format",
    alt: "Student learning coding and skills",
    tag: "Skills",
    tagColor: "bg-teal-600",
    title: "Skillset Development",
    description:
      "Go beyond academics with expert tutors in Coding, web development, graphic design, languages, mental math, and more for career-ready skills.",
  },
  {
    image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&h=260&fit=crop&auto=format",
    alt: "O Level and A Level Cambridge tutoring",
    tag: "Cambridge",
    tagColor: "bg-indigo-600",
    title: "O/A Level Tutors",
    description:
      "Highly qualified tutors specializing in the Cambridge curriculum for O-Level and A-Level. Covering Maths, Sciences, English, Business, and all IGCSE subjects.",
  },
];

const LandingServices = () => {
  const navigate = useNavigate();

  return (
    <section id="services" className="py-12 lg:py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block bg-blue-600 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide shadow-md">
            What We Offer
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4 lg:text-4xl">
            Our Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Personalized learning at your doorstep or online — for every grade, subject, and board across Pakistan.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={index}
              onClick={() => navigate('/tuition-request')}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-200 hover:border-blue-400 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-48">
                <img
                  src={service.image}
                  alt={service.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className={`absolute top-3 left-3 ${service.tagColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                  {service.tag}
                </span>
              </div>
              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {service.description}
                </p>
                <div className="mt-4 flex items-center text-blue-600 text-sm font-semibold group-hover:gap-2 gap-1 transition-all">
                  <span>Get a Tutor</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingServices;
