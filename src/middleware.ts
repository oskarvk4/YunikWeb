import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Just pass through - let server components handle auth
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Only match protected routes
    "/account/:path*",
    "/admin/:path*",
  ],
};
