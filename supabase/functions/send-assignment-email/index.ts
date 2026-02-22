import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, tutorName, tuitionCode, studentName, subject, grade, fee, type } = await req.json()

    let emailSubject = '';
    let emailHtml = '';

    if (type === 'acceptance') {
      emailSubject = `🎉 Congratulations! Tuition ${tuitionCode} Assigned to You`;
      emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .tuition-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; color: #667eea; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; color: #666; padding: 20px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Congratulations!</h1>
              <p>You've been assigned a new tuition</p>
            </div>
            <div class="content">
              <p>Dear <strong>${tutorName}</strong>,</p>
              
              <p>We are pleased to inform you that your application for <strong>Tuition ${tuitionCode}</strong> has been <span style="color: #10b981; font-weight: bold;">ACCEPTED</span>!</p>
              
              <div class="tuition-details">
                <h3 style="color: #667eea; margin-top: 0;">Tuition Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Tuition Code:</span>
                  <span>${tuitionCode}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Student Name:</span>
                  <span>${studentName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Subject:</span>
                  <span>${subject}</span>
                </div>
                ${grade ? `
                <div class="detail-row">
                  <span class="detail-label">Grade:</span>
                  <span>${grade}</span>
                </div>
                ` : ''}
                ${fee ? `
                <div class="detail-row">
                  <span class="detail-label">Fee:</span>
                  <span>Rs. ${fee}</span>
                </div>
                ` : ''}
              </div>
              
              <p><strong>Next Steps:</strong></p>
              <ul>
                <li>Log in to your ApnaTuition dashboard to view complete tuition details</li>
                <li>Contact the student/parent to arrange first session</li>
                <li>Prepare your teaching materials</li>
              </ul>
              
              <a href="${Deno.env.get('APP_URL') || 'https://apna-tuition.com'}/dashboard" class="button">Go to Dashboard</a>
              
              <p>We wish you all the best for this tuition assignment!</p>
              
              <p>Best regards,<br><strong>ApnaTuition Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
              <p>© 2026 ApnaTuition. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    } else {
      // Rejection email
      emailSubject = `Application Update - Tuition ${tuitionCode}`;
      emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; color: #666; padding: 20px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Application Update</h1>
              <p>Regarding Tuition ${tuitionCode}</p>
            </div>
            <div class="content">
              <p>Dear <strong>${tutorName}</strong>,</p>
              
              <p>Thank you for applying for <strong>Tuition ${tuitionCode}</strong> (${subject} for ${studentName}).</p>
              
              <div class="info-box">
                <p style="margin: 0;"><strong>Application Status:</strong> Not Selected</p>
              </div>
              
              <p>After careful consideration of all applications, we regret to inform you that we have selected another tutor whose profile more closely matches the specific requirements for this tuition.</p>
              
              <p>This decision does not reflect on your qualifications or teaching abilities. We encourage you to:</p>
              <ul>
                <li>Continue browsing available tuitions on your dashboard</li>
                <li>Apply for tuitions that match your expertise</li>
                <li>Keep your profile updated with latest qualifications</li>
              </ul>
              
              <a href="${Deno.env.get('APP_URL') || 'https://apna-tuition.com'}/tuitions" class="button">View Available Tuitions</a>
              
              <p>We appreciate your interest in ApnaTuition and look forward to connecting you with suitable opportunities in the future.</p>
              
              <p>Best regards,<br><strong>ApnaTuition Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
              <p>© 2026 ApnaTuition. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'ApnaTuition <support@apna-tuition.com>',
        to: [to],
        subject: emailSubject,
        html: emailHtml,
      }),
    })

    const data = await res.json()
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
