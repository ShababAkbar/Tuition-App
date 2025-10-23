import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Briefcase, ChevronRight, GraduationCap } from 'lucide-react';
import { supabase, Tuition, Tutor } from '../lib/supabase';
import TuitionCard from '../components/TuitionCard';

export default function Dashboard() {
  const navigate = useNavigate();
  const [tutor, setTutor] = useState<Tutor | null>(null);
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

      const [tutorResult, latestResult, allCountResult] = await Promise.all([
        supabase.from('tutor').select('*').limit(1).maybeSingle(),
        supabase.from('tuition').select('*').order('created_at', { ascending: false }).limit(4),
        supabase.from('tuition').select('id', { count: 'exact', head: true }),
      ]);

      if (tutorResult.data) {
        setTutor(tutorResult.data);

        const myTuitionsResult = await supabase
          .from('tuition')
          .select('id', { count: 'exact', head: true })
          .eq('tutor_id', tutorResult.data.id);

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {tutor?.name || 'Tutor'}
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
