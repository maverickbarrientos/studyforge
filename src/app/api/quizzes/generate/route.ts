import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/supabase/require-user";
import {
  DocumentValidationError,
  extractDocumentText,
} from "@/features/quiz/services/document-extractor";
import {
  generateQuiz,
  QuizGenerationError,
} from "@/features/quiz/services/generate-quiz";
import { isQuizFormat } from "@/features/quiz/types";

export const runtime = "nodejs";
export const maxDuration = 90;

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return jsonError("Sign in to generate a quiz.", 401);
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return jsonError("Submit a valid quiz generation request.", 400);
    }

    const file = formData.get("file");
    const format = formData.get("format");
    const minQuestions = Number(formData.get("minQuestions"));
    const maxQuestions = Number(formData.get("maxQuestions"));

    if (!(file instanceof File)) {
      return jsonError("Choose a study file to generate a quiz.", 400);
    }

    if (
      !isQuizFormat(format) ||
      !Number.isInteger(minQuestions) ||
      !Number.isInteger(maxQuestions) ||
      minQuestions < 5 ||
      maxQuestions > 20 ||
      minQuestions > maxQuestions
    ) {
      return jsonError(
        "Choose a valid quiz format and a question range from 5 to 20.",
        400,
      );
    }

    const { text, wordCount } = await extractDocumentText(file);
    const quiz = await generateQuiz({
      text,
      format,
      minQuestions,
      maxQuestions,
    });

    return NextResponse.json({ quiz, wordCount });
  } catch (error) {
    if (error instanceof DocumentValidationError) {
      return jsonError(error.message, error.status);
    }

    if (error instanceof QuizGenerationError) {
      return jsonError(error.message, error.status);
    }

    console.error(
      "Quiz generation failed:",
      error instanceof Error ? error.name : "Unknown error",
    );
    return jsonError("Quiz generation failed. Please try again.", 500);
  }
}
