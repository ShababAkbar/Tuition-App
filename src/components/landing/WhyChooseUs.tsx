import { ShieldCheck, Gift, Star, Clock, UserCheck, BadgeCheck, ThumbsUp, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const reasons = [
  {
    icon: Gift,
    color: "bg-green-100",
    iconColor: "text-green-600",
    title: "100% Free for Parents",
    description:
      "Looking for a tutor for your child? Send us your request — no application fee, no commission charge. We earn nothing from parents.",
  },
  {
    icon: ShieldCheck,
    color: "bg-blue-100",
    iconColor: "text-blue-600",
    title: "Trusted & Verified Tutors",
    description:
      "Every tutor completes a rigorous onboarding process: degree verification, teaching demo, CNIC authentication, subject assessment, and background checks before approval.",
  },
  {
    icon: BadgeCheck,
    color: "bg-orange-100",
    iconColor: "text-orange-600",
    title: "Zero Registration Fee for Tutors",
    description:
      "Want to join us as a tutor? No registration fee, no hidden charges. Start teaching and earn directly from parents with complete transparency.",
  },
  {
    icon: Clock,
    color: "bg-purple-100",
    iconColor: "text-purple-600",
    title: "2–3 Free Demo Classes",
    description:
      "Not sure about a tutor? Try them out! We offer 2 to 3 free demonstration classes so you can assess compatibility before making any commitment.",
  },
  {
    icon: UserCheck,
    color: "bg-pink-100",
    iconColor: "text-pink-600",
    title: "Male & Female Tutors",
    description:
      "We have both male and female tutors available for home and online sessions. Find the right fit for your family's preference and comfort.",
  },
  {
    icon: Star,
    color: "bg-yellow-100",
    iconColor: "text-yellow-600",
    title: "All Boards & Grades Covered",
    description:
      "From Primary to University, Matric, FSc, O-Level, A-Level, IGCSE, MDCAT, ECAT — we cover every board, grade, and exam type in Pakistan.",
  },
  {
    icon: Zap,
    color: "bg-teal-100",
    iconColor: "text-teal-600",
    title: "Fast Tutor Matching",
    description:
      "Submit your tuition request and get matched with the best-fit tutors within hours. No long waits — your child's learning starts fast.",
  },
  {
    icon: ThumbsUp,
    color: "bg-indigo-100",
    iconColor: "text-indigo-600",
    title: "Rated 4.5+ on Google",
    description:
      "Thousands of satisfied parents and students have rated us amongst Pakistan's top tutoring platforms. Their success is our biggest achievement.",
  },
];

const WhyChooseUs = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide shadow-md">
            Why Us
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4 lg:text-4xl">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Apna Tuition?
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We are Pakistan's most transparent tutoring platform. Here's why thousands of families trust us to educate their children.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-md hover:shadow-2xl hover:border-blue-400 hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${reason.color} group-hover:scale-110 transition-transform`}>
                <reason.icon className={`h-6 w-6 ${reason.iconColor}`} />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">{reason.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{reason.description}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-14 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 p-8 text-center text-white shadow-2xl">
          <h3 className="text-2xl font-extrabold mb-3">
            Ready to Find the Perfect Tutor?
          </h3>
          <p className="mb-6 text-white/90 max-w-xl mx-auto">
            Join thousands of families who found their ideal tutor through Apna Tuition — completely free, verified, and hassle-free.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/tuition-request')}
              className="rounded-lg bg-white text-blue-700 px-8 py-3 font-bold hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl"
            >
              Get a Tutor – It's Free!
            </button>
            <button
              onClick={() => navigate('/auth?type=tutor')}
              className="rounded-lg border-2 border-white text-white px-8 py-3 font-bold hover:bg-white/10 transition-colors"
            >
              Register as Tutor
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
