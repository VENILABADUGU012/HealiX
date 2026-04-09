import dotenv from 'dotenv'

dotenv.config()

const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_JWT_SECRET']
const isTest = process.env.NODE_ENV === 'test'

if (!isTest) {
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required env var: ${key}`)
    }
  }
}

/** Comma-separated URLs, e.g. https://app.vercel.app,https://preview.vercel.app */
function parseCorsOrigins(raw) {
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  corsOrigins: parseCorsOrigins(process.env.FRONTEND_ORIGIN || 'http://localhost:5173'),
  supabaseUrl: process.env.SUPABASE_URL || 'http://localhost:54321',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || 'test-anon-key',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'test-service-role-key',
  supabaseJwtSecret: process.env.SUPABASE_JWT_SECRET || 'test-jwt-secret',
  bucketName: process.env.SUPABASE_STORAGE_BUCKET || 'medical-records',
}
