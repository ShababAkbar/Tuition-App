/**
 * Database Documentation Generator
 * Generates complete database structure, policies, triggers, and workflows
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

async function generateDatabaseDocumentation() {
  const docs = [];
  
  docs.push('# COMPLETE DATABASE DOCUMENTATION');
  docs.push('Generated on: ' + new Date().toISOString());
  docs.push('\n---\n');

  // 1. Get all tables
  const { data: tables } = await supabase
    .from('information_schema.tables')
    .select('*')
    .eq('table_schema', 'public');

  docs.push('## DATABASE OVERVIEW\n');
  docs.push(`Total Tables: ${tables?.length || 0}\n\n`);

  // 2. For each table, get complete structure
  for (const table of tables || []) {
    docs.push(`\n## TABLE: ${table.table_name.toUpperCase()}\n`);
    
    // Get columns
    const columnsQuery = `
      SELECT 
        column_name,
        data_type,
        character_maximum_length,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' 
        AND table_name = '${table.table_name}'
      ORDER BY ordinal_position;
    `;
    
    const { data: columns } = await supabase.rpc('exec_sql', { query: columnsQuery });
    
    docs.push('### Columns:\n');
    docs.push('| Column | Type | Nullable | Default |');
    docs.push('|--------|------|----------|---------|');
    
    columns?.forEach(col => {
      docs.push(`| ${col.column_name} | ${col.data_type}${col.character_maximum_length ? `(${col.character_maximum_length})` : ''} | ${col.is_nullable} | ${col.column_default || 'NULL'} |`);
    });
    
    // Get constraints
    const constraintsQuery = `
      SELECT 
        tc.constraint_name,
        tc.constraint_type,
        kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
      WHERE tc.table_schema = 'public'
        AND tc.table_name = '${table.table_name}';
    `;
    
    const { data: constraints } = await supabase.rpc('exec_sql', { query: constraintsQuery });
    
    if (constraints?.length > 0) {
      docs.push('\n### Constraints:\n');
      constraints.forEach(c => {
        docs.push(`- **${c.constraint_type}**: ${c.constraint_name} on ${c.column_name}`);
      });
    }

    // Get indexes
    const indexesQuery = `
      SELECT 
        indexname,
        indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
        AND tablename = '${table.table_name}';
    `;
    
    const { data: indexes } = await supabase.rpc('exec_sql', { query: indexesQuery });
    
    if (indexes?.length > 0) {
      docs.push('\n### Indexes:\n');
      indexes.forEach(idx => {
        docs.push(`- ${idx.indexname}`);
        docs.push(`  \`\`\`sql\n  ${idx.indexdef}\n  \`\`\``);
      });
    }

    // Get RLS Policies
    const policiesQuery = `
      SELECT 
        policyname,
        cmd,
        qual,
        with_check,
        roles
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = '${table.table_name}';
    `;
    
    const { data: policies } = await supabase.rpc('exec_sql', { query: policiesQuery });
    
    if (policies?.length > 0) {
      docs.push('\n### RLS Policies:\n');
      policies.forEach(policy => {
        docs.push(`\n#### Policy: ${policy.policyname}`);
        docs.push(`- **Command**: ${policy.cmd}`);
        docs.push(`- **Roles**: ${policy.roles?.join(', ')}`);
        if (policy.qual) docs.push(`- **USING**: \`${policy.qual}\``);
        if (policy.with_check) docs.push(`- **WITH CHECK**: \`${policy.with_check}\``);
      });
    }

    // Get Triggers
    const triggersQuery = `
      SELECT 
        trigger_name,
        event_manipulation,
        action_timing,
        action_statement
      FROM information_schema.triggers
      WHERE event_object_schema = 'public'
        AND event_object_table = '${table.table_name}';
    `;
    
    const { data: triggers } = await supabase.rpc('exec_sql', { query: triggersQuery });
    
    if (triggers?.length > 0) {
      docs.push('\n### Triggers:\n');
      triggers.forEach(trigger => {
        docs.push(`\n#### Trigger: ${trigger.trigger_name}`);
        docs.push(`- **Event**: ${trigger.event_manipulation}`);
        docs.push(`- **Timing**: ${trigger.action_timing}`);
        docs.push(`- **Action**: \`\`\`sql\n${trigger.action_statement}\n\`\`\``);
      });
    }
    
    docs.push('\n---\n');
  }

  // 3. Document workflows
  docs.push('\n## WORKFLOWS AND BUSINESS LOGIC\n');
  
  docs.push('### Tutor Onboarding Workflow:\n');
  docs.push('1. User fills tutor onboarding form (unauthenticated)');
  docs.push('2. Data is inserted into `tutors` table with status = "pending"');
  docs.push('3. Admin reviews the tutor profile in dashboard');
  docs.push('4. If approved:');
  docs.push('   - Admin creates user account in Supabase Auth');
  docs.push('   - Admin creates entry in `user_profiles` table');
  docs.push('   - Admin updates tutor status to "approved" in `tutors` table');
  docs.push('   - System sends confirmation email to tutor');
  docs.push('5. Tutor can now login with credentials');
  docs.push('6. **NOTE**: No automatic trigger - manual admin approval required\n');

  docs.push('### Tuition Request Workflow:\n');
  docs.push('1. Student/Parent fills tuition request form (unauthenticated)');
  docs.push('2. Request is inserted into `tuition_requests` table');
  docs.push('3. Admin views all requests in dashboard');
  docs.push('4. Admin can:');
  docs.push('   - Assign tutor to request');
  docs.push('   - Approve and convert to tuition posting');
  docs.push('   - Reject request');
  docs.push('5. If approved: Admin creates new entry in `tuition` table\n');

  // Save to file
  const output = docs.join('\n');
  fs.writeFileSync('DATABASE_DOCUMENTATION.md', output);
  
  console.log('✅ Documentation generated: DATABASE_DOCUMENTATION.md');
}

// Run
generateDatabaseDocumentation().catch(console.error);
