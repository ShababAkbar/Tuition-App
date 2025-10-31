import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, MessageCircle } from "lucide-react";

const TuitionRequest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    preferredGender: "",
    city: "",
    area: "",
    class: "",
    subject: "",
    school: "",
    board: "",
    modeOfTuition: "",
    additionalComments: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hi, I'm looking for a tutor.\n\nName: ${formData.name || "Not provided"}\nPhone: ${formData.phone || "Not provided"}\nCity: ${formData.city || "Not provided"}\nClass: ${formData.class || "Not provided"}\nSubject: ${formData.subject || "Not provided"}`
    );
    // Replace with your WhatsApp business number
    window.open(`https://wa.me/923001234567?text=${message}`, "_blank");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase.from("tuition_requests").insert({
        user_id: user?.id || null,
        name: formData.name,
        phone: formData.phone,
        preferred_gender: formData.preferredGender,
        city: formData.city,
        area: formData.area,
        class: formData.class,
        subject: formData.subject,
        school: formData.school,
        board: formData.board,
        mode_of_tuition: formData.modeOfTuition,
        additional_comments: formData.additionalComments,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your tuition request has been submitted. We'll connect you with a tutor shortly.",
      });

      navigate("/tuitions");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <GraduationCap size={60} className="text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Request a Tutor</h1>
          <p className="text-lg text-gray-600">
            Contact our operator on WhatsApp or submit the form and you will be connected with the tutor in no time
          </p>
        </div>

        {/* WhatsApp Button */}
        <div className="text-center mb-8">
          <Button
            onClick={handleWhatsApp}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-6 text-lg rounded-lg"
          >
            <MessageCircle className="mr-2 h-6 w-6" />
            WhatsApp
          </Button>
        </div>

        {/* Divider */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-2xl font-semibold text-gray-900">Or</span>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Fill out this form and we will connect you with the tutor shortly.</CardTitle>
            <CardDescription className="text-red-500 font-medium">
              (For Parents and Students Only, Not For Teachers.)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    🇵🇰 +92
                  </span>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="333-XXXXXXX"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="rounded-l-none"
                    required
                  />
                </div>
              </div>

              {/* Preferred Gender */}
              <div className="space-y-2">
                <Label htmlFor="preferredGender">Preferred Tutor Gender *</Label>
                <select
                  id="preferredGender"
                  value={formData.preferredGender}
                  onChange={(e) => updateField("preferredGender", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="no_preference">No Preference</option>
                </select>
              </div>

              {/* City and Area */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="e.g., Karachi"
                    value={formData.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">Area *</Label>
                  <Input
                    id="area"
                    placeholder="e.g., Gulshan-e-Iqbal"
                    value={formData.area}
                    onChange={(e) => updateField("area", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Class and Subject */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="class">Class/Grade *</Label>
                  <Input
                    id="class"
                    placeholder="e.g., Grade 10"
                    value={formData.class}
                    onChange={(e) => updateField("class", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject/Course *</Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Mathematics, Physics"
                    value={formData.subject}
                    onChange={(e) => updateField("subject", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* School and Board */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="school">School/Institution</Label>
                  <Input
                    id="school"
                    placeholder="e.g., Beaconhouse School"
                    value={formData.school}
                    onChange={(e) => updateField("school", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="board">Board</Label>
                  <Input
                    id="board"
                    placeholder="e.g., Federal Board, Cambridge"
                    value={formData.board}
                    onChange={(e) => updateField("board", e.target.value)}
                  />
                </div>
              </div>

              {/* Mode of Tuition */}
              <div className="space-y-2">
                <Label htmlFor="modeOfTuition">Mode of Tuition *</Label>
                <select
                  id="modeOfTuition"
                  value={formData.modeOfTuition}
                  onChange={(e) => updateField("modeOfTuition", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Mode</option>
                  <option value="home">Home Tuition</option>
                  <option value="online">Online Tuition</option>
                  <option value="both">Both (Home & Online)</option>
                </select>
              </div>

              {/* Additional Comments */}
              <div className="space-y-2">
                <Label htmlFor="additionalComments">Additional Comments/Description</Label>
                <Textarea
                  id="additionalComments"
                  placeholder="Any specific requirements or preferences..."
                  value={formData.additionalComments}
                  onChange={(e) => updateField("additionalComments", e.target.value)}
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-purple-700 hover:bg-purple-800 text-white py-6 text-lg"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TuitionRequest;
