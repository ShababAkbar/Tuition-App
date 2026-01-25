# Supabase Setup Checklist - Authentication

## ⚠️ CRITICAL: Complete these steps in Supabase Dashboard

### 1. Email Provider Setup (Required for Password Reset)

**Go to: Authentication → Providers → Email**

- ✅ **Enable Email Provider** (must be ON)
- ✅ **Confirm Email**: Set to "OFF" (for development) OR configure proper email service
  - If OFF: Users can login immediately without email verification
  - If ON: Users MUST verify email before password reset works

**Recommended for Development:**
```
Confirm Email: OFF (allows immediate login + password reset)
```

**Recommended for Production:**
```
Confirm Email: ON
Email Service: Custom SMTP (Resend API configured)
```

---

### 2. Redirect URLs Configuration

**Go to: Authentication → URL Configuration**

Add these URLs:

**Site URL:**
```
http://localhost:5173
```

**Redirect URLs:**
```
http://localhost:5173/reset-password
http://localhost:5173/verify-email
https://apna-tuition.com/reset-password
https://apna-tuition.com/verify-email
```

---

### 3. Email Templates Configuration

**Go to: Authentication → Email Templates**

**Template: Reset Password**
- Copy content from: `email-templates/password-reset-template.html`
- Paste into Supabase editor
- Save changes

**Template: Confirm Signup**
- Copy content from: `email-templates/email-confirmation-template.html`
- Paste into Supabase editor
- Save changes

---

### 4. SMTP Settings (Optional but Recommended)

**Go to: Project Settings → Auth → SMTP Settings**

**Using Resend API:**
```
SMTP Host: smtp.resend.com
SMTP Port: 587
SMTP User: resend
SMTP Password: re_xxxxx (your Resend API key)
Sender Email: support@apna-tuition.com
Sender Name: ApnaTuition
```

---

### 5. Rate Limits (Optional)

**Go to: Authentication → Rate Limits**

**Recommended Settings:**
```
Email Signups: 10 per hour
Password Recovery: 5 per hour
```

---

## 🔧 Quick Fix for Current Error

### Option A: Disable Email Confirmation (Fast - Development Only)

1. Go to **Authentication → Providers → Email**
2. Set **Confirm Email** to **OFF**
3. Save changes
4. User can now reset password immediately

### Option B: Verify Email First (Production Approach)

1. User signs up → receives verification email
2. User clicks verification link
3. Email confirmed in Supabase
4. Now password reset will work

---

## ✅ Testing Checklist

After configuration:

- [ ] Signup → receive email
- [ ] Click verification link → email confirmed
- [ ] Login → successful
- [ ] Forgot password → receive reset email
- [ ] Click reset link → redirects to `/reset-password`
- [ ] Enter new password → success
- [ ] Login with new password → works

---

## 🐛 Common Issues & Solutions

### "Invalid login credentials" on Password Reset

**Cause:** User email not confirmed in Supabase

**Solution:**
1. Check: Authentication → Users → find user
2. Look at "Email Confirmed At" column
3. If empty → email not confirmed
4. Either:
   - Manually confirm in dashboard
   - OR disable "Confirm Email" in settings
   - OR have user verify email first

### Password Reset Email Not Sending

**Cause:** SMTP not configured or wrong template

**Solution:**
1. Check: Project Settings → Auth → SMTP Settings
2. Verify Resend API key is correct
3. Check email template has {{ .ConfirmationURL }}

### Redirect Not Working After Reset

**Cause:** Redirect URL not whitelisted

**Solution:**
1. Go to: Authentication → URL Configuration
2. Add all redirect URLs (localhost + production)
3. Save changes

---

## 📧 Current Configuration Status

**Email Provider:** Resend API  
**Sender Email:** support@apna-tuition.com  
**Team Email:** team.apnatuition@gmail.com  
**Domain:** apna-tuition.com  

**Edge Functions:**
- ✅ send-login-email (welcome emails)
- ✅ send-contact-email (contact form)

**Auth Pages:**
- ✅ /auth (login/signup)
- ✅ /verify-email (email verification)
- ✅ /reset-password (password reset)

---

## 🚀 Next Steps

1. **Immediately:** Go to Supabase → Authentication → Providers → Email
2. **Set "Confirm Email" to OFF** (for development)
3. **Add redirect URLs** in URL Configuration
4. **Test password reset** again
5. **Before production:** Configure SMTP properly + enable email confirmation

