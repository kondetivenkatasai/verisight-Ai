import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';
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
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'x-client-info': 'verisight-ai-backend-v1',
      },
    },
    realtime: {
      transport: WebSocket,
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
    realtime: {
      transport: WebSocket,
    },
  }
);


/**
 * Tests database connectivity on server startup.
 * Logs "Supabase Connected Successfully" on success, or a detailed error without crashing.
 */
export async function testConnection() {
  if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
    console.log('ℹ️ Operating in Local In-Memory Fallback Mode (No live Supabase credentials)');
    return false;
  }

  try {
    const { data, error } = await supabase.from('users').select('id').limit(1);

    if (error) {
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
      return false;
    }

    console.log('Supabase Connected Successfully');
    return true;
  } catch (err) {
    console.error('❌ Supabase Connection Exception:', err.message);
    return false;
  }
}

export default supabase;

