# COMPLETE DATABASE WORKFLOW DOCUMENTATION

> **Generated**: January 26, 2026  
> **Database**: Tuition App - Complete Flow with Admin Panel

---

## 📊 TABLE RELATIONSHIPS

```
auth.users (Supabase Auth)
    ↓ (id)
user_profiles (Admin/Tutor/Student)
    ↓ (id → user_id)
tutors (Approved Tutors Only)
    ↓
    ├─→ tutor_applications (Apply for jobs)
    ├─→ tuition_requests (assigned_tutor_id)
    └─→ tuition_assignments (Final assignments)

tuition_requests (Student requests)
    ↓ (approved by admin)
tuition (Posted jobs with auto-code)
    ↓
tutor_applications (Tutors apply)
    ↓ (admin schedules demo)
tuition_assignments (Final assignment)
```

---

## 🔐 ADMIN AUTHENTICATION FLOW

### **How Admin Login Works:**

```javascript
// 1. Admin logs in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'admin@example.com',
  password: 'password'
});

// 2. Check if user is admin
const { data: profile } = await supabase
  .from('user_profiles')
  .select('user_type')
  .eq('id', data.user.id)
  .single();

if (profile.user_type === 'admin') {
  // ✅ Grant admin access
  // RLS policies automatically enforce permissions
}
```

### **Database Side:**

```sql
-- user_profiles table
{
    id: '469a4b17-1d4a-469d-aebf-731c447f49cb',  -- From auth.users.id
    email: 'admin@example.com',
    user_type: 'admin',  -- ← This determines admin access
    is_active: true
}

-- RLS checks this automatically
CREATE POLICY "Admin only" 
USING (auth.uid() = '469a4b17-1d4a-469d-aebf-731c447f49cb'::uuid);

-- Or use helper function
CREATE POLICY "Admin only" 
USING (is_admin());  -- Returns true if user_type = 'admin'
```

### **Your Admin Setup (First Time):**

```sql
-- Step 1: Login with your account
-- Step 2: Run this in Supabase SQL Editor:

UPDATE user_profiles 
SET user_type = 'admin' 
WHERE id = auth.uid();  -- Your logged-in user ID

-- Verify:
SELECT id, email, user_type 
FROM user_profiles 
WHERE id = auth.uid();
```

**✅ Your approach is CORRECT!** No need for separate admin table.

---

## 🔄 COMPLETE TUITION REQUEST FLOW

### **FLOW 1: Student Request → Approval → Posting**

```
┌─────────────────────────────────────────────────────┐
│ STEP 1: Student Submits Request (No Login Required)│
└─────────────────────────────────────────────────────┘
                          ↓
INSERT INTO tuition_requests (
    name, phone, city, area, class, subject, 
    mode_of_tuition, status
) VALUES (..., 'pending');
                          ↓
┌─────────────────────────────────────────────────────┐
│ STEP 2: Admin Views in Dashboard                   │
└─────────────────────────────────────────────────────┘
SELECT * FROM tuition_requests 
WHERE status = 'pending' 
ORDER BY created_at DESC;
                          ↓
┌─────────────────────────────────────────────────────┐
│ STEP 3: Admin Approves Request                     │
└─────────────────────────────────────────────────────┘
-- Update request status
UPDATE tuition_requests 
SET status = 'approved' 
WHERE id = 'request-id';

-- Create tuition posting
INSERT INTO tuition (
    student_name, subject, grade, city, 
    location, timing, fee, tuition_type
) VALUES (...);
-- ✅ Trigger auto-generates: tuition_code = 'AP-016'
                          ↓
┌─────────────────────────────────────────────────────┐
│ STEP 4: Tuition Visible to All Tutors              │
└─────────────────────────────────────────────────────┘
SELECT * FROM tuition 
WHERE status = 'available' 
ORDER BY created_at DESC;
```

---

### **FLOW 2: Tutor Application → Demo → Assignment**

```
┌─────────────────────────────────────────────────────┐
│ STEP 5: Tutor Applies for Tuition                  │
└─────────────────────────────────────────────────────┘
INSERT INTO tutor_applications (
    tuition_id, tutor_id, status
) VALUES (
    'tuition-uuid',
    (SELECT id FROM tutors WHERE user_id = auth.uid()),
    'pending'
);
                          ↓
┌─────────────────────────────────────────────────────┐
│ STEP 6: Admin Views Applications                   │
└─────────────────────────────────────────────────────┘
SELECT * FROM admin_tuition_applications 
WHERE tuition_code = 'AP-016';

-- Shows:
-- - Tutor name, contact, email
-- - Experience, subjects
-- - Application date
-- - Current status
                          ↓
┌─────────────────────────────────────────────────────┐
│ STEP 7: Admin Schedules Demo                       │
└─────────────────────────────────────────────────────┘
UPDATE tutor_applications 
SET 
    status = 'demo_scheduled',
    demo_date = '2026-01-30 10:00:00',
    admin_notes = 'Demo scheduled with parent'
WHERE id = 'application-id';
                          ↓
┌─────────────────────────────────────────────────────┐
│ STEP 8: Tutor Sees Demo on Dashboard               │
└─────────────────────────────────────────────────────┘
-- Tutor's query:
SELECT 
    ta.demo_date,
    ta.status,
    ta.admin_notes,
    tu.tuition_code,
    tu.subject,
    tu.grade,
    tu.location
FROM tutor_applications ta
JOIN tuition tu ON ta.tuition_id = tu.id
WHERE ta.tutor_id = (
    SELECT id FROM tutors WHERE user_id = auth.uid()
)
AND ta.status IN ('demo_scheduled', 'demo_completed');
                          ↓
┌─────────────────────────────────────────────────────┐
│ STEP 9A: Demo Successful → Finalize                │
└─────────────────────────────────────────────────────┘
BEGIN TRANSACTION;

-- 1. Accept winning application
UPDATE tutor_applications 
SET status = 'accepted', demo_notes = 'Demo passed' 
WHERE id = 'winning-app-id';

-- 2. Reject other applications
UPDATE tutor_applications 
SET status = 'rejected' 
WHERE tuition_id = 'tuition-id' 
    AND id != 'winning-app-id';

-- 3. Create final assignment
INSERT INTO tuition_assignments (
    tuition_request_id, tutor_id, 
    tutor_name, student_name, subject, status
) VALUES (..., 'active');
-- ✅ Trigger auto-updates:
--    - tuition_requests.assigned_tutor_id
--    - tuition_requests.status = 'assigned'
--    - tuition.status = 'assigned'

COMMIT;
                          ↓
┌─────────────────────────────────────────────────────┐
│ STEP 9B: Demo Failed → Schedule Another            │
└─────────────────────────────────────────────────────┘
UPDATE tutor_applications 
SET 
    status = 'rejected',
    demo_notes = 'Demo not successful'
WHERE id = 'failed-app-id';

-- Schedule demo with another tutor
UPDATE tutor_applications 
SET 
    status = 'demo_scheduled',
    demo_date = '2026-02-01 14:00:00'
WHERE id = 'next-candidate-id';
```

---

## 📋 COMPLETE TABLE DETAILS

### **1. tuition_requests** (Student Requests)

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | TEXT | Student/Parent name |
| phone | TEXT | Contact number |
| city | TEXT | City |
| area | TEXT | Area/Location |
| class | TEXT | Student's grade |
| subject | TEXT | Subject needed |
| mode_of_tuition | TEXT | Home/Online/Both |
| status | TEXT | pending/approved/assigned |
| assigned_tutor_id | UUID | FK → tutors.id (set by trigger) |

**Who can access:**
- ✅ Public: Insert (anyone can submit)
- ✅ Admin: Select, Update
- ✅ Assigned Tutor: Select (only their assigned requests)

---

### **2. tuition** (Posted Jobs)

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| tuition_code | TEXT | **Auto-generated: AP-001, AP-002...** |
| student_name | TEXT | Student name |
| subject | TEXT | Subject |
| grade | TEXT | Class/Grade |
| city | TEXT | City |
| location | TEXT | Area |
| timing | TEXT | Preferred timing |
| fee | TEXT | Expected fee |
| tuition_type | TEXT | Home/Online |
| status | TEXT | **available/assigned/completed** |
| tutor_id | UUID | FK → tutors.id (when assigned) |

**Who can access:**
- ✅ Public: Select (everyone sees available tuitions)
- ✅ Admin: Insert, Update, Delete

**Triggers:**
- ✅ `set_tuition_code`: Auto-generates code on INSERT

---

### **3. tutor_applications** (NEW TABLE!)

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| tuition_id | UUID | FK → tuition.id |
| tutor_id | UUID | FK → tutors.id |
| status | TEXT | pending/demo_scheduled/demo_completed/accepted/rejected |
| applied_at | TIMESTAMPTZ | When applied |
| demo_date | TIMESTAMPTZ | Scheduled demo date |
| demo_notes | TEXT | Demo feedback |
| admin_notes | TEXT | Admin's notes |

**Who can access:**
- ✅ Tutor: Insert (apply), Select (own applications)
- ✅ Admin: Select all, Update

**Constraints:**
- UNIQUE(tuition_id, tutor_id) - Can't apply twice

---

### **4. tuition_assignments** (Final Assignments)

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| tuition_request_id | UUID | FK → tuition_requests.id |
| tutor_id | UUID | FK → tutors.id |
| tutor_name | TEXT | Tutor name |
| student_name | TEXT | Student name |
| subject | TEXT | Subject |
| status | TEXT | active/completed/cancelled |
| demo_held_at | TIMESTAMPTZ | Demo date |
| assigned_at | TIMESTAMPTZ | Assignment date |

**Who can access:**
- ✅ Public: Select (view assignments)
- ✅ Admin: Insert, Update

**Triggers:**
- ✅ `sync_on_tuition_assignment`: Updates tuition_requests and tuition

---

### **5. tutors** (Approved Tutors)

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK → auth.users.id |
| email | TEXT | Email |
| first_name | TEXT | First name |
| contact | TEXT | Phone |
| subjects | TEXT[] | Array of subjects |
| status | TEXT | approved/pending |

**Who can access:**
- ✅ Admin: Insert, Select all
- ✅ Tutor: Select (own profile), Update (own profile)

---

### **6. user_profiles** (All Users)

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | PK → auth.users.id |
| email | TEXT | Email |
| username | TEXT | Display name |
| user_type | TEXT | **admin/tutor/student** |
| is_active | BOOLEAN | Account status |

**Who can access:**
- ✅ Admin: Full control (CRUD)
- ❌ Others: No access

---

## 🔧 AUTO-GENERATED CODES start with 0 with  is helps us count how many request we recieve till now

### **Tuition Code Generation:**

```sql
-- Sequence starts from current max + 1
tuition_code_seq → START WITH 16 (if last was AP-015)

-- On INSERT to tuition:
tuition_code = 'AP-' || LPAD(nextval('tuition_code_seq'), 3, '0')
-- Results: AP-016, AP-017, AP-018...
```

**Example:**
```sql
INSERT INTO tuition (student_name, subject, ...) 
VALUES ('Ahmed', 'Math', ...);

-- Auto-generated:
-- tuition_code = 'AP-016'
```

---

## ⚙️ TRIGGERS & AUTOMATION

### **Trigger 1: Auto-generate tuition codes**
```sql
CREATE TRIGGER set_tuition_code
    BEFORE INSERT ON tuition
    FOR EACH ROW
    EXECUTE FUNCTION generate_tuition_code();
```

### **Trigger 2: Sync on assignment**
```sql
CREATE TRIGGER sync_on_tuition_assignment
    AFTER INSERT ON tuition_assignments
    FOR EACH ROW
    EXECUTE FUNCTION sync_tuition_request_on_assignment();
```
**What it does:**
1. Updates `tuition_requests.assigned_tutor_id`
2. Updates `tuition_requests.status = 'assigned'`
3. Updates `tuition.status = 'assigned'`
4. Updates `tuition.tutor_id`

### **Trigger 3: Update timestamps**
- `new_tutor.updated_at`
- `tutors.updated_at`
- `tuition_requests.updated_at`
- `user_profiles.updated_at`
- `tutor_applications.updated_at`

---

## 📊 ADMIN PANEL QUERIES

### **1. View Pending Requests**
```sql
SELECT 
    id,
    name,
    phone,
    city,
    area,
    class,
    subject,
    mode_of_tuition,
    created_at
FROM tuition_requests
WHERE status = 'pending'
ORDER BY created_at DESC;
```

### **2. View Applications for a Tuition**
```sql
SELECT * FROM admin_tuition_applications
WHERE tuition_code = 'AP-016'
ORDER BY applied_at DESC;
```

### **3. Schedule Demo**
```sql
UPDATE tutor_applications
SET 
    status = 'demo_scheduled',
    demo_date = '2026-02-01 10:00:00',
    admin_notes = 'Called parent, demo confirmed'
WHERE id = 'application-id';
```

### **4. Finalize Assignment**
```sql
-- Use this stored procedure or manual SQL
BEGIN;

UPDATE tutor_applications 
SET status = 'accepted' 
WHERE id = 'winning-id';

UPDATE tutor_applications 
SET status = 'rejected' 
WHERE tuition_id = 'tuition-id' AND id != 'winning-id';

INSERT INTO tuition_assignments (
    tuition_request_id, tutor_id, 
    tutor_name, student_name, subject
) VALUES (...);

COMMIT;
```

---

## 🚀 MIGRATION STEPS

1. **Run the migration file:**
```bash
# Supabase SQL Editor mein paste karein:
# 20260126000000_complete_tuition_flow.sql
```

2. **Verify:**
```sql
-- Check if everything is created
SELECT 
    'tutor_applications' as table_name,
    COUNT(*) as policies
FROM pg_policies 
WHERE tablename = 'tutor_applications'
UNION ALL
SELECT 'tuition', COUNT(*) 
FROM information_schema.columns 
WHERE table_name = 'tuition' AND column_name = 'status';
```

3. **Test:**
```sql
-- Test tuition code generation
INSERT INTO tuition (student_name, subject, grade, city, location, timing, fee)
VALUES ('Test Student', 'Math', 'Class 10', 'Karachi', 'Gulshan', '5-6 PM', '10000');

-- Check auto-generated code
SELECT tuition_code FROM tuition ORDER BY created_at DESC LIMIT 1;
-- Should show: AP-XXX
```

---

## ✅ SUMMARY

| Feature | Status | How It Works |
|---------|--------|--------------|
| Admin Authentication | ✅ | user_profiles.user_type = 'admin' |
| Tuition Code Auto-Gen | ✅ | Trigger + Sequence |
| Tutor Applications | ✅ | New table + RLS |
| Demo Scheduling | ✅ | Update application status |
| Assignment Sync | ✅ | Trigger auto-updates |
| Data Preservation | ✅ | Status column (no deletion) |

**Next: Update Admin Panel UI to use these queries!**
