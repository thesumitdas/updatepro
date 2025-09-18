import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Admin routes protection
  if (req.nextUrl.pathname.startsWith('/admin') && !req.nextUrl.pathname.startsWith('/admin/login')) {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  // Redirect logged in admin from login page
  if (req.nextUrl.pathname === '/admin/login') {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*']
}