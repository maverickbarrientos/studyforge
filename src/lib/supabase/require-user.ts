import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { isAuthSessionMissingError } from "@supabase/supabase-js";

export async function getAuthenticatedUser() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error && !isAuthSessionMissingError(error)) {
    throw new Error("Unable to verify the Supabase user session.", {
      cause: error,
    });
  }

  return data?.user ?? null;
}

export async function requireAuthenticatedUser() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
