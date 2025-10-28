import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, GraduationCap } from "lucide-react";

const LandingFooter = () => {
  return (
    <footer className="border-t border-gray-800 bg-black">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-white">TutorHub</span>
            </div>
            <p className="text-sm text-gray-400">
              Making high-quality home tuition and online tutoring accessible, affordable, and results-driven.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-sm text-gray-400 hover:text-blue-600 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#services" className="text-sm text-gray-400 hover:text-blue-600 transition-colors">
                  Our Services
                </a>
              </li>
              <li>
                <a href="/profile" className="text-sm text-gray-400 hover:text-blue-600 transition-colors">
                  Become a Tutor
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-blue-600 transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="#services" className="text-sm text-gray-400 hover:text-blue-600 transition-colors">
                  Home Tutoring
                </a>
              </li>
              <li>
                <a href="#services" className="text-sm text-gray-400 hover:text-blue-600 transition-colors">
                  Online Tutoring
                </a>
              </li>
              <li>
                <a href="#services" className="text-sm text-gray-400 hover:text-blue-600 transition-colors">
                  Exam Preparation
                </a>
              </li>
              <li>
                <a href="#services" className="text-sm text-gray-400 hover:text-blue-600 transition-colors">
                  O/A Levels
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-blue-600 mt-0.5" />
                <span className="text-sm text-gray-400">+92 300 1234567</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-blue-600 mt-0.5" />
                <span className="text-sm text-gray-400">info@tutorhub.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-blue-600 mt-0.5" />
                <span className="text-sm text-gray-400">Karachi, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © 2025 TutorHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
