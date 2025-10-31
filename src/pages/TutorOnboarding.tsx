import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const TutorOnboarding = () => {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    fatherName: "",
    contact: "",
    otherContact: "",
    city: "",
    state: "",
    address: "",
    postalCode: "",
    cnicFront: null as File | null,
    cnicBack: null as File | null,
    education: [] as Array<{ degree: string; institution: string; startDate: string; endDate: string }>,
    workExperience: [] as Array<{ position: string; company: string; description: string; duration: string }>,
    experienceYears: "",
    courses: [] as string[],
    shortAbout: "",
    detailedDescription: "",
  });

  const [newEducation, setNewEducation] = useState({ degree: "", institution: "", startDate: "", endDate: "" });
  const [newExperience, setNewExperience] = useState({ position: "", company: "", description: "", duration: "" });
  const [courseInput, setCourseInput] = useState("");

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth?type=tutor");
      } else {
        setUserId(session.user.id);
      }
    };
    checkAuth();
  }, [navigate]);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addEducation = () => {
    if (newEducation.degree && newEducation.institution) {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, newEducation]
      }));
      setNewEducation({ degree: "", institution: "", startDate: "", endDate: "" });
    }
  };

  const addExperience = () => {
    if (newExperience.position && newExperience.company) {
      setFormData(prev => ({
        ...prev,
        workExperience: [...prev.workExperience, newExperience]
      }));
      setNewExperience({ position: "", company: "", description: "", duration: "" });
    }
  };

  const addCourse = () => {
    if (courseInput.trim()) {
      setFormData(prev => ({
        ...prev,
        courses: [...prev.courses, courseInput.trim()]
      }));
      setCourseInput("");
    }
  };

  const removeCourse = (index: number) => {
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (!userId) return;

    try {
      // Upload CNIC images if provided
      let cnicFrontUrl = null;
      let cnicBackUrl = null;

      if (formData.cnicFront) {
        const frontPath = `${userId}/cnic-front-${Date.now()}`;
        const { error: frontError } = await supabase.storage
          .from('tutor-documents')
          .upload(frontPath, formData.cnicFront);
        
        if (!frontError) {
          const { data: { publicUrl } } = supabase.storage
            .from('tutor-documents')
            .getPublicUrl(frontPath);
          cnicFrontUrl = publicUrl;
        }
      }

      if (formData.cnicBack) {
        const backPath = `${userId}/cnic-back-${Date.now()}`;
        const { error: backError } = await supabase.storage
          .from('tutor-documents')
          .upload(backPath, formData.cnicBack);
        
        if (!backError) {
          const { data: { publicUrl } } = supabase.storage
            .from('tutor-documents')
            .getPublicUrl(backPath);
          cnicBackUrl = publicUrl;
        }
      }

      const { error } = await supabase.from("tutors").insert({
        user_id: userId,
        first_name: formData.firstName,
        last_name: formData.lastName,
        father_name: formData.fatherName,
        contact: formData.contact,
        other_contact: formData.otherContact || null,
        city: formData.city,
        state: formData.state,
        address: formData.address,
        postal_code: formData.postalCode,
        cnic_front_url: cnicFrontUrl,
        cnic_back_url: cnicBackUrl,
        education: formData.education,
        work_experience: formData.workExperience,
        experience_years: parseInt(formData.experienceYears) || 0,
        courses: formData.courses,
        short_about: formData.shortAbout,
        detailed_description: formData.detailedDescription,
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your tutor profile has been submitted for review.",
      });

      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fatherName">Father's Name</Label>
                <Input
                  id="fatherName"
                  value={formData.fatherName}
                  onChange={(e) => updateField("fatherName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number</Label>
                <Input
                  id="contact"
                  value={formData.contact}
                  onChange={(e) => updateField("contact", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="otherContact">Other Contact (Optional)</Label>
                <Input
                  id="otherContact"
                  value={formData.otherContact}
                  onChange={(e) => updateField("otherContact", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => updateField("state", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => updateField("postalCode", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => updateField("address", e.target.value)}
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">CNIC Documents</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cnicFront">CNIC Front Image</Label>
                <Input
                  id="cnicFront"
                  type="file"
                  accept="image/*"
                  onChange={(e) => updateField("cnicFront", e.target.files?.[0] || null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnicBack">CNIC Back Image</Label>
                <Input
                  id="cnicBack"
                  type="file"
                  accept="image/*"
                  onChange={(e) => updateField("cnicBack", e.target.files?.[0] || null)}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Education & Experience</h3>
            
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold">Education</Label>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Degree"
                    value={newEducation.degree}
                    onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                  />
                  <Input
                    placeholder="Institution"
                    value={newEducation.institution}
                    onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                  />
                  <Input
                    type="date"
                    placeholder="Start Date"
                    value={newEducation.startDate}
                    onChange={(e) => setNewEducation({ ...newEducation, startDate: e.target.value })}
                  />
                  <Input
                    type="date"
                    placeholder="End Date"
                    value={newEducation.endDate}
                    onChange={(e) => setNewEducation({ ...newEducation, endDate: e.target.value })}
                  />
                </div>
                <Button type="button" onClick={addEducation} className="mt-2" variant="outline">
                  Add Education
                </Button>
                <div className="mt-4 space-y-2">
                  {formData.education.map((edu, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <p className="font-semibold">{edu.degree}</p>
                        <p className="text-sm text-muted-foreground">{edu.institution}</p>
                        <p className="text-xs text-muted-foreground">{edu.startDate} - {edu.endDate}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold">Work Experience (Optional)</Label>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Position"
                    value={newExperience.position}
                    onChange={(e) => setNewExperience({ ...newExperience, position: e.target.value })}
                  />
                  <Input
                    placeholder="Company"
                    value={newExperience.company}
                    onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                  />
                  <Input
                    placeholder="Duration (e.g., 2 years)"
                    value={newExperience.duration}
                    onChange={(e) => setNewExperience({ ...newExperience, duration: e.target.value })}
                  />
                  <Textarea
                    placeholder="Description"
                    value={newExperience.description}
                    onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                  />
                </div>
                <Button type="button" onClick={addExperience} className="mt-2" variant="outline">
                  Add Experience
                </Button>
                <div className="mt-4 space-y-2">
                  {formData.workExperience.map((exp, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <p className="font-semibold">{exp.position}</p>
                        <p className="text-sm text-muted-foreground">{exp.company} - {exp.duration}</p>
                        <p className="text-xs text-muted-foreground">{exp.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experienceYears">Total Years of Teaching Experience</Label>
                <Input
                  id="experienceYears"
                  type="number"
                  value={formData.experienceYears}
                  onChange={(e) => updateField("experienceYears", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Courses You Can Teach</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Enter course name (e.g., Mathematics, Physics)"
                value={courseInput}
                onChange={(e) => setCourseInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCourse())}
              />
              <Button type="button" onClick={addCourse} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.courses.map((course, index) => (
                <div key={index} className="bg-primary/10 px-3 py-1 rounded-full flex items-center gap-2">
                  <span>{course}</span>
                  <button
                    onClick={() => removeCourse(index)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">About Yourself</h3>
            <div className="space-y-2">
              <Label htmlFor="shortAbout">Short Introduction (Max 200 characters)</Label>
              <Textarea
                id="shortAbout"
                value={formData.shortAbout}
                onChange={(e) => updateField("shortAbout", e.target.value)}
                maxLength={200}
                placeholder="Brief introduction about yourself"
                required
              />
              <p className="text-xs text-muted-foreground">{formData.shortAbout.length}/200</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="detailedDescription">Detailed Description</Label>
              <Textarea
                id="detailedDescription"
                value={formData.detailedDescription}
                onChange={(e) => updateField("detailedDescription", e.target.value)}
                placeholder="Describe your teaching methodology, experience, and what makes you unique as a tutor"
                rows={8}
                required
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Tutor Registration</CardTitle>
            <CardDescription>
              Complete your profile to start teaching on Tutor Hub
            </CardDescription>
            <Progress value={progress} className="mt-4" />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderStep()}
            
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
              >
                Previous
              </Button>
              
              {step < totalSteps ? (
                <Button onClick={() => setStep(Math.min(totalSteps, step + 1))}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit}>
                  Submit for Review
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Step indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                index + 1 === step
                  ? "bg-primary"
                  : index + 1 < step
                  ? "bg-primary/50"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TutorOnboarding;