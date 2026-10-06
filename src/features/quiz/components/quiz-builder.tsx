"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GeneratedQuizView } from "@/features/quiz/components/generated-quiz";
import {
  isGeneratedQuiz,
  quizFormats,
  type GeneratedQuiz,
  type QuizFormat,
} from "@/features/quiz/types";

const acceptedFileTypes = ".pdf,.docx,.pptx";
const questionCounts = Array.from({ length: 16 }, (_, index) => index + 5);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function QuizBuilder() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<QuizFormat>("multiple-choice");
  const [minQuestions, setMinQuestions] = useState(5);
  const [maxQuestions, setMaxQuestions] = useState(10);
  const [quiz, setQuiz] = useState<GeneratedQuiz | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setMessage("Choose a PDF, DOCX, or PPTX file first.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("The file must not exceed 5 MB.");
      return;
    }

    setIsGenerating(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("format", format);
      formData.set("minQuestions", String(minQuestions));
      formData.set("maxQuestions", String(maxQuestions));

      const response = await fetch("/api/quizzes/generate", {
        method: "POST",
        body: formData,
      });

      if (response.redirected) {
        router.replace("/login");
        return;
      }

      let payload: unknown;
      try {
        payload = await response.json();
      } catch {
        throw new Error("The server returned an invalid response. Please try again.");
      }

      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      if (!response.ok) {
        const errorMessage =
          isRecord(payload) && typeof payload.error === "string"
            ? payload.error
            : "Quiz generation failed. Please try again.";
        throw new Error(errorMessage);
      }

      if (
        !isRecord(payload) ||
        !isGeneratedQuiz(payload.quiz) ||
        payload.quiz.format !== format
      ) {
        throw new Error("The server returned an invalid quiz. Please try again.");
      }

      setQuiz(payload.quiz);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Quiz generation failed. Please try again.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  if (quiz) {
    return (
      <GeneratedQuizView
        onCreateAnother={() => setQuiz(null)}
        quiz={quiz}
      />
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f8f8f6] text-stone-900">
      <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-indigo-700">
            <span className="size-1.5 rounded-full bg-indigo-500" />
            Your study space
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
            Make studying
            <span className="text-indigo-600"> click.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-stone-600">
            Add your course material, choose how you want to practice, and get
            ready to learn on your terms.
          </p>
        </div>

        <form
          className="mx-auto mt-10 max-w-2xl rounded-3xl border border-stone-200 bg-white p-5 shadow-[0_18px_60px_-40px_rgba(28,25,23,0.25)] sm:p-8"
          onSubmit={handleSubmit}
        >
          <section aria-labelledby="upload-heading">
            <div className="flex items-center gap-3">
              <span className="grid size-8 place-items-center rounded-full bg-stone-100 text-sm font-semibold text-stone-700">
                1
              </span>
              <div>
                <h2
                  className="text-base font-semibold text-stone-900"
                  id="upload-heading"
                >
                  Add your study material
                </h2>
                <p className="mt-0.5 text-sm text-stone-500">
                  Start with a document you want to learn from.
                </p>
              </div>
            </div>

            <label className="mt-5 flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-stone-50/70 px-5 py-7 text-center transition hover:border-indigo-300 hover:bg-indigo-50/40 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2">
              <span className="grid size-11 place-items-center rounded-xl bg-white text-indigo-600 shadow-sm ring-1 ring-stone-200">
                <svg
                  aria-hidden="true"
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14.5v3A2.5 2.5 0 0 0 7.5 20h9a2.5 2.5 0 0 0 2.5-2.5v-3"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.7"
                  />
                </svg>
              </span>
              <span className="mt-3 text-sm font-semibold text-stone-800">
                {file ? file.name : "Choose a file to upload"}
              </span>
              <span className="mt-1 text-xs text-stone-500">
                PDF, DOCX, or PPTX · up to 5 MB
              </span>
              <input
                accept={acceptedFileTypes}
                className="sr-only"
                onChange={(event) => {
                  setFile(event.target.files?.[0] ?? null);
                  setMessage("");
                }}
                required
                type="file"
              />
            </label>
          </section>

          <section aria-labelledby="format-heading" className="mt-8">
            <div className="flex items-center gap-3">
              <span className="grid size-8 place-items-center rounded-full bg-stone-100 text-sm font-semibold text-stone-700">
                2
              </span>
              <div>
                <h2
                  className="text-base font-semibold text-stone-900"
                  id="format-heading"
                >
                  Choose a quiz format
                </h2>
                <p className="mt-0.5 text-sm text-stone-500">
                  Pick a format that fits your study session.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {quizFormats.map((option) => (
                <label
                  className={`cursor-pointer rounded-2xl border p-4 transition focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 ${
                    format === option.value
                      ? "border-indigo-500 bg-indigo-50/70 ring-1 ring-indigo-500"
                      : "border-stone-200 bg-white hover:border-stone-300"
                  }`}
                  key={option.value}
                >
                  <input
                    checked={format === option.value}
                    className="sr-only"
                    name="format"
                    onChange={() => {
                      setFormat(option.value);
                      setMessage("");
                    }}
                    type="radio"
                    value={option.value}
                  />
                  <span className="block text-sm font-semibold text-stone-900">
                    {option.label}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-stone-500">
                    {option.description}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section aria-labelledby="question-count-heading" className="mt-8">
            <div className="flex items-center gap-3">
              <span className="grid size-8 place-items-center rounded-full bg-stone-100 text-sm font-semibold text-stone-700">
                3
              </span>
              <div>
                <h2
                  className="text-base font-semibold text-stone-900"
                  id="question-count-heading"
                >
                  Choose a question range
                </h2>
                <p className="mt-0.5 text-sm text-stone-500">
                  The quiz will focus on key concepts and include 5–20 questions.
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-end gap-3">
              <label className="text-sm font-medium text-stone-700">
                At least
                <select
                  className="mt-2 h-11 w-full rounded-xl border border-stone-300 bg-white px-3 text-sm text-stone-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    setMinQuestions(value);
                    if (value > maxQuestions) setMaxQuestions(value);
                  }}
                  value={minQuestions}
                >
                  {questionCounts.map((count) => (
                    <option key={count} value={count}>
                      {count}
                    </option>
                  ))}
                </select>
              </label>
              <span className="pb-3 text-sm text-stone-500">to</span>
              <label className="text-sm font-medium text-stone-700">
                Up to
                <select
                  className="mt-2 h-11 w-full rounded-xl border border-stone-300 bg-white px-3 text-sm text-stone-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    setMaxQuestions(value);
                    if (value < minQuestions) setMinQuestions(value);
                  }}
                  value={maxQuestions}
                >
                  {questionCounts.map((count) => (
                    <option key={count} value={count}>
                      {count}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <div className="mt-8 border-t border-stone-100 pt-6">
            <Button
              className="h-auto w-full rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-stone-300"
              disabled={!file || isGenerating}
              size="lg"
              type="submit"
            >
              {isGenerating ? "Generating your quiz..." : "Generate my quiz"}
              <svg
                aria-hidden="true"
                className={`size-4 ${isGenerating ? "animate-pulse" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M5 12h14m-6-6 6 6-6 6"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
              </svg>
            </Button>
            <p
              aria-live="polite"
              className={`mt-3 min-h-5 text-center text-xs ${
                message ? "text-red-700" : "text-stone-500"
              }`}
              role={message ? "alert" : "status"}
            >
              {message ||
                (isGenerating
                  ? "Reading your material and preparing questions..."
                  : "Your study material is processed securely and is not saved.")}
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
