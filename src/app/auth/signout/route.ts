import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin || new URL(origin).origin !== request.nextUrl.origin) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const supabase = await createSupabaseServerClient({ writableCookies: true });
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error("Unable to end the Supabase session.", { cause: error });
  }

  return NextResponse.redirect(new URL("/login", request.url), 303);
}
