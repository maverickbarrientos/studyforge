import { OfficeParser } from "officeparser";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_WORD_COUNT = 2_000;

export class DocumentValidationError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "DocumentValidationError";
  }
}

export async function extractDocumentText(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (
    extension !== "pdf" &&
    extension !== "docx" &&
    extension !== "pptx"
  ) {
    throw new DocumentValidationError(
      "Upload a PDF, DOCX, or PPTX file.",
      415,
    );
  }

  if (file.size === 0) {
    throw new DocumentValidationError("The uploaded file is empty.", 400);
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new DocumentValidationError(
      "The file must not exceed 5 MB.",
      413,
    );
  }

  let ast: Awaited<ReturnType<typeof OfficeParser.parseOffice>>;
  try {
    ast = await OfficeParser.parseOffice(
      new Uint8Array(await file.arrayBuffer()),
      { abortSignal: AbortSignal.timeout(15_000) },
    );
  } catch (error) {
    console.error(
      "Document extraction failed:",
      error instanceof Error ? error.name : "Unknown error",
    );
    throw new DocumentValidationError(
      "The file could not be read. Check that it is a valid PDF, DOCX, or PPTX.",
      422,
    );
  }

  if (ast.type !== extension) {
    throw new DocumentValidationError(
      "The file contents do not match its file extension.",
      415,
    );
  }

  const text = ast.toText().trim();
  const wordCount = text.match(/\S+/gu)?.length ?? 0;

  if (wordCount === 0) {
    throw new DocumentValidationError(
      "No readable text was found in the file.",
      422,
    );
  }

  if (wordCount > MAX_WORD_COUNT) {
    throw new DocumentValidationError(
      `The document contains ${wordCount.toLocaleString()} words. The maximum is 2,000.`,
      422,
    );
  }

  return { text, wordCount };
}
