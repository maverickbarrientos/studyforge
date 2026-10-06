import { QuizBuilder } from "@/features/quiz/components/quiz-builder";
import { SiteHeader } from "@/components/site-header";
import { requireAuthenticatedUser } from "@/lib/supabase/require-user";

export default async function Home() {
  const user = await requireAuthenticatedUser();

  return (
    <>
      <SiteHeader userEmail={user.email} />
      <QuizBuilder />
    </>
  );
}
