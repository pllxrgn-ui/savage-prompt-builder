import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || supabaseUrl.includes('your_supabase_project_url') || !supabaseKey) {
    return null;
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseKey
  )
}
