import { useEffect, useState, useRef } from 'react';
import { Camera, Phone, MapPin, Edit2, Save, CheckCircle, AlertCircle, X, Plus } from 'lucide-react';
import { supabase, Tutor } from '../lib/supabase';
import { verifyAuthenticatedUser } from '../lib/auth';
import { useToast } from '@/hooks/use-toast';

const AVAILABLE_SUBJECTS = [
  'Mathematics', 'Additional Mathematics', 'Algebra', 'Arithmetic', 'Chemistry',
  'Coding Basics', 'Computer Science', 'English', 'History', 'Physics',
  'Science', 'Social Studies', 'Biology', 'Accounting', 'Islamiat',
  'Art and Design', 'Biochemistry', 'Business Studies', 'Arabic Language', 'All'
];

export default function Profile() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cnicFrontRef = useRef<HTMLInputElement>(null);
  const cnicBackRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    // Basic fields (for approved users)
    name: '',
    email: '',
    phone: '',
    address: '',
    subjects: [] as string[],
    mode_of_tuition: 'Both',
    city: '',
    biography: '',
    profile_picture: '',
    education: [] as any[],
    
    // Additional onboarding fields (for rejected/incomplete profiles)
    firstName: '',
    lastName: '',
    fatherName: '',
    contact: '',
    otherContact: '',
    state: '',
    postalCode: '',
    cnicFrontUrl: '',
    cnicBackUrl: '',
    cnicFrontFile: null as File | null,
    cnicBackFile: null as File | null,
    workExperience: [] as Array<{ position: string; company: string; description: string; duration: string }>,
    experienceYears: 0,
    courses: [] as string[],
    shortAbout: '',
    detailedDescription: '',
  });
  const [existingTutor, setExistingTutor] = useState<Tutor | null>(null);
  const [profileStatus, setProfileStatus] = useState<'incomplete' | 'pending' | 'approved' | 'rejected'>('incomplete');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>('');

  useEffect(() => {
    fetchTutorProfile();
  }, []);

  // Generate signed URL for profile picture
  useEffect(() => {
    const loadProfilePicture = async () => {
      if (formData.profile_picture && formData.profile_picture.includes('/')) {
        try {
          const { data, error } = await supabase.storage
            .from('tutor-documents')
            .createSignedUrl(formData.profile_picture, 3600); // 1 hour expiry
          
          if (data && !error) {
            setProfilePictureUrl(data.signedUrl);
          }
        } catch (err) {
          console.error('Error loading profile picture:', err);
        }
      }
    };
    
    loadProfilePicture();
  }, [formData.profile_picture]);

  const fetchTutorProfile = async () => {
    try {
      setLoading(true);
      
      // Verify user actually exists in database
      const user = await verifyAuthenticatedUser();
      if (!user) {
        setError('User not authenticated');
        return;
      }

      // FIRST: Check new_tutor table — rejected status takes PRIORITY over tutors table
      const { data: pendingProfile } = await supabase
        .from('new_tutor')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // If rejected, always show resubmit form (even if tutors table has old data)
      if (pendingProfile?.status === 'rejected') {
        setProfileStatus('rejected');
        setFormData({
          name: `${pendingProfile.first_name || ''} ${pendingProfile.last_name || ''}`.trim(),
          email: user.email || '',
          phone: pendingProfile.contact || '',
          address: pendingProfile.address || '',
          subjects: [],
          mode_of_tuition: 'Both',
          city: pendingProfile.city || '',
          biography: pendingProfile.short_about || '',
          profile_picture: '',
          education: pendingProfile.education || [],
          firstName: pendingProfile.first_name || '',
          lastName: pendingProfile.last_name || '',
          fatherName: pendingProfile.father_name || '',
          contact: pendingProfile.contact || '',
          otherContact: pendingProfile.other_contact || '',
          state: pendingProfile.state || '',
          postalCode: pendingProfile.postal_code || '',
          cnicFrontUrl: pendingProfile.cnic_front_url || '',
          cnicBackUrl: pendingProfile.cnic_back_url || '',
          cnicFrontFile: null,
          cnicBackFile: null,
          workExperience: pendingProfile.work_experience || [],
          experienceYears: pendingProfile.experience_years || 0,
          courses: pendingProfile.courses || [],
          shortAbout: pendingProfile.short_about || '',
          detailedDescription: pendingProfile.detailed_description || '',
        });
        return;
      }

      // SECOND: Check tutors table (approved tutors)
      const { data, error } = await supabase
        .from('tutors')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setExistingTutor(data);
        setProfileStatus('approved');
        setFormData({
          name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || data.name || '',
          email: data.email || user.email || '',
          phone: data.contact || data.phone || '',
          address: data.address || '',
          subjects: data.subjects || [],
          mode_of_tuition: data.mode_of_tuition || 'Both',
          city: data.city || '',
          biography: data.short_bio || data.biography || '',
          profile_picture: data.profile_picture || '',
          education: data.education || [],
          firstName: '',
          lastName: '',
          fatherName: '',
          contact: '',
          otherContact: '',
          state: '',
          postalCode: '',
          cnicFrontUrl: '',
          cnicBackUrl: '',
          cnicFrontFile: null,
          cnicBackFile: null,
          workExperience: [],
          experienceYears: 0,
          courses: [],
          shortAbout: '',
          detailedDescription: '',
        });
      } else if (pendingProfile) {
        // pending status
        setProfileStatus(pendingProfile.status as 'pending');
        setFormData({
          name: `${pendingProfile.first_name || ''} ${pendingProfile.last_name || ''}`.trim(),
          email: user.email || '',
          phone: pendingProfile.contact || '',
          address: pendingProfile.address || '',
          subjects: [],
          mode_of_tuition: 'Both',
          city: pendingProfile.city || '',
          biography: pendingProfile.short_about || '',
          profile_picture: '',
          education: pendingProfile.education || [],
          firstName: pendingProfile.first_name || '',
          lastName: pendingProfile.last_name || '',
          fatherName: pendingProfile.father_name || '',
          contact: pendingProfile.contact || '',
          otherContact: pendingProfile.other_contact || '',
          state: pendingProfile.state || '',
          postalCode: pendingProfile.postal_code || '',
          cnicFrontUrl: pendingProfile.cnic_front_url || '',
          cnicBackUrl: pendingProfile.cnic_back_url || '',
          cnicFrontFile: null,
          cnicBackFile: null,
          workExperience: pendingProfile.work_experience || [],
          experienceYears: pendingProfile.experience_years || 0,
          courses: pendingProfile.courses || [],
          shortAbout: pendingProfile.short_about || '',
          detailedDescription: pendingProfile.detailed_description || '',
        });
      } else {
        setProfileStatus('incomplete');
        setFormData(prev => ({ ...prev, email: user.email || '' }));
      }
    } catch (err) {
      console.error('Error fetching tutor profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setSuccess(false);
    setError(null);
  };

  const handleModeChange = (mode: string) => {
    setFormData({
      ...formData,
      mode_of_tuition: mode,
    });
    setSuccess(false);
    setError(null);
  };

  const handleSubjectToggle = (subject: string) => {
    const currentSubjects = [...formData.subjects];
    const index = currentSubjects.indexOf(subject);

    if (index > -1) {
      currentSubjects.splice(index, 1);
    } else {
      currentSubjects.push(subject);
    }

    setFormData({
      ...formData,
      subjects: currentSubjects,
    });
    setSuccess(false);
    setError(null);
  };

  const removeSubject = (subject: string) => {
    setFormData({
      ...formData,
      subjects: formData.subjects.filter(s => s !== subject),
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/profile_${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('tutor-documents')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      // Store the file path (not public URL, since bucket is private)
      setFormData(prev => ({ ...prev, profile_picture: fileName }));
      
      // Auto-save the profile picture file path
      if (existingTutor) {
        await supabase
          .from('tutors')
          .update({ profile_picture: fileName })
          .eq('user_id', user.id);
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!formData.email) {
      setError('Email address is required for password reset');
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      setPasswordResetSent(true);
      setTimeout(() => setPasswordResetSent(false), 5000);
    } catch (err) {
      setError('Failed to send password reset email');
    }
  };

  const handleEducationChange = (index: number, field: string, value: string | File) => {
    const newEducation = [...formData.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setFormData({ ...formData, education: newEducation });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { degree: '', institution: '', startDate: '', endDate: '', status: 'Completed', resultCard: null, resultCardUrl: '' }],
    });
  };

  const removeEducation = (index: number) => {
    setFormData({
      ...formData,
      education: formData.education.filter((_, i) => i !== index),
    });
  };

  const handleResubmitProfile = async () => {
    // Validate required fields for rejected/incomplete profiles
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.contact.trim()) {
      setError('First name, last name, and contact are required');
      return;
    }

    if (!formData.city.trim() || !formData.state.trim() || !formData.address.trim()) {
      setError('City, state, and address are required');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Upload CNIC files if new ones are selected
      let cnicFrontUrl = formData.cnicFrontUrl;
      let cnicBackUrl = formData.cnicBackUrl;

      if (formData.cnicFrontFile) {
        try {
          const fileName = `${user.id}/cnic-front-${Date.now()}.${formData.cnicFrontFile.name.split('.').pop()}`;
          const { error: uploadError } = await supabase.storage
            .from('tutor-documents')
            .upload(fileName, formData.cnicFrontFile);
          
          if (uploadError) {
            console.warn('CNIC front upload error (keeping old URL):', uploadError);
          } else {
            cnicFrontUrl = fileName;
          }
        } catch (uploadErr) {
          console.warn('CNIC front upload failed (keeping old URL):', uploadErr);
        }
      }

      if (formData.cnicBackFile) {
        try {
          const fileName = `${user.id}/cnic-back-${Date.now()}.${formData.cnicBackFile.name.split('.').pop()}`;
          const { error: uploadError } = await supabase.storage
            .from('tutor-documents')
            .upload(fileName, formData.cnicBackFile);
          
          if (uploadError) {
            console.warn('CNIC back upload error (keeping old URL):', uploadError);
          } else {
            cnicBackUrl = fileName;
          }
        } catch (uploadErr) {
          console.warn('CNIC back upload failed (keeping old URL):', uploadErr);
        }
      }

      // Upload education result cards if any
      const updatedEducation = await Promise.all(
        formData.education.map(async (edu: any) => {
          if (edu.resultCard && edu.resultCard instanceof File) {
            try {
              const fileName = `${user.id}/result-card-${Date.now()}.${edu.resultCard.name.split('.').pop()}`;
              const { error: uploadError } = await supabase.storage
                .from('tutor-documents')
                .upload(fileName, edu.resultCard);
              
              if (!uploadError) {
                return { 
                  degree: edu.degree,
                  institution: edu.institution,
                  startDate: edu.startDate,
                  endDate: edu.endDate,
                  status: edu.status,
                  resultCardUrl: fileName 
                };
              }
              console.warn('Result card upload error (keeping old URL):', uploadError);
            } catch (uploadErr) {
              console.warn('Result card upload failed (keeping old URL):', uploadErr);
            }
          }
          return {
            degree: edu.degree,
            institution: edu.institution,
            startDate: edu.startDate,
            endDate: edu.endDate,
            status: edu.status,
            resultCardUrl: edu.resultCardUrl || ''
          };
        })
      );

      const updateData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        father_name: formData.fatherName,
        contact: formData.contact,
        other_contact: formData.otherContact,
        city: formData.city,
        state: formData.state,
        address: formData.address,
        postal_code: formData.postalCode,
        cnic_front_url: cnicFrontUrl,
        cnic_back_url: cnicBackUrl,
        education: updatedEducation,
        work_experience: formData.workExperience,
        experience_years: formData.experienceYears,
        courses: formData.courses,
        short_about: formData.shortAbout,
        detailed_description: formData.detailedDescription,
        status: 'pending',  // Reset status to pending for re-review
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('new_tutor')
        .update(updateData)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Profile Resubmitted!',
        description: 'Your profile has been submitted for review. We will notify you once it is approved.',
      });

      setProfileStatus('pending');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resubmit profile');
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to resubmit profile',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if profile is pending
    if (profileStatus === 'pending') {
      toast({
        title: 'Profile Under Review',
        description: 'Your profile is currently pending approval. You cannot edit it at this time.',
        variant: 'destructive',
      });
      return;
    }

    // Handle rejected or incomplete profiles - allow resubmission
    if (profileStatus === 'incomplete' || profileStatus === 'rejected') {
      return handleResubmitProfile();
    }

    // Handle approved profiles - normal update
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError('Name, email, and phone are required');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const updateData = {
        contact: formData.phone,
        address: formData.address,
        subjects: formData.subjects,
        mode_of_tuition: formData.mode_of_tuition,
        city: formData.city,
        short_bio: formData.biography,
        profile_picture: formData.profile_picture,
        education: formData.education,
        updated_at: new Date().toISOString(),
      };

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      if (existingTutor) {
        const { error } = await supabase
          .from('tutors')
          .update(updateData)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('tutors')
          .insert([{ ...updateData, user_id: user.id }])
          .select()
          .single();

        if (error) throw error;
        setExistingTutor(data);
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="relative">
            <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>

            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-white p-2 shadow-xl">
                  <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {profilePictureUrl ? (
                      <img src={profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  {uploading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <Edit2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-20 pb-8 px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">{formData.name || 'Your Name'}</h2>
              <p className="text-gray-600 mt-1">{formData.email || 'your.email@example.com'}</p>
            </div>

            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                <p className="text-green-700 font-medium">Profile saved successfully!</p>
              </div>
            )}

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {passwordResetSent && (
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                <p className="text-blue-700">Password reset email sent successfully!</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Show onboarding fields for rejected/incomplete profiles */}
              {(profileStatus === 'rejected' || profileStatus === 'incomplete') && (
                <div className="mb-8 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {profileStatus === 'rejected' ? '⚠️ Profile Rejected - Please Update and Resubmit' : '📝 Complete Your Profile'}
                  </h3>
                  <p className="text-sm text-gray-700 mb-6">
                    {profileStatus === 'rejected' 
                      ? 'Your profile was rejected. Please review the feedback, update all required fields below, and resubmit for approval.'
                      : 'Please fill in all required fields to submit your profile for approval.'}
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Column 1: Personal Information */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900 mb-3 pb-2 border-b">Personal Information</h4>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name (Read-only)
                        </label>
                        <input
                          type="text"
                          value={`${formData.firstName} ${formData.lastName}`}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email (Read-only)
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          value={formData.contact}
                          onChange={(e) => setFormData({...formData, contact: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="+92 300 1234567"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Father's Name
                        </label>
                        <input
                          type="text"
                          value={formData.fatherName}
                          onChange={(e) => setFormData({...formData, fatherName: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your father's name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Years of Experience
                        </label>
                        <input
                          type="number"
                          value={formData.experienceYears}
                          onChange={(e) => setFormData({...formData, experienceYears: parseInt(e.target.value) || 0})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0"
                          min="0"
                        />
                      </div>
                    </div>

                    {/* Column 2: Address Information */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900 mb-3 pb-2 border-b">Address Details</h4>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your city"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State/Province <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.state}
                          onChange={(e) => setFormData({...formData, state: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your state/province"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Address <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your complete address"
                          rows={3}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          value={formData.postalCode}
                          onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter postal code"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Other Contact
                        </label>
                        <input
                          type="tel"
                          value={formData.otherContact}
                          onChange={(e) => setFormData({...formData, otherContact: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Alternative contact number"
                        />
                      </div>
                    </div>

                    {/* Column 3: Subjects & Mode */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900 mb-3 pb-2 border-b">Subjects & Teaching</h4>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subjects Can Teach
                        </label>
                        <div className="border border-gray-300 rounded-lg p-3 min-h-[120px] bg-white">
                          <div className="flex flex-wrap gap-2 mb-2">
                            {formData.courses.map((subject) => (
                              <span
                                key={subject}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                              >
                                {subject}
                                <button
                                  type="button"
                                  onClick={() => setFormData({...formData, courses: formData.courses.filter(s => s !== subject)})}
                                  className="ml-2 hover:text-blue-900"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                          <select
                            onChange={(e) => {
                              if (e.target.value && !formData.courses.includes(e.target.value)) {
                                setFormData({...formData, courses: [...formData.courses, e.target.value]});
                                e.target.value = '';
                              }
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          >
                            <option value="">Add a subject...</option>
                            {AVAILABLE_SUBJECTS.filter(s => !formData.courses.includes(s)).map((subject) => (
                              <option key={subject} value={subject}>{subject}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mode of Tuition
                        </label>
                        <div className="space-y-2">
                          {['Online', 'Home', 'Both'].map((mode) => (
                            <label key={mode} className="flex items-center">
                              <input
                                type="radio"
                                name="mode_of_tuition_rejected"
                                value={mode}
                                checked={formData.mode_of_tuition === mode}
                                onChange={() => setFormData({...formData, mode_of_tuition: mode})}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-sm text-gray-700">{mode}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CNIC Documents */}
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-3">CNIC Documents</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CNIC Front
                        </label>
                        <input
                          type="file"
                          ref={cnicFrontRef}
                          onChange={(e) => setFormData({...formData, cnicFrontFile: e.target.files?.[0] || null})}
                          accept="image/*"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        />
                        {formData.cnicFrontUrl && <p className="text-xs text-green-600 mt-1">✓ File uploaded</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CNIC Back
                        </label>
                        <input
                          type="file"
                          ref={cnicBackRef}
                          onChange={(e) => setFormData({...formData, cnicBackFile: e.target.files?.[0] || null})}
                          accept="image/*"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                        />
                        {formData.cnicBackUrl && <p className="text-xs text-green-600 mt-1">✓ File uploaded</p>}
                      </div>
                    </div>
                  </div>

                  {/* Education */}
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-3">Education</h4>
                    <div className="space-y-4">
                      {formData.education.map((edu: any, index: number) => (
                        <div key={index} className="p-4 border-2 border-gray-200 rounded-lg bg-white">
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-sm font-semibold text-gray-700">Education {index + 1}</span>
                            <button
                              type="button"
                              onClick={() => removeEducation(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={edu.degree || ''}
                              onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                              placeholder="Degree (e.g., BS Computer Science)"
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                            />
                            <input
                              type="text"
                              value={edu.institution || ''}
                              onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                              placeholder="Institution"
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                            />
                            <input
                              type="text"
                              value={edu.startDate || ''}
                              onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                              placeholder="Start Date (e.g., 2020-01-01)"
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                            />
                            <input
                              type="text"
                              value={edu.endDate || ''}
                              onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                              placeholder="End Date (e.g., 2024-12-31)"
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                            />
                            <select
                              value={edu.status || 'Completed'}
                              onChange={(e) => handleEducationChange(index, 'status', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                            >
                              <option value="Completed">Completed</option>
                              <option value="Continuing">Continuing</option>
                              <option value="In Progress">In Progress</option>
                            </select>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Result Card/Degree (Optional)</label>
                              <input
                                type="file"
                                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleEducationChange(index, 'resultCard', f); }}
                                accept="image/*"
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                              />
                              {edu.resultCardUrl && <p className="text-xs text-green-600 mt-1">✓ File uploaded</p>}
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addEducation}
                        className="inline-flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Education
                      </button>
                    </div>
                  </div>

                  {/* About */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Short About (Brief Introduction)
                    </label>
                    <textarea
                      value={formData.shortAbout}
                      onChange={(e) => setFormData({...formData, shortAbout: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Brief introduction about yourself..."
                      rows={3}
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Detailed Description
                    </label>
                    <textarea
                      value={formData.detailedDescription}
                      onChange={(e) => setFormData({...formData, detailedDescription: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Detailed description of your teaching experience and methodology..."
                      rows={5}
                    />
                  </div>
                </div>
              )}

              {/* Regular profile fields for approved users */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                      placeholder="Your name from registration"
                    />
                    <p className="text-xs text-gray-500 mt-1">Name cannot be edited here</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value="••••••••"
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                      <button
                        type="button"
                        onClick={handlePasswordReset}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4 mr-2" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 mr-2" />
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter your address"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subjects
                    </label>
                    <div className="border border-gray-300 rounded-lg p-3 min-h-[120px] bg-gray-50">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.subjects.map((subject) => (
                          <span
                            key={subject}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                          >
                            {subject}
                            <button
                              type="button"
                              onClick={() => removeSubject(subject)}
                              className="ml-2 hover:text-blue-900"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add
                        </button>
                        {showSubjectDropdown && (
                          <div className="absolute z-10 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {AVAILABLE_SUBJECTS.filter(s => !formData.subjects.includes(s)).map((subject) => (
                              <button
                                key={subject}
                                type="button"
                                onClick={() => {
                                  handleSubjectToggle(subject);
                                  setShowSubjectDropdown(false);
                                }}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                              >
                                {subject}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mode of Tuition
                    </label>
                    <div className="space-y-2">
                      {['Online', 'Home', 'Both'].map((mode) => (
                        <label key={mode} className="flex items-center">
                          <input
                            type="radio"
                            name="mode_of_tuition"
                            value={mode}
                            checked={formData.mode_of_tuition === mode}
                            onChange={() => handleModeChange(mode)}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{mode}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter your city"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Education
                    </label>
                    <div className="space-y-3">
                      {formData.education.map((edu, index) => (
                        <div key={index} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-medium text-gray-700">Education {index + 1}</span>
                            <button
                              type="button"
                              onClick={() => removeEducation(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={edu.degree || ''}
                            onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                            placeholder="Degree (e.g., BS Computer Science)"
                            className="w-full px-3 py-2 border border-gray-300 rounded mb-2 text-sm"
                          />
                          <input
                            type="text"
                            value={edu.institution || ''}
                            onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                            placeholder="Institution"
                            className="w-full px-3 py-2 border border-gray-300 rounded mb-2 text-sm"
                          />
                          <input
                            type="text"
                            value={edu.year || ''}
                            onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                            placeholder="Year (e.g., 2020)"
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                          />
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addEducation}
                        className="inline-flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Education
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Biography
                    </label>
                    <textarea
                      name="biography"
                      value={formData.biography}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>
              </div>

              {/* Show pending status message */}
              {profileStatus === 'pending' && (
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center">
                  <AlertCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                  <p className="text-blue-700 font-medium">Your profile is currently under review. You cannot make changes until it is approved or rejected.</p>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving || profileStatus === 'pending'}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-8 rounded-lg transition-colors flex items-center"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 h-5 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      {profileStatus === 'pending' ? 'Profile Under Review' : 
                       profileStatus === 'incomplete' ? 'Submit for Review' :
                       profileStatus === 'rejected' ? 'Resubmit for Review' : 'Save Changes'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}