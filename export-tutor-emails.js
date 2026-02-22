/**
 * Export all approved tutor emails to CSV
 * 
 * SETUP:
 * 1. Create a .env file with:
 *    VITE_SUPABASE_URL=your_supabase_url
 *    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
 * 2. Run: node export-tutor-emails.js
 * 3. Import the generated CSV into Zoho Campaigns
 */

import 'dotenv/config';
import { writeFileSync } from 'fs';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

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
