import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
  name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
}
