import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface City {
  city: string;
  tutor_count: string;
}

const TopCities = () => {
  const navigate = useNavigate();
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const { data, error } = await supabase
        .from('cities_stats')
        .select('*')
        .limit(6);

      if (error) throw error;

      // Only show real data from database
      if (data && data.length > 0) {
        setCities(data);
      } else {
        setCities([]); // Show empty if no data
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      setCities([]); // Show empty on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Find Tutors in Your City
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We connect students with qualified tutors across major cities in Pakistan
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {loading ? (
            <div className="col-span-full text-center py-8 text-gray-500">Loading cities...</div>
          ) : cities.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">No cities available yet</div>
          ) : (
            cities.map((city, index) => (
              <div
                key={city.city + index}
                onClick={() => navigate('/tuition-request')}
                className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-all cursor-pointer group border border-gray-200 hover:border-blue-600"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-600 transition-colors">
                  <MapPin className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{city.city}</h3>
                <p className="text-sm text-gray-600">{city.tutor_count} tutors</p>
              </div>
            ))
          )}
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            Don't see your city?{" "}
            <button
              onClick={() => navigate("/contact")}
              className="text-blue-600 font-semibold hover:underline"
            >
              Contact us
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};

export default TopCities;
