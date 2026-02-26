import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { ADMIN_USER_ID } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, XCircle, User, Phone, MapPin, GraduationCap, Briefcase, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";

interface TutorApplication {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  father_name: string;
  contact: string;
  other_contact: string | null;
  city: string;
  state: string;
  address: string;
  postal_code: string;
  cnic_front_url: string | null;
  cnic_back_url: string | null;
  education: any[];
  work_experience: any[];
  experience_years: number;
  courses: string[];
  short_about: string;
  detailed_description: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

const TutorApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [application, setApplication] = useState<TutorApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});

  const getSignedUrl = async (path: string | null): Promise<string | null> => {
    if (!path) return null;
    // If it's already a full URL, return as-is
    if (path.startsWith('http')) return path;
    try {
      const { data, error } = await supabase.storage
        .from('tutor-documents')
        .createSignedUrl(path, 3600);
      if (error || !data) return null;
      return data.signedUrl;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const checkAdminAndFetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || user.id !== ADMIN_USER_ID) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      await fetchApplication();
    };

    checkAdminAndFetch();
  }, [id, navigate]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("new_tutor")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setApplication(data);

      // Generate signed URLs for all private storage images
      const urls: Record<string, string> = {};

      const cnicFront = await getSignedUrl(data.cnic_front_url);
      if (cnicFront) urls['cnic_front'] = cnicFront;

      const cnicBack = await getSignedUrl(data.cnic_back_url);
      if (cnicBack) urls['cnic_back'] = cnicBack;

      if (data.education && Array.isArray(data.education)) {
        for (let i = 0; i < data.education.length; i++) {
          const edu = data.education[i];
          const resultUrl = await getSignedUrl(edu.resultCardUrl || edu.resultCard);
          if (resultUrl) urls[`edu_result_${i}`] = resultUrl;
        }
      }

      setSignedUrls(urls);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load application",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!application) return;

    try {
      // Update status to approved - database trigger will auto-create tutors entry
      const { error: updateError } = await supabase
        .from("new_tutor")
        .update({ 
          status: "approved",
          reviewed_at: new Date().toISOString(),
          reviewed_by: ADMIN_USER_ID,
        })
        .eq("id", application.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Tutor approved successfully!",
      });

      navigate("/admin-dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleReject = async () => {
    if (!application) return;

    try {
      const { error } = await supabase
        .from("new_tutor")
        .update({ status: "rejected" })
        .eq("id", application.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Application rejected.",
      });

      navigate("/admin-dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pt-24 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-xl text-gray-600">Loading application...</div>
        </div>
      </>
    );
  }

  if (!application) {
    return (
      <>
        <Navbar />
        <div className="pt-24 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-xl text-gray-600">Application not found</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="pt-24 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4 md:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate("/admin-dashboard")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>

          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {application.first_name} {application.last_name}
              </h1>
              <p className="text-gray-600">Tutor Application Details</p>
              <p className="text-sm text-gray-500 mt-1">
                Submitted on {formatDate(application.created_at)}
              </p>
            </div>
            <Badge className={
              application.status === 'pending' ? 'bg-blue-100 text-blue-700' :
              application.status === 'approved' ? 'bg-green-100 text-green-700' :
              'bg-red-100 text-red-700'
            }>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">First Name</p>
                    <p className="font-medium">{application.first_name || <span className="text-red-500">Empty</span>}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Name</p>
                    <p className="font-medium">{application.last_name || <span className="text-red-500">Empty</span>}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Father's Name</p>
                    <p className="font-medium">{application.father_name || <span className="text-red-500">Empty</span>}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Primary Contact</p>
                  <p className="font-medium">{application.contact || <span className="text-red-500">Empty</span>}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Other Contact (Optional)</p>
                  <p className="font-medium">{application.other_contact || <span className="text-gray-400">Not provided</span>}</p>
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Address Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">City</p>
                    <p className="font-medium">{application.city || <span className="text-red-500">Empty</span>}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">State/Province</p>
                    <p className="font-medium">{application.state || <span className="text-red-500">Empty</span>}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Postal Code</p>
                    <p className="font-medium">{application.postal_code || <span className="text-red-500">Empty</span>}</p>
                  </div>
                  <div className="md:col-span-3">
                    <p className="text-sm text-gray-500">Complete Address</p>
                    <p className="font-medium">{application.address || <span className="text-red-500">Empty</span>}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CNIC Documents */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  CNIC Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-3">CNIC Front</p>
                    {application.cnic_front_url ? (
                      <div className="space-y-2">
                        {signedUrls['cnic_front'] ? (
                          <img 
                            src={signedUrls['cnic_front']} 
                            alt="CNIC Front" 
                            className="w-full h-auto border-2 border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                          />
                        ) : (
                          <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-400">Loading image...</div>
                        )}
                        {signedUrls['cnic_front'] && (
                          <a 
                            href={signedUrls['cnic_front']} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-sm text-blue-600 hover:underline inline-block"
                          >
                            Open in new tab
                          </a>
                        )}
                      </div>
                    ) : (
                      <span className="text-red-500">Not uploaded</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-3">CNIC Back</p>
                    {application.cnic_back_url ? (
                      <div className="space-y-2">
                        {signedUrls['cnic_back'] ? (
                          <img 
                            src={signedUrls['cnic_back']} 
                            alt="CNIC Back" 
                            className="w-full h-auto border-2 border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                          />
                        ) : (
                          <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-400">Loading image...</div>
                        )}
                        {signedUrls['cnic_back'] && (
                          <a 
                            href={signedUrls['cnic_back']} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-sm text-blue-600 hover:underline inline-block"
                          >
                            Open in new tab
                          </a>
                        )}
                      </div>
                    ) : (
                      <span className="text-red-500">Not uploaded</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                {application.education && application.education.length > 0 ? (
                  <div className="space-y-6">
                    {application.education.map((edu: any, index: number) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                        <h4 className="font-semibold">{edu.degree || <span className="text-red-500">No degree specified</span>}</h4>
                        <p className="text-sm text-gray-600">{edu.institution || "No institution"}</p>
                        <p className="text-sm text-gray-500">
                          {edu.startDate || "?"} - {edu.endDate || "?"}
                          {edu.status && ` • ${edu.status}`}
                        </p>
                        {edu.resultCardUrl && (
                          <div className="mt-3 space-y-2">
                            {signedUrls[`edu_result_${index}`] ? (
                              <img 
                                src={signedUrls[`edu_result_${index}`]} 
                                alt={`${edu.degree} Result Card`} 
                                className="w-full max-w-md h-auto border-2 border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                              />
                            ) : (
                              <div className="w-full max-w-md h-24 bg-gray-100 rounded-lg flex items-center justify-center text-sm text-gray-400">Loading image...</div>
                            )}
                            {signedUrls[`edu_result_${index}`] && (
                              <a 
                                href={signedUrls[`edu_result_${index}`]} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-sm text-blue-600 hover:underline inline-block"
                              >
                                Open in new tab
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-red-500">No education added</p>
                )}
              </CardContent>
            </Card>

            {/* Work Experience */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Work Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Teaching Experience</p>
                  <p className="font-medium text-lg">{application.experience_years || 0} years</p>
                </div>
                {application.work_experience && application.work_experience.length > 0 ? (
                  <div className="space-y-4">
                    {application.work_experience.map((exp: any, index: number) => (
                      <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                        <h4 className="font-semibold">{exp.position || "Position not specified"}</h4>
                        <p className="text-sm text-gray-600">{exp.company || "Company not specified"}</p>
                        <p className="text-sm text-gray-500">{exp.duration || "Duration not specified"}</p>
                        {exp.description && <p className="text-sm mt-1">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No work experience added</p>
                )}
              </CardContent>
            </Card>

            {/* Subjects */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Subjects Can Teach</CardTitle>
              </CardHeader>
              <CardContent>
                {application.courses && application.courses.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {application.courses.map((course, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50">
                        {course}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-red-500">No subjects selected</p>
                )}
              </CardContent>
            </Card>

            {/* About */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Short Introduction</p>
                  <p className="font-medium">{application.short_about || <span className="text-red-500">Empty</span>}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Detailed Description</p>
                  <p className="whitespace-pre-wrap">{application.detailed_description || <span className="text-red-500">Empty</span>}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          {application.status === 'pending' && (
            <div className="mt-8 flex gap-4 justify-end">
              <Button
                onClick={handleReject}
                variant="destructive"
                className="px-8"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button
                onClick={handleApprove}
                className="bg-green-600 hover:bg-green-700 px-8"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TutorApplicationDetail;
