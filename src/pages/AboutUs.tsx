import { Target, Users, Award, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About ApnaTuition</h1>
            <p className="text-xl text-blue-100">
              Connecting students with qualified tutors across Pakistan since 2024
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-lg text-gray-600">
                Making high-quality home tuition and online tutoring accessible, affordable, and results-driven for every student in Pakistan.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Quality Education</h3>
                <p className="text-gray-600">
                  We ensure every tutor meets our strict quality standards
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Personalized Learning</h3>
                <p className="text-gray-600">
                  One-on-one attention tailored to each student's needs
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Proven Results</h3>
                <p className="text-gray-600">
                  Track record of improving student grades and confidence
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Story</h2>
            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="mb-4">
                ApnaTuition was founded with a simple yet powerful vision: to bridge the gap between students seeking quality education and experienced tutors across Pakistan.
              </p>
              <p className="mb-4">
                We understand that every student learns differently. Traditional classroom settings don't always provide the personalized attention needed for true understanding. That's where we come in.
              </p>
              <p>
                Today, we're proud to connect thousands of students with qualified tutors, helping them achieve their academic goals and build confidence in their abilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Core Values</h2>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Heart className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2">Student-First Approach</h3>
                  <p className="text-gray-600">
                    Every decision we make prioritizes student success and learning experience.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2">Excellence in Teaching</h3>
                  <p className="text-gray-600">
                    We maintain high standards by carefully vetting and supporting our tutors.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2">Community Building</h3>
                  <p className="text-gray-600">
                    Creating a supportive learning community for students, tutors, and parents.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of students achieving their academic goals with ApnaTuition
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                onClick={() => navigate('/tuition-request')}
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Find a Tutor
              </Button>
              <Button 
                onClick={() => navigate('/auth?type=tutor')}
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-blue-700"
              >
                Become a Tutor
              </Button>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
};

export default AboutUs;
