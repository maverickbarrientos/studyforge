export const quizFormats = [
  {
    value: "multiple-choice",
    label: "Multiple choice",
    description: "Choose the best answer",
  },
  {
    value: "flash-cards",
    label: "Flash cards",
    description: "Review one concept at a time",
  },
  {
    value: "essay",
    label: "Essay",
    description: "Practice written responses",
  },
] as const;

export type QuizFormat = (typeof quizFormats)[number]["value"];
