"use client";

import { useState } from "react";
import type { GeneratedQuiz } from "@/features/quiz/types";

export function GeneratedQuizView({
  quiz,
  onCreateAnother,
}: {
  quiz: GeneratedQuiz;
  onCreateAnother: () => void;
}) {
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({});
  const [revealedAnswers, setRevealedAnswers] = useState<
    Record<number, boolean>
  >({});
  const [writtenAnswers, setWrittenAnswers] = useState<Record<number, string>>(
    {},
  );

  return (
    <main className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-indigo-600">
            {quiz.questions.length} questions ·{" "}
            {quiz.format.replace("-", " ")}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950">
            {quiz.title}
          </h1>
        </div>
        <button
          className="rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={onCreateAnother}
          type="button"
        >
          Create another quiz
        </button>
      </div>

      <ol className="space-y-5">
        {quiz.questions.map((question, questionIndex) => {
          const selectedOption = selectedAnswers[questionIndex];
          const answerRevealed = revealedAnswers[questionIndex] ?? false;

          return (
            <li
              className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7"
              key={`${questionIndex}-${question.prompt}`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-500">
                Question {questionIndex + 1}
              </p>
              <h2 className="mt-2 text-lg font-semibold leading-7 text-stone-900">
                {question.prompt}
              </h2>

              {quiz.format === "multiple-choice" ? (
                <div className="mt-5 space-y-2.5">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = selectedOption === optionIndex;
                    const showCorrect = selectedOption !== undefined && option.isCorrect;
                    const showIncorrect = isSelected && !option.isCorrect;

                    return (
                      <button
                        aria-pressed={isSelected}
                        className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                          showCorrect
                            ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                            : showIncorrect
                              ? "border-red-300 bg-red-50 text-red-950"
                              : isSelected
                                ? "border-indigo-400 bg-indigo-50 text-indigo-950"
                                : "border-stone-200 bg-white text-stone-700 hover:border-stone-300"
                        }`}
                        key={`${optionIndex}-${option.text}`}
                        onClick={() =>
                          setSelectedAnswers((current) => ({
                            ...current,
                            [questionIndex]: optionIndex,
                          }))
                        }
                        type="button"
                      >
                        <span className="mr-3 font-semibold">
                          {String.fromCharCode(65 + optionIndex)}.
                        </span>
                        {option.text}
                        {showCorrect && (
                          <span className="ml-2 font-semibold">Correct</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : quiz.format === "flash-cards" ? (
                <div className="mt-5">
                  <button
                    aria-expanded={answerRevealed}
                    className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() =>
                      setRevealedAnswers((current) => ({
                        ...current,
                        [questionIndex]: !answerRevealed,
                      }))
                    }
                    type="button"
                  >
                    {answerRevealed ? "Hide answer" : "Reveal answer"}
                  </button>
                  {answerRevealed && (
                    <AnswerFeedback
                      answer={question.answer}
                      explanation={question.explanation}
                    />
                  )}
                </div>
              ) : (
                <div className="mt-5">
                  <label
                    className="sr-only"
                    htmlFor={`essay-answer-${questionIndex}`}
                  >
                    Your response to question {questionIndex + 1}
                  </label>
                  <textarea
                    className="min-h-28 w-full rounded-xl border border-stone-300 px-4 py-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    id={`essay-answer-${questionIndex}`}
                    onChange={(event) =>
                      setWrittenAnswers((current) => ({
                        ...current,
                        [questionIndex]: event.target.value,
                      }))
                    }
                    placeholder="Write your response here..."
                    value={writtenAnswers[questionIndex] ?? ""}
                  />
                  <button
                    aria-expanded={answerRevealed}
                    className="mt-3 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() =>
                      setRevealedAnswers((current) => ({
                        ...current,
                        [questionIndex]: !answerRevealed,
                      }))
                    }
                    type="button"
                  >
                    {answerRevealed ? "Hide sample response" : "Show sample response"}
                  </button>
                  {answerRevealed && (
                    <AnswerFeedback
                      answer={question.answer}
                      explanation={question.explanation}
                    />
                  )}
                </div>
              )}

              {quiz.format === "multiple-choice" &&
                selectedOption !== undefined && (
                  <AnswerFeedback
                    answer={question.answer}
                    explanation={question.explanation}
                  />
                )}
            </li>
          );
        })}
      </ol>
    </main>
  );
}

function AnswerFeedback({
  answer,
  explanation,
}: {
  answer: string;
  explanation: string;
}) {
  return (
    <div className="mt-4 rounded-xl bg-stone-50 px-4 py-3.5 text-sm text-stone-700">
      <p>
        <span className="font-semibold text-stone-900">Answer: </span>
        {answer}
      </p>
      <p className="mt-1.5 leading-6">
        <span className="font-semibold text-stone-900">Why: </span>
        {explanation}
      </p>
    </div>
  );
}
