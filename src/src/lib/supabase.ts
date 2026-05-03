import { createClient } from '@supabase/supabase-js'

// Fallbacks prevent build-time crash when env vars aren't available.
// Real values must be set in Vercel environment variables.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder-service-key'

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side admin client (bypasses RLS — for API routes only)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
