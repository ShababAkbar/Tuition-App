// @ts-nocheck
// Edge function that emails a user when they sign in successfully.
// Deploy with: npx supabase functions deploy send-login-email --no-verify-jwt
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { Resend } from 'https://esm.sh/resend@2.1.0';

const resendApiKey = Deno.env.get('RESEND_API_KEY');
const fromAddress = Deno.env.get('RESEND_FROM_EMAIL') ?? 'noreply@tutorhub.local';

const resend = resendApiKey ? new Resend(resendApiKey) : null;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { 
      status: 405,
      headers: corsHeaders 
    });
  }

  if (!resend) {
    console.warn('RESEND_API_KEY is not configured.');
    return new Response(JSON.stringify({ success: false, error: 'Email provider not configured.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ success: false, error: 'Missing email in payload.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: 'Login successful',
      html: `
        <h2>Welcome back to TutorHub!</h2>
        <p>You have successfully signed in. If this wasn't you, please reset your password immediately.</p>
      `,
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to send login email', error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to send login email.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
