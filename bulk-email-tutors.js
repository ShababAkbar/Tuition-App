/**
 * Bulk Email Script - Send email to all registered tutors
 * 
 * SETUP:
 * 1. Create a .env file in the root directory
 * 2. Add these variables:
 *    VITE_SUPABASE_URL=your_supabase_url
 *    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
 *    RESEND_API_KEY=your_resend_api_key
 * 3. Edit the EMAIL_SUBJECT and EMAIL_BODY below with your message
 * 4. Set DRY_RUN = true first to preview without sending
 * 5. Run: node bulk-email-tutors.js
 */

import 'dotenv/config';

// ============================================================
// CONFIGURATION - EDIT THESE VALUES
// ============================================================

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const RESEND_API_KEY = process.env.RESEND_API_KEY;

const FROM_EMAIL = 'Apna Tuition <noreply@apna-tuition.com>';
// Must be a verified domain in your Resend dashboard

const EMAIL_SUBJECT = '🚨 Important Announcement – Action Required | Apna Tuition';

const EMAIL_BODY_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: white; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { padding: 30px; }
    .content p { margin: 0 0 16px 0; }
    .alert-box { background: #fff8e1; border-left: 4px solid #f59e0b; padding: 15px 20px; border-radius: 5px; margin: 20px 0; }
    .steps { background: #f0fdf4; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .steps ol { margin: 0; padding-left: 20px; }
    .steps li { margin-bottom: 10px; }
    .button { display: inline-block; background: #25D366; color: white !important; padding: 14px 35px; text-decoration: none; border-radius: 5px; margin: 10px 0; font-weight: bold; font-size: 16px; }
    .footer { background: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚨 Important Announcement</h1>
      <p style="margin:8px 0 0 0; opacity:0.9;">Please Read Carefully – Action Required</p>
    </div>
    <div class="content">
      <p>Dear Tutor,</p>

      <p>We hope you are doing well. This is an important announcement from <strong>Apna Tuition</strong> that requires your immediate attention.</p>

      <div class="alert-box">
        ⚠️ <strong>We have noticed that many tutors have turned off notifications on our WhatsApp Channel</strong>, or have not joined it yet. As a result, they are not receiving updates about available tuitions — and then blaming the platform for not providing tuitions.
      </div>

      <p>Please note that <strong>all available tuition listings are posted on our official WhatsApp Channel</strong>. If your notifications are off or you haven't joined, you will miss every new opportunity.</p>

      <div class="steps">
        <strong>✅ Please take these steps right now:</strong>
        <ol>
          <li>Open WhatsApp and search for <strong>Apna Tuition</strong> channel, or click the button below to join directly.</li>
          <li>If you have already joined, go to the channel and make sure <strong>notifications are turned ON</strong>.</li>
          <li>Check the channel regularly for new tuition postings.</li>
        </ol>
      </div>

      <p style="text-align:center; margin: 25px 0;">
        <a href="https://whatsapp.com/channel/0029Vb7GSHV5q08aaeU3pv2r" class="button">
          📲 Join WhatsApp Channel
        </a>
      </p>

      <p>If you have any questions, feel free to contact us at <strong>+923194394344</strong>.</p>

      <p>Best regards,<br><strong>Apna Tuition Team</strong></p>
    </div>
    <div class="footer">
      <p>Apna Tuition | apna-tuition.com | +923194394344</p>
      <p>You received this email because you are registered as a tutor on Apna Tuition.</p>
    </div>
  </div>
</body>
</html>
`;

// Set to true to preview emails WITHOUT actually sending them
const DRY_RUN = false;

// Delay between each email (milliseconds) - 500ms = 2 emails/sec (safe for Resend)
const DELAY_MS = 500;

// ============================================================
// SCRIPT - DO NOT EDIT BELOW THIS LINE
// ============================================================

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchAllTutors() {
  console.log('📋 Fetching approved tutors from tutors table...');

  // Fetch directly from tutors table - email is stored here for approved tutors
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/tutors?status=eq.approved&email=not.is.null&select=user_id,email,first_name`,
    {
      headers: {
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      }
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to fetch tutors: ${err}`);
  }

  const tutors = await response.json();
  console.log(`✅ Found ${tutors.length} approved tutors\n`);
  return tutors;
}

async function sendEmail(to, name, subject, html) {
  const personalizedHtml = html;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [to],
      subject: subject,
      html: personalizedHtml,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Resend API error: ${err}`);
  }

  return await response.json();
}

async function main() {
  console.log('======================================');
  console.log('  APNA TUITION - Bulk Email Sender');
  console.log('======================================\n');

  if (SUPABASE_SERVICE_ROLE_KEY === 'YOUR_SERVICE_ROLE_KEY_HERE') {
    console.error('❌ ERROR: Please set your SUPABASE_SERVICE_ROLE_KEY in the script!');
    process.exit(1);
  }
  if (RESEND_API_KEY === 'YOUR_RESEND_API_KEY_HERE') {
    console.error('❌ ERROR: Please set your RESEND_API_KEY in the script!');
    process.exit(1);
  }

  if (DRY_RUN) {
    console.log('🔍 DRY RUN MODE - No emails will be sent');
    console.log('   (Set DRY_RUN = false to actually send)\n');
  }

  const tutors = await fetchAllTutors();

  if (tutors.length === 0) {
    console.log('⚠️ No approved tutors found. Exiting.');
    return;
  }

  console.log(`📧 Subject: ${EMAIL_SUBJECT}`);
  console.log(`📤 From:    ${FROM_EMAIL}`);
  console.log(`👥 Total:   ${tutors.length} tutors\n`);

  if (DRY_RUN) {
    console.log('--- PREVIEW: First 5 recipients ---');
    tutors.slice(0, 5).forEach((t, i) => {
      console.log(`  ${i + 1}. ${t.email} (name: ${t.first_name || 'Tutor'})`);
    });
    if (tutors.length > 5) console.log(`  ... and ${tutors.length - 5} more`);
    console.log('\n✅ Dry run complete. Set DRY_RUN = false to send emails.');
    return;
  }

  // Confirm before sending
  console.log(`⚠️  About to send ${tutors.length} emails. Starting in 5 seconds...`);
  console.log('   Press Ctrl+C to cancel!\n');
  await sleep(5000);

  let sent = 0;
  let failed = 0;
  const errors = [];

  for (let i = 0; i < tutors.length; i++) {
    const tutor = tutors[i];
    const name = tutor.first_name || 'Tutor';

    try {
      await sendEmail(tutor.email, name, EMAIL_SUBJECT, EMAIL_BODY_HTML);
      sent++;
      console.log(`✅ [${i + 1}/${tutors.length}] Sent to: ${tutor.email}`);
    } catch (err) {
      failed++;
      errors.push({ email: tutor.email, error: err.message });
      console.log(`❌ [${i + 1}/${tutors.length}] Failed: ${tutor.email} - ${err.message}`);
    }

    // Rate limiting delay
    if (i < tutors.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  console.log('\n======================================');
  console.log(`  DONE! ✅ Sent: ${sent} | ❌ Failed: ${failed}`);
  console.log('======================================');

  if (errors.length > 0) {
    console.log('\nFailed emails:');
    errors.forEach(e => console.log(`  - ${e.email}: ${e.error}`));
  }
}

main().catch(err => {
  console.error('\n💥 Fatal error:', err.message);
  process.exit(1);
});
