import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SUBJECT_CATEGORIES, PAKISTAN_CITIES, PAKISTAN_STATES, VALIDATION_PATTERNS } from "@/lib/constants";

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

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

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

  // Validation function for each step
  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (stepNumber) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!formData.fatherName.trim()) newErrors.fatherName = "Father's name is required";
        if (!formData.contact.trim()) {
          newErrors.contact = "Contact number is required";
        } else if (!VALIDATION_PATTERNS.phone.test(formData.contact)) {
          newErrors.contact = "Invalid phone number format (e.g., 03001234567)";
        }
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.state.trim()) newErrors.state = "State/Province is required";
        if (!formData.address.trim()) newErrors.address = "Address is required";
        if (!formData.postalCode.trim()) {
          newErrors.postalCode = "Postal code is required";
        } else if (!VALIDATION_PATTERNS.postalCode.test(formData.postalCode)) {
          newErrors.postalCode = "Invalid postal code (5 digits)";
        }
        break;

      case 2:
        // CNIC is optional
        break;

      case 3:
        if (formData.education.length === 0) {
          newErrors.education = "At least one education entry is required";
        }
        if (!formData.experienceYears.trim()) {
          newErrors.experienceYears = "Years of experience is required";
        }
        break;

      case 4:
        if (formData.courses.length === 0) {
          newErrors.courses = "At least one course/subject is required";
        }
        break;

      case 5:
        if (!formData.shortAbout.trim()) {
          newErrors.shortAbout = "Short introduction is required";
        }
        if (!formData.detailedDescription.trim()) {
          newErrors.detailedDescription = "Detailed description is required";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
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
      // Check for duplicates
      if (formData.courses.includes(courseInput.trim())) {
        toast({
          title: "Duplicate Subject",
          description: "This subject has already been added.",
          variant: "destructive",
        });
        return;
      }
      setFormData(prev => ({
        ...prev,
        courses: [...prev.courses, courseInput.trim()]
      }));
      setCourseInput("");
      // Clear errors if any
      if (errors.courses) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.courses;
          return newErrors;
        });
      }
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

      const { error } = await supabase.from("new_tutor").insert({
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

      navigate("/dashboard");
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
                <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  onBlur={() => handleBlur("firstName")}
                  error={!!errors.firstName}
                />
                {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  onBlur={() => handleBlur("lastName")}
                  error={!!errors.lastName}
                />
                {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="fatherName">Father's Name <span className="text-red-500">*</span></Label>
                <Input
                  id="fatherName"
                  value={formData.fatherName}
                  onChange={(e) => updateField("fatherName", e.target.value)}
                  onBlur={() => handleBlur("fatherName")}
                  error={!!errors.fatherName}
                />
                {errors.fatherName && <p className="text-xs text-red-500">{errors.fatherName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number <span className="text-red-500">*</span></Label>
                <Input
                  id="contact"
                  placeholder="e.g., 03001234567"
                  value={formData.contact}
                  onChange={(e) => updateField("contact", e.target.value)}
                  onBlur={() => handleBlur("contact")}
                  error={!!errors.contact}
                />
                {errors.contact && <p className="text-xs text-red-500">{errors.contact}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="otherContact">Other Contact (Optional)</Label>
                <Input
                  id="otherContact"
                  placeholder="e.g., 03001234567"
                  value={formData.otherContact}
                  onChange={(e) => updateField("otherContact", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                <Select
                  id="city"
                  value={formData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  onBlur={() => handleBlur("city")}
                  error={!!errors.city}
                >
                  <option value="">Select a city</option>
                  {PAKISTAN_CITIES.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </Select>
                {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State/Province <span className="text-red-500">*</span></Label>
                <Select
                  id="state"
                  value={formData.state}
                  onChange={(e) => updateField("state", e.target.value)}
                  onBlur={() => handleBlur("state")}
                  error={!!errors.state}
                >
                  <option value="">Select a state/province</option>
                  {PAKISTAN_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </Select>
                {errors.state && <p className="text-xs text-red-500">{errors.state}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code <span className="text-red-500">*</span></Label>
                <Input
                  id="postalCode"
                  placeholder="e.g., 54000"
                  value={formData.postalCode}
                  onChange={(e) => updateField("postalCode", e.target.value)}
                  onBlur={() => handleBlur("postalCode")}
                  error={!!errors.postalCode}
                />
                {errors.postalCode && <p className="text-xs text-red-500">{errors.postalCode}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
              <Textarea
                id="address"
                placeholder="Enter your complete address"
                value={formData.address}
                onChange={(e) => updateField("address", e.target.value)}
                onBlur={() => handleBlur("address")}
                error={!!errors.address}
              />
              {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
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
                <Label className="text-base font-semibold">Education <span className="text-red-500">*</span></Label>
                {errors.education && <p className="text-xs text-red-500 mt-1">{errors.education}</p>}
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
                <Label htmlFor="experienceYears">Total Years of Teaching Experience <span className="text-red-500">*</span></Label>
                <Input
                  id="experienceYears"
                  type="number"
                  min="0"
                  placeholder="e.g., 5"
                  value={formData.experienceYears}
                  onChange={(e) => updateField("experienceYears", e.target.value)}
                  onBlur={() => handleBlur("experienceYears")}
                  error={!!errors.experienceYears}
                />
                {errors.experienceYears && <p className="text-xs text-red-500">{errors.experienceYears}</p>}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Subjects You Can Teach <span className="text-red-500">*</span></h3>
            {errors.courses && <p className="text-xs text-red-500">{errors.courses}</p>}
            
            <div className="space-y-2">
              <Label htmlFor="subjectSelect">Select Subject</Label>
              <Select
                id="subjectSelect"
                value={courseInput}
                onChange={(e) => setCourseInput(e.target.value)}
                className="w-full"
              >
                <option value="">Choose a subject...</option>
                {Object.entries(SUBJECT_CATEGORIES).map(([category, subjects]) => (
                  <optgroup key={category} label={category}>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </optgroup>
                ))}
              </Select>
              <Button 
                type="button" 
                onClick={addCourse} 
                variant="outline" 
                className="w-full mt-2"
                disabled={!courseInput.trim()}
              >
                Add Subject
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label>Selected Subjects ({formData.courses.length})</Label>
              <div className="flex flex-wrap gap-2 min-h-[60px] p-3 border rounded-md">
                {formData.courses.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No subjects selected yet</p>
                ) : (
                  formData.courses.map((course, index) => (
                    <div key={index} className="bg-primary/10 px-3 py-1 rounded-full flex items-center gap-2">
                      <span className="text-sm">{course}</span>
                      <button
                        onClick={() => removeCourse(index)}
                        className="text-destructive hover:text-destructive/80 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">About Yourself</h3>
            <div className="space-y-2">
              <Label htmlFor="shortAbout">Short Introduction (Max 200 characters) <span className="text-red-500">*</span></Label>
              <Textarea
                id="shortAbout"
                value={formData.shortAbout}
                onChange={(e) => updateField("shortAbout", e.target.value)}
                onBlur={() => handleBlur("shortAbout")}
                maxLength={200}
                placeholder="Brief introduction about yourself"
                error={!!errors.shortAbout}
              />
              <div className="flex justify-between items-center">
                {errors.shortAbout && <p className="text-xs text-red-500">{errors.shortAbout}</p>}
                <p className="text-xs text-muted-foreground ml-auto">{formData.shortAbout.length}/200</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="detailedDescription">Detailed Description <span className="text-red-500">*</span></Label>
              <Textarea
                id="detailedDescription"
                value={formData.detailedDescription}
                onChange={(e) => updateField("detailedDescription", e.target.value)}
                onBlur={() => handleBlur("detailedDescription")}
                placeholder="Describe your teaching methodology, experience, and what makes you unique as a tutor"
                rows={8}
                error={!!errors.detailedDescription}
              />
              {errors.detailedDescription && <p className="text-xs text-red-500">{errors.detailedDescription}</p>}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-2xl border-2 border-slate-200 bg-white">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">Tutor Registration</CardTitle>
            <CardDescription className="text-blue-100">
              Complete your profile to start teaching on Tutor Hub
            </CardDescription>
            <Progress value={progress} className="mt-4 bg-blue-400" />
            <div className="flex justify-between text-xs text-blue-100 mt-2">
              <span>Step {step} of {totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-6 md:p-8 bg-slate-50">
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
                <Button onClick={() => {
                  if (validateStep(step)) {
                    setStep(Math.min(totalSteps, step + 1));
                  } else {
                    toast({
                      title: "Validation Error",
                      description: "Please fill in all required fields correctly.",
                      variant: "destructive",
                    });
                  }
                }}>
                  Next
                </Button>
              ) : (
                <Button onClick={() => {
                  if (validateStep(step)) {
                    handleSubmit();
                  } else {
                    toast({
                      title: "Validation Error",
                      description: "Please fill in all required fields correctly.",
                      variant: "destructive",
                    });
                  }
                }}>
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