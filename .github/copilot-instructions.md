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

## Build, test, and lint

- `npm run dev` starts the local Next.js development server.
- `npm run lint` runs ESLint.
- `npm run build` creates the production build.
- No test runner or single-test command is configured yet.

## Repository-specific conventions

- Keep implementation aligned with the scope in `docs/SPEC.md`; do not add quiz persistence or authentication without an updated product decision.
- Treat supported file formats and quiz types listed in the spec as product requirements, not as evidence of a particular parsing or AI provider.
- Generation must remain clearly unimplemented until an actual upload-processing and LLM service is wired; do not present placeholder feedback as a generated quiz.
