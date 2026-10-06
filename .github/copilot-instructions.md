# Copilot instructions

## Product scope and flow

Use [`docs/SPEC.md`](../docs/SPEC.md) as the source of truth for the product. The app is intended to:

1. Authenticate users with Supabase email/password signup and login.
2. Require authentication for the quiz app and private endpoints.
3. Accept a user-uploaded topic file (PDF, Word, or PowerPoint).
4. Let the user choose a quiz format, such as flash cards, essay, or multiple choice.
5. Send the file's content to an LLM to generate the quiz.
6. Let the user answer questions and show correct answers with short explanations.
7. Destroy the Supabase session on logout and redirect to login.

Saving quizzes and OAuth are out of scope.

## Architecture context

This is a Next.js App Router monolith. The quiz flow runs from file upload and format selection through LLM generation to answering and feedback. Keep those responsibilities within the quiz feature boundary; route entry points belong in `src/app/`.

## Stack and architecture

- Use Next.js file-based routing with the App Router and TypeScript.
- Put feature-specific UI and domain logic under `src/features/<feature>/`.
- Put components shared across features under `src/components/`; shadcn/ui primitives belong in `src/components/ui/`.
- Use Tailwind CSS for styling and shadcn/ui for reusable interface primitives.
- Keep quiz-format/domain types with the quiz feature. Add upload parsing and LLM integration behind feature-level service boundaries rather than in route components.
- Use Supabase PostgreSQL with Prisma ORM 7.9. Keep the schema in `prisma/schema.prisma`, CLI configuration in `prisma.config.ts`, and use `getPrismaClient()` from `src/lib/prisma.ts` in server-side code.
- The Prisma 7 `prisma-client` generator writes to `src/generated/prisma`; this generated directory is ignored and should be recreated with `npm run db:generate`.
- Model quiz format, questions, and answer options in Prisma; keep answer explanations with their question. Do not add saved-quiz history or a save flow until the product scope is updated.
- Use Supabase Auth with `@supabase/ssr` for email/password authentication. Create request-scoped clients in `src/lib/supabase/`; do not use service-role keys in browser or request-facing code.
- Keep login and signup public. `proxy.ts` refreshes and verifies sessions, redirects unauthenticated requests to `/login`, and redirects authenticated visitors away from the login/signup pages. Use `requireAuthenticatedUser()` for defense in depth in protected server pages and route handlers.
- Handle Supabase email-confirmation callbacks at `/auth/callback`. Logout is a same-origin `POST` to `/auth/signout`; it signs out the Supabase session and redirects to `/login`.
- OAuth providers, role-based authorization, and saved-quiz behavior are out of scope.

## Build, test, and lint

- `npm run dev` starts the local Next.js development server.
- `npm run lint` runs ESLint.
- `npm run build` creates the production build.
- `npm run db:generate` generates Prisma Client after schema changes.
- `npm run db:format` formats the Prisma schema.
- `npm run db:validate` validates the Prisma schema.
- `npm run db:migrate` creates/applies a development migration; `prisma.config.ts` loads `DIRECT_URL` from `.env.local` or `.env`.
- `npm run db:deploy` applies committed migrations in deployment environments.
- `npm run db:studio` opens Prisma Studio.
- Configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local` for auth.
- Configure Supabase Auth's Site URL and redirect allow list to include the local app origin and `/auth/callback`; add the deployed callback URL when deploying.
- No test runner or single-test command is configured yet.

## Repository-specific conventions

- Keep implementation aligned with the scope in `docs/SPEC.md`; do not add quiz persistence without an updated product decision.
- Treat supported file formats and quiz types listed in the spec as product requirements, not as evidence of a particular parsing or AI provider.
- Generation must remain clearly unimplemented until an actual upload-processing and LLM service is wired; do not present placeholder feedback as a generated quiz.
- Use `.env.example` as the connection-string template. `DATABASE_URL` is the pooled Supabase runtime URL consumed by the PostgreSQL driver adapter; `DIRECT_URL` is the direct/session-pooled URL loaded by `prisma.config.ts` for CLI migrations. Keep real credentials in ignored local environment files and out of commits.
- The Prisma schema models quiz format, ordered questions, optional answers/explanations, and ordered multiple-choice answer options. Do not add uploaded file contents or learner response/history tables without a product-scope update.
- Map the UI quiz-format values to Prisma's `QuizFormat` enum at the persistence boundary. Keep the schema as infrastructure only: do not wire generation to save/load/history behavior until saved quizzes enter product scope.
- Use Supabase Auth-managed identities and cookie sessions; do not create a duplicate Prisma user/password table. Never trust auth cookies without server-side Supabase verification.
- The Next.js 16 `proxy.ts` refreshes Supabase cookies and verifies identity with `auth.getClaims()`. Keep the `/login`, `/signup`, `/auth/callback`, and `/auth/signout` routes public; protect app pages and private endpoints, and call `requireAuthenticatedUser()` again inside protected server-side handlers.
- Treat `AuthSessionMissingError` from `getClaims()`/`getUser()` as an unauthenticated request and redirect to `/login`; it is not an internal server error. Continue to surface other verification errors.
- Map Supabase sign-in errors accurately (for example, distinguish an unconfirmed email from invalid credentials) and log only error code/name/status, never passwords, tokens, or email addresses.
- `src/lib/supabase/server.ts` creates a request-scoped server client. Only server actions and auth route handlers that need to mutate sessions should request writable cookies.
- Keep redirects same-origin using `getSafeRedirectPath()`; do not forward untrusted `next` values directly to `redirect()`.
