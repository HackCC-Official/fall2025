import { type NextRequest } from 'next/server'
import { updateSession } from './features/auth/utils/update-session'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: ['/panel/:path*'], // Protects all routes under /panel/*
}
