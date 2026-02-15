import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, Phone, Clock, MapPin } from "lucide-react";
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
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract city from pathname (e.g., /tuition-in-lahore -> lahore)
  const pathname = location.pathname;
  const cityMatch = pathname.match(/\/tuition-in-(.+)/);
  const cityKey = cityMatch ? cityMatch[1].toLowerCase() : "";
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
  const pageTitle = `Best Home Tutors in ${cityInfo.name} | Expert Online Tuition | Affordable Cambridge Tutoring`;
  const pageDescription = `Find the best home tutors in ${cityInfo.name}. Expert online tuition & home tuition services for O-Level, A-Level, IGCSE, Cambridge curriculum, Matric, FSc & University. ${cityInfo.stats} verified tutors. 100% free platform - no commission charged.`;
  const canonicalUrl = `https://apna-tuition.com/tuition-in-${cityKey}`;
  const keywords = `home tuition ${cityInfo.name}, online tuition ${cityInfo.name}, expert tutors ${cityInfo.name}, find tutors ${cityInfo.name}, home tuition in ${cityInfo.name}, tutor in ${cityInfo.name}, best home tutors in ${cityInfo.name}, affordable cambridge curriculum tutoring, tutors in ${cityInfo.name}, home tutors ${cityInfo.name}, private tutors ${cityInfo.name}, O level tutors ${cityInfo.name}, A level tutors ${cityInfo.name}, best home tuition ${cityInfo.name}, IGCSE tutors ${cityInfo.name}, university tutors ${cityInfo.name}, entry test preparation ${cityInfo.name}, language tutors ${cityInfo.name}, female tutors ${cityInfo.name}, male tutors ${cityInfo.name}`;

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
    <div className="min-h-screen bg-white">
      {/* SEO Head with Canonical, Schema, and Meta Tags */}
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        canonical={canonicalUrl}
        keywords={keywords}
        schema={[localBusinessSchema, serviceSchema]}
      />
      
      <LandingNavbar />
      
      {/* Hero Section with Gradient Background */}
      <section className="relative pt-20 pb-16 px-3 bg-gradient-to-r from-purple-600 via-purple-500 to-blue-600 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-700/20 to-blue-700/20"></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
            FIND THE BEST HOME & ONLINE TUTORS IN {cityInfo.name.toUpperCase()}
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-white/95 mb-7 max-w-4xl mx-auto leading-relaxed">
            Expert tutoring for O-Level, A-Level, IGCSE, Cambridge Curriculum, Matric, FSc, Entry Tests & University Students, ensuring academic excellence.
          </p>

          {/* CTA Button */}
          <button
            onClick={handleGetTutor}
            className="bg-white text-purple-700 px-10 py-4 rounded-lg text-lg font-bold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 inline-block"
          >
            Get a Tutor Now
          </button>
        </div>
      </section>

      {/* Contact Bar */}
      <div className="bg-gray-900 text-white py-3 px-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-6 text-sm md:text-base">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>+923194394344</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{cityInfo.name} | Karachi | Islamabad</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Mon - Sat | 9.00 AM - 10.00 PM</span>
          </div>
        </div>
      </div>

      {/* Private Online/Home Tutoring Section */}
      <section className="py-12 px-3 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start gap-4 mb-6">
            <span className="text-3xl">⏳</span>
            <h2 className="text-2xl md:text-3xl font-bold text-blue-600">
              Private Online / Home Tutoring - The Most Effective Way of Learning
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5 text-base">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <span className="font-semibold">One-on-One Personalized Tutoring</span>
                <span className="text-gray-600"> – Tailored learning for better understanding.</span>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <span className="font-semibold">Best Online Tutors in Pakistan</span>
                <span className="text-gray-600"> – Learn from anywhere with interactive sessions.</span>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <span className="font-semibold">Group Study & Individual Sessions</span>
                <span className="text-gray-600"> – Choose the study format that suits you best.</span>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <span className="font-semibold">Flexible Schedules</span>
                <span className="text-gray-600"> – Learn at your preferred time.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experienced Male & Female Tutors Section */}
      <section className="py-12 px-3 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start gap-4 mb-6">
            <span className="text-3xl">👨‍🏫</span>
            <h2 className="text-2xl md:text-3xl font-bold text-green-700">
              Experienced Male & Female Tutors in {cityInfo.name}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5 text-base">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <span className="font-semibold">Experienced Male & Female Tutors</span>
                <span className="text-gray-600"> – Highly qualified professionals.</span>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <span className="font-semibold">A+ Tutors in {cityInfo.name}</span>
                <span className="text-gray-600"> – Experts Tutors with Results Oriented Approach</span>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <span className="font-semibold">Home Tuition for All Grades</span>
                <span className="text-gray-600"> – Kindergarten to University level support.</span>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <span className="font-semibold">Special Needs & Slow Learners Support</span>
                <span className="text-gray-600"> – Tailored guidance for unique learning needs.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Entry Test Preparation & University Level Tutoring Section */}
      <section className="py-12 px-3 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start gap-4 mb-6">
            <span className="text-3xl">🏆</span>
            <h2 className="text-2xl md:text-3xl font-bold text-purple-700">
              Entry Test Preparation & University Level Tutoring
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5 text-base">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <span className="font-semibold">University Level Tutoring</span>
                <span className="text-gray-600"> – Engineering, Medical, Business & Computer Science support.</span>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <span className="font-semibold">Entry Test Preparation</span>
                <span className="text-gray-600"> – MDCAT, ECAT, SAT, GRE, IELTS & NTS coaching.</span>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <span className="font-semibold">Mock Tests & Past Papers Practice</span>
                <span className="text-gray-600"> – Ensure top scores with proven strategies.</span>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <span className="font-semibold">Language Courses</span>
                <span className="text-gray-600"> – English, Urdu, Arabic, French & other languages.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 100% Free Platform Section */}
      <section className="py-12 px-3 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-6xl mx-auto text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-5">
            100% FREE Platform for Parents - No Commission Charged
          </h2>
          <p className="text-base md:text-lg mb-6 leading-relaxed">
            At Apna Tuition, we believe quality education should be accessible to everyone. That's why we 
            <span className="font-bold"> don't charge any commission or registration fees from parents</span>. 
            Our platform is completely free for you!
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
            <div className="grid md:grid-cols-3 gap-5 text-base">
              <div className="flex flex-col items-center">
                <CheckCircle2 className="w-8 h-8 mb-2" />
                <span className="font-semibold">No Registration Fee</span>
              </div>
              <div className="flex flex-col items-center">
                <CheckCircle2 className="w-8 h-8 mb-2" />
                <span className="font-semibold">No Hidden Charges</span>
              </div>
              <div className="flex flex-col items-center">
                <CheckCircle2 className="w-8 h-8 mb-2" />
                <span className="font-semibold">No Commission</span>
              </div>
            </div>
          </div>

          <p className="text-base mb-6">
            You only pay the tutor directly for their teaching services. We simply connect you with qualified, 
            verified tutors in {cityInfo.name} and across Pakistan.
          </p>

          <button
            onClick={handleGetTutor}
            className="bg-white text-purple-700 px-10 py-4 rounded-lg text-lg font-bold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all inline-block"
          >
            Request a Tutor - It's 100% Free!
          </button>
        </div>
      </section>

      {/* All Subjects Available Section */}
      <section className="py-12 px-3 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">
            All Subjects & Educational Levels Available in {cityInfo.name}
          </h2>

          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="p-5 bg-blue-50 rounded-xl">
              <h3 className="text-lg font-bold text-blue-700 mb-3">Science Subjects</h3>
              <p className="text-sm text-gray-700">Mathematics, Physics, Chemistry, Biology, Computer Science</p>
            </div>
            
            <div className="p-5 bg-green-50 rounded-xl">
              <h3 className="text-lg font-bold text-green-700 mb-3">Language Subjects</h3>
              <p className="text-sm text-gray-700">English, Urdu, Islamiyat, Pakistan Studies, Arabic, French</p>
            </div>
            
            <div className="p-5 bg-purple-50 rounded-xl">
              <h3 className="text-lg font-bold text-purple-700 mb-3">Commerce Subjects</h3>
              <p className="text-sm text-gray-700">Accounting, Economics, Business Studies, Statistics</p>
            </div>

            <div className="p-5 bg-orange-50 rounded-xl">
              <h3 className="text-lg font-bold text-orange-700 mb-3">Cambridge & University</h3>
              <p className="text-sm text-gray-700">O-Level, A-Level, IGCSE, University Subjects, Entry Tests</p>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Areas Section */}
      <section className="py-12 px-3 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-6">
            We Cover All Areas in {cityInfo.name}
          </h2>
          
          <p className="text-base text-gray-700 text-center mb-6 leading-relaxed">
            Our {cityInfo.stats.toLowerCase()} are available in <span className="font-semibold">{cityInfo.areas}</span>. 
            No matter where you are in {cityInfo.name}, we can connect you with qualified tutors near you.
          </p>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">How It Works:</h3>
            <ol className="space-y-3 text-base text-gray-700">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</span>
                <span><span className="font-semibold">Submit Your Request</span> – Tell us your subject, grade, and preferred timing</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</span>
                <span><span className="font-semibold">Get Matched</span> – We'll connect you with suitable tutors in your area</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</span>
                <span><span className="font-semibold">Start Learning</span> – Begin your classes and pay the tutor directly (no commission to us!)</span>
              </li>
            </ol>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={handleGetTutor}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-lg text-lg font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Get Started Now - Find Tutors in {cityInfo.name}
            </button>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-12 px-3 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-5">
            Best Home Tuition in {cityInfo.name} - Expert Tutors Near You
          </h2>
          
          <p className="text-base text-gray-700 leading-relaxed mb-5">
            Looking for reliable <strong>home tuition in {cityInfo.name}</strong>? Apna Tuition is Pakistan's premier platform 
            connecting students and parents with qualified, verified teachers. Whether you need <strong>online tuition</strong>, 
            <strong> home tutors in {cityInfo.name}</strong>, or <strong>expert tutors</strong> for O-Level, 
            A-Level, IGCSE, Matric, FSc, or university subjects, we have the <strong>best home tutors in {cityInfo.name}</strong> ready to help your child excel.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Find Tutors in {cityInfo.name} - Affordable & Quality Education
          </h3>
          
          <p className="text-base text-gray-700 leading-relaxed mb-5">
            Unlike other platforms that charge hefty commissions, Apna Tuition is <span className="font-semibold">100% free for parents</span>. 
            We offer <strong>affordable Cambridge curriculum tutoring</strong> and connect you with the <strong>best tutors in {cityInfo.name}</strong> 
            without any financial barriers. When you search for "<strong>tutor in {cityInfo.name}</strong>" or "<strong>home tuition {cityInfo.name}</strong>", 
            we ensure you get qualified, experienced teachers who deliver results.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Expert Online Tuition & Home Tutoring Services
          </h3>
          
          <p className="text-base text-gray-700 leading-relaxed mb-5">
            Our platform offers both <strong>online tuition</strong> and traditional home tutoring services. <strong>Find tutors</strong> for 
            all subjects including Mathematics, Physics, Chemistry, Biology, English, Urdu, Computer Science, Accounting, Economics, and more. 
            We have {cityInfo.stats.toLowerCase()} providing personalized instruction tailored to each student's learning style.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Cambridge Curriculum Tutoring & University Level Support
          </h3>
          
          <p className="text-base text-gray-700 leading-relaxed mb-5">
            Specializing in <strong>affordable Cambridge curriculum tutoring</strong>, our tutors provide expert guidance for O-Level, A-Level, 
            and IGCSE students. We also offer university-level tutoring for engineering, medical, business, and computer science students. 
            Whether you need help with entry test preparation (MDCAT, ECAT, SAT, GRE) or language courses (English, Urdu, Arabic, French), 
            our <strong>expert tutors</strong> are here to support your academic journey.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Why Choose Apna Tuition for Home Tutoring in {cityInfo.name}?
          </h3>
          
          <ul className="list-disc list-inside space-y-2 text-base text-gray-700 mb-5">
            <li><strong>Verified & Experienced Tutors</strong> - All our tutors are thoroughly vetted for qualifications and teaching experience</li>
            <li><strong>100% Free Platform</strong> - No registration fees, no hidden charges, no commission from parents</li>
            <li><strong>Flexible Learning Options</strong> - Choose between home tuition and online classes based on your convenience</li>
            <li><strong>All Areas Covered</strong> - Tutors available throughout {cityInfo.areas}</li>
            <li><strong>Personalized Attention</strong> - One-on-one sessions tailored to individual learning needs</li>
            <li><strong>Affordable Rates</strong> - Direct payment to tutors means competitive pricing</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-900 mb-4">
            How to Find the Best Home Tutors in {cityInfo.name}
          </h3>
          
          <p className="text-base text-gray-700 leading-relaxed mb-5">
            Finding quality <strong>home tutors in {cityInfo.name}</strong> is now simple with Apna Tuition. Simply click the button below 
            to submit your requirements - specify your subject, grade level, preferred area in {cityInfo.name}, and timing. Our team will 
            connect you with verified tutors who match your criteria. You can choose the best tutor based on their qualifications, 
            experience, and teaching approach. Start your journey to academic excellence today with the <strong>best home tutors in {cityInfo.name}</strong>!
          </p>

          <div className="bg-blue-50 p-6 rounded-xl mt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
              Ready to Find Expert Tutors?
            </h3>
            <p className="text-center text-base text-gray-700 mb-5">
              Join thousands of satisfied parents in {cityInfo.name} who trust Apna Tuition for quality <strong>home tuition</strong> 
              and <strong>online tuition</strong> services.
            </p>
            <div className="text-center">
              <button
                onClick={handleGetTutor}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-lg text-lg font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all inline-block"
              >
                Request a Tutor Now - Completely Free!
              </button>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
