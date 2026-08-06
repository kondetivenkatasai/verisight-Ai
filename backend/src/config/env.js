import dotenv from 'dotenv';
dotenv.config();

const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
};

// Validate required variables in production with soft warning to prevent container build crashes
const required = ['JWT_SECRET', 'SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'];

if (env.NODE_ENV === 'production') {
  for (const key of required) {
    if (!env[key]) {
      console.warn(`⚠️ Warning: Production environment variable missing: ${key}. Please configure in Railway Dashboard.`);
    }
  }
}

export default env;
