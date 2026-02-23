import { ArrowRight, Users, ShieldCheck, Gift, Star, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ADMIN_USER_ID } from "@/lib/constants";
import heroImage from "@/assets/hero-illustration.png";

const LandingHero = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ tutors: "3000+", students: "5000+" });

  useEffect(() => {
    fetchQuickStats();
  }, []);

  const fetchQuickStats = async () => {
    try {
      const { data } = await supabase
        .from('dashboard_stats')
        .select('active_tutors, happy_students')
        .single();

      if (data) {
        setStats({
          tutors: data.active_tutors + '+' || '3000+',
          students: data.happy_students || '5000+'
        });
      }
    } catch (error) {
      console.error('Error fetching hero stats:', error);
    }
  };

  const handleTutorClick = async () => {
    // Check if user is already authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      // Check if user is admin
      if (session.user.id === ADMIN_USER_ID) {
        navigate("/admin-dashboard");
        return;
      }
      
      // User is logged in, check their profile status
      const { data: tutorProfile, error: profileError } = await supabase
        .from("new_tutor")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      console.log('LandingHero - Profile check:', { tutorProfile, profileError, userId: session.user.id });

      if (!tutorProfile) {
        // No profile - go to onboarding
        navigate("/tutor-onboarding");
      } else {
        // Has profile - go to dashboard
        navigate("/dashboard");
      }
    } else {
      // Not logged in - go to auth page
      navigate('/auth?type=tutor');
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 pt-4 pb-16 lg:pt-5 lg:pb-24">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div className="space-y-6 lg:space-y-8">
            
            <h1 className="text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl lg:text-6xl pt-6 lg:pt-8">
              Trusted Home &{" "}
              <span className="text-blue-600">
                Online Tuition
              </span>{" "}
              Services
            </h1>

            <p className="text-base text-gray-600 lg:text-lg max-w-xl leading-relaxed">
              Connect with <strong>highly qualified, 100% verified tutors</strong> for all classes and subjects. Experience personalized learning with <strong>zero commission, no application fee</strong> and <strong>free demo classes</strong>.
            </p>

            {/* USP Badges */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5 rounded-full bg-blue-200 text-blue-600 px-4 py-2 text-sm font-semibold shadow-md">
                <Gift className="h-4 w-4" />
                100% Free for Parents
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-blue-200 text-blue-600 px-4 py-2 text-sm font-semibold shadow-md">
                <ShieldCheck className="h-4 w-4" />
                Verified Tutors
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-blue-200 text-blue-600 px-4 py-2 text-sm font-semibold shadow-md">
                <Clock className="h-4 w-4" />
                2–3 Free Demo Classes
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-blue-200 text-blue-600 px-4 py-2 text-sm font-semibold shadow-md">
                <Star className="h-4 w-4" />
                No Commission
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button 
                className="group relative inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3.5 text-base font-semibold text-white hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl overflow-hidden"
                onClick={() => navigate('/tuition-request')}
              >
                <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-500 ease-out group-hover:w-full"></span>
                <span className="relative">Find a Tutor – It's Free!</span>
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 relative" />
              </button>
              <button 
                className="group relative inline-flex flex-col items-center justify-center rounded-lg border-2 border-blue-600 px-8 py-3.5 text-lg font-bold text-blue-600 hover:bg-blue-600 hover:text-white transition-all overflow-hidden shadow-md hover:shadow-xl"
                onClick={handleTutorClick}
              >
                <span className="relative">Become a Tutor</span>
                <span className="relative text-xs font-medium mt-0.5 opacity-80">No Registration Fee</span>
              </button>
            </div>

            <div className="flex items-center gap-8 pt-2">
              <div>
                <div className="text-3xl font-extrabold text-gray-900">{stats.tutors}</div>
                <div className="text-sm text-gray-600 font-medium">Verified Tutors</div>
              </div>
              <div className="h-12 w-px bg-gray-300" />
              <div>
                <div className="text-3xl font-extrabold text-gray-900">{stats.students}</div>
                <div className="text-sm text-gray-600 font-medium">Happy Students</div>
              </div>
              <div className="h-12 w-px bg-gray-300" />
              <div>
                <div className="text-3xl font-extrabold text-green-600">0%</div>
                <div className="text-sm text-gray-600 font-medium">Commission</div>
              </div>
            </div>
          </div>

          {/* Right Image - Illustration Style */}
          <div className="relative lg:h-[600px] flex items-center justify-center">
            {/* Additional background waves for depth */}
            <div className="absolute inset-0 -right-1/4">
              <svg className="absolute top-0 right-0 w-full h-full" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMaxYMid slice">
                <ellipse cx="400" cy="300" rx="350" ry="300" fill="url(#imgGradient1)" fillOpacity="0.4"/>
                <ellipse cx="500" cy="400" rx="300" ry="350" fill="url(#imgGradient2)" fillOpacity="0.3"/>
                <defs>
                  <radialGradient id="imgGradient1">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0"/>
                  </radialGradient>
                  <radialGradient id="imgGradient2">
                    <stop offset="0%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#93c5fd" stopOpacity="0"/>
                  </radialGradient>
                </defs>
              </svg>
            </div>
            
            <div className="relative z-10 w-full transform scale-110">
              <img
                src={heroImage}
                alt="Online tutor teaching student"
                className="w-full h-auto object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative sparkle element */}
      <div className="absolute bottom-12 right-12 lg:bottom-24 lg:right-24 w-12 h-12 opacity-60">
        <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full animate-pulse">
          <path d="M25 0L27.5 22.5L50 25L27.5 27.5L25 50L22.5 27.5L0 25L22.5 22.5L25 0Z" fill="url(#sparkleGradient)"/>
          <defs>
            <linearGradient id="sparkleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
};

export default LandingHero;
