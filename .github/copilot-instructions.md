# Copilot instructions

## Product scope and flow

Use [`docs/SPEC.md`](../docs/SPEC.md) as the source of truth for the product. The app is intended to:

1. Accept a user-uploaded topic file (PDF, Word, or PowerPoint).
2. Let the user choose a quiz format, such as flash cards, essay, or multiple choice.
3. Send the file's content to an LLM to generate the quiz.
4. Let the user answer questions and show correct answers with short explanations.

Saving quizzes and authentication are explicitly out of scope.

## Architecture context

This is a Next.js App Router monolith. The quiz flow runs from file upload and format selection through LLM generation to answering and feedback. Keep those responsibilities within the quiz feature boundary; route entry points belong in `src/app/`.

## Stack and architecture

- Use Next.js file-based routing with the App Router and TypeScript.
- Put feature-specific UI and domain logic under `src/features/<feature>/`.
- Put components shared across features under `src/components/`; shadcn/ui primitives belong in `src/components/ui/`.
- Use Tailwind CSS for styling and shadcn/ui for reusable interface primitives.
- Keep quiz-format/domain types with the quiz feature. Add upload parsing and LLM integration behind feature-level service boundaries rather than in route components.
- Use Supabase PostgreSQL with Prisma ORM. Keep the Prisma schema in `prisma/schema.prisma` and use the shared Prisma client from `src/lib/prisma.ts` in server-side code.
- Model quiz format, questions, and answer options in Prisma; keep answer explanations with their question. Do not add authentication, ownership, saved-quiz history, or a save flow until the product scope is updated.

## Build, test, and lint

- `npm run dev` starts the local Next.js development server.
- `npm run lint` runs ESLint.
- `npm run build` creates the production build.
- `npm run db:generate` generates Prisma Client after schema changes.
- `npm run db:format` formats the Prisma schema.
- `npm run db:validate` validates the Prisma schema.
- `npm run db:migrate` creates/applies a development migration; it requires `DIRECT_URL`.
- `npm run db:deploy` applies committed migrations in deployment environments.
- `npm run db:studio` opens Prisma Studio.
- No test runner or single-test command is configured yet.

## Repository-specific conventions

- Keep implementation aligned with the scope in `docs/SPEC.md`; do not add quiz persistence or authentication without an updated product decision.
- Treat supported file formats and quiz types listed in the spec as product requirements, not as evidence of a particular parsing or AI provider.
- Generation must remain clearly unimplemented until an actual upload-processing and LLM service is wired; do not present placeholder feedback as a generated quiz.
- Use `.env.example` as the connection-string template. `DATABASE_URL` is the pooled Supabase runtime URL; `DIRECT_URL` is the direct/session-pooled URL used by Prisma CLI migrations. Keep real credentials in ignored local environment files and out of commits.
- The Prisma schema models quiz format, ordered questions, optional answers/explanations, and ordered multiple-choice answer options. Do not add uploaded file contents or learner response/history tables without a product-scope update.
- Map the UI quiz-format values to Prisma's `QuizFormat` enum at the persistence boundary. Keep the schema as infrastructure only: do not wire generation to save/load/history behavior until authentication and saved quizzes enter product scope.
