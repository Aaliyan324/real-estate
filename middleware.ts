import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET_KEY = process.env.AUTH_SECRET || 'dev-secret-key-real-estate-pakistan-2026-secure'
const key = new TextEncoder().encode(SECRET_KEY)

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  if (path.startsWith('/admin')) {
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(path)}`, request.url))
    }

    try {
      const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] })
      const role = payload.role as string

      if (role !== 'ADMIN' && role !== 'AGENT') {
        return NextResponse.redirect(new URL('/?error=unauthorized', request.url))
      }
    } catch {
      return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(path)}`, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
