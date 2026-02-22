/**
 * Export all approved tutor emails to CSV
 * Run: node export-tutor-emails.js
 * Then import the CSV into Zoho Campaigns
 */

import { writeFileSync } from 'fs';

const SUPABASE_URL = 'https://gitwgsoasegtfumkrizz.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpdHdnc29hc2VndGZ1bWtyaXp6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDk5NjE0OCwiZXhwIjoyMDc2NTcyMTQ4fQ.0G0XEvvABJW77eoKEjsSOoCOVKmvMorsQ2NxndwsJpI';

const response = await fetch(
  `${SUPABASE_URL}/rest/v1/tutors?status=eq.approved&email=not.is.null&select=email,first_name,last_name`,
  {
    headers: {
      'apikey': SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    }
  }
);

const tutors = await response.json();
console.log(`✅ Found ${tutors.length} approved tutors`);

// Create CSV content
const csvLines = ['Email Address,First Name,Last Name'];
for (const t of tutors) {
  const email = t.email || '';
  const first = (t.first_name || '').replace(/,/g, ' ');
  const last = (t.last_name || '').replace(/,/g, ' ');
  csvLines.push(`${email},${first},${last}`);
}

const csvContent = csvLines.join('\n');
writeFileSync('tutor-emails.csv', csvContent);

console.log(`📄 CSV saved: tutor-emails.csv`);
console.log(`📋 Total rows: ${tutors.length}`);
console.log('\n➡️  Now import this CSV into Zoho Campaigns:');
console.log('   campaigns.zoho.com → Contacts → Mailing Lists → Add Subscribers → Import');
