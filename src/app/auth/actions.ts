"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSafeRedirectPath } from "@/features/auth/redirect-path";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function formString(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export async function login(formData: FormData) {
  const email = formString(formData, "email").trim();
  const password = formString(formData, "password");
  const next = getSafeRedirectPath(formString(formData, "next"));

  if (!email || !password) {
    redirect("/login?error=invalid-input");
  }

  const supabase = await createSupabaseServerClient({ writableCookies: true });
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/login?error=invalid-credentials");
  }

  redirect(next);
}

export async function signup(formData: FormData) {
  const email = formString(formData, "email").trim();
  const password = formString(formData, "password");
  const passwordConfirmation = formString(formData, "passwordConfirmation");
  const next = getSafeRedirectPath(formString(formData, "next"));

  if (!email || password.length < 6) {
    redirect("/signup?error=invalid-input");
  }

  if (password !== passwordConfirmation) {
    redirect("/signup?error=password-mismatch");
  }

  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin");
  const host = requestHeaders.get("host");

  if (!origin || !host || new URL(origin).host !== host) {
    redirect("/signup?error=invalid-origin");
  }

  const callbackUrl = new URL("/auth/callback", origin);
  callbackUrl.searchParams.set("next", next);

  const supabase = await createSupabaseServerClient({ writableCookies: true });
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: callbackUrl.toString() },
  });

  if (error) {
    redirect("/signup?error=signup-failed");
  }

  if (data.session) {
    redirect(next);
  }

  redirect("/signup?message=check-email");
}
