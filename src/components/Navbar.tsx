import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Home, User } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">TutorHub</span>
          </Link>

          <div className="flex space-x-4">
            <Link
              to="/"
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home className="w-5 h-5 mr-2" />
              Home
            </Link>
            <Link
              to="/profile"
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/profile')
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
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
