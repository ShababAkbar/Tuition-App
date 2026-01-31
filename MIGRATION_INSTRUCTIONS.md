# 🚀 MIGRATION INSTRUCTIONS

## Step 1: Run SQL Migration in Supabase Dashboard

1. Go to Supabase Dashboard → SQL Editor
2. Copy the entire content from: `supabase/migrations/20260127000001_simplify_tuition_tables.sql`
3. Paste and click **Run**

### What This Migration Does:
✅ Drops `tuition_assignments` table (redundant)  
✅ Adds missing columns to `tuition` table:
   - `city`, `tuition_type`, `tuition_code`
   - `status`, `tutor_id`, `assigned_at`, `updated_at`  
✅ Creates performance indexes  
✅ Auto-generates tuition codes (KT-xxxxxxx)

---

## Step 2: Verify Migration Success

Run these queries in SQL Editor to verify:

```sql
-- Check tuition table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'tuition'
ORDER BY ordinal_position;

-- Expected columns:
-- id, student_name, subject, grade, location, timing, fee, 
-- city, tuition_type, tuition_code, status, tutor_id, assigned_at, 
-- created_at, updated_at
```

```sql
-- Check tuition_assignments deleted
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'tuition_assignments';

-- Should return 0 rows
```

```sql
-- Check tuition codes generated
SELECT id, tuition_code, status 
FROM tuition 
ORDER BY created_at DESC;

-- All records should have tuition_code (e.g., KT-8503699)
```

---

## Step 3: Test Complete Flow

### Test 1: Admin Approval Creates Tuition Entry
1. Login as admin (469a4b17-1d4a-469d-aebf-731c447f49cb)
2. Go to Admin Dashboard
3. Approve a tuition request
4. **Expected Result:**
   - New entry in `tuition` table with `status = 'available'`
   - `tuition_requests` status updated to `status = 'assigned'`

**SQL Verification:**
```sql
SELECT * FROM tuition WHERE status = 'available' ORDER BY created_at DESC LIMIT 5;
SELECT * FROM tuition_requests WHERE status = 'assigned' ORDER BY created_at DESC LIMIT 5;
```

### Test 2: Tutors See Available Tuitions
1. Login as tutor (approved profile)
2. Go to /tuitions page
3. **Expected Result:**
   - Only tuitions with `status = 'available'` displayed
   - Can see tuition_code, subject, grade, location, fee

**SQL Query (What Frontend Uses):**
```sql
SELECT * FROM tuition 
WHERE status = 'available' 
ORDER BY created_at DESC;
```

### Test 3: Tutor Applies to Tuition
1. Click "Apply" on any available tuition
2. **Expected Result:**
   - Tuition status changes to `status = 'assigned'`
   - `tutor_id` set to current tutor's ID
   - `assigned_at` timestamp recorded
   - Success toast shown
   - Redirected to MyTuitions

**SQL Verification:**
```sql
-- Check application was recorded
SELECT id, tuition_code, status, tutor_id, assigned_at 
FROM tuition 
WHERE status = 'assigned' 
ORDER BY assigned_at DESC LIMIT 5;
```

### Test 4: MyTuitions Shows Assigned Tuitions
1. After applying, check /my-tuitions
2. **Expected Result:**
   - Applied tuition visible in list
   - Shows tuition details (code, subject, grade, etc.)

**SQL Query (What Frontend Uses):**
```sql
SELECT * FROM tuition 
WHERE tutor_id = '<current_tutor_id>' 
AND status = 'assigned' 
ORDER BY created_at DESC;
```

---

## Step 4: Cleanup (After Verification)

Once everything works, remove old code references:

### Files to Clean:
1. Search codebase for `tuition_assignments` references
2. Delete migration file: `20260124000000_create_stats_and_assignments.sql` (or update it to remove tuition_assignments creation)

### Grep Command:
```bash
grep -r "tuition_assignments" src/
```

Should return **0 results** after cleanup.

---

## 🐛 Troubleshooting

### Issue: Tuitions not showing in /tuitions page
**Check:**
```sql
SELECT * FROM tuition WHERE status = 'available';
```
- If empty: Admin hasn't approved any requests yet
- If has data but UI empty: Check browser console for errors

### Issue: Apply button not working
**Check:**
1. Profile approved? `SELECT * FROM tutors WHERE user_id = '<user_id>'`
2. RLS policies correct? Run RLS policy queries
3. Browser console errors?

### Issue: MyTuitions empty after applying
**Check:**
```sql
SELECT * FROM tuition WHERE tutor_id = '<tutor_id>';
```
- If empty: Application failed (check errors)
- If has data with `status = 'available'`: Query needs to filter by `status = 'assigned'`

---

## ✅ Success Criteria

Migration successful when:
- ✅ `tuition_assignments` table deleted
- ✅ `tuition` table has all new columns
- ✅ Tuition codes auto-generated (KT-xxxxxxx)
- ✅ Admin approval creates tuition entries
- ✅ Tutors see only available tuitions
- ✅ Apply updates status to assigned
- ✅ MyTuitions shows assigned tuitions
- ✅ No `tuition_assignments` references in code

---

**Date:** January 27, 2026  
**Status:** Ready to execute 🎯
