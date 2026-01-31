import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { ADMIN_USER_ID } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, XCircle, User, MapPin, BookOpen, Calendar, DollarSign } from "lucide-react";
import Navbar from "@/components/Navbar";

interface TuitionRequest {
  id: string;
  user_id: string | null;
  name: string;
  phone: string;
  preferred_gender: string;
  city: string;
  area: string;
  class: string;
  subject: string;
  school: string | null;
  board: string | null;
  mode_of_tuition: string;
  fee: string | null;
  additional_comments: string | null;
  status: string;
  assigned_tutor_id: string | null;
  created_at: string;
  updated_at: string;
}

const TuitionRequestDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [request, setRequest] = useState<TuitionRequest | null>(null);
  const [loading, setLoading] = useState(true);

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

      await fetchRequest();
    };

    checkAdminAndFetch();
  }, [id, navigate]);

  const fetchRequest = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("tuition_requests")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setRequest(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!request) return;

    try {
      // Create entry in tuition table so tutors can see it
      const { error: insertError } = await supabase
        .from("tuition")
        .insert({
          student_name: request.name,
          subject: request.subject,
          grade: request.class,
          location: request.area,
          city: request.city,
          timing: "To be discussed",
          fee: request.fee || "Negotiable",
          tuition_type: request.mode_of_tuition === 'home' ? 'Home Tuition' : 
                        request.mode_of_tuition === 'online' ? 'Online Tuition' : 
                        'Both',
          status: "available",
          created_at: new Date().toISOString(),
        });

      if (insertError) throw insertError;

      // Update tuition request status
      const { error } = await supabase
        .from("tuition_requests")
        .update({ status: "assigned" })
        .eq("id", request.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tuition request approved! Now visible to tutors.",
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
    if (!request) return;

    try {
      const { error } = await supabase
        .from("tuition_requests")
        .update({ status: "cancelled" })
        .eq("id", request.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tuition request cancelled.",
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
          <div className="text-xl text-gray-600">Loading request...</div>
        </div>
      </>
    );
  }

  if (!request) {
    return (
      <>
        <Navbar />
        <div className="pt-24 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-xl text-gray-600">Request not found</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="pt-24 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4 md:px-8 py-8">
        <div className="max-w-5xl mx-auto">
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
                Tuition Request Details
              </h1>
              <p className="text-gray-600">Request from {request.name}</p>
              <p className="text-sm text-gray-500 mt-1">
                Submitted on {formatDate(request.created_at)}
              </p>
            </div>
            <Badge className={
              request.status === 'pending' ? 'bg-orange-100 text-orange-700' :
              request.status === 'assigned' ? 'bg-green-100 text-green-700' :
              request.status === 'completed' ? 'bg-blue-100 text-blue-700' :
              'bg-red-100 text-red-700'
            }>
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Parent/Student Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Parent/Student Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-lg">{request.name || <span className="text-red-500">Empty</span>}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact Number</p>
                  <p className="font-medium">{request.phone || <span className="text-red-500">Empty</span>}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Preferred Tutor Gender</p>
                  <p className="font-medium capitalize">{request.preferred_gender || <span className="text-red-500">Empty</span>}</p>
                </div>
              </CardContent>
            </Card>

            {/* Location Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">City</p>
                  <p className="font-medium">{request.city || <span className="text-red-500">Empty</span>}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Area</p>
                  <p className="font-medium">{request.area || <span className="text-red-500">Empty</span>}</p>
                </div>
              </CardContent>
            </Card>

            {/* Academic Information */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Class/Grade</p>
                    <p className="font-medium">{request.class || <span className="text-red-500">Empty</span>}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Subject</p>
                    <p className="font-medium">{request.subject || <span className="text-red-500">Empty</span>}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">School</p>
                    <p className="font-medium">{request.school || <span className="text-gray-400">Not provided</span>}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Board</p>
                    <p className="font-medium">{request.board || <span className="text-gray-400">Not provided</span>}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tuition Details */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Tuition Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Mode of Tuition</p>
                    <p className="font-medium capitalize">{request.mode_of_tuition || <span className="text-red-500">Empty</span>}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Expected Fee</p>
                    <p className="font-medium flex items-center">
                      {request.fee ? (
                        <>
                          <DollarSign className="w-4 h-4 mr-1" />
                          {request.fee}
                        </>
                      ) : (
                        <span className="text-gray-400">Not specified</span>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            {request.additional_comments && (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Additional Comments</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{request.additional_comments}</p>
                </CardContent>
              </Card>
            )}

            {/* Timestamps */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Timestamps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Created At</p>
                    <p className="font-medium">{formatDate(request.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium">{formatDate(request.updated_at)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          {request.status === 'pending' && (
            <div className="mt-8 flex gap-4 justify-end">
              <Button
                onClick={handleReject}
                variant="destructive"
                className="px-8"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Cancel Request
              </Button>
              <Button
                onClick={handleApprove}
                className="bg-green-600 hover:bg-green-700 px-8"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve Request
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TuitionRequestDetail;
