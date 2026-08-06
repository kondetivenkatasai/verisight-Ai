import { createClient } from '@supabase/supabase-js';
import env from './env.js';

const supabaseUrl = env.SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = env.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn('⚠️ Supabase credentials missing in backend/.env');
}

// Reusable Supabase client with service role key for full backend database access
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseServiceRoleKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Reusable Supabase client with anon key for scoped operations if needed
export const supabaseAnon = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * Tests database connectivity on server startup.
 * Logs "Supabase Connected Successfully" on success, or a detailed error without crashing.
 */
export async function testConnection() {
  try {
    const { data, error } = await supabase.from('users').select('id').limit(1);

    if (error) {
      // PGRST205 / 42P01 / schema cache: table not created yet, but connection to Supabase API succeeded
      if (
        error.code === '42P01' ||
        error.code === 'PGRST205' ||
        error.message?.includes('schema cache') ||
        error.message?.includes('does not exist')
      ) {
        console.log('Supabase Connected Successfully');
        return true;
      }

      console.error('❌ Supabase Connection Failed:');
      console.error('   Message:', error.message);
      console.error('   Code:', error.code || 'N/A');
      console.error('   Details:', error.details || 'Check your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env');
      return false;
    }

    console.log('Supabase Connected Successfully');
    return true;
  } catch (err) {
    console.error('❌ Supabase Connection Exception:');
    console.error('   Message:', err.message);
    console.error('   Stack:', err.stack);
    return false;
  }
}

export default supabase;
