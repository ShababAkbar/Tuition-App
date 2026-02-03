import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Phone, Users, BookOpen, Clock, Award } from "lucide-react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";

const CITY_DATA: Record<string, { name: string; description: string; stats: string }> = {
  karachi: {
    name: "Karachi",
    description: "Find the best home tutors and online teachers in Karachi. Qualified tutors for all areas including DHA, Clifton, Gulshan, North Nazimabad, and more.",
    stats: "500+ Active Tutors"
  },
  lahore: {
    name: "Lahore",
    description: "Expert home tutors in Lahore for all subjects and grades. Covering DHA, Gulberg, Johar Town, Model Town, Bahria Town, and all major areas.",
    stats: "600+ Active Tutors"
  },
  islamabad: {
    name: "Islamabad",
    description: "Premium home tuition services in Islamabad. Professional tutors available in F-6, F-7, F-8, G-6, G-9, Bahria Town, and all sectors.",
    stats: "400+ Active Tutors"
  },
  rawalpindi: {
    name: "Rawalpindi",
    description: "Quality home tutors in Rawalpindi (Pindi). Experienced teachers for Satellite Town, Saddar, Bahria Town, and surrounding areas.",
    stats: "300+ Active Tutors"
  },
  faisalabad: {
    name: "Faisalabad",
    description: "Trusted home tuition services in Faisalabad. Expert tutors for all subjects, grades, and boards available across the city.",
    stats: "250+ Active Tutors"
  },
  multan: {
    name: "Multan",
    description: "Find qualified home tutors in Multan. Professional teaching services for all educational levels and subjects.",
    stats: "200+ Active Tutors"
  },
  gujranwala: {
    name: "Gujranwala",
    description: "Home tuition services in Gujranwala. Connect with verified tutors for personalized learning at home.",
    stats: "150+ Active Tutors"
  },
  sheikhupura: {
    name: "Sheikhupura",
    description: "Quality home tutors in Sheikhupura. Expert teachers available for all subjects and grades.",
    stats: "100+ Active Tutors"
  },
  sialkot: {
    name: "Sialkot",
    description: "Home tuition in Sialkot with experienced tutors. Quality education for students of all levels.",
    stats: "120+ Active Tutors"
  },
  peshawar: {
    name: "Peshawar",
    description: "Professional home tutors in Peshawar. Covering University Town, Hayatabad, and all major areas.",
    stats: "180+ Active Tutors"
  },
  quetta: {
    name: "Quetta",
    description: "Find home tutors in Quetta. Qualified teachers for all subjects and educational boards.",
    stats: "80+ Active Tutors"
  },
  hyderabad: {
    name: "Hyderabad",
    description: "Home tuition services in Hyderabad. Expert tutors for personalized learning and exam preparation.",
    stats: "140+ Active Tutors"
  }
};

export default function CityLanding() {
  const { city } = useParams<{ city: string }>();
  const navigate = useNavigate();
  
  const cityKey = city?.toLowerCase() || "";
  const cityInfo = CITY_DATA[cityKey];

  useEffect(() => {
    // Update page title for SEO
    if (cityInfo) {
      document.title = `Home Tutors in ${cityInfo.name} | Apna Tuition - Find Best Tutors`;
    }
  }, [cityInfo]);

  if (!cityInfo) {
    navigate('/');
    return null;
  }

  const handleRequestTuition = () => {
    navigate('/tuition-request', { state: { city: cityInfo.name } });
  };

  const handleBecomeTutor = () => {
    navigate('/auth?type=tutor');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <LandingNavbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full mb-6">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">{cityInfo.name}, Pakistan</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
              Home Tutors in <span className="text-blue-600">{cityInfo.name}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              {cityInfo.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={handleRequestTuition}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Request a Tutor
              </button>
              <button
                onClick={handleBecomeTutor}
                className="bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Become a Tutor
              </button>
            </div>

            <div className="inline-flex items-center gap-2 text-gray-600">
              <Users className="w-5 h-5" />
              <span className="font-medium">{cityInfo.stats} in {cityInfo.name}</span>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">All Subjects & Grades</h3>
              <p className="text-gray-600">From primary to A-Levels. Math, Science, English, Computer, and all subjects covered.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Tutors</h3>
              <p className="text-gray-600">All tutors are verified with proper credentials and teaching experience.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Schedule</h3>
              <p className="text-gray-600">Home and online tuition available at your convenient time and location.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick Response</h3>
              <p className="text-gray-600">Get matched with suitable tutors within 24-48 hours of your request.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Nearby Tutors</h3>
              <p className="text-gray-600">Find tutors in your area of {cityInfo.name} for convenient home tuition.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">100% Free Platform</h3>
              <p className="text-gray-600">No registration fees, no hidden charges. Completely free for students and tutors.</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white mt-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Find Your Perfect Tutor in {cityInfo.name}?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of students already learning with Apna Tuition
            </p>
            <button
              onClick={handleRequestTuition}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Get Started - It's Free!
            </button>
          </div>

          {/* SEO Content */}
          <div className="mt-16 prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Choose Apna Tuition for Home Tuition in {cityInfo.name}?
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Finding quality home tutors in {cityInfo.name} has never been easier. Apna Tuition connects students and parents 
              with experienced, verified tutors across {cityInfo.name}. Whether you need help with board exam preparation, 
              O-Level/A-Level subjects, or general academic support, our platform makes it simple to find the right tutor.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our tutors in {cityInfo.name} specialize in all major subjects including Mathematics, Physics, Chemistry, Biology, 
              English, Urdu, Computer Science, and more. We serve students from primary school to university level, ensuring 
              personalized attention and effective learning outcomes.
            </p>
            <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              Popular Areas We Serve in {cityInfo.name}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Our network of tutors covers all major areas and localities in {cityInfo.name}, ensuring you can find a qualified 
              tutor near your home. Both home tuition and online tuition options are available to suit your preferences.
            </p>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
