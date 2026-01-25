import { TrendingUp, Users, Award, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface StatsData {
  totalTutors: string;
  totalStudents: string;
  rating: string;
  legacy: string;
}

const LandingStats = () => {
  const [stats, setStats] = useState<StatsData>({
    totalTutors: "3000+",
    totalStudents: "5000+",
    rating: "4.5+",
    legacy: "1 Month",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch from dashboard_stats view
      const { data, error } = await supabase
        .from('dashboard_stats')
        .select('*')
        .single();

      if (error) throw error;

      if (data) {
        setStats({
          totalTutors: data.active_tutors + '+' || '0+',
          totalStudents: data.happy_students || '0',
          rating: data.rating + '+' || '4.5+',
          legacy: data.legacy || '1 Month',
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Keep default values on error
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    {
      icon: Users,
      value: stats.totalTutors,
      label: "Active Tutors",
    },
    {
      icon: TrendingUp,
      value: stats.totalStudents,
      label: "Happy Students",
    },
    {
      icon: Award,
      value: stats.rating,
      label: "Ranked on Google",
    },
    {
      icon: Clock,
      value: stats.legacy,
      label: "Years Of Legacy",
    },
  ];

  return (
    <section className="bg-gray-50 py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600 mb-4">
            Our Story in Numbers
          </h2>
          <p className="text-lg text-gray-900 max-w-3xl mx-auto">
            We aim to make high-quality home tuition and online tutoring accessible, affordable, and results-driven.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-4 rounded-2xl bg-white p-8 shadow-sm transition-all hover:shadow-md hover:scale-105"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <stat.icon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-extrabold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingStats;
