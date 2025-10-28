import { Button } from "@/components/ui/button";
import { Menu, Search, GraduationCap } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LandingNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">TutorHub</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <a href="#home" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Home
            </a>
            <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              About Us
            </a>
            <a href="#services" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Services
            </a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Contact
            </a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-4 md:flex">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
              onClick={() => navigate('/tuitions')}
            >
              Find a Tutor
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-border py-4 md:hidden">
            <div className="flex flex-col gap-4">
              <a href="#home" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Home
              </a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                About Us
              </a>
              <a href="#services" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Services
              </a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Contact
              </a>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                size="lg"
                onClick={() => navigate('/tuitions')}
              >
                Find a Tutor
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default LandingNavbar;
