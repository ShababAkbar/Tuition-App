# Database Security Audit - ApnaTuition
**Date:** January 30, 2026
**Status:** ⚠️ CRITICAL SECURITY ISSUES FOUND

---

## 🚨 CRITICAL ISSUES

### 1. **TUITION_APPLICATIONS - PUBLIC READ ACCESS**
**File:** `20260129000000_create_tuition_applications.sql`
```sql
CREATE POLICY "Anyone can view applications"
  ON public.tuition_applications
  FOR SELECT
  USING (true);  ❌ DANGEROUS!
```

**Problem:** Anyone (even unauthenticated users) can see ALL tuition applications including:
- Tutor names
- Contact numbers
- Cover letters
- Application status

**Fix Required:**
```sql
-- Remove public access
DROP POLICY IF EXISTS "Anyone can view applications" ON public.tuition_applications;

-- Only tutors can see their own applications
CREATE POLICY "Tutors can view own applications"
  ON public.tuition_applications
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tutors 
      WHERE tutors.id = tuition_applications.tutor_id 
      AND tutors.user_id = auth.uid()
    )
  );

-- Admin can see all
CREATE POLICY "Admin can view all applications"
  ON public.tuition_applications
  FOR SELECT
  USING (auth.uid() = 'a43652ff-1008-4730-9b59-33503ba34ea5'::uuid);
```

---

### 2. **TUTORS TABLE - EMAIL EXPOSURE**
**File:** `20251109000002_complete_database_structure.sql`
```sql
CREATE POLICY "Anyone can read approved tutors" 
  ON tutors FOR SELECT 
  USING (status = 'approved'); ❌ EXPOSES EMAILS!
```

**Problem:** Anyone can read tutor emails, phone numbers, addresses
- Personal contact info publicly visible
- Privacy violation
- Spam/harassment risk

**Fix Required:**
```sql
-- Create a public view without sensitive data
CREATE OR REPLACE VIEW public.tutors_public AS
SELECT 
  id,
  first_name,
  last_name,
  city,
  subjects,
  experience_years,
  short_bio,
  profile_picture,
  -- NO email, contact, address, cnic
  created_at
FROM tutors 
WHERE status = 'approved';

-- Remove public SELECT policy
DROP POLICY IF EXISTS "Anyone can read approved tutors" ON tutors;

-- Only authenticated users + own data
CREATE POLICY "Tutors read own data" 
  ON tutors FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admin reads all" 
  ON tutors FOR SELECT 
  USING (auth.uid() = 'a43652ff-1008-4730-9b59-33503ba34ea5'::uuid);
```

---

### 3. **TUITION TABLE - NO RLS POLICIES FOUND**
**Problem:** Might allow public access to student names, locations, fees

**Check:** Run this query in Supabase SQL Editor:
```sql
SELECT * FROM pg_policies WHERE tablename = 'tuition';
```

**Should Have:**
- Public can only see basic info (NOT student names/contacts)
- Assigned tutors can see full details
- Admin can see everything

---

### 4. **ADMIN ID HARDCODED**
**File:** `20260126000002_update_admin_id.sql`
```sql
auth.uid() = 'a43652ff-1008-4730-9b59-33503ba34ea5'::uuid
```

**Problem:** Admin ID exposed in multiple places
- If this ID leaks, anyone can create account with this ID
- Single point of failure

**Better Approach:**
```sql
-- Create admin_users table
CREATE TABLE admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to check admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM admin_users 
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Use in policies
CREATE POLICY "..." ON ... USING (is_admin());
```

---

## ⚠️ MEDIUM PRIORITY ISSUES

### 5. **TUITION_REQUESTS - USER_ID NULLABLE**
```sql
user_id uuid NULL
```
**Problem:** Allows anonymous tuition requests without tracking who created them

**Fix:** Make user_id NOT NULL or add session tracking

---

### 6. **STORAGE BUCKET PUBLIC**
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('tutor-documents', 'tutor-documents', true)
```

**Problem:** Documents publicly accessible if URL is known
- CNIC images
- Education certificates
- All sensitive documents

**Fix:**
```sql
UPDATE storage.buckets 
SET public = false 
WHERE id = 'tutor-documents';

-- Add authenticated access policy
CREATE POLICY "Auth users read own docs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'tutor-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

---

### 7. **PASSWORD RESET - NO RATE LIMITING**
Email functions can be spammed
- No rate limiting on forgot password
- Can flood user inbox

**Fix:** Add rate limiting in edge functions

---

## ✅ GOOD SECURITY PRACTICES

1. **RLS Enabled:** All tables have RLS enabled
2. **User Isolation:** Users can only see/edit their own data
3. **Admin Separation:** Admin access properly gated
4. **Auth Integration:** Using Supabase Auth properly
5. **Triggers:** Data consistency maintained

---

## 🔒 IMMEDIATE ACTION REQUIRED

### Priority 1 (TODAY):
1. Fix tuition_applications public access
2. Fix tutors email exposure
3. Make storage bucket private

### Priority 2 (THIS WEEK):
1. Create admin_users table
2. Add tuition table RLS review
3. Add rate limiting

### Priority 3 (BEFORE PRODUCTION):
1. Security audit of all frontend queries
2. Test authentication bypass attempts
3. Penetration testing
4. GDPR compliance review

---

## 📋 SECURITY CHECKLIST

- [ ] No public access to sensitive tables
- [ ] Emails/phones not publicly visible
- [ ] CNIC/documents not public
- [ ] User data isolated (can't see other users)
- [ ] Admin role properly restricted
- [ ] Rate limiting on emails
- [ ] Session validation
- [ ] HTTPS only in production
- [ ] Environment variables secure
- [ ] API keys not in frontend code

---

## 🛡️ RECOMMENDATIONS

1. **Implement Role-Based Access Control (RBAC)**
   - Not just admin/user
   - Add: tutor, parent, admin roles
   - More granular permissions

2. **Audit Logging**
   - Log all admin actions
   - Track who accessed what data
   - Monitor suspicious activity

3. **Data Encryption**
   - Encrypt sensitive fields at rest
   - CNIC, phone numbers
   - Use Supabase Vault

4. **Frontend Security**
   - Never trust client input
   - Validate all data server-side
   - Use parameterized queries

5. **Regular Security Reviews**
   - Monthly policy audits
   - Dependency updates
   - Security patches

---

**Severity Levels:**
🚨 Critical - Fix immediately
⚠️ High - Fix this week
⚡ Medium - Fix before production
ℹ️ Low - Nice to have
