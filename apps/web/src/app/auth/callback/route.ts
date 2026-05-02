import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    // The Supabase client-side SDK will handle the code exchange
    // via onAuthStateChange. We just redirect to dashboard.
    return NextResponse.redirect(new URL("/dashboard", requestUrl.origin));
  }

  // If no code, redirect to login
  return NextResponse.redirect(new URL("/login", requestUrl.origin));
}
