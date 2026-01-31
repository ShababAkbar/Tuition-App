import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, MapPin, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { verifyAuthenticatedUser } from '../lib/auth';
import { notifyTuitionAssignment, notifyTuitionRejection } from '@/lib/email';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ADMIN_USER_ID } from '@/lib/constants';

interface TuitionApplication {
  id: string;
  tuition_id: string;
  tutor_id: string;
  tutor_name: string;
  tutor_contact: string;
  tutor_city: string;
  tutor_subjects: string[];
  status: 'pending' | 'accepted' | 'rejected';
  cover_letter: string;
  applied_at: string;
  reviewed_at: string | null;
  tutors?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    contact: string;
    city: string;
    subjects: string[];
    education: Array<{
      degree: string;
      institution: string;
      year: string;
    }>;
    work_experience: Array<{
      position: string;
      company: string;
      duration: string;
    }>;
    short_bio: string;
    detailed_description: string;
  };
}

interface Tuition {
  id: string;
  tuition_code: string;
  student_name: string;
  subject: string;
  grade: string;
  location: string;
  city: string;
  fee: string;
  status: string;
}

export default function TuitionApplications() {
  const { tuitionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [tuition, setTuition] = useState<Tuition | null>(null);
  const [applications, setApplications] = useState<TuitionApplication[]>([]);

  useEffect(() => {
    checkAuthAndFetch();
  }, [tuitionId]);

  const checkAuthAndFetch = async () => {
    const user = await verifyAuthenticatedUser();
    
    if (!user || user.id !== ADMIN_USER_ID) {
      toast({
        title: "Access Denied",
        description: "Only admin can view applications.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    await fetchData();
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch tuition details
      const { data: tuitionData, error: tuitionError } = await supabase
        .from('tuition')
        .select('*')
        .eq('id', tuitionId)
        .single();

      if (tuitionError) throw tuitionError;
      setTuition(tuitionData);

      // Fetch all applications for this tuition with full tutor details
      const { data: applicationsData, error: appsError } = await supabase
        .from('tuition_applications')
        .select(`
          *,
          tutors:tutor_id (
            id,
            email,
            first_name,
            last_name,
            contact,
            city,
            subjects,
            education,
            work_experience,
            experience_years,
            short_bio,
            detailed_description,
            profile_picture
          )
        `)
        .eq('tuition_id', tuitionId)
        .order('applied_at', { ascending: false });

      if (appsError) throw appsError;
      setApplications(applicationsData || []);

    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (applicationId: string) => {
    try {
      // Get accepted application details before update
      const acceptedApp = applications.find(app => app.id === applicationId);
      if (!acceptedApp) throw new Error('Application not found');

      // Get other pending applications for rejection emails
      const rejectedApps = applications.filter(
        app => app.id !== applicationId && app.status === 'pending'
      );

      const { error } = await supabase
        .from('tuition_applications')
        .update({
          status: 'accepted',
          reviewed_at: new Date().toISOString(),
          reviewed_by: ADMIN_USER_ID,
        })
        .eq('id', applicationId);

      if (error) throw error;

      console.log('Application accepted, sending emails...');
      console.log('Accepted app:', acceptedApp);
      console.log('Rejected apps:', rejectedApps);

      // Send acceptance email to accepted tutor
      if (acceptedApp.tutors?.email) {
        console.log('Sending acceptance email to:', acceptedApp.tutors.email);
        await notifyTuitionAssignment(
          acceptedApp.tutors.email,
          `${acceptedApp.tutors.first_name} ${acceptedApp.tutors.last_name}`,
          tuition?.tuition_code || '',
          tuition?.student_name || '',
          tuition?.subject || '',
          tuition?.grade || '',
          tuition?.fee || ''
        );
      } else {
        console.warn('No email found for accepted tutor');
      }

      // Send rejection emails to other tutors
      for (const app of rejectedApps) {
        if (app.tutors?.email) {
          console.log('Sending rejection email to:', app.tutors.email);
          await notifyTuitionRejection(
            app.tutors.email,
            `${app.tutors.first_name} ${app.tutors.last_name}`,
            tuition?.tuition_code || '',
            tuition?.student_name || '',
            tuition?.subject || ''
          );
        }
      }

      toast({
        title: 'Success',
        description: 'Tutor assigned successfully! Emails sent to all applicants.',
      });

      await fetchData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (applicationId: string) => {
    try {
      // Get application details before update
      const app = applications.find(a => a.id === applicationId);
      if (!app) throw new Error('Application not found');

      const { error } = await supabase
        .from('tuition_applications')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: ADMIN_USER_ID,
        })
        .eq('id', applicationId);

      if (error) throw error;

      // Send rejection email
      if (app.tutors?.email) {
        await notifyTuitionRejection(
          app.tutors.email,
          `${app.tutors.first_name} ${app.tutors.last_name}`,
          tuition?.tuition_code || '',
          tuition?.student_name || '',
          tuition?.subject || ''
        );
      }

      toast({
        title: 'Success',
        description: 'Application rejected. Email sent to tutor.',
      });

      await fetchData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'accepted':
        return <Badge className="bg-green-500">Accepted</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (!tuition) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">Tuition not found</p>
          <Button onClick={() => navigate('/admin-dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/admin-dashboard')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Dashboard</span>
        </button>

        {/* Tuition Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Tuition Details</CardTitle>
            <CardDescription>Applications for this tuition</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Tuition Code</p>
                <p className="font-semibold">{tuition.tuition_code}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Student Name</p>
                <p className="font-semibold">{tuition.student_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Subject</p>
                <p className="font-semibold">{tuition.subject}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Grade</p>
                <p className="font-semibold">{tuition.grade}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-semibold">{tuition.location}, {tuition.city}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fee</p>
                <p className="font-semibold text-green-600">Rs. {tuition.fee}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-semibold capitalize">{tuition.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Applications</p>
                <p className="font-semibold text-blue-600">{applications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Applications ({applications.length})
          </h2>

          {applications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">No applications received yet</p>
              </CardContent>
            </Card>
          ) : (
            applications.map((app) => {
              const tutor = app.tutors;
              return (
              <Card key={app.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {app.tutor_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Applied {new Date(app.applied_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{app.tutor_contact}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{app.tutor_city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <BookOpen className="w-4 h-4" />
                      <span className="text-sm">
                        {app.tutor_subjects?.slice(0, 3).join(', ')}
                        {app.tutor_subjects?.length > 3 ? '...' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Tutor Complete Profile Details */}
                  {tutor && (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">Tutor Profile</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500">All Subjects</p>
                          <p className="text-sm font-medium">{tutor.subjects?.join(', ') || 'N/A'}</p>
                        </div>
                      </div>

                      {tutor.short_bio && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1">Short Bio</p>
                          <p className="text-sm text-gray-700">{tutor.short_bio}</p>
                        </div>
                      )}

                      {tutor.detailed_description && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1">Detailed Description</p>
                          <p className="text-sm text-gray-700">{tutor.detailed_description}</p>
                        </div>
                      )}

                      {tutor.education && tutor.education.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1">Education</p>
                          {tutor.education.map((edu: any, idx: number) => (
                            <div key={idx} className="text-sm text-gray-700 mb-1">
                              • {edu.degree} from {edu.institution} ({edu.status})
                            </div>
                          ))}
                        </div>
                      )}

                      {tutor.work_experience && tutor.work_experience.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Work Experience</p>
                          {tutor.work_experience.map((exp: any, idx: number) => (
                            <div key={idx} className="text-sm text-gray-700 mb-1">
                              • {exp.position} at {exp.company} ({exp.duration})
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Cover Letter / Proposal */}
                  {app.cover_letter && (
                    <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Tutor's Proposal</h4>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{app.cover_letter}</p>
                    </div>
                  )}

                  {app.status === 'pending' && tuition.status === 'available' && (
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleAccept(app.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Accept & Assign
                      </Button>
                      <Button
                        onClick={() => handleReject(app.id)}
                        variant="destructive"
                        className="flex-1"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}

                  {app.reviewed_at && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        Reviewed on {new Date(app.reviewed_at).toLocaleString()}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
            })
          )}
        </div>
      </div>
    </div>
  );
}
