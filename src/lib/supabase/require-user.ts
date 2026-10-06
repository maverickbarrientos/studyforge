import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { isAuthSessionMissingError } from "@supabase/supabase-js";

export async function requireAuthenticatedUser() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error && !isAuthSessionMissingError(error)) {
    throw new Error("Unable to verify the Supabase user session.", {
      cause: error,
    });
  }

  if (!data?.user) {
    redirect("/login");
  }

  return data.user;
}
