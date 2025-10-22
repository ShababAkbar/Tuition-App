import { useEffect, useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { supabase, Tuition } from '../lib/supabase';
import TuitionListItem from '../components/TuitionListItem';

export default function AllTuitions() {
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [filteredTuitions, setFilteredTuitions] = useState<Tuition[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTuitions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tuitions, selectedCity, selectedType, searchQuery]);

  const fetchTuitions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tuition')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setTuitions(data || []);

      const uniqueCities = [...new Set(data?.map((t) => t.city) || [])].sort();
      setCities(uniqueCities);
    } catch (error) {
      console.error('Error fetching tuitions:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tuitions];

    if (selectedCity) {
      filtered = filtered.filter((t) => t.city === selectedCity);
    }

    if (selectedType) {
      filtered = filtered.filter((t) => t.tuition_type === selectedType);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.subject.toLowerCase().includes(query) ||
          t.grade.toLowerCase().includes(query) ||
          t.student_name.toLowerCase().includes(query) ||
          t.tuition_code.toLowerCase().includes(query)
      );
    }

    setFilteredTuitions(filtered);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading tuitions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Tuitions List</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Cities</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCity('')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCity === ''
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All Cities
                  </button>
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => setSelectedCity(city)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCity === city
                          ? 'bg-blue-100 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Filter by</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedType('')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedType === ''
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All Types
                  </button>
                  <button
                    onClick={() => setSelectedType('Home Tuition')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedType === 'Home Tuition'
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Home Tuition
                  </button>
                  <button
                    onClick={() => setSelectedType('Online Tuition')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedType === 'Online Tuition'
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Online Tuition
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by subject, grade, student name, or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredTuitions.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-600">No tuitions found matching your criteria</p>
                </div>
              ) : (
                filteredTuitions.map((tuition) => (
                  <TuitionListItem key={tuition.id} tuition={tuition} onUpdate={fetchTuitions} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
