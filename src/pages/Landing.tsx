import { useEffect } from "react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingHero from "@/components/landing/LandingHero";
import LandingStats from "@/components/landing/LandingStats";
import LandingServices from "@/components/landing/LandingServices";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import LandingReviews from "@/components/landing/LandingReviews";
import TopCities from "@/components/landing/TopCities";
import LandingFooter from "@/components/landing/LandingFooter";
import WhatsAppFloat from "@/components/landing/WhatsAppFloat";
import SEOHead from "@/components/SEOHead";
import { captureReferralCode } from "@/lib/referral";

const Landing = () => {
  // Capture referral code from URL on page load
  useEffect(() => {
    captureReferralCode();
  }, []);

  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Apna Tuition",
    "url": "https://apna-tuition.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://apna-tuition.com/tuitions?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Apna Tuition – Pakistan's #1 Free Home Tutoring Platform | Verified Tutors | No Commission"
        description="Find verified home tutors and online teachers across Pakistan. No registration fee, no commission, and 2–3 free demo classes for parents. Expert tutors for O-Level, A-Level, IGCSE, Matric, FSc & University. 100% free for parents!"
        canonical="https://apna-tuition.com/"
        keywords="home tuition, home tutors near me, online tutors pakistan, tuition in karachi, tuition in lahore, tuition in islamabad, home tutor, private tutor, online tuition, home tuition services, tutors in pakistan, find tutor, tuition academy, home teacher, free tuition, no commission tutoring, verified tutors pakistan"
        schema={homeSchema}
      />
      <LandingNavbar />
      <main id="home">
        <LandingHero />
        <LandingStats />
        <LandingServices />
        <WhyChooseUs />
        <TopCities />
        <LandingReviews />
      </main>
      <LandingFooter />
      <WhatsAppFloat />
    </div>
  );
};

export default Landing;
