import { useEffect, useState } from 'react';
import { Search, Briefcase } from 'lucide-react';
import { supabase, Tuition } from '../lib/supabase';
import { verifyAuthenticatedUser } from '../lib/auth';
import TuitionListItem from '../components/TuitionListItem';
import { useNavigate } from 'react-router-dom';

export default function MyTuitions() {
  const navigate = useNavigate();
  const [myTuitions, setMyTuitions] = useState<Tuition[]>([]);
  const [filteredTuitions, setFilteredTuitions] = useState<Tuition[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [tutorId, setTutorId] = useState<string | null>(null);
  const [profileStatus, setProfileStatus] = useState<'incomplete' | 'pending' | 'approved' | 'rejected'>('incomplete');

  useEffect(() => {
    fetchMyTuitions();
  }, []);

  useEffect(() => {
    applySearch();
  }, [myTuitions, searchQuery]);

  const fetchMyTuitions = async () => {
    try {
      setLoading(true);

      const user = await verifyAuthenticatedUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: tutorData } = await supabase
        .from('tutors')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!tutorData) {
        // Check if profile exists in new_tutor table (pending)
        const { data: pendingProfile } = await supabase
          .from('new_tutor')
          .select('status')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (pendingProfile) {
          setProfileStatus(pendingProfile.status as 'pending' | 'rejected');
        } else {
          setProfileStatus('incomplete');
        }
        
        setLoading(false);
        return;
      }

      setProfileStatus('approved');

      setTutorId(tutorData.id);

      const { data, error } = await supabase
        .from('tuition')
        .select('*')
        .eq('tutor_id', tutorData.id)
        .eq('status', 'assigned') // Only show currently assigned tuitions
        .order('created_at', { ascending: false });

      if (error) throw error;

      setMyTuitions(data || []);
    } catch (error) {
      console.error('Error fetching my tuitions:', error);
    } finally {
      setLoading(false);
    }
  };

  const applySearch = () => {
    if (!searchQuery) {
      setFilteredTuitions(myTuitions);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = myTuitions.filter(
      (t) =>
        t.subject.toLowerCase().includes(query) ||
        t.grade.toLowerCase().includes(query) ||
        t.student_name.toLowerCase().includes(query) ||
        t.tuition_code.toLowerCase().includes(query) ||
        t.city.toLowerCase().includes(query)
    );

    setFilteredTuitions(filtered);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading your tuitions...</p>
        </div>
      </div>
    );
  }

  if (!tutorId) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {profileStatus === 'pending' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <h3 className="font-semibold text-blue-900 mb-2">Profile Under Review</h3>
              <p className="text-blue-700">
                Your profile is pending approval. You will be able to view tuitions once approved.
              </p>
            </div>
          )}
          {profileStatus === 'rejected' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <h3 className="font-semibold text-red-900 mb-2">Profile Rejected</h3>
              <p className="text-red-700">
                Your profile was not approved. Please contact support for more information.
              </p>
            </div>
          )}
          {profileStatus === 'incomplete' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <h3 className="font-semibold text-yellow-900 mb-2">Complete Your Profile</h3>
              <p className="text-yellow-700 mb-4">
                Please create a tutor profile first to view your tuitions.
              </p>
              <button
                onClick={() => navigate('/tutor-onboarding')}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Complete Profile
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
          <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">My Tuitions</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-3 sm:p-6 mb-4 sm:mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search your tuitions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {filteredTuitions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center">
              <Briefcase className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                {myTuitions.length === 0
                  ? "You haven't applied for any tuitions yet"
                  : 'No tuitions found matching your search'}
              </p>
            </div>
          ) : (
            filteredTuitions.map((tuition) => (
              <TuitionListItem key={tuition.id} tuition={tuition} onUpdate={fetchMyTuitions} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
