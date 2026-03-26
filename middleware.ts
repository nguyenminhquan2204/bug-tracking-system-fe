import { NextRequest, NextResponse } from 'next/server'

const roleRoutes: Record<string, string[]> = {
  Admin: ['/admin'],
  Developer: ['/dev'],
  Tester: ['/tester'],
}

export function middleware(request: NextRequest) {
  const role = request.cookies.get('role')?.value
  const token = request.cookies.get('accessToken')?.value

  const pathname = request.nextUrl.pathname

  if (!token || !role) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const allowedRoutes = roleRoutes[role]

  const isAllowed = allowedRoutes?.some(route =>
    pathname.startsWith(route)
  )

  if (!isAllowed) {
    return NextResponse.redirect(
      new URL(`/${role.toLowerCase()}`, request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dev/:path*', '/tester/:path*'],
}