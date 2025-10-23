import { Link } from 'react-router-dom';
import { GraduationCap, Home, User } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">TutorHub</span>
          </Link>

          <div className="flex space-x-4">
            <Link
              to="/"
              className="flex items-center px-4 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              Home
            </Link>
            <Link
              to="/profile"
              className="flex items-center px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors border border-gray-300"
            >
              <User className="w-5 h-5 mr-2" />
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
