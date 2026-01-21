import { ArrowRight, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-illustration.png";

const LandingHero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div className="space-y-6 lg:space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
              <Users className="h-4 w-4" />
              Rated 4.5+ on Google
            </div>

            <h1 className="text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Learn Better,
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">Achieve More!</span>
            </h1>

            <p className="text-base text-gray-600 lg:text-lg max-w-xl leading-relaxed">
              Connect with expert home tutors and online teachers. Personalized learning for all grades and subjects, designed to help you succeed.
            </p>

            <div className="flex flex-wrap gap-4">
              <button 
                className="group inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3.5 text-base font-semibold text-white hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                onClick={() => navigate('/auth?type=parent')}
              >
                For Parents
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button 
                className="inline-flex items-center justify-center rounded-lg bg-gray-100 px-8 py-3.5 text-base font-semibold text-gray-800 hover:bg-gray-200 transition-all border border-gray-200"
                onClick={() => navigate('/auth?type=tutor')}
              >
                For Tutors
              </button>
            </div>

            <div className="flex items-center gap-8 pt-6">
              <div>
                <div className="text-3xl font-extrabold text-gray-900">3000+</div>
                <div className="text-sm text-gray-600 font-medium">Active Tutors</div>
              </div>
              <div className="h-12 w-px bg-gray-300" />
              <div>
                <div className="text-3xl font-extrabold text-gray-900">5000+</div>
                <div className="text-sm text-gray-600 font-medium">Happy Students</div>
              </div>
            </div>
          </div>

          {/* Right Image - Illustration Style */}
          <div className="relative lg:h-[500px] flex items-center justify-center">
            <div className="relative z-10 w-full">
              <img
                src={heroImage}
                alt="Online tutor teaching student"
                className="w-full h-auto object-contain drop-shadow-2xl"
              />
            </div>
            {/* Background decorative blob */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-200/40 via-purple-200/30 to-blue-300/40 rounded-full blur-3xl transform scale-110" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
