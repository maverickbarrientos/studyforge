# StudyForge

StudyForge is a quiz-app scaffold built with Next.js App Router, TypeScript, Tailwind CSS, and shadcn/ui. The initial interface establishes the quiz-creation flow; file processing and LLM generation are not connected yet.

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

## Architecture

- `src/app/` contains Next.js App Router entry points and global styles.
- `src/features/quiz/` owns quiz-specific types and interface components.
- `src/components/` contains components shared across features.
- `src/components/ui/` is the shadcn/ui component destination.
- `src/lib/` is the shadcn utility destination.

Keep upload and quiz-generation services behind the quiz feature boundary as they are implemented. Quiz persistence and authentication are out of scope per [`docs/SPEC.md`](docs/SPEC.md).
