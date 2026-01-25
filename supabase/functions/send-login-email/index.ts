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
      subject: 'Welcome to ApnaTuition!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
            .welcome-text { font-size: 24px; font-weight: bold; color: #1f2937; margin-bottom: 20px; }
            .message { color: #4b5563; margin-bottom: 20px; }
            .features { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .feature-item { margin: 10px 0; padding-left: 25px; position: relative; }
            .feature-item:before { content: "✓"; position: absolute; left: 0; color: #2563eb; font-weight: bold; }
            .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; padding: 20px; border-top: 1px solid #e5e7eb; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">
                <span style="color: white;">Apna</span><span style="color: #93c5fd;">Tuition</span>
              </div>
              <p style="margin: 0; font-size: 16px;">Pakistan's Premier Tutoring Platform</p>
            </div>
            
            <div class="content">
              <div class="welcome-text">Welcome to ApnaTuition! 🎓</div>
              
              <p class="message">
                Thank you for joining Pakistan's most trusted home and online tutoring platform. You've taken the first step towards academic excellence!
              </p>
              
              <div class="features">
                <h3 style="margin-top: 0; color: #1f2937;">What You Can Do Now:</h3>
                <div class="feature-item">Browse thousands of verified tutors across Pakistan</div>
                <div class="feature-item">Request tutors for any subject or exam preparation</div>
                <div class="feature-item">Choose between home tutoring or online sessions</div>
                <div class="feature-item">Track your tuition requests in real-time</div>
              </div>
              
              <p class="message">
                Ready to find your perfect tutor? Click below to get started!
              </p>
              
              <center>
                <a href="https://apna-tuition.com/tuition-request" class="button">Find a Tutor Now</a>
              </center>
              
              <p class="message" style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                Need help? Our support team is here for you at <a href="mailto:support@apna-tuition.com" style="color: #2563eb;">support@apna-tuition.com</a>
              </p>
            </div>
            
            <div class="footer">
              <p>© 2026 ApnaTuition. All rights reserved.</p>
              <p>Making quality education accessible across Pakistan</p>
            </div>
          </div>
        </body>
        </html>
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
