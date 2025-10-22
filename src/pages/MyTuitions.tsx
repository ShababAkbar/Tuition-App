import { useEffect, useState } from 'react';
import { Search, Briefcase } from 'lucide-react';
import { supabase, Tuition } from '../lib/supabase';
import TuitionListItem from '../components/TuitionListItem';

export default function MyTuitions() {
  const [myTuitions, setMyTuitions] = useState<Tuition[]>([]);
  const [filteredTuitions, setFilteredTuitions] = useState<Tuition[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [tutorId, setTutorId] = useState<string | null>(null);

  useEffect(() => {
    fetchMyTuitions();
  }, []);

  useEffect(() => {
    applySearch();
  }, [myTuitions, searchQuery]);

  const fetchMyTuitions = async () => {
    try {
      setLoading(true);

      const { data: tutorData } = await supabase
        .from('tutor')
        .select('id')
        .limit(1)
        .maybeSingle();

      if (!tutorData) {
        setLoading(false);
        return;
      }

      setTutorId(tutorData.id);

      const { data, error } = await supabase
        .from('tuition')
        .select('*')
        .eq('tutor_id', tutorData.id)
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
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-800">
              Please create a tutor profile first to view your tuitions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <Briefcase className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">My Tuitions</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search your tuitions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredTuitions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
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
