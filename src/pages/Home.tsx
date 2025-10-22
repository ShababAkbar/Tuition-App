import { useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { supabase, Tuition } from '../lib/supabase';
import TuitionCard from '../components/TuitionCard';

export default function Home() {
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTuitions();
  }, []);

  const fetchTuitions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tuition')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTuitions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tuitions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Available Tuitions</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse through available tutoring opportunities and find the perfect match for your expertise
          </p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading tuitions...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && tuitions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No tuitions available at the moment.</p>
          </div>
        )}

        {!loading && !error && tuitions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tuitions.map((tuition) => (
              <TuitionCard key={tuition.id} tuition={tuition} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
