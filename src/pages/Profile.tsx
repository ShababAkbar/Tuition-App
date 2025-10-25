import { useEffect, useState } from 'react';
import { Camera, Mail, Phone, MapPin, Edit2, Save, CheckCircle, AlertCircle, X, Plus } from 'lucide-react';
import { supabase, Tutor } from '../lib/supabase';

const AVAILABLE_SUBJECTS = [
  'Mathematics', 'Additional Mathematics', 'Algebra', 'Arithmetic', 'Chemistry',
  'Coding Basics', 'Computer Science', 'English', 'History', 'Physics',
  'Science', 'Social Studies', 'Biology', 'Accounting', 'Islamiat',
  'Art and Design', 'Biochemistry', 'Business Studies', 'Arabic Language', 'All'
];

export default function Profile() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    subjects: [] as string[],
    mode_of_tuition: 'Both',
    city: '',
    biography: '',
    profile_picture: '',
  });
  const [existingTutor, setExistingTutor] = useState<Tutor | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [passwordResetSent, setPasswordResetSent] = useState(false);

  useEffect(() => {
    fetchTutorProfile();
  }, []);

  const fetchTutorProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tutor')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setExistingTutor(data);
        setFormData({
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address || '',
          subjects: data.subjects || [],
          mode_of_tuition: data.mode_of_tuition || 'Both',
          city: data.city || '',
          biography: data.biography || '',
          profile_picture: data.profile_picture || '',
        });
      }
    } catch (err) {
      console.error('Error fetching tutor profile:', err);
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

  const handlePasswordReset = async () => {
    if (!formData.email) {
      setError('Email address is required for password reset');
      return;
    }

    try {
      setPasswordResetSent(true);
      setTimeout(() => setPasswordResetSent(false), 5000);
    } catch (err) {
      setError('Failed to send password reset email');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError('Name, email, and phone are required');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        subjects: formData.subjects,
        mode_of_tuition: formData.mode_of_tuition,
        city: formData.city,
        biography: formData.biography,
        profile_picture: formData.profile_picture,
        updated_at: new Date().toISOString(),
      };

      if (existingTutor) {
        const { error } = await supabase
          .from('tutor')
          .update(updateData)
          .eq('id', existingTutor.id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('tutor')
          .insert([updateData])
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
                    {formData.profile_picture ? (
                      <img src={formData.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                </div>
                <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
                  <Edit2 className="w-4 h-4" />
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
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter your full name"
                    />
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

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-8 rounded-lg transition-colors flex items-center"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Save Changes
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