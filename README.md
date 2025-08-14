# Toursona

Toursona is a quiz builder platform designed to help travel businesses understand their clients' travel personas. By using interactive quizzes, Toursona collects preferences, interests, and travel styles from users, then matches them to the most suitable travel advisors.

## Features

- **Quiz Builder:** Easily create and customize quizzes to gather client travel preferences.
- **Persona Generation:** Analyze quiz responses to build detailed travel personas for each client.
- **Advisor Matching:** Match clients to travel advisors based on their unique travel persona and preferences.
- **Admin Dashboard:** Manage quizzes, view analytics, and oversee advisor-client matches.
- **Viewer Experience:** Clients can take quizzes and receive personalized travel recommendations.

## How It Works

1. **Create Quizzes:** Admins build quizzes tailored to different travel interests and styles.
2. **Collect Responses:** Clients complete quizzes, sharing their travel preferences and goals.
3. **Build Personas:** Toursona analyzes responses to generate a travel persona for each client.
4. **Match Advisors:** The platform matches clients to travel advisors who best fit their persona.

## Getting Started

1. Clone the repository:
   ```sh
   git clone git@github.com:fora-mealeyst/toursona.git
   ```
2. Install `mongodb`:
   ```sh
   brew tap mongodb/brew
   brew update
   brew install mongodb-community@8.0
   ```

3. Start `mongodb`:
   ```sh
   brew services start mongodb/brew/mongodb-community
   ```

4. Install npm dependencies for the workspaces:
   ```sh
   npm install
   npm run dev
   ```
5. Start the development servers as needed.

## Project Structure

- `quiz-admin/` — Admin dashboard for quiz management
- `quiz-viewer/` — Client-facing quiz experience
- `server/` — Backend API and data processing

## License

MIT
