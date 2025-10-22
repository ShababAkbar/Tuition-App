import { Link } from 'react-router-dom';
import { User } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end items-center h-16">
          <Link
            to="/profile"
            className="flex items-center px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <User className="w-5 h-5 mr-2" />
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
}
