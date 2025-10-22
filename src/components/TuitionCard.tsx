import { useNavigate } from 'react-router-dom';
import { BookOpen, MapPin, Clock, DollarSign } from 'lucide-react';
import { Tuition } from '../lib/supabase';

interface TuitionCardProps {
  tuition: Tuition;
}

export default function TuitionCard({ tuition }: TuitionCardProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            {tuition.student_name}
          </h3>
          <div className="flex items-center text-gray-600 mb-2">
            <BookOpen className="w-4 h-4 mr-2" />
            <span className="font-medium">{tuition.subject}</span>
            <span className="mx-2">•</span>
            <span>{tuition.grade}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-600">
          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="text-sm">{tuition.location}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="text-sm">{tuition.timing}</span>
        </div>
        <div className="flex items-center text-green-600 font-semibold">
          <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{tuition.fee}</span>
        </div>
      </div>

      <button
        onClick={() => navigate(`/tuition/${tuition.id}`)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        View Details
      </button>
    </div>
  );
}
