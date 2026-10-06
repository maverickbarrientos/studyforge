import Link from "next/link";
import { login, signup } from "@/app/auth/actions";

type AuthFormProps = {
  mode: "login" | "signup";
  error?: string;
  nextPath: string;
};

const errorMessages: Record<string, string> = {
  "invalid-credentials": "Email or password is incorrect.",
  "invalid-input": "Enter a valid email and password of at least 6 characters.",
  "login-failed": "We couldn’t sign you in right now. Try again in a moment.",
  "password-mismatch": "The passwords do not match.",
  "signup-failed": "We couldn’t create your account. Check the email and try again.",
  "too-many-attempts": "There have been too many sign-in attempts. Wait a little before trying again.",
};

export function AuthForm({
  mode,
  error,
  nextPath,
}: AuthFormProps) {
  const isSignup = mode === "signup";
  const action = isSignup ? signup : login;

  return (
    <section className="mx-auto w-full max-w-md rounded-3xl border border-stone-200 bg-white p-6 shadow-[0_18px_60px_-40px_rgba(28,25,23,0.25)] sm:p-8">
      <div className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600">
          {isSignup ? "Create your account" : "Welcome back"}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
          {isSignup ? "Join StudyForge" : "Log in to StudyForge"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          {isSignup
            ? "Create an account to start your study session."
            : "Sign in to continue to your study space."}
        </p>
      </div>

      {error && (
        <p
          aria-live="polite"
          className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {errorMessages[error] ?? "Authentication failed. Please try again."}
        </p>
      )}

      <form action={action} className="space-y-5">
        <input name="next" type="hidden" value={nextPath} />
        <div>
          <label
            className="mb-2 block text-sm font-medium text-stone-800"
            htmlFor={`${mode}-email`}
          >
            Email
          </label>
          <input
            autoComplete="email"
            className="h-11 w-full rounded-xl border border-stone-300 bg-white px-3.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            id={`${mode}-email`}
            name="email"
            placeholder="you@example.com"
            required
            type="email"
          />
        </div>
        <div>
          <label
            className="mb-2 block text-sm font-medium text-stone-800"
            htmlFor={`${mode}-password`}
          >
            Password
          </label>
          <input
            autoComplete={isSignup ? "new-password" : "current-password"}
            className="h-11 w-full rounded-xl border border-stone-300 bg-white px-3.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            id={`${mode}-password`}
            minLength={isSignup ? 6 : undefined}
            name="password"
            required
            type="password"
          />
        </div>
        {isSignup && (
          <div>
            <label
              className="mb-2 block text-sm font-medium text-stone-800"
              htmlFor="signup-password-confirmation"
            >
              Confirm password
            </label>
            <input
              autoComplete="new-password"
              className="h-11 w-full rounded-xl border border-stone-300 bg-white px-3.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              id="signup-password-confirmation"
              minLength={6}
              name="passwordConfirmation"
              required
              type="password"
            />
          </div>
        )}
        <button
          className="flex h-12 w-full items-center justify-center rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          type="submit"
        >
          {isSignup ? "Create account" : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-stone-600">
        {isSignup ? "Already have an account?" : "New to StudyForge?"}{" "}
        <Link
          className="font-semibold text-indigo-700 hover:text-indigo-800"
          href={`${isSignup ? "/login" : "/signup"}?next=${encodeURIComponent(nextPath)}`}
        >
          {isSignup ? "Log in" : "Sign up"}
        </Link>
      </p>
    </section>
  );
}
