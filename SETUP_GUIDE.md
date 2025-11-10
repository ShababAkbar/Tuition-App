# Tutor Login/Signup & Profile Management Setup

## Overview
This implementation provides a complete tutor authentication and profile management system with admin approval workflow.

## Database Architecture

### Two-Table System:

1. **`tutors` table** (Pending/Approved Profiles)
   - Contains sensitive data (CNIC, education, work experience)
   - Status: `pending`, `approved`, `rejected`
   - Non-editable after approval
   - Used for admin review

2. **`tutor` table** (Active Tutor Profiles)
   - Contains editable profile data (name, bio, subjects, city)
   - Only approved tutors exist here
   - Tutors can edit these fields anytime

## User Flow

### 1. Signup & Login
```
User → Clicks "For Tutors" → Auth Page
     → Signs up with Name, Email, Password, Phone (optional)
     → Email verification sent
     → Login with credentials
     → Successful login email notification sent
```

### 2. Profile Completion
```
Login → Dashboard (Yellow Banner: "Complete Your Profile")
     → Click "Complete Now" → Tutor Onboarding Form
     → Fill: Personal Info, CNIC, Education, Experience
     → Submit → Data saved to `tutors` table with status='pending'
```

### 3. Admin Approval
```
Admin reviews `tutors` table
├── Approves → Copy data to `tutor` table + update status='approved'
└── Rejects → Update status='rejected'
```

### 4. Applying for Tuitions
```
Dashboard → Browse Tuitions → View Details
├── Profile Incomplete → "Complete your profile first" message
├── Profile Pending → "Waiting for approval" message  
├── Profile Rejected → "Contact support" message
└── Profile Approved → Can apply successfully ✅
```

## Supabase Setup

### Step 1: Run Migrations in Order

Run these SQL files in Supabase SQL Editor:

```sql
-- 1. Create base tables
-- File: 20251021043837_create_tutor_tuition_tables.sql

-- 2. Add tuition assignments
-- File: 20251022104550_add_tuition_assignments.sql

-- 3. Add tutor profile fields
-- File: 20251025161236_add_tutor_profile_fields.sql

-- 4. Add app stats
-- File: 20251028000000_add_app_stats.sql

-- 5. Create tutors table (for pending profiles)
-- File: 20251029000000_create_tutors_table.sql

-- 6. Create tuition requests
-- File: 20251031000000_create_tuition_requests_table.sql

-- 7. Make phone nullable
-- File: 20251109000000_make_phone_nullable.sql

-- 8. Update tutor table structure
-- File: 20251109000001_update_tutor_table_structure.sql
```

### Step 2: Configure Auth Settings

In Supabase Dashboard → Authentication → Settings:

1. **Enable Email Provider**
2. **Site URL**: Set to your deployment URL (e.g., `http://localhost:5173` for dev)
3. **Email Confirmations**: 
   - Enable if you want email verification
   - Disable for instant access (testing)

### Step 3: Deploy Edge Function (Optional)

For login email notifications:

```bash
# Install Supabase CLI first
npx supabase functions deploy send-login-email --project-ref YOUR_PROJECT_REF --no-verify-jwt

# Set secrets
npx supabase secrets set RESEND_API_KEY=your_resend_key --project-ref YOUR_PROJECT_REF
npx supabase secrets set RESEND_FROM_EMAIL=noreply@yourdomain.com --project-ref YOUR_PROJECT_REF
```

## Features Implemented

### ✅ Authentication
- Email/Password signup with duplicate check
- Login with session management
- Password show/hide toggle
- Email verification (optional)
- Login success email notification
- Sign out functionality

### ✅ Profile Status Management
- **Incomplete**: Yellow banner → "Complete Your Profile"
- **Pending**: Blue banner → "Profile Under Review"
- **Rejected**: Red banner → "Profile Rejected"
- **Approved**: No banner, full access

### ✅ Access Control
- Browse tuitions: All users ✅
- View tuition details: All users ✅
- Apply for tuitions: Only approved tutors ✅
- Edit profile: Only profile owner ✅

### ✅ Dashboard Features
- Welcome message with tutor name
- Profile status banner
- Stats: All Tuitions count, My Tuitions count
- Latest tuitions preview
- Quick navigation

### ✅ UI/UX
- Professional auth page with branding
- Responsive design
- Toast notifications for feedback
- Loading states
- Error handling
- Password visibility toggle
- Optional phone field for tutors

## Admin Workflow (Manual for now)

To approve a tutor:

```sql
-- 1. View pending tutors
SELECT * FROM tutors WHERE status = 'pending';

-- 2. Approve a tutor (copy to tutor table)
WITH approved_tutor AS (
  SELECT * FROM tutors WHERE id = 'TUTOR_ID' AND status = 'pending'
)
INSERT INTO tutor (id, name, email, phone, city, bio, subjects, experience_years)
SELECT 
  user_id as id,
  first_name || ' ' || last_name as name,
  user_id::text || '@temp.com' as email, -- Or fetch from auth.users
  contact as phone,
  city,
  short_about as bio,
  courses as subjects,
  experience_years
FROM approved_tutor;

-- 3. Update status
UPDATE tutors SET status = 'approved' WHERE id = 'TUTOR_ID';
```

## Testing Checklist

- [ ] User can sign up as tutor
- [ ] Email verification works (if enabled)
- [ ] User can login with credentials
- [ ] Login email notification sent
- [ ] Dashboard shows "Complete Profile" banner
- [ ] User can complete onboarding
- [ ] Profile saved to `tutors` table with status='pending'
- [ ] Dashboard shows "Under Review" banner
- [ ] User can view tuitions but cannot apply (pending)
- [ ] Admin approves profile
- [ ] Data copied to `tutor` table
- [ ] User can now apply for tuitions
- [ ] User can sign out

## Environment Variables

```.env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Next Steps (Future Enhancements)

1. **Admin Panel**: Create UI for approving/rejecting tutors
2. **Application System**: Implement actual tuition application logic
3. **Notifications**: Email/SMS notifications for status changes
4. **Profile Editing**: Allow tutors to edit their profile in `tutor` table
5. **Dashboard Analytics**: Add charts and statistics
6. **Search/Filter**: Add advanced tuition search

## Troubleshooting

### "null value in column phone violates not-null constraint"
→ Run migration: `20251109000000_make_phone_nullable.sql`

### "policy already exists" error
→ Migration file already has `DROP POLICY IF EXISTS`

### User redirects immediately after login
→ Fixed - removed auto-redirect useEffect from Auth page

### Login email not sending
→ Deploy edge function and configure Resend API keys

## Support

For issues or questions, check:
1. Supabase logs in Dashboard
2. Browser console for React errors
3. Network tab for API calls
4. RLS policies in Supabase

---

**Status**: ✅ Ready for testing
**Last Updated**: November 9, 2025
