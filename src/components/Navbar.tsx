import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, LogOut, User, Shield, Menu, BookOpen, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signOut } from '@/lib/auth';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ADMIN_USER_ID } from '@/lib/constants';
import logo from '@/assets/logo.png';

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAdmin(user?.id === ADMIN_USER_ID);
    };
    checkAdmin();
  }, []);

  const handleSignOut = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);
    try {
      await signOut();
      toast({ title: 'Signed out successfully.' });
      navigate('/auth?type=tutor');
    } catch (error: any) {
      toast({
        title: 'Failed to sign out',
        description: error.message ?? 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo - Left aligned */}
          <Link to="/" className="flex items-center space-x-1 sm:space-x-2 flex-1 lg:flex-none">
            <img src={logo} alt="ApnaTuition" className="h-8 sm:h-10" />
            <span className="text-lg sm:text-xl lg:text-2xl font-bold">
              <span className="text-gray-900">Apna</span>
              <span className="text-blue-600">Tuition</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-3">
            {isAdmin && (
              <Link
                to="/admin-dashboard"
                className="flex items-center px-3 py-2 rounded-lg font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors"
              >
                <Shield className="w-4 h-4 mr-2" />
                Admin
              </Link>
            )}
            <Link
              to="/dashboard"
              className="flex items-center px-3 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Link>
            <Link
              to="/profile"
              className="flex items-center px-3 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors border border-gray-300"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-red-50 transition-colors border border-red-200 text-red-600"
              disabled={isSigningOut}
            >
              <LogOut className="w-5 h-5 mr-2" />
              {isSigningOut ? 'Signing out...' : 'Sign out'}
            </button>
          </div>

          {/* Mobile Profile Button */}
          <Link to="/profile" className="lg:hidden p-2 rounded-full bg-gray-100">
            <User className="w-5 h-5 text-gray-700" />
          </Link>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </nav>
  );
}

// Mobile Bottom Navigation Component
function MobileBottomNav() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/my-tuitions', icon: Briefcase, label: 'My Tuitions' },
    { path: '/tuitions', icon: BookOpen, label: 'Tuitions' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 ${
              isActive(item.path)
                ? 'text-blue-600'
                : 'text-gray-600'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
