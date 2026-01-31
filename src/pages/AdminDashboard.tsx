import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";import { verifyAuthenticatedUser } from "../lib/auth";import { ADMIN_USER_ID } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Users, BookOpen, Clock, TrendingUp, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";

interface TuitionRequest {
  id: string;
  parent_name: string;
  parent_contact: string;
  student_class: string;
  subjects: string[];
  city: string;
  preferred_gender: string;
  status: string;
  created_at: string;
}

interface TutorApplication {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  contact: string;
  city: string;
  status: string;
  created_at: string;
}

interface Stats {
  pending_requests: number;
  pending_tutors: number;
  active_tuitions: number;
  total_tutors: number;
  pending_applications: number;
}

interface TuitionWithApplications {
  id: string;
  tuition_code: string;
  student_name: string;
  subject: string;
  grade: string;
  city: string;
  status: string;
  application_count: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [tuitionRequests, setTuitionRequests] = useState<TuitionRequest[]>([]);
  const [tutorApplications, setTutorApplications] = useState<TutorApplication[]>([]);
  const [tuitionsWithApplications, setTuitionsWithApplications] = useState<TuitionWithApplications[]>([]);
  const [stats, setStats] = useState<Stats>({
    pending_requests: 0,
    pending_tutors: 0,
    active_tuitions: 0,
    total_tutors: 0,
    pending_applications: 0,
  });

  useEffect(() => {
    const checkAdmin = async () => {
      const user = await verifyAuthenticatedUser();
      
      if (!user || user.id !== ADMIN_USER_ID) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      await fetchData();
    };

    checkAdmin();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch pending tuition requests
      const { data: requests } = await supabase
        .from("tuition_requests")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      // Fetch pending tutor applications
      const { data: tutors } = await supabase
        .from("new_tutor")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      // Fetch stats
      const { data: activetuitions } = await supabase
        .from("tuition")
        .select("id", { count: "exact" });

      const { data: allTutors } = await supabase
        .from("tutors")
        .select("id", { count: "exact" });

      // Fetch tuitions with pending applications
      const { data: tuitionsWithApps } = await supabase
        .from("tuition")
        .select(`
          id,
          tuition_code,
          student_name,
          subject,
          grade,
          city,
          status,
          application_count
        `)
        .eq("status", "available")
        .gt("application_count", 0)
        .order("application_count", { ascending: false });

      // Count total pending applications
      const { count: pendingAppsCount } = await supabase
        .from("tuition_applications")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      setTuitionRequests(requests || []);
      setTutorApplications(tutors || []);
      setTuitionsWithApplications(tuitionsWithApps || []);
      setStats({
        pending_requests: requests?.length || 0,
        pending_tutors: tutors?.length || 0,
        active_tuitions: activetuitions?.length || 0,
        total_tutors: allTutors?.length || 0,
        pending_applications: pendingAppsCount || 0,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveTuition = async (requestId: string) => {
    try {
      // Get the tuition request details first
      const { data: request, error: fetchError } = await supabase
        .from("tuition_requests")
        .select("*")
        .eq("id", requestId)
        .single();

      if (fetchError) throw fetchError;
      if (!request) throw new Error("Tuition request not found");

      // Create entry in tuition table so tutors can see it
      const { error: insertError } = await supabase
        .from("tuition")
        .insert({
          student_name: request.name,
          subject: request.subject,
          grade: request.class,
          location: request.area,
          city: request.city,
          timing: "To be discussed", // Default value
          fee: request.fee || "Negotiable",
          tuition_type: request.mode_of_tuition === 'home' ? 'Home Tuition' : 
                        request.mode_of_tuition === 'online' ? 'Online Tuition' : 
                        'Both',
          status: "available",
          created_at: new Date().toISOString(),
        });

      if (insertError) throw insertError;

      // Update tuition request status to assigned
      const { error: updateError } = await supabase
        .from("tuition_requests")
        .update({ status: "assigned" })
        .eq("id", requestId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Tuition request approved! Now visible to tutors.",
      });

      await fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRejectTuition = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from("tuition_requests")
        .update({ status: "cancelled" })
        .eq("id", requestId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tuition request rejected.",
      });

      await fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleApproveTutor = async (tutorId: string) => {
    try {
      // Update new_tutor status - trigger will auto-create tutors entry
      const { error: updateError } = await supabase
        .from("new_tutor")
        .update({ 
          status: "approved",
          reviewed_at: new Date().toISOString(),
          reviewed_by: ADMIN_USER_ID,
        })
        .eq("id", tutorId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Tutor approved! They can now apply for tuitions.",
      });

      await fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRejectTutor = async (tutorId: string) => {
    try {
      const { error } = await supabase
        .from("new_tutor")
        .update({ status: "rejected" })
        .eq("id", tutorId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tutor application rejected.",
      });

      await fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pt-20 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-xl text-gray-600">Loading admin dashboard...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="pt-24 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4 md:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Admin Dashboard</h1>
            <p className="text-lg text-gray-600">Manage tuition requests and tutor applications</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.pending_requests}</div>
                <p className="text-xs text-muted-foreground">Tuition requests</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Tutors</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.pending_tutors}</div>
                <p className="text-xs text-muted-foreground">Tutor applications</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Apps</CardTitle>
                <FileText className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.pending_applications}</div>
                <p className="text-xs text-muted-foreground">Tutor applications</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Tuitions</CardTitle>
                <BookOpen className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.active_tuitions}</div>
                <p className="text-xs text-muted-foreground">Currently active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tutors</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.total_tutors}</div>
                <p className="text-xs text-muted-foreground">Approved tutors</p>
              </CardContent>
            </Card>
          </div>

          {/* Tuitions with Pending Applications - NEW SECTION */}
          {tuitionsWithApplications.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl">Tuitions with Applications</CardTitle>
                <CardDescription>Review tutor applications for available tuitions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tuitionsWithApplications.map((tuition) => (
                    <div 
                      key={tuition.id} 
                      className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate(`/admin/tuition-applications/${tuition.id}`)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{tuition.tuition_code}</h3>
                          <p className="text-sm text-gray-600">{tuition.student_name}</p>
                        </div>
                        <Badge className="bg-yellow-500 text-white">
                          {tuition.application_count} Applications
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Subject:</span>
                          <p className="font-medium">{tuition.subject}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Grade:</span>
                          <p className="font-medium">{tuition.grade}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">City:</span>
                          <p className="font-medium">{tuition.city}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span>
                          <p className="font-medium capitalize">{tuition.status}</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/tuition-applications/${tuition.id}`);
                          }}
                        >
                          View {tuition.application_count} Application{tuition.application_count !== 1 ? 's' : ''} →
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pending Tuition Requests */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Pending Tuition Requests</CardTitle>
              <CardDescription>Review and approve tuition requests from parents</CardDescription>
            </CardHeader>
            <CardContent>
              {tuitionRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No pending tuition requests
                </div>
              ) : (
                <div className="space-y-4">
                  {tuitionRequests.map((request) => (
                    <div 
                      key={request.id} 
                      className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate(`/admin/tuition-request/${request.id}`)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{request.parent_name}</h3>
                          <p className="text-sm text-gray-600">{request.parent_contact}</p>
                        </div>
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                          Pending
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                        <div>
                          <span className="text-gray-500">Class:</span>
                          <p className="font-medium">{request.student_class}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">City:</span>
                          <p className="font-medium">{request.city}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Gender:</span>
                          <p className="font-medium">{request.preferred_gender}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Subjects:</span>
                          <p className="font-medium">{Array.isArray(request.subjects) ? request.subjects.join(", ") : request.subjects || "N/A"}</p>
                        </div>
                      </div>
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApproveTuition(request.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRejectTuition(request.id)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Tutor Applications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Pending Tutor Applications</CardTitle>
              <CardDescription>Review and approve tutor profile applications</CardDescription>
            </CardHeader>
            <CardContent>
              {tutorApplications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No pending tutor applications
                </div>
              ) : (
                <div className="space-y-4">
                  {tutorApplications.map((tutor) => (
                    <div 
                      key={tutor.id} 
                      className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate(`/admin/tutor-application/${tutor.id}`)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {tutor.first_name} {tutor.last_name}
                          </h3>
                          <p className="text-sm text-gray-600">{tutor.email}</p>
                        </div>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Pending
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <span className="text-gray-500">Contact:</span>
                          <p className="font-medium">{tutor.contact}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">City:</span>
                          <p className="font-medium">{tutor.city}</p>
                        </div>
                      </div>
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApproveTutor(tutor.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRejectTutor(tutor.id)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
