import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create client with persistent session (7 days)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'apna-tuition-auth',
  },
});

export interface Tuition {
  id: string;
  student_name: string;
  subject: string;
  grade: string;
  location: string;
  timing: string;
  fee: string;
  city: string;
  tuition_type: string;
  tuition_code: string;
  tutor_id: string | null;
  created_at: string;
}

export interface Tutor {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  father_name?: string;
  email: string;
  contact: string;
  other_contact?: string;
  city: string;
  state: string;
  address: string;
  postal_code: string;
  cnic_front_url?: string;
  cnic_back_url?: string;
  education?: any[];
  work_experience?: any[];
  experience_years?: number;
  subjects: string[];
  mode_of_tuition: string;
  short_bio?: string;
  detailed_description?: string;
  profile_picture?: string;
  status: string;
  created_at: string;
  updated_at: string;
}