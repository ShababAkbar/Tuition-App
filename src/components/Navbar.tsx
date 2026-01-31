import { Link, useNavigate } from 'react-router-dom';
import { Home, LogOut, User, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signOut } from '@/lib/auth';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ADMIN_USER_ID } from '@/lib/constants';
import logo from '@/assets/logo.png';

export default function Navbar() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

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
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="ApnaTuition" className="h-12" />
            <span className="text-2xl font-bold">
              <span className="text-gray-900">Apna</span>
              <span className="text-blue-600">Tuition</span>
            </span>
          </Link>

          <div className="flex space-x-4">
            {isAdmin && (
              <Link
                to="/admin-dashboard"
                className="flex items-center px-4 py-2 rounded-lg font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors"
              >
                <Shield className="w-5 h-5 mr-2" />
                Admin Panel
              </Link>
            )}
            <Link
              to="/dashboard"
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
            <button
              onClick={handleSignOut}
              className="flex items-center px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-red-50 transition-colors border border-red-200 text-red-600"
              disabled={isSigningOut}
            >
              <LogOut className="w-5 h-5 mr-2" />
              {isSigningOut ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
