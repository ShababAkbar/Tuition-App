# Email Notification System for Tuition Applications

## Overview
Implemented automatic email notifications for tuition application acceptance and rejection.

## How It Works

### Auto-Rejection System
✅ **Already Implemented in Database Trigger**
- When admin accepts one tutor's application, all other pending applications are automatically rejected
- Trigger: `accept_tuition_application()` in migration `20260129000000_create_tuition_applications.sql`
- Lines 76-82: Auto-rejects other pending applications

### Email Notifications

#### 1. **Acceptance Email** 🎉
**Sent When:** Admin assigns tuition to a tutor

**Email Contains:**
- Congratulations message
- Tuition details (code, student name, subject, grade, fee)
- Next steps for the tutor
- Link to dashboard

**Template:** Professional HTML email with:
- ApnaTuition branding
- Detailed tuition information table
- Call-to-action button to dashboard

#### 2. **Rejection Email** 📧
**Sent When:** 
- Admin manually rejects an application
- Application is auto-rejected when another tutor is selected

**Email Contains:**
- Polite notification about not being selected
- Reason: "Another tutor's profile more closely matches requirements"
- Encouragement to apply for other tuitions
- Link to view available tuitions

**Tone:** Polite and professional, avoiding terms like "low competence"

## Implementation Details

### Files Modified

1. **src/lib/email.ts**
   - Added `notifyTuitionAssignment()` - sends acceptance email
   - Added `notifyTuitionRejection()` - sends rejection email

2. **src/pages/TuitionApplications.tsx**
   - `handleAccept()`: Sends acceptance email to selected tutor + rejection emails to others
   - `handleReject()`: Sends rejection email to rejected tutor
   - Fetches tutor email from auth.users table via user_id

3. **supabase/functions/send-assignment-email/index.ts** (NEW)
   - Supabase Edge Function
   - Handles both acceptance and rejection emails
   - Uses Resend API for email delivery

## Deployment Steps

### 1. Deploy Edge Function
```bash
cd supabase/functions/send-assignment-email
supabase functions deploy send-assignment-email
```

### 2. Set Environment Variable
```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key
supabase secrets set APP_URL=http://localhost:5173
```

### 3. Test Email Flow
1. Create tuition request as parent
2. Approve from admin dashboard
3. Have 2+ tutors apply
4. Accept one application
5. Verify:
   - Accepted tutor receives acceptance email
   - Other tutors receive rejection email

## Email Flow Example

```
Admin accepts Tutor A's application
         ↓
Database Trigger fires
         ↓
Tuition assigned to Tutor A
Other applications marked "rejected"
         ↓
Frontend sends emails:
- Acceptance email → Tutor A
- Rejection email → Tutor B
- Rejection email → Tutor C
```

## Email Templates

### Acceptance Email Subject
`🎉 Congratulations! Tuition {CODE} Assigned to You`

### Rejection Email Subject
`Application Update - Tuition {CODE}`

## Future Enhancements
- [ ] Email templates in database for easy editing
- [ ] Email preview before sending
- [ ] Email delivery status tracking
- [ ] Bulk email for multiple applications
