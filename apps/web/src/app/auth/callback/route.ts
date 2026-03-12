import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/** Only allow redirects to same-origin relative paths */
function sanitizeRedirectPath(path: string): string {
  // Must start with `/` and not contain `//` (protocol-relative URL attack)
  if (!path.startsWith('/') || path.startsWith('//')) return '/builder'
  // Strip any authority component that could be smuggled via encoded chars
  try {
    const parsed = new URL(path, 'http://dummy')
    if (parsed.hostname !== 'dummy') return '/builder'
  } catch {
    return '/builder'
  }
  return path
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = sanitizeRedirectPath(searchParams.get('next') ?? '/builder')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
