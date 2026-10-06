import Link from "next/link";

type SiteHeaderProps = {
  userEmail?: string;
};

export function SiteHeader({ userEmail }: SiteHeaderProps) {
  return (
    <header className="border-b border-stone-200/80 bg-white/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          aria-label="StudyForge home"
          className="flex items-center gap-2.5"
          href="/"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-indigo-600 text-white">
            <svg
              aria-hidden="true"
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="M4 6.5 12 3l8 3.5v10L12 20l-8-3.5v-10Z"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="1.7"
              />
              <path
                d="m8 10 2.3 2.3L16 7"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.7"
              />
            </svg>
          </span>
          <span className="text-lg font-semibold tracking-tight text-stone-900">
            StudyForge
          </span>
        </Link>
        {userEmail ? (
          <div className="flex items-center gap-4">
            <span className="hidden max-w-48 truncate text-sm text-stone-500 sm:inline">
              {userEmail}
            </span>
            <form action="/auth/signout" method="post">
              <button
                className="rounded-lg border border-stone-200 px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                type="submit"
              >
                Log out
              </button>
            </form>
          </div>
        ) : (
          <span className="hidden text-sm text-stone-500 sm:inline">
            Turn your notes into a study session
          </span>
        )}
      </div>
    </header>
  );
}
