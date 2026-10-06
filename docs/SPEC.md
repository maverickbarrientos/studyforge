# AI QUIZ APP

# DESCRIPTION
- An AI quiz app that creates quizzes from the file that the user uploaded.
- Users sign up and log in immediately with email and password through Supabase Auth (email confirmation disabled).
- Authenticated users can access the quiz app. Unauthenticated users are redirected to login.

# FLOW
- User signs up or logs in with email and password and receives an authenticated session.
- An authenticated user uploads a PDF, DOCX, or PPTX file no larger than 5 MB.
- Extracted text must contain no more than 2,000 words; files over that limit are rejected rather than silently truncated.
- The user chooses a quiz format (multiple choice, flash cards, or essay) and a question-count range from 5 to 20.
- The server sends the extracted text to OpenRouter using Gemini 3.1 Flash Lite to generate a quiz focused on important concepts.
- The app displays the generated quiz without saving the uploaded file, extracted text, quiz, or learner responses.
- Users answer multiple-choice questions, reveal flash-card answers, or write essay responses. The app shows the correct/sample answer and a short explanation.
- User logs out; the app destroys the Supabase Auth session and redirects to login.

# OUT OF SCOPE
- saving quizzes or learner responses, OAuth, OCR for scanned documents

# QUIZ GENERATION CONFIGURATION
- Set `OPENROUTER_API_KEY` in the server environment. It must not be exposed through a `NEXT_PUBLIC_` variable.
- The OpenRouter model is `google/gemini-3.1-flash-lite-preview`.
- Quiz generation is available only to authenticated users. The API validates file type, file size, extracted word count, format, selected question range, and generated response before returning a quiz.