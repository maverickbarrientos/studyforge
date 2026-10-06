import { NextResponse, type NextRequest } from "next/server";
import { getSafeRedirectPath } from "@/features/auth/redirect-path";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const destination = getSafeRedirectPath(
    request.nextUrl.searchParams.get("next"),
  );

  if (code) {
    const supabase = await createSupabaseServerClient({
      writableCookies: true,
    });
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL(destination, request.url));
    }
  }

  return NextResponse.redirect(
    new URL("/login?error=confirmation-failed", request.url),
  );
}
