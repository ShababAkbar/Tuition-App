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
    <section className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block bg-blue-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide shadow-md">
            Our Story in Numbers
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4 lg:text-4xl">
            Impact That Speaks for Itself
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We aim to make high-quality home tuition and online tutoring accessible, affordable, and results-driven.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 md:gap-8 lg:grid-cols-4">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-4 rounded-2xl bg-white p-6 md:p-8 border border-blue-200 shadow-lg hover:shadow-2xl hover:border-blue-400 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-blue-100 group-hover:scale-110 transition-transform">
                <stat.icon className="h-7 w-7 md:h-8 md:w-8 text-blue-600" />
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-extrabold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-gray-700">
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
