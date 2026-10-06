# Copilot instructions

## Product scope and flow

Use [`docs/SPEC.md`](../docs/SPEC.md) as the source of truth for the product. The app is intended to:

1. Accept a user-uploaded topic file (PDF, Word, or PowerPoint).
2. Let the user choose a quiz format, such as flash cards, essay, or multiple choice.
3. Send the file's content to an LLM to generate the quiz.
4. Let the user answer questions and show correct answers with short explanations.

Saving quizzes and authentication are explicitly out of scope.

## Architecture context

The specified flow runs from file upload through quiz-format selection and LLM generation to answering and feedback. Keep these responsibilities consistent as the implementation takes shape; consult the product spec before adding product behavior. The repository does not yet contain application code or a defined framework, so inspect the existing implementation before choosing or describing technology-specific patterns.

## Stack and architecture

- Use Next.js file based routing and monolith architecture.
- Use feature-based folder sturcture, storing every feature inside the feature folder.
- Global components that is shared across the app lives on the src/components folder.
- Use shadcn for reusable components paired with TailwindCSS for styling.

- Monolith Architecture with Next.js

## Build, test, and lint

No build, test, or lint commands are defined in the repository yet. There are also no configured test files or single-test command.

## Repository-specific conventions

- Keep implementation aligned with the scope in `docs/SPEC.md`; do not add quiz persistence or authentication without an updated product decision.
- Treat file formats and quiz types listed in the spec as the current product requirements, not as evidence of a particular library or framework.
