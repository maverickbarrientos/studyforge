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

export type QuizOption = {
  text: string;
  isCorrect: boolean;
};

export type QuizQuestion = {
  prompt: string;
  options: QuizOption[];
  answer: string;
  explanation: string;
};

export type GeneratedQuiz = {
  title: string;
  format: QuizFormat;
  questions: QuizQuestion[];
};

export function isQuizOption(value: unknown): value is QuizOption {
  return (
    typeof value === "object" &&
    value !== null &&
    "text" in value &&
    typeof value.text === "string" &&
    Boolean(value.text.trim()) &&
    "isCorrect" in value &&
    typeof value.isCorrect === "boolean"
  );
}

export function isQuizQuestion(
  value: unknown,
  format: QuizFormat,
): value is QuizQuestion {
  if (
    typeof value !== "object" ||
    value === null ||
    !("prompt" in value) ||
    typeof value.prompt !== "string" ||
    !value.prompt.trim() ||
    !("answer" in value) ||
    typeof value.answer !== "string" ||
    !value.answer.trim() ||
    !("explanation" in value) ||
    typeof value.explanation !== "string" ||
    !value.explanation.trim() ||
    !("options" in value) ||
    !Array.isArray(value.options) ||
    !value.options.every(isQuizOption)
  ) {
    return false;
  }

  if (format !== "multiple-choice") {
    return value.options.length === 0;
  }

  return (
    value.options.length === 4 &&
    new Set(value.options.map((option) => option.text.trim().toLowerCase())).size ===
      4 &&
    value.options.filter((option) => option.isCorrect).length === 1 &&
    value.options.find((option) => option.isCorrect)?.text === value.answer
  );
}

export function isGeneratedQuiz(value: unknown): value is GeneratedQuiz {
  if (
    typeof value !== "object" ||
    value === null ||
    !("title" in value) ||
    typeof value.title !== "string" ||
    !value.title.trim() ||
    !("format" in value) ||
    !isQuizFormat(value.format) ||
    !("questions" in value) ||
    !Array.isArray(value.questions) ||
    value.questions.length === 0
  ) {
    return false;
  }

  const format = value.format;
  return value.questions.every((question) =>
    isQuizQuestion(question, format),
  );
}

export function isQuizFormat(value: unknown): value is QuizFormat {
  return (
    typeof value === "string" &&
    quizFormats.some((format) => format.value === value)
  );
}
