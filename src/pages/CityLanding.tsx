import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, BookOpen, Award, Clock, Users, CheckCircle } from "lucide-react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";
import SEOHead from "@/components/SEOHead";

const CITY_DATA: Record<string, { name: string; areas: string; stats: string }> = {
  karachi: {
    name: "Karachi",
    areas: "DHA, Clifton, Gulshan, North Nazimabad, Bahria Town, Malir, Korangi, and all areas",
    stats: "500+ Active Tutors"
  },
  lahore: {
    name: "Lahore",
    areas: "DHA, Gulberg, Johar Town, Model Town, Bahria Town, Allama Iqbal Town, and all areas",
    stats: "600+ Active Tutors"
  },
  islamabad: {
    name: "Islamabad",
    areas: "F-6, F-7, F-8, G-6, G-9, Bahria Town, I-8, I-9, and all sectors",
    stats: "400+ Active Tutors"
  },
  rawalpindi: {
    name: "Rawalpindi",
    areas: "Satellite Town, Saddar, Bahria Town, Chaklala, Westridge, and all areas",
    stats: "300+ Active Tutors"
  },
  faisalabad: {
    name: "Faisalabad",
    areas: "D Ground, People's Colony, Susan Road, Madina Town, and all areas",
    stats: "250+ Active Tutors"
  },
  multan: {
    name: "Multan",
    areas: "Cantt, Gulgasht, Shah Rukn-e-Alam, and all areas",
    stats: "200+ Active Tutors"
  },
  gujranwala: {
    name: "Gujranwala",
    areas: "Model Town, Satellite Town, Peoples Colony, and all areas",
    stats: "150+ Active Tutors"
  },
  sheikhupura: {
    name: "Sheikhupura",
    areas: "City Center, Model Town, and all areas",
    stats: "100+ Active Tutors"
  },
  sialkot: {
    name: "Sialkot",
    areas: "Cantt, Civil Lines, Paris Road, and all areas",
    stats: "120+ Active Tutors"
  },
  peshawar: {
    name: "Peshawar",
    areas: "University Town, Hayatabad, Cantt, Saddar, and all areas",
    stats: "180+ Active Tutors"
  },
  quetta: {
    name: "Quetta",
    areas: "Cantt, Satellite Town, Jinnah Town, and all areas",
    stats: "80+ Active Tutors"
  },
  hyderabad: {
    name: "Hyderabad",
    areas: "Latifabad, Qasimabad, Cantt, and all areas",
    stats: "140+ Active Tutors"
  }
};

export default function CityLanding() {
  const { city } = useParams<{ city: string }>();
  const navigate = useNavigate();
  
  const cityKey = city?.toLowerCase() || "";
  const cityInfo = CITY_DATA[cityKey];

  // Handle invalid city - navigate in useEffect
  useEffect(() => {
    if (!cityInfo) {
      navigate('/');
    }
  }, [cityInfo, navigate]);

  const handleGetTutor = () => {
    navigate('/tuition-request');
  };

  // Loading state while redirecting
  if (!cityInfo) {
    return null;
  }

  // SEO Configuration
  const pageTitle = `Verified Home Tutors in ${cityInfo.name}`;
  const pageDescription = `Find the best home tutors in ${cityInfo.name}, Pakistan. ${cityInfo.stats} of qualified teachers for O-Level, A-Level, Matric, and all subjects. Expert online & home tuition services in ${cityInfo.areas}. 100% Free platform.`;
  const canonicalUrl = `https://apna-tuition.com/tuition-in-${cityKey}`;
  const keywords = `home tuition in ${cityInfo.name}, tutors in ${cityInfo.name}, home tutors ${cityInfo.name}, online tuition ${cityInfo.name}, private tutors ${cityInfo.name}, O level tutors ${cityInfo.name}, A level tutors ${cityInfo.name}, best home tuition ${cityInfo.name}, tuition academy ${cityInfo.name}, female tutors ${cityInfo.name}`;

  // Schema.org LocalBusiness structured data
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `Apna Tuition - ${cityInfo.name}`,
    "description": `Professional home tuition and online tutoring services in ${cityInfo.name}`,
    "url": canonicalUrl,
    "logo": "https://apna-tuition.com/favicon.png",
    "image": "https://apna-tuition.com/og-image.png",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": cityInfo.name,
      "addressCountry": "PK"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "addressCountry": "PK"
    },
    "areaServed": {
      "@type": "City",
      "name": cityInfo.name
    },
    "priceRange": "Free",
    "serviceType": "Home Tuition Services",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "500"
    }
  };

  // Service schema
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `Home Tuition Services in ${cityInfo.name}`,
    "serviceType": "Educational Services",
    "provider": {
      "@type": "EducationalOrganization",
      "name": "Apna Tuition"
    },
    "areaServed": {
      "@type": "City",
      "name": cityInfo.name,
      "containedInPlace": {
        "@type": "Country",
        "name": "Pakistan"
      }
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Tutoring Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Home Tuition"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Online Tuition"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "O-Level & A-Level Tutoring"
          }
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* SEO Head with Canonical, Schema, and Meta Tags */}
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        canonical={canonicalUrl}
        keywords={keywords}
        schema={[localBusinessSchema, serviceSchema]}
      />
      
      <LandingNavbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          {/* Location Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-100 px-6 py-3 rounded-full mb-8">
            <MapPin className="w-5 h-5 text-blue-600" />
            <span className="text-base font-semibold text-blue-700">{cityInfo.name}, Pakistan</span>
          </div>

          {/* Main Headline - Optimized H1 for SEO */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Verified Home Tutors in <span className="text-blue-600">{cityInfo.name}</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Apna Tuition connects you with qualified and verified teachers in {cityInfo.name}. 
            Get expert tutors for all subjects and grades at zero charges.
          </p>

          {/* Stats */}
          <div className="inline-flex items-center gap-2 bg-green-100 px-6 py-3 rounded-full mb-10">
            <Users className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-700">{cityInfo.stats} in {cityInfo.name}</span>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleGetTutor}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-5 rounded-xl text-xl font-bold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 mb-4"
          >
            Get Tutors in {cityInfo.name} - 100% Free!
          </button>
          
          <p className="text-sm text-gray-500">No registration fees • No hidden charges • Completely free</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose Apna Tuition for Home Tuition in {cityInfo.name}?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-5">
                <Award className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Verified Tutors in {cityInfo.name}</h3>
              <p className="text-gray-700 leading-relaxed">
                All tutors are verified with proper credentials and teaching experience. Find qualified teachers in {cityInfo.areas}.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-5">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">All Subjects & Grades</h3>
              <p className="text-gray-700 leading-relaxed">
                Expert tutors in {cityInfo.name} for Math, Science, English, Computer, Urdu, and all subjects from Primary to A-Levels.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-5">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Flexible Timing</h3>
              <p className="text-gray-700 leading-relaxed">
                Home tuition and online classes available at your convenient time. Find tutors near you in {cityInfo.name}.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
              Best Tutor Service in {cityInfo.name}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg mb-1">Expert Teachers</h4>
                  <p className="text-blue-100">Qualified tutors with proven track records in {cityInfo.name}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg mb-1">Zero Charges</h4>
                  <p className="text-blue-100">100% free platform - no registration or hidden fees</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg mb-1">Quick Response</h4>
                  <p className="text-blue-100">Get matched with tutors within 24-48 hours</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg mb-1">All Areas Covered</h4>
                  <p className="text-blue-100">Tutors available in {cityInfo.areas}</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleGetTutor}
                className="bg-white text-blue-600 px-10 py-4 rounded-xl text-xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
              >
                Find Tutors in {cityInfo.name} Now!
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto prose prose-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Home Tuition Services in {cityInfo.name}
          </h2>
          
          <p className="text-gray-700 leading-relaxed mb-6">
            Looking for the best home tutors in {cityInfo.name}? Apna Tuition is Pakistan's most trusted platform 
            connecting students with qualified and verified teachers. Whether you need help with board exam preparation, 
            O-Level/A-Level subjects, or university entrance tests, we have expert tutors ready to help you succeed.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Why Students Choose Us in {cityInfo.name}
          </h3>
          
          <p className="text-gray-700 leading-relaxed mb-6">
            Our platform offers the best tutor service in {cityInfo.name} with zero charges for students. You can find 
            tutors in {cityInfo.name} for all subjects including Mathematics, Physics, Chemistry, Biology, English, 
            Urdu, Computer Science, and more. We cover all major areas: {cityInfo.areas}.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            How to Get Home Tutors in {cityInfo.name}
          </h3>
          
          <p className="text-gray-700 leading-relaxed mb-6">
            Finding quality home tutors in {cityInfo.name} is now simple with Apna Tuition. Just press the button above 
            to submit your requirements, and our team will connect you with verified tutors in your area. Whether you 
            prefer home tuition or online classes, we have {cityInfo.stats.toLowerCase()} ready to teach.
          </p>

          <div className="text-center mt-10">
            <button
              onClick={handleGetTutor}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Get Started - Request Tutors in {cityInfo.name}
            </button>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
