# 📝 TUTOR PROFILE REQUIREMENTS UPDATE

**Date:** January 26, 2026

---

## ✅ CHANGES APPLIED

### **1. CNIC Upload - NOW MANDATORY ⚠️**

**Before:**
- CNIC front and back images were optional
- No validation on Step 2

**After:**
- ✅ CNIC front image - **MANDATORY**
- ✅ CNIC back image - **MANDATORY**
- ✅ Validation added
- ✅ Red asterisk (*) shown
- ✅ Error messages if not uploaded
- ✅ Green checkmark when uploaded

**Validation:**
```typescript
case 2:
  if (!formData.cnicFront) {
    newErrors.cnicFront = "CNIC front image is required";
  }
  if (!formData.cnicBack) {
    newErrors.cnicBack = "CNIC back image is required";
  }
  break;
```

---

### **2. Education Section - Complete Redesign 🎓**

#### **New Fields Added:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Degree | Text | ✅ Yes | e.g., Bachelor of Science |
| Institution | Text | ✅ Yes | e.g., University of Karachi |
| **Start Date** | Date | ✅ Yes | **With label now!** |
| **End Date** | Date | ✅ Yes | **With label now!** |
| **Status** | Dropdown | ✅ Yes | **NEW: Graduate / Continuing** |
| **Result Card** | File Upload | ✅ Yes | **NEW: PDF or Image** |

#### **Before:**
```
- Degree (input)
- Institution (input)
- [Date input] (no label)
- [Date input] (no label)
```

#### **After:**
```
- Degree * (with label)
- Institution * (with label)
- Start Date * (with clear label)
- End Date / Expected * (with clear label)
- Status * (Graduate / Continuing dropdown)
- Result Card / Transcript * (file upload)
```

---

### **3. Education Card Display**

**Enhanced display shows:**
```
┌─────────────────────────────────────┐
│ Bachelor of Science                 │ ×
│ University of Karachi               │
│ 2020-01-01 - 2024-06-01            │
│ Graduate                            │ ← NEW
│ ✓ Result card uploaded              │ ← NEW
└─────────────────────────────────────┘
```

- ✅ Delete button (×) to remove entry
- ✅ Status shown in blue
- ✅ Result card confirmation

---

### **4. Validation Logic**

**Add Education button is disabled unless:**
- ✅ Degree entered
- ✅ Institution entered
- ✅ Start date selected
- ✅ End date selected
- ✅ Status selected (Graduate/Continuing)
- ✅ Result card uploaded

**Code:**
```typescript
disabled={
  !newEducation.degree || 
  !newEducation.institution || 
  !newEducation.startDate || 
  !newEducation.endDate || 
  !newEducation.status || 
  !newEducation.resultCard
}
```

---

### **5. File Upload & Storage**

#### **Uploaded Files:**

**CNIC Images:**
```
Storage: tutor-documents/{userId}/cnic-front-{timestamp}
Storage: tutor-documents/{userId}/cnic-back-{timestamp}
```

**Result Cards:**
```
Storage: tutor-documents/{userId}/result-card-{timestamp}-{random}
Accepts: Images (JPG, PNG) and PDF files
```

#### **Database Structure:**

**Education array stored as JSON:**
```json
{
  "education": [
    {
      "degree": "Bachelor of Science",
      "institution": "University of Karachi",
      "startDate": "2020-01-01",
      "endDate": "2024-06-01",
      "status": "Graduate",
      "resultCardUrl": "https://...supabase.co/.../result-card-123.pdf"
    }
  ]
}
```

---

## 🎯 USER EXPERIENCE FLOW

### **Step 1: Personal Information**
- Name, contact, address, etc. (unchanged)

### **Step 2: CNIC Documents** ⚠️ NOW MANDATORY
```
┌────────────────────────────────────────┐
│ CNIC Documents                         │
│ Please upload clear images of both     │
│ sides of your CNIC                     │
│                                        │
│ CNIC Front Image *                     │
│ [Choose File]                          │
│ ✓ cnic-front.jpg                       │
│                                        │
│ CNIC Back Image *                      │
│ [Choose File]                          │
│ ✓ cnic-back.jpg                        │
└────────────────────────────────────────┘
```

### **Step 3: Education & Experience**
```
┌────────────────────────────────────────┐
│ Education *                            │
│                                        │
│ Degree *           Institution *       │
│ [BSc Computer]     [UoK          ]     │
│                                        │
│ Start Date *       End Date *          │
│ [2020-01-01]       [2024-06-01   ]     │
│                                        │
│ Status *           Result Card *       │
│ [Graduate ▼]       [Choose File  ]     │
│                    ✓ result.pdf        │
│                                        │
│ [Add Education]    ← Disabled until    │
│                      all filled        │
│                                        │
│ Added:                                 │
│ ┌──────────────────────────────┐      │
│ │ BSc Computer Science      × │       │
│ │ University of Karachi       │       │
│ │ 2020-01-01 - 2024-06-01    │       │
│ │ Graduate                    │       │
│ │ ✓ Result card uploaded      │       │
│ └──────────────────────────────┘      │
└────────────────────────────────────────┘
```

---

## 📊 VALIDATION SUMMARY

### **Step-by-Step Validation:**

| Step | Field | Validation | Error Message |
|------|-------|------------|---------------|
| 2 | CNIC Front | Required | "CNIC front image is required" |
| 2 | CNIC Back | Required | "CNIC back image is required" |
| 3 | Education Array | Min 1 entry | "At least one education entry is required" |
| 3 | Degree | Required | Shown in toast |
| 3 | Institution | Required | Shown in toast |
| 3 | Start Date | Required | Shown in toast |
| 3 | End Date | Required | Shown in toast |
| 3 | Status | Required | Shown in toast |
| 3 | Result Card | Required | Shown in toast |

---

## 🗄️ DATABASE CHANGES NEEDED

**No schema changes required!** The `new_tutor` table already has:
- `education` column (JSONB) - can store new fields
- `cnic_front_url` (TEXT)
- `cnic_back_url` (TEXT)

**New structure being saved:**
```sql
-- education column now contains:
[
  {
    "degree": "string",
    "institution": "string", 
    "startDate": "date",
    "endDate": "date",
    "status": "Graduate|Continuing",  -- NEW
    "resultCardUrl": "url"            -- NEW
  }
]
```

---

## 🚀 TESTING CHECKLIST

### **CNIC Upload Test:**
- [ ] Try to proceed without CNIC front → Should show error
- [ ] Try to proceed without CNIC back → Should show error
- [ ] Upload both images → Should show green checkmarks
- [ ] Proceed to next step → Should work

### **Education Test:**
- [ ] Try "Add Education" with empty fields → Button disabled
- [ ] Fill degree only → Button still disabled
- [ ] Fill all except result card → Button still disabled
- [ ] Upload result card → Button becomes enabled
- [ ] Click Add → Should add to list with all details
- [ ] Verify status shows correctly (Graduate/Continuing)
- [ ] Verify result card confirmation shows
- [ ] Click delete (×) → Should remove entry

### **Submission Test:**
- [ ] Complete all steps
- [ ] Submit form
- [ ] Check "Uploading..." toast appears
- [ ] Verify all files uploaded to Supabase Storage
- [ ] Check database entry has result card URLs
- [ ] Verify success message

---

## 📁 FILES MODIFIED

| File | Changes |
|------|---------|
| [src/pages/TutorOnboarding.tsx](src/pages/TutorOnboarding.tsx) | Complete redesign |

**Key Changes:**
- Updated state types for education
- Added CNIC validation
- Added result card upload
- Added status dropdown
- Added date labels
- Enhanced UI with better labels
- Updated submit handler to upload result cards

---

## 💾 STORAGE BUCKET SETUP

**Make sure Supabase storage bucket exists:**

```sql
-- Check if bucket exists
SELECT * FROM storage.buckets WHERE name = 'tutor-documents';

-- If not, create it (in Supabase Dashboard > Storage)
-- Bucket name: tutor-documents
-- Public: No (private)
-- File size limit: 5 MB recommended
-- Allowed MIME types: image/*, application/pdf
```

**Bucket policies needed:**
```sql
-- Allow authenticated users to upload
CREATE POLICY "Tutors can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'tutor-documents');

-- Allow users to read own documents
CREATE POLICY "Users can view own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'tutor-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

## ⚠️ IMPORTANT NOTES

1. **File Size Limits:** Consider adding file size validation (e.g., max 5MB)
2. **File Types:** Currently accepts images and PDFs for result cards
3. **CNIC Required:** Users cannot skip CNIC upload anymore
4. **Education Required:** At least one complete education entry required
5. **Admin Review:** All uploaded documents will be visible to admin during review

---

## 🎨 UI IMPROVEMENTS

**Visual Enhancements:**
- ✅ Clear labels on all date fields
- ✅ Red asterisks (*) on mandatory fields
- ✅ Green checkmarks on uploaded files
- ✅ Disabled button state when incomplete
- ✅ Delete button on education cards
- ✅ Status badge in blue color
- ✅ Helper text for CNIC section
- ✅ Toast notifications for validation errors

---

**All Requirements Implemented! ✅**

Test karo aur batao agar koi issue ho!
