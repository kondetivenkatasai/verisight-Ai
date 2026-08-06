/**
 * Database Seed Script
 *
 * Run: node src/database/seed.js
 *
 * Creates sample data for development. Requires .env to be configured.
 */

import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Create demo user
    const password = await bcrypt.hash('password123', 12);
    const { data: user, error: userError } = await supabase
      .from('users')
      .upsert(
        { name: 'Demo User', email: 'demo@aegis.ai', password, role: 'user' },
        { onConflict: 'email' }
      )
      .select()
      .single();

    if (userError) throw userError;
    console.log('✅ User created:', user.email);

    // Create sample cases
    const cases = [
      { user_id: user.id, title: 'Supply Chain Risk Assessment', description: 'Evaluate supply chain vulnerabilities for Q3 operations across APAC region. Focus on semiconductor shortage impact and alternative sourcing strategies.', priority: 'high', status: 'completed' },
      { user_id: user.id, title: 'Compliance Audit Review', description: 'Review regulatory compliance for financial reporting. Ensure SOX and GDPR requirements are met across all business units.', priority: 'critical', status: 'in_progress' },
      { user_id: user.id, title: 'Market Entry Analysis', description: 'Analyze viability of entering the Southeast Asian market. Assess competition, regulations, and consumer demand patterns.', priority: 'medium', status: 'open' },
    ];

    const { data: createdCases, error: caseError } = await supabase
      .from('cases')
      .upsert(cases)
      .select();

    if (caseError) throw caseError;
    console.log(`✅ ${createdCases.length} cases created`);

    // Create sample report for completed case
    const { error: reportError } = await supabase
      .from('reports')
      .insert({
        case_id: createdCases[0].id,
        summary: 'The supply chain analysis reveals significant vulnerability in semiconductor sourcing with a 67% dependency on a single region. Diversification strategies have been identified with projected 40% risk reduction over 6 months.',
        decision: 'approved',
        risk_score: 72,
        recommendation: 'Implement dual-sourcing strategy for critical components. Establish regional inventory buffers of 30-day supply. Initiate vendor qualification process for 3 alternative suppliers within 60 days.',
      });

    if (reportError) throw reportError;
    console.log('✅ Sample report created');

    console.log('\n🎉 Seed completed successfully!');
    console.log('   Login: demo@aegis.ai / password123');
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
  }

  process.exit(0);
}

seed();
