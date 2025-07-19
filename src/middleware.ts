import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value || "";

  // Public paths (no auth required)
  const publicPaths = ["/", "/pages/login", "/pages/signup"];
  const isPublicPath = publicPaths.includes(path);

  // ✅ Authenticated users shouldn't access login/signup again
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/pages/dashboard", request.url));
  }

  // ✅ Protect all other `/pages` routes except public ones
  if (!isPublicPath && path.startsWith("/pages") && !token) {
    return NextResponse.redirect(new URL("/pages/login", request.url));
  }

  return NextResponse.next(); // allow request to proceed
}

// ✅ Exclude API routes and static files
export const config = {
  matcher: [
    "/pages/:path*", // covers /pages/** (login, signup, dashboard, podcasts, etc.)
    "/"              // home route
  ],
};
