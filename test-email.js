// Quick test to verify Supabase email setup
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gitwgsoasegtfumkrizz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpdHdnc29hc2VndGZ1bWtyaXp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTYxNDgsImV4cCI6MjA3NjU3MjE0OH0.xzUujs8OGGsxIaOFl4k5L-gnvqmlKcBt5HEIXcht8Lg';

const supabase = createClient(supabaseUrl, supabaseKey);

// Test signup
const testEmail = 'test' + Date.now() + '@gmail.com';
console.log('Testing signup with:', testEmail);

const { data, error } = await supabase.auth.signUp({
  email: testEmail,
  password: 'Test123456!',
  options: {
    emailRedirectTo: 'http://localhost:5173/auth?type=tutor'
  }
});

if (error) {
  console.error('❌ Error:', error.message);
} else {
  console.log('✅ Signup successful!');
  console.log('User ID:', data.user?.id);
  console.log('Email confirmation sent:', data.user?.email_confirmed_at === null ? 'Pending' : 'Confirmed');
  console.log('\n📧 Check your email inbox for:', testEmail);
}
