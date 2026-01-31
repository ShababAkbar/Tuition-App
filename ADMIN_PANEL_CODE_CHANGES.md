# FRONTEND CODE CHANGES - Admin Panel Query Update Guide

## 📍 WHERE TO CHANGE

### **Current Situation:**
Aapke Dashboard.tsx mein **abhi sirf TUTOR dashboard** hai. Admin panel features **add karne honge**.

---

## 🔧 CHANGES NEEDED

### **1. Dashboard.tsx mein Admin Section Add Karo**

**Location:** [src/pages/Dashboard.tsx](src/pages/Dashboard.tsx)

**Add this after line 20:**

```typescript
// Add after existing state declarations
const [isAdmin, setIsAdmin] = useState(false);
const [tuitionApplications, setTuitionApplications] = useState<any[]>([]);
```

**Add this function:**

```typescript
const fetchAdminData = async () => {
  try {
    // Check if user is admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('user_type')
      .eq('id', user.id)
      .single();
    
    if (profile?.user_type === 'admin') {
      setIsAdmin(true);
      
      // OLD WAY (Will fail now):
      // const { data } = await supabase
      //   .from('admin_tuition_applications')
      //   .select('*');
      
      // ✅ NEW WAY (Secure):
      const { data } = await supabase
        .rpc('get_tuition_applications');
      
      setTuitionApplications(data || []);
    }
  } catch (error) {
    console.error('Error fetching admin data:', error);
  }
};
```

---

### **2. Create Admin-Specific Components**

Create new file: [src/pages/AdminDashboard.tsx](src/pages/AdminDashboard.tsx)

```typescript
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminDashboard() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      // ✅ Use secure RPC function
      const { data, error } = await supabase
        .rpc('get_tuition_applications');
      
      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const scheduleDemo = async (applicationId: string, demoDate: string) => {
    try {
      const { error } = await supabase
        .from('tutor_applications')
        .update({
          status: 'demo_scheduled',
          demo_date: demoDate,
          admin_notes: 'Demo scheduled'
        })
        .eq('id', applicationId);
      
      if (error) throw error;
      fetchApplications(); // Refresh
    } catch (error) {
      console.error('Error scheduling demo:', error);
    }
  };

  const finalizeAssignment = async (
    applicationId: string, 
    tuitionRequestId: string,
    tutorId: string
  ) => {
    try {
      // Begin transaction-like operations
      
      // 1. Accept winning application
      await supabase
        .from('tutor_applications')
        .update({ status: 'accepted' })
        .eq('id', applicationId);
      
      // 2. Get tuition details
      const { data: application } = await supabase
        .from('tutor_applications')
        .select(`
          *,
          tutors (first_name, last_name),
          tuition (student_name, subject)
        `)
        .eq('id', applicationId)
        .single();
      
      // 3. Create final assignment
      const { error } = await supabase
        .from('tuition_assignments')
        .insert({
          tuition_request_id: tuitionRequestId,
          tutor_id: tutorId,
          tutor_name: `${application.tutors.first_name} ${application.tutors.last_name}`,
          student_name: application.tuition.student_name,
          subject: application.tuition.subject,
          status: 'active'
        });
      
      if (error) throw error;
      
      // Triggers will automatically:
      // - Update tuition_requests.assigned_tutor_id
      // - Update tuition.status = 'assigned'
      // - Reject other applications
      
      fetchApplications(); // Refresh
      alert('Tuition assigned successfully!');
    } catch (error) {
      console.error('Error finalizing assignment:', error);
      alert('Error assigning tuition');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tutor Applications</h1>
      
      <div className="grid gap-4">
        {applications.map((app) => (
          <div key={app.application_id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold">{app.tuition_code} - {app.subject}</h3>
                <p className="text-sm text-gray-600">
                  Tutor: {app.tutor_name} ({app.tutor_email})
                </p>
                <p className="text-sm text-gray-600">
                  Experience: {app.experience_years} years
                </p>
                <p className="text-sm text-gray-600">
                  Status: <span className="font-semibold">{app.application_status}</span>
                </p>
              </div>
              
              <div className="flex gap-2">
                {app.application_status === 'pending' && (
                  <button
                    onClick={() => {
                      const date = prompt('Enter demo date/time (YYYY-MM-DD HH:MM):');
                      if (date) scheduleDemo(app.application_id, date);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Schedule Demo
                  </button>
                )}
                
                {app.application_status === 'demo_completed' && (
                  <button
                    onClick={() => {
                      if (confirm('Assign this tutor?')) {
                        finalizeAssignment(
                          app.application_id,
                          app.tuition_request_id,
                          app.tutor_id
                        );
                      }
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                  >
                    Finalize Assignment
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### **3. Update Routes in App.tsx**

```typescript
// Add this route
<Route path="/admin" element={<AdminDashboard />} />
```

---

### **4. For Viewing Applications of Specific Tuition**

```typescript
// Filter by tuition code
const { data } = await supabase
  .rpc('get_tuition_applications', { 
    tuition_code_filter: 'AP-016' 
  });
```

---

## 📊 QUERY EXAMPLES

### **Get All Applications (Admin Only)**
```typescript
const { data, error } = await supabase
  .rpc('get_tuition_applications');

// Returns:
// [
//   {
//     application_id: 'uuid',
//     application_status: 'pending',
//     tutor_name: 'Ahmed Khan',
//     tutor_email: 'ahmed@example.com',
//     tuition_code: 'AP-016',
//     subject: 'Mathematics',
//     ...
//   }
// ]
```

### **Get Applications for Specific Tuition**
```typescript
const { data } = await supabase
  .rpc('get_tuition_applications', {
    tuition_code_filter: 'AP-016'
  });
```

### **Schedule Demo**
```typescript
const { error } = await supabase
  .from('tutor_applications')
  .update({
    status: 'demo_scheduled',
    demo_date: '2026-02-01 10:00:00',
    admin_notes: 'Called parent, demo confirmed'
  })
  .eq('id', applicationId);
```

### **Update Demo Status (After Demo)**
```typescript
const { error } = await supabase
  .from('tutor_applications')
  .update({
    status: 'demo_completed',
    demo_notes: 'Demo went well, parent satisfied'
  })
  .eq('id', applicationId);
```

---

## ✅ COMPLETE WORKFLOW

```typescript
// Step 1: Admin approves tuition request
const approveRequest = async (requestId: string) => {
  // Update request status
  await supabase
    .from('tuition_requests')
    .update({ status: 'approved' })
    .eq('id', requestId);
  
  // Create tuition posting (code auto-generates)
  const { data: request } = await supabase
    .from('tuition_requests')
    .select('*')
    .eq('id', requestId)
    .single();
  
  await supabase
    .from('tuition')
    .insert({
      student_name: request.name,
      subject: request.subject,
      grade: request.class,
      city: request.city,
      location: request.area,
      timing: 'TBD',
      fee: request.fee || 'Negotiable',
      tuition_type: request.mode_of_tuition
    });
  // tuition_code auto-generates: AP-017
};

// Step 2: Tutor applies (from tutor's dashboard)
const applyForTuition = async (tuitionId: string) => {
  const { data: tutor } = await supabase
    .from('tutors')
    .select('id')
    .eq('user_id', auth.uid())
    .single();
  
  await supabase
    .from('tutor_applications')
    .insert({
      tuition_id: tuitionId,
      tutor_id: tutor.id,
      status: 'pending'
    });
};

// Step 3: Admin views applications
const { data } = await supabase
  .rpc('get_tuition_applications', {
    tuition_code_filter: 'AP-017'
  });

// Step 4: Admin schedules demo
await supabase
  .from('tutor_applications')
  .update({
    status: 'demo_scheduled',
    demo_date: '2026-02-01 10:00:00'
  })
  .eq('id', applicationId);

// Step 5: After demo, finalize
await supabase
  .from('tuition_assignments')
  .insert({
    tuition_request_id: requestId,
    tutor_id: tutorId,
    tutor_name: 'Ahmed Khan',
    student_name: 'Sara Ahmed',
    subject: 'Mathematics',
    status: 'active'
  });
// Trigger auto-updates everything!
```

---

## 🚨 IMPORTANT NOTES

1. **View ko function se replace kiya hai** - `admin_tuition_applications` view ab nahi hai
2. **Use RPC function** - `.rpc('get_tuition_applications')` 
3. **Admin check automatic hai** - Function mein built-in security
4. **Triggers handle everything** - Assignment create karo, baaki automatic

---

## 📁 FILES TO CREATE/UPDATE

- ✅ [src/pages/AdminDashboard.tsx](src/pages/AdminDashboard.tsx) - New file
- ✅ [src/pages/Dashboard.tsx](src/pages/Dashboard.tsx) - Add admin check
- ✅ [src/App.tsx](src/App.tsx) - Add admin route

**Migration already ready:**
- ✅ 20260126000000_complete_tuition_flow.sql
- ✅ 20260126000001_fix_unrestricted_tables.sql

Run both migrations, then update frontend code!
