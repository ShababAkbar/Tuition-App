import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, MapPin, Clock, DollarSign, User, Calendar } from 'lucide-react';
import { supabase, Tuition } from '../lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function TuitionDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tuition, setTuition] = useState<Tuition | null>(null);
  const [profileStatus, setProfileStatus] = useState<'incomplete' | 'pending' | 'approved' | 'rejected'>('incomplete');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchTuitionDetails(id);
    }
    checkProfileStatus();
  }, [id]);

  const checkProfileStatus = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      
      if (!user) {
        setProfileStatus('incomplete');
        return;
      }

      const { data: tutorProfile } = await supabase
        .from('new_tutor')
        .select('status')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!tutorProfile) {
        setProfileStatus('incomplete');
      } else {
        setProfileStatus(tutorProfile.status);
      }
    } catch (err) {
      console.error('Error checking profile status:', err);
    }
  };

  const fetchTuitionDetails = async (tuitionId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tuition')
        .select('*')
        .eq('id', tuitionId)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Tuition not found');
      setTuition(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tuition details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (profileStatus === 'incomplete') {
      toast({
        title: 'Profile Incomplete',
        description: 'Please complete your profile first before applying for tuitions.',
        variant: 'destructive',
      });
      setTimeout(() => navigate('/tutor-onboarding'), 1500);
      return;
    }

    if (profileStatus === 'pending') {
      toast({
        title: 'Profile Under Review',
        description: 'Your profile is pending approval. You will be able to apply once it is approved.',
        variant: 'destructive',
      });
      return;
    }

    if (profileStatus === 'rejected') {
      toast({
        title: 'Profile Rejected',
        description: 'Your profile was not approved. Please contact support for assistance.',
        variant: 'destructive',
      });
      return;
    }

    // If approved, proceed with application
    toast({
      title: 'Application Submitted!',
      description: 'Your application for this tuition has been submitted successfully.',
    });
    // Add actual application logic here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading details...</p>
        </div>
      </div>
    );
  }

  if (error || !tuition) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-4">
            <p>{error || 'Tuition not found'}</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to All Tuitions
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white mb-2">Tuition Details</h1>
            <p className="text-blue-100">Complete information about this tutoring opportunity</p>
          </div>

          <div className="px-8 py-6 space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <div className="flex items-center text-gray-500 text-sm mb-2">
                <User className="w-4 h-4 mr-2" />
                Student Information
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">{tuition.student_name}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Subject
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{tuition.subject}</p>
                </div>

                <div>
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Grade/Class
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{tuition.grade}</p>
                </div>

                <div>
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Fee
                  </div>
                  <p className="text-lg font-semibold text-green-600">{tuition.fee}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    Location
                  </div>
                  <p className="text-lg text-gray-900">{tuition.location}</p>
                </div>

                <div>
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <Clock className="w-4 h-4 mr-2" />
                    Timing
                  </div>
                  <p className="text-lg text-gray-900">{tuition.timing}</p>
                </div>

                <div>
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    Posted On
                  </div>
                  <p className="text-lg text-gray-900">
                    {new Date(tuition.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <button
                onClick={handleApply}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Apply for This Tuition
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
