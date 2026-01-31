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

/**
 * Verifies if authenticated user actually exists in database
 * Handles edge case where auth session exists but user deleted from DB
 * @returns User data if valid, null if session invalid
 */
export async function verifyAuthenticatedUser() {
  try {
    // Get session from localStorage/cookies
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return null;
    }

    // Verify user exists in auth.users table by making actual API call
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      // User deleted from database but session still exists
      console.warn('⚠️ Invalid session detected - user not found in database');
      await supabase.auth.signOut();
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error verifying authenticated user:', error);
    await supabase.auth.signOut();
    return null;
  }
}

/**
 * Force logout and clear all sessions
 * Useful when user deleted or session corrupted
 */
export async function forceLogout() {
  try {
    await supabase.auth.signOut();
    // Clear localStorage manually as backup
    localStorage.removeItem('supabase.auth.token');
    window.location.href = '/auth';
  } catch (error) {
    console.error('Error during force logout:', error);
    // Force clear even on error
    localStorage.clear();
    window.location.href = '/auth';
  }
}
