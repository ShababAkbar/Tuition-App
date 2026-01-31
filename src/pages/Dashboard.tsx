import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Briefcase, ChevronRight, GraduationCap } from 'lucide-react';
import { supabase, Tuition, Tutor } from '../lib/supabase';
import { verifyAuthenticatedUser } from '../lib/auth';
import TuitionCard from '../components/TuitionCard';

export default function Dashboard() {
  const navigate = useNavigate();
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [tutorProfile, setTutorProfile] = useState<any>(null);
  const [profileStatus, setProfileStatus] = useState<'incomplete' | 'pending' | 'approved' | 'rejected'>('incomplete');
  const [latestTuitions, setLatestTuitions] = useState<Tuition[]>([]);
  const [myTuitionsCount, setMyTuitionsCount] = useState(0);
  const [allTuitionsCount, setAllTuitionsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Verify user actually exists in database
      const user = await verifyAuthenticatedUser();
      
      if (!user) {
        navigate('/auth?type=tutor');
        return;
      }

      // Check new_tutor table (pending applications)
      const { data: tutorProfileData } = await supabase
        .from('new_tutor')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      setTutorProfile(tutorProfileData);

      // Check tutors table (approved tutors)
      const { data: tutorData } = await supabase
        .from('tutors')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      setTutor(tutorData);

      if (!tutorProfileData) {
        // No profile exists at all
        setProfileStatus('incomplete');
      } else {
        if (tutorData) {
          // Entry in tutors table means approved
          setProfileStatus('approved');
        } else {
          // No entry in tutors table, use new_tutor status
          setProfileStatus(tutorProfileData.status as 'pending' | 'approved' | 'rejected');
        }
      }

      const [latestResult, allCountResult] = await Promise.all([
        supabase.from('tuition').select('*').eq('status', 'available').order('created_at', { ascending: false }).limit(4),
        supabase.from('tuition').select('id', { count: 'exact', head: true }).eq('status', 'available'),
      ]);

      if (tutorData) {
        const myTuitionsResult = await supabase
          .from('tuition')
          .select('id', { count: 'exact', head: true })
          .eq('tutor_id', tutorData.id)
          .eq('status', 'assigned');

        setMyTuitionsCount(myTuitionsResult.count || 0);
      }

      setLatestTuitions(latestResult.data || []);
      setAllTuitionsCount(allCountResult.count || 0);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Profile Status Banner */}
        {profileStatus === 'incomplete' && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-100 rounded-full p-2">
                <GraduationCap className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-yellow-900">Complete Your Profile</h3>
                <p className="text-sm text-yellow-700">
                  Complete your profile to start applying for tuitions
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/tutor-onboarding')}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Complete Now
            </button>
          </div>
        )}

        {(profileStatus === 'pending') && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center space-x-3">
            <div className="bg-blue-100 rounded-full p-2">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">Profile Under Review</h3>
              <p className="text-sm text-blue-700">
                Your profile is pending approval. You can browse tuitions but cannot apply yet.
              </p>
            </div>
          </div>
        )}

        {profileStatus === 'rejected' && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
            <div className="bg-red-100 rounded-full p-2">
              <GraduationCap className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-red-900">Profile Rejected</h3>
              <p className="text-sm text-red-700">
                Your profile was not approved. Please contact support for more information.
              </p>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {tutorProfile?.first_name || 'Tutor'}
          </h1>
          <p className="text-gray-600">Here's what's happening with your tuitions today</p>
        </div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
  <button
    onClick={() => navigate('/tuitions')}
    className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-all flex items-center justify-between group"
  >
    <div className="flex items-center space-x-3">
      <div className="bg-blue-100 rounded-md p-2.5">
        <BookOpen className="w-5 h-5 text-blue-600" />
      </div>
      <div className="text-left">
        <h3 className="text-lg font-semibold text-gray-900">{allTuitionsCount}</h3>
        <p className="text-sm text-gray-600 font-medium">All Tuitions</p>
      </div>
    </div>
    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
  </button>

  <button
    onClick={() => navigate('/my-tuitions')}
    className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-all flex items-center justify-between group"
  >
    <div className="flex items-center space-x-3">
      <div className="bg-green-100 rounded-md p-2.5">
        <Briefcase className="w-5 h-5 text-green-600" />
      </div>
      <div className="text-left">
        <h3 className="text-lg font-semibold text-gray-900">{myTuitionsCount}</h3>
        <p className="text-sm text-gray-600 font-medium">My Tuitions</p>
      </div>
    </div>
    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" />
  </button>
</div>


<div className="bg-white rounded-lg shadow-sm p-4">
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center space-x-2">
      <GraduationCap className="w-5 h-5 text-blue-600" />
      <h2 className="text-lg font-semibold text-gray-900">Recent Tuition Listings</h2>
    </div>
  </div>

  {latestTuitions.length === 0 ? (
    <p className="text-gray-600 text-center py-6">No tuitions available at the moment</p>
  ) : (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {latestTuitions.map((tuition) => (
          <TuitionCard key={tuition.id} tuition={tuition} />
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => navigate('/tuitions')}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors"
        >
          View All
        </button>
      </div>
    </>
  )}
</div>

      </div>
    </div>
  );
}
