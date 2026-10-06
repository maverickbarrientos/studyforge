import { SiteHeader } from "@/components/site-header";
import { AuthForm } from "@/features/auth/components/auth-form";
import { getSafeRedirectPath } from "@/features/auth/redirect-path";

type SignupPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-[#f8f8f6] text-stone-900">
      <SiteHeader />
      <main className="px-5 py-12 sm:py-16">
        <AuthForm
          error={params.error}
          mode="signup"
          nextPath={getSafeRedirectPath(params.next)}
        />
      </main>
    </div>
  );
}
