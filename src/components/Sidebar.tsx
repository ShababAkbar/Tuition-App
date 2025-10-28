import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

export default function Sidebar({ isExpanded, setIsExpanded }: SidebarProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/my-tuitions', icon: Briefcase, label: 'My Tuitions' },
    { path: '/tuitions', icon: BookOpen, label: 'Tuitions' },
  ];

  return (
    <div
      className={`bg-white shadow-lg fixed left-0 top-16 bottom-0 transition-all duration-300 z-40 ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
    >
      <div className="flex flex-col h-full">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -right-3 top-4 bg-blue-600 text-white rounded-full p-1.5 shadow-lg hover:bg-blue-700 transition-colors"
        >
          {isExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isExpanded && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
