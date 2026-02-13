import { useEffect } from "react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingHero from "@/components/landing/LandingHero";
import LandingStats from "@/components/landing/LandingStats";
import LandingServices from "@/components/landing/LandingServices";
import LandingReviews from "@/components/landing/LandingReviews";
import TopCities from "@/components/landing/TopCities";
import LandingFooter from "@/components/landing/LandingFooter";
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
        title="Apna Tuition - Home Tutors in Pakistan | Online & Home Tuition Services"
        description="Find qualified home tutors in Karachi, Lahore, Islamabad & all Pakistan. Expert online tutors for all grades and subjects. Best home tuition service near you. Free registration!"
        canonical="https://apna-tuition.com/"
        keywords="home tuition, home tutors near me, online tutors pakistan, tuition in karachi, tuition in lahore, tuition in islamabad, home tutor, private tutor, online tuition, home tuition services, tutors in pakistan, find tutor, tuition academy, home teacher"
        schema={homeSchema}
      />
      <LandingNavbar />
      <main id="home">
        <LandingHero />
        <LandingStats />
        <LandingServices />
        <TopCities />
        <LandingReviews />
      </main>
      <LandingFooter />
    </div>
  );
};

export default Landing;
