# AI QUIZ APP

# DESCRIPTION
- An AI quiz app that creates quizzes from the file that the user uploaded.
- Users sign up and log in with email and password through Supabase Auth.
- Authenticated users can access the quiz app. Unauthenticated users are redirected to login.

# FLOW
- User signs up or logs in with email and password.
- A user will upload a file with the content of their topic, whether it be a .pdf, .word, or .ppt
- User will pick what kind of test (flash cards, essay, or multiple choice etc.) and click "Generate quiz"
- The app will then call the LLM to create a quiz from the file given.
- App generates quizzes for the user
- Users pick answers and sees which ones are correct. with a short explanation.
- User logs out; the app destroys the Supabase Auth session and redirects to login.

# OUT OF SCOPE
- saving quiz, OAuth