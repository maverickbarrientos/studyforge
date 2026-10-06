# StudyForge

StudyForge is a quiz-app scaffold built with Next.js App Router, TypeScript, Tailwind CSS, and shadcn/ui. The initial interface establishes the quiz-creation flow; file processing and LLM generation are not connected yet.

Use Node.js 20.19+, 22.12+, or 24+ for Prisma 7.9.

## Development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Checks

```bash
npm run lint
npm run build
```

There is no test runner configured yet.

## Database

StudyForge uses Supabase PostgreSQL through Prisma 7.9. Copy `.env.example` to `.env` (or `.env.local`) and replace its placeholders with connection strings from the Supabase project’s database settings. The Prisma CLI config loads `.env.local` before `.env`:

- `DATABASE_URL` is the Supavisor transaction-pooler URL for application connections (port `6543`, with `pgbouncer=true`).
- `DIRECT_URL` is read by `prisma.config.ts` for Prisma migrations and other CLI commands. Use a direct database connection URL, or Supabase’s session pooler URL (port `5432`) if direct connectivity is unavailable.

URL-encode special characters in the database password before placing it in either connection string.

Install dependencies and generate Prisma Client into `src/generated/prisma`:

```bash
npm install
npm run db:generate
```

Apply schema changes to a development database and open Prisma Studio with:

```bash
npm run db:format
npm run db:validate
npm run db:migrate
npm run db:studio
```

For deployment, apply committed migrations with `npm run db:deploy`. Do not commit `.env` or put Supabase credentials in source control.

## Authentication

Authentication uses Supabase Auth with email and password through `@supabase/ssr`. Add these Supabase project values to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://<project-ref>.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="<supabase-publishable-key>"
```

In the Supabase dashboard, disable **Confirm email** under the email provider's Auth settings so signup immediately returns an authenticated session. Set the Site URL to the app origin (for example, `http://localhost:3000`). No email-confirmation callback or redirect allow-list entry is used.

`/login` and `/signup` are public. The Next.js 16 `proxy.ts` refreshes and verifies the cookie session and redirects unauthenticated requests to `/login`; protected server pages and route handlers should also use `requireAuthenticatedUser()` from `src/lib/supabase/require-user.ts`. The `/auth/signout` route accepts same-origin `POST` requests, ends the Supabase session, and redirects to login. OAuth is not configured.

## Architecture

- `src/app/` contains Next.js App Router entry points and global styles.
- `src/app/auth/` contains public server actions and the logout route handler.
- `src/app/login/` and `src/app/signup/` contain the public auth pages.
- `src/features/auth/` contains shared authentication UI and redirect validation.
- `src/lib/supabase/` contains request-scoped clients and session/identity helpers.
- `proxy.ts` refreshes Supabase sessions and protects private routes.
- `src/features/quiz/` owns quiz-specific types and interface components.
- `src/components/` contains components shared across features.
- `src/components/ui/` is the shadcn/ui component destination.
- `src/lib/` is the shadcn utility destination.
- `prisma/schema.prisma` defines the PostgreSQL data model and generated client output.
- `prisma.config.ts` provides the direct URL to Prisma CLI commands.
- `src/lib/prisma.ts` lazily creates and caches Prisma Client with the PostgreSQL driver adapter.

Keep upload and quiz-generation services behind the quiz feature boundary as they are implemented. Saved-quiz behavior remains out of scope per [`docs/SPEC.md`](docs/SPEC.md); the schema is infrastructure and does not add a quiz-saving interface or flow.

The database model uses a quiz format enum, ordered questions with optional canonical answers and explanations, and ordered multiple-choice options with correctness flags. Uploaded file content and learner responses are not stored in this schema.
