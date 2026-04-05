import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  // If we're hitting the /dashboard, /dashboard/* routes
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    
    // Check for the Next-Auth session token
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "fallback_super_secret_for_local_dev_only_948" });
    
    // If no token exists, redirect to login
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      // Append callbackUrl so they return to where they came from
      url.searchParams.set('callbackUrl', req.url);
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

// Ensure the middleware is only called for relevant paths
export const config = {
  matcher: ['/dashboard/:path*'],
};
