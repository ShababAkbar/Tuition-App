import { supabase } from './supabase';

interface SignUpArgs {
  fullName: string;
  email: string;
  password: string;
  role?: 'tutor' | 'parent';
}

export const signUp = async ({ fullName, email, password, role = 'tutor' }: SignUpArgs) => {
  // Check if user already exists in user_profiles
  const { data: existingUser } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  // Ignore error if table doesn't exist or RLS blocks access (user will get created anyway)
  if (existingUser) {
    throw new Error('An account with this email already exists. Please log in instead.');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role,
      },
      emailRedirectTo: `${window.location.origin}/auth?type=${role}`,
    },
  });

  if (error) {
    throw error;
  }

  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
};
