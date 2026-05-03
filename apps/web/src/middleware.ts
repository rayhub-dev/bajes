import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Public routes that don't need auth
  const publicPaths = ["/login", "/auth/callback", "/offline", "/share-target"];
  const isPublicPath = pathname === "/" || publicPaths.some((path) => pathname.startsWith(path));

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Check for Supabase auth cookies (sb-*-auth-token)
  const cookies = request.cookies.getAll();
  const hasAuthCookie = cookies.some((cookie) => cookie.name.includes("-auth-token"));
  const hasAuthenticatedMarker = request.cookies.get("bajes-authenticated")?.value === "true";

  // Check for guest mode
  // Note: localStorage is not accessible in middleware, so we use a cookie fallback
  const isGuest = request.cookies.get("bajes-guest-mode")?.value === "true";

  if (!hasAuthCookie && !hasAuthenticatedMarker && !isGuest) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|icons|api).*)"],
};
