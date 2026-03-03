# Project Proposal and Requirement Specification Document

## 1. Introduction & Problem Statement:

Apna Tuition is a React + TypeScript + Supabase web platform that operationalizes a complete tuition marketplace lifecycle in Pakistan: public demand capture (tuition request intake), tutor acquisition/onboarding with document verification, admin approval/assignment operations, tutor application workflows, transactional notifications (email + WhatsApp-assisted lead flow), and SEO-driven city/content landing architecture to generate qualified inbound traffic.

**Problem Statement (1 line):** The system solves fragmented tutor discovery and manual tuition matching by providing a structured, verifiable, and trackable end-to-end platform connecting parents/students with approved tutors.

---

## 2. Aims and Objectives:

- Build a dual-sided platform for two core funnels:
  - Parent/Student funnel: request tutor quickly (`/tuition-request` + WhatsApp CTA).
  - Tutor funnel: sign up, verify email, complete multi-step onboarding, await approval, then apply to listed tuitions.
- Implement admin-controlled quality gate:
  - Approve/reject tutor applications (`new_tutor.status` workflow).
  - Approve/reject tuition requests and publish approved requests into `tuition` listings.
- Enable structured marketplace operations:
  - Tutors apply to tuitions via `tuition_applications`.
  - Admin accepts one application and auto-rejects others via DB trigger (`accept_tuition_application`).
- Ensure trust and compliance via document-backed onboarding:
  - CNIC front/back uploads and education proof uploads.
- Support discoverability and growth:
  - Canonical SEO metadata, Open Graph/Twitter tags, JSON-LD schema, city landing pages, sitemap, and robots configuration.
- Add growth attribution:
  - Referral capture (`?ref=`) with 48-hour localStorage window and persistence into `tuition_requests.referral_code`.
- Add conversion telemetry:
  - Meta Conversions API event (`CompleteRegistration`) via Supabase Edge Function.

---

## 3. Users/Actors:

### 3.1 Guest / Public User
- Can access landing and SEO pages (`/`, `/about`, `/faq`, `/contact`, `/blog`, `/blog/:slug`, `/tuition-in-*`).
- Can submit tuition requests without authenticated session (`user_id` nullable in `tuition_requests`).
- Can trigger WhatsApp inquiry from tuition request page.

### 3.2 Parent/Student Requester
- Role captured at signup metadata (`role: parent`), but current UX bypasses dedicated parent auth screen by redirecting `/auth?type=parent` directly to `/tuition-request`.
- Can submit tuition needs with academic/location/fee preferences.

### 3.3 Tutor (Applicant / Approved Tutor)
- Signs up with `role: tutor` metadata and email verification flow.
- Completes multi-step onboarding (`new_tutor` insert + storage uploads).
- Profile states implemented in UI logic:
  - `incomplete` (no profile)
  - `pending`
  - `approved` (entry exists in `tutors`)
  - `rejected`
- Approved tutors can apply to tuitions through `tuition_applications` with cover letter + mandatory terms acknowledgements.

### 3.4 Admin
- Identified by `VITE_ADMIN_USER_ID` (and mirrored in SQL policies/functions with specific UUID in migrations).
- Exclusive capabilities in UI:
  - Access `/admin-dashboard` and admin detail pages.
  - Approve/reject tutor applications.
  - Approve/reject tuition requests.
  - Review and accept/reject tutor applications per tuition.

### 3.5 RBAC/Middleware Reality (as implemented)
- No centralized frontend route middleware/guard component in `App.tsx`; restrictions are enforced inside page-level `useEffect` checks.
- Primary backend enforcement model is Supabase RLS policies and trigger-based workflow automation.
- Client-side admin checks compare `user.id === ADMIN_USER_ID` before rendering admin operations.

---

## 4. Main Screens & Workflows:

### 4.1 Main Screens (Route Inventory)

#### Public / Marketing
- `/` → `Landing`
- `/about` → `AboutUs`
- `/faq` → `FAQ`
- `/contact` → `Contact`
- `/blog` → `Blog`
- `/blog/:slug` → `BlogDetail`
- City SEO pages:
  - `/tuition-in-karachi`, `/tuition-in-lahore`, `/tuition-in-islamabad`, `/tuition-in-rawalpindi`, `/tuition-in-faisalabad`, `/tuition-in-multan`, `/tuition-in-gujranwala`, `/tuition-in-sheikhupura`, `/tuition-in-sialkot`, `/tuition-in-peshawar`, `/tuition-in-quetta`, `/tuition-in-hyderabad`

#### Authentication / Account
- `/auth` → Tutor auth (parent query path redirects)
- `/verify-email` → Email verification + resend
- `/reset-password` → Password update form

#### Tutor Funnel
- `/tutor-onboarding` → Multi-step tutor profile submission
- `/dashboard` → Tutor dashboard + status banners + latest tuitions
- `/tuitions` → All available tuitions with filters/search
- `/tuition/:id` → Tuition details + apply modal
- `/my-tuitions` → Assigned tuitions list
- `/profile` → Profile edit / resubmit / password reset trigger

#### Parent/Student Funnel
- `/tuition-request` → Tuition request intake form
- `/tuition-request-success` → Success confirmation

#### Admin Funnel
- `/admin-dashboard`
- `/admin/tutor-application/:id`
- `/admin/tuition-request/:id`
- `/admin/tuition-applications/:tuitionId`

### 4.2 Primary Workflows

1. **Tutor Signup to Activation**
   - Tutor signs up on `/auth?type=tutor`.
   - Email verification sent; user redirected to `/verify-email`.
   - After login, if no `new_tutor` profile → redirect `/tutor-onboarding`.
   - Tutor submits 5-step onboarding form + uploads docs.
   - Admin approves application (`new_tutor.status = approved`), trigger creates/updates `tutors` entry.
   - Tutor gains full apply capability.

2. **Parent/Student Request to Published Tuition**
   - User (authenticated or guest) submits `/tuition-request` form.
   - Record inserted into `tuition_requests` with `status='pending'`.
   - Admin reviews request in dashboard/detail page.
   - On approval, admin inserts normalized listing into `tuition` and sets request `status='assigned'`.

3. **Tutor Application and Admin Assignment**
   - Approved tutor opens `/tuition/:id` or list item apply action.
   - Submits `tuition_applications` row with cover letter and tutor snapshot fields.
   - Admin opens `/admin/tuition-applications/:tuitionId`, accepts one, rejects others.
   - DB trigger auto-assigns `tuition.tutor_id`, `tuition.status='assigned'`, sets `assigned_at`, and rejects other pending applications.
   - Email notifications sent for acceptance/rejection.

4. **Rejected Tutor Resubmission**
   - Rejected tutor profile opens editable resubmission mode in `/profile`.
   - User updates personal/address/documents/education/description.
   - Update pushes `new_tutor.status` back to `pending` for re-review.

---

## 5. Functional Requirements (With Tables):

### FR01: SIGN UP (Tutor Registration Entry)

| Item | Specification (Implemented Behavior) |
|---|---|
| Trigger Point | `Auth.tsx` sign-up mode (`/auth?type=tutor`) |
| Inputs | `fullName` (required), `email` (required), `password` (required, minLength 6), `phone` (optional UI field for tutor only) |
| API/Service | `signUp()` in `lib/auth.ts` -> `supabase.auth.signUp()` |
| Metadata Stored | `full_name`, `role` (`tutor` or `parent`) |
| Duplicate Prevention | Pre-check against `user_profiles.email`; throws user-friendly error if exists |
| Redirect | On success -> `/verify-email?email=...` |
| DB Side Effect | `handle_new_user()` trigger inserts into `user_profiles` from `auth.users` |

### FR02: LOGIN

| Item | Specification (Implemented Behavior) |
|---|---|
| Trigger Point | `Auth.tsx` login mode |
| Inputs | `email` (required), `password` (required, minLength 6) |
| API/Service | `signIn()` -> `supabase.auth.signInWithPassword()` |
| Error Handling | Custom messages for invalid credentials and unverified email |
| Post-Login Routing | Admin -> `/admin-dashboard`; Tutor without `new_tutor` -> `/tutor-onboarding`; Tutor with profile -> `/dashboard` |
| Side Actions | Non-blocking login notification email via `send-login-email` edge function |

### FR03: FORGOT/RESET PASSWORD

| Item | Specification (Implemented Behavior) |
|---|---|
| Forgot Password Entry | `Auth.tsx` `handleForgotPassword()` |
| Forgot Input | `email` |
| Forgot API | `supabase.auth.resetPasswordForEmail(email, redirectTo=/reset-password)` |
| Reset Page | `ResetPassword.tsx` |
| Reset Inputs | `password`, `confirmPassword` |
| Validation | Match check + min length 6 |
| Reset API | `supabase.auth.updateUser({ password })` |
| Outcome | Success toast + delayed redirect to `/auth?type=tutor` |

### FR04: TUTOR ONBOARDING (5-Step)

| Item | Specification (Implemented Behavior) |
|---|---|
| Preconditions | Authenticated user; not admin; no existing `new_tutor` profile |
| Step 1 Inputs | `firstName`, `lastName`, `fatherName`, `contact`, `otherContact`, `city` (+ `customCity` if city=`Other`), `state`, `address`, `postalCode` |
| Step 1 Validation | Required checks + `phone` regex `^(\+92|0)?[0-9]{10}$` + `postalCode` regex `^[0-9]{5}$` |
| Step 2 Inputs | `cnicFront` file, `cnicBack` file |
| Step 2 Validation | Both CNIC files mandatory |
| Step 3 Inputs | Education array (`degree`, `institution`, `startDate`, `endDate`, `status`, `resultCard` file), optional work experience array (`position`, `company`, `description`, `duration`), `experienceYears` |
| Step 3 Validation | At least one education entry + required experience years |
| Step 4 Inputs | Subject selection from `SUBJECT_CATEGORIES` + custom subject entry (`courses[]`) |
| Step 4 Validation | At least one subject; duplicate prevention |
| Step 5 Inputs | `shortAbout` (required, max 200), `detailedDescription` (required) |
| File Storage | Uploads to `tutor-documents` bucket paths under `<userId>/...`; stores generated URLs |
| DB Write | Insert into `new_tutor` with mapped fields (`courses`, `education`, `work_experience`, docs URLs, etc.) |
| Analytics | Calls edge function `track-meta-conversion` (`CompleteRegistration`) |
| Outcome | Success toast + navigate `/dashboard` |

### FR05: TUITION REQUEST SUBMISSION (Parent/Student)

| Item | Specification (Implemented Behavior) |
|---|---|
| Screen | `TuitionRequest.tsx` |
| Inputs | `name`, `phone`, `preferredGender`, `city`, `area`, `class`, `subject`, `school`, `board`, `modeOfTuition`, `fee`, `additionalComments` |
| Required Fields | All except `school`, `board`, `additionalComments` |
| Enumerations | `preferredGender`: `male`, `female`, `no_preference`; `modeOfTuition`: `home`, `online`, `both` |
| Extra Action | WhatsApp deep-link to `wa.me/923194394344` with prefilled request text |
| DB Write | Insert into `tuition_requests` with `status='pending'`, nullable `user_id`, plus `referral_code` from localStorage |
| Outcome | Success toast + redirect `/tuition-request-success` |

### FR06: TUITION DISCOVERY & SEARCH

| Item | Specification (Implemented Behavior) |
|---|---|
| Screen | `AllTuitions.tsx` |
| Data Source | `tuition` table filtered by `status='available'` |
| Filters | City (`selectedCity`), Tuition Type (`Home Tuition`, `Online Tuition`, all) |
| Search Fields | `subject`, `grade`, `student_name`, `tuition_code` |
| Ordering | Latest first (`created_at desc`) |

### FR07: TUITION APPLICATION SUBMISSION (Tutor)

| Item | Specification (Implemented Behavior) |
|---|---|
| Entry Points | `TuitionDetails.tsx` and `TuitionListItem.tsx` |
| Eligibility Rules | Blocked for `incomplete`, `pending`, and `rejected` tutor states |
| Modal Inputs | `coverLetter` (required, max 500), 3 mandatory checkbox agreements |
| DB Write | Insert into `tuition_applications` with `tuition_id`, `tutor_id`, cached tutor snapshot (`tutor_name`, `tutor_contact`, `tutor_city`, `tutor_subjects`), `cover_letter`, `status='pending'` |
| Duplicate Handling | Unique constraint `(tuition_id, tutor_id)`; catches error code `23505` |

### FR08: ADMIN REVIEW - TUITION REQUESTS

| Item | Specification (Implemented Behavior) |
|---|---|
| Access Control | Page-level admin check (`user.id === ADMIN_USER_ID`) |
| List View | `AdminDashboard.tsx` pending request cards + counts |
| Detail View | `TuitionRequestDetail.tsx` full request fields, status badge, timestamps |
| Approve Action | Insert normalized row into `tuition` (`student_name`, `subject`, `grade`, `location`, `city`, `timing`, `fee`, `tuition_type`, `status='available'`) then update `tuition_requests.status='assigned'` |
| Reject Action | Update `tuition_requests.status='cancelled'` |

### FR09: ADMIN REVIEW - TUTOR APPLICATIONS

| Item | Specification (Implemented Behavior) |
|---|---|
| Access Control | Admin-only page-level checks |
| List View | Pending `new_tutor` records in dashboard |
| Detail View | `TutorApplicationDetail.tsx` with signed URLs for private storage objects |
| Approve Action | Update `new_tutor.status='approved'`, set `reviewed_at`, `reviewed_by`; DB trigger populates `tutors` |
| Reject Action | Update `new_tutor.status='rejected'` |

### FR10: ADMIN REVIEW - TUTOR APPLICATIONS PER TUITION

| Item | Specification (Implemented Behavior) |
|---|---|
| Screen | `TuitionApplications.tsx` |
| Data Query | `tuition_applications` joined with `tutors` details |
| Accept Action | Update selected row `status='accepted'`, set review metadata |
| Reject Others | Auto by DB trigger (`accept_tuition_application`) + optional manual reject action |
| Notifications | Acceptance/rejection emails via `send-assignment-email` edge function |

### FR11: PROFILE MANAGEMENT

| Item | Specification (Implemented Behavior) |
|---|---|
| Screen | `Profile.tsx` |
| Approved Tutor Mode | Edit phone/contact, address, subjects, mode (`Online`/`Home`/`Both`), city, education, biography, profile picture |
| Rejected/Incomplete Mode | Resubmission form with contact/address/courses/docs/education/description and status reset to `pending` |
| File Rules | Profile image max 5MB and image-only; stored in `tutor-documents` with signed URL display |
| Password Reset | Trigger `supabase.auth.resetPasswordForEmail` from profile page |

### FR12: CONTACT & COMMUNICATION MODULE

| Item | Specification (Implemented Behavior) |
|---|---|
| Contact Form Inputs | `name` (required), `email` (required), `phone` (optional), `message` (required) |
| Endpoint | `POST {VITE_SUPABASE_URL}/functions/v1/send-contact-email` with anon bearer token |
| Processing | Edge function validates payload and sends email via Resend to `team.apnatuition@gmail.com` |

---

## 6. Non-Functional Requirements & Technical Decisions:

### 6.1 Performance

- Query optimization patterns in UI:
  - `Promise.all()` in dashboard for parallel count/list retrieval.
  - Lightweight count queries using `select('id', { count: 'exact', head: true })`.
  - `limit(4)` for dashboard recents.
- Database-level optimization:
  - Indexed fields across core tables (`status`, `user_id`, `city`, `created_at`, application indexes).
  - Trigger-driven denormalized counters (`tuition.application_count`) to avoid expensive aggregate reads.
- UX responsiveness:
  - Granular loading states/spinners across all major pages.
  - Multi-step onboarding reduces immediate cognitive and rendering load per step.

### 6.2 Usability & UI/UX

- Frontend stack: React 18 + TypeScript + Vite.
- Design system:
  - Tailwind CSS + custom UI primitives under `components/ui` (Button, Input, Card, Select, Progress, Toast, etc.).
  - Iconography via `lucide-react`.
- Responsive behavior:
  - Desktop sidebar + mobile bottom navigation in authenticated area.
  - Adaptive grid layouts on onboarding, forms, and dashboard cards.
- Interaction clarity:
  - Toast-based feedback on success/failure.
  - Status banners (`incomplete/pending/rejected`) guide tutor next actions.
  - Dedicated upload-overlay warning during onboarding submit to prevent interruption.

### 6.3 Security

- Authentication:
  - Supabase Auth with email/password.
  - Email verification and resend flow.
  - Session persistence in localStorage (`storageKey: apna-tuition-auth`), auto-refresh enabled.
- Password handling:
  - Password reset and update managed by Supabase Auth API (no custom password hashing in frontend code).
- Authorization:
  - Admin authority mapped to env variable (`VITE_ADMIN_USER_ID`) in frontend checks.
  - RLS policies in migrations enforce table-level access strategies.
- Data protection:
  - Private file access supported via signed URLs for stored documents.
  - Input validations applied for phone/postal/password and required fields.

### 6.4 SEO & Meta Data

- Rendering approach:
  - Client-side SPA (Vite) with runtime `<head>` management via `react-helmet-async` (`HelmetProvider` in `main.tsx`).
  - No SSR in current implementation.
- Meta strategy:
  - Reusable `SEOHead` injects title, description, canonical, keywords, Open Graph (`og:type/url/title/description/image/site_name`), and Twitter cards.
- Structured data:
  - JSON-LD schemas implemented per page type:
    - `WebSite` (landing)
    - `FAQPage` (FAQ)
    - `ContactPage` (Contact)
    - `LocalBusiness` + `Service` (city landing pages)
    - `BlogPosting` (blog detail)
- Local SEO architecture:
  - Dedicated city URLs (`/tuition-in-{city}`) with city-specific title/description/keywords/schema.
- Crawlability:
  - `public/robots.txt` allows all + points to sitemap.
  - `public/sitemap.xml` includes core pages, city pages, and blog URLs with priorities/change frequencies.

### 6.5 Technical Decision Summary

- **BaaS-first architecture:** Supabase handles auth, Postgres, storage, RLS, and edge functions to reduce custom backend complexity.
- **Trigger-assisted workflow automation:** DB triggers synchronize cross-table state (e.g., tutor approval and tuition assignment lifecycle).
- **Client-side RBAC checks + RLS defense-in-depth:** UI prevents accidental access; database policies enforce actual data constraints.
- **Growth instrumentation built-in:** Referral tracking and Meta CAPI conversion events are directly integrated into the production flow.

---

### Appendix: Key Database Models in Active Use

- `user_profiles`: id, email, username, user_type, avatar_url, phone, is_active, email_verified, timestamps.
- `new_tutor`: onboarding submission store with personal/contact/location/docs/education/experience/courses/status/review metadata.
- `tutors`: approved tutor profile used for tutor-facing marketplace operations.
- `tuition_requests`: incoming demand records from parents/students.
- `tuition`: tutor-visible opportunities with assignment status and generated tuition code.
- `tuition_applications`: many-to-one application records from tutors to tuition listings.

---

### Appendix: Implemented API/Function Endpoints

- Supabase Auth (SDK): sign up, sign in, sign out, get session/user, resend verification, reset password, update password.
- Edge Functions:
  - `send-contact-email`
  - `send-login-email`
  - `send-assignment-email`
  - `track-meta-conversion`
- Client fetch endpoint (contact form):
  - `POST /functions/v1/send-contact-email`
