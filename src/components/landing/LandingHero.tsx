import { ArrowRight, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-illustration.png";

const LandingHero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-blue-100 py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-600">
              <Users className="h-4 w-4" />
              Rated 4.5+ on Google
            </div>

            <h1 className="text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Learn Better,
              <br />
              <span className="text-blue-600">Achieve More!</span>
            </h1>

            <p className="text-lg text-gray-600 lg:text-xl max-w-lg">
              Connect with expert home tutors and online teachers. Personalized learning for all grades and subjects, designed to help you succeed.
            </p>

            <div className="flex flex-wrap gap-4">
              <button 
                className="group inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700 transition-colors"
                onClick={() => navigate('/auth?type=parent')}
              >
                For Parents
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button 
                className="inline-flex items-center justify-center rounded-lg bg-gray-200 px-6 py-3 text-base font-medium text-gray-900 hover:bg-gray-300 transition-colors"
                onClick={() => navigate('/auth?type=tutor')}
              >
                For Tutors
              </button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-3xl font-bold text-gray-900">3000+</div>
                <div className="text-sm text-gray-600">Active Tutors</div>
              </div>
              <div className="h-12 w-px bg-gray-300" />
              <div>
                <div className="text-3xl font-bold text-gray-900">5000+</div>
                <div className="text-sm text-gray-600">Happy Students</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src={heroImage}
                alt="Student learning with tutor"
                className="w-full rounded-2xl shadow-2xl"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -right-4 -top-4 h-72 w-72 rounded-full bg-blue-200 opacity-40 blur-3xl" />
            <div className="absolute -bottom-4 -left-4 h-72 w-72 rounded-full bg-blue-300 opacity-30 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
