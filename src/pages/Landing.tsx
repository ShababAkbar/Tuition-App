import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingHero from "@/components/landing/LandingHero";
import LandingStats from "@/components/landing/LandingStats";
import LandingServices from "@/components/landing/LandingServices";
import LandingReviews from "@/components/landing/LandingReviews";
import TopCities from "@/components/landing/TopCities";
import LandingFooter from "@/components/landing/LandingFooter";

const Landing = () => {
  return (
    <div className="min-h-screen">
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
