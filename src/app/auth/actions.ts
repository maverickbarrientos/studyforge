"use server";

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
    console.error("Supabase password sign-in failed.", {
      code: error.code,
      name: error.name,
      status: error.status,
    });

    if (error.status === 429) {
      redirect("/login?error=too-many-attempts");
    }

    if (error.code === "invalid_credentials") {
      redirect("/login?error=invalid-credentials");
    }

    redirect("/login?error=login-failed");
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

  const supabase = await createSupabaseServerClient({ writableCookies: true });
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    console.error("Supabase password signup failed.", {
      code: error.code,
      name: error.name,
      status: error.status,
    });
    redirect("/signup?error=signup-failed");
  }

  if (data.session) {
    redirect(next);
  }

  redirect("/signup?error=signup-failed");
}
