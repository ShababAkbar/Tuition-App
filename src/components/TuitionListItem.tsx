import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { supabase, Tuition } from '../lib/supabase';
import { verifyAuthenticatedUser } from '../lib/auth';
import ApplicationModal from './ApplicationModal';

interface TuitionListItemProps {
  tuition: Tuition;
  onUpdate: () => void;
}

export default function TuitionListItem({ tuition, onUpdate }: TuitionListItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [applying, setApplying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [profileStatus, setProfileStatus] = useState<'incomplete' | 'pending' | 'approved' | 'rejected'>('incomplete');

  useEffect(() => {
    checkProfileStatus();
  }, []);

  const checkProfileStatus = async () => {
    try {
      const user = await verifyAuthenticatedUser();
      if (!user) {
        setProfileStatus('incomplete');
        return;
      }

      // Check if approved in tutors table
      const { data: tutorData } = await supabase
        .from('tutors')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (tutorData) {
        setProfileStatus('approved');
      } else {
        // Check new_tutor table for pending status
        const { data: pendingProfile } = await supabase
          .from('new_tutor')
          .select('status')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (pendingProfile) {
          setProfileStatus(pendingProfile.status as 'pending' | 'rejected');
        } else {
          setProfileStatus('incomplete');
        }
      }
    } catch (error) {
      console.error('Error checking profile status:', error);
    }
  };

  const handleApply = async () => {
    // Check profile status before showing modal
    if (profileStatus === 'incomplete') {
      alert('Please create a tutor profile first before applying for tuitions.');
      return;
    }

    if (profileStatus === 'pending') {
      alert('Your profile is pending approval. You will be able to apply once it is approved.');
      return;
    }

    if (profileStatus === 'rejected') {
      alert('Your profile was not approved. Please contact support for assistance.');
      return;
    }

    // Show application modal
    setShowModal(true);
  };

  const handleSubmitApplication = async (coverLetter: string) => {
    try {
      setApplying(true);
      setShowModal(false);

      const user = await verifyAuthenticatedUser();
      if (!user) {
        alert('Please login first');
        return;
      }

      const { data: tutorData } = await supabase
        .from('tutors')
        .select('id, first_name, last_name, contact, city, subjects')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!tutorData) {
        alert('Tutor profile not found. Please try again.');
        return;
      }

      // Create application entry with cover letter
      const { error } = await supabase
        .from('tuition_applications')
        .insert({
          tuition_id: tuition.id,
          tutor_id: tutorData.id,
          tutor_name: `${tutorData.first_name} ${tutorData.last_name}`,
          tutor_contact: tutorData.contact,
          tutor_city: tutorData.city,
          tutor_subjects: tutorData.subjects,
          cover_letter: coverLetter,
          status: 'pending',
        });

      if (error) {
        // Check if already applied
        if (error.code === '23505') {
          alert('You have already applied for this tuition!');
        } else {
          throw error;
        }
        return;
      }

      alert('Application submitted successfully! Admin will review and assign.');
      onUpdate();
    } catch (error) {
      console.error('Error applying for tuition:', error);
      alert('Failed to apply for tuition');
    } finally {
      setApplying(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    }) + ', ' + date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Grade: {tuition.grade} Subject: {tuition.subject}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{formatDate(tuition.created_at)}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-900">{tuition.tuition_code}</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    tuition.tuition_type === 'Online Tuition'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-cyan-100 text-cyan-700'
                  }`}
                >
                  {tuition.tuition_type}
                </span>
                <span className="text-sm font-medium text-gray-900">{tuition.city}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            {!tuition.tutor_id && (
              <button
                onClick={handleApply}
                disabled={applying}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium px-6 py-2 rounded-lg transition-colors"
              >
                {applying ? 'Applying...' : 'Apply'}
              </button>
            )}
            {tuition.tutor_id && (
              <span className="bg-green-100 text-green-700 font-medium px-6 py-2 rounded-lg">
                Applied
              </span>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronDown
                className={`w-5 h-5 text-gray-600 transition-transform ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Student Name</p>
                <p className="font-medium text-gray-900">{tuition.student_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium text-gray-900">{tuition.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Timing</p>
                <p className="font-medium text-gray-900">{tuition.timing}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fee</p>
                <p className="font-medium text-green-600">{tuition.fee}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Subject</p>
                <p className="font-medium text-gray-900">{tuition.subject}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Grade</p>
                <p className="font-medium text-gray-900">{tuition.grade}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Application Modal */}
      <ApplicationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitApplication}
        tuitionDetails={{
          code: tuition.tuition_code,
          subject: tuition.subject,
          grade: tuition.grade,
          fee: tuition.fee,
        }}
      />
    </div>
  );
}
