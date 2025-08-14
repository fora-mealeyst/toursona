# Quiz Admin Dashboard

A React-based admin interface for managing and viewing quiz responses from your quiz viewer application.

## Features

- **View All Quizzes**: See all available quizzes in your system
- **Create New Quizzes**: Build quizzes with multiple steps and various input types
- **Edit Existing Quizzes**: Modify quiz structure, steps, and inputs
- **View Quiz Responses**: Detailed view of all responses for each quiz
- **Delete Quizzes**: Remove quizzes from the system
- **Real-time Data**: Connected to your MongoDB database via the Express server

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Development Server**:
   ```bash
   npm run dev
   ```

3. **Access the Admin Dashboard**:
   Open your browser and go to `http://localhost:3001`

## Prerequisites

Make sure you have the following services running:

1. **MongoDB Server** (port 27017):
   ```bash
   brew services start mongodb/brew/mongodb-community
   ```

2. **Express API Server** (port 4000):
   ```bash
   cd ../server
   npm run dev
   ```

3. **Quiz Viewer** (optional, for testing):
   ```bash
   cd ../quiz-viewer
   npm run dev
   ```

## How It Works

The quiz admin connects to your existing Express server API to:

1. **Fetch Quizzes**: Gets all quizzes from the database
2. **Fetch Answers**: Retrieves all responses for a specific quiz
3. **Delete Quizzes**: Removes quizzes from the system

## API Endpoints Used

- `GET /api/quizzes` - Get all quizzes
- `GET /api/quizzes/:id` - Get a specific quiz
- `POST /api/quizzes` - Create a new quiz
- `PUT /api/quizzes/:id` - Update a quiz
- `GET /api/quizzes/:id/answers` - Get all answers for a quiz
- `DELETE /api/quizzes/:id` - Delete a quiz

## File Structure

```
quiz-admin/
├── src/
│   ├── components/
│   │   ├── LoadingSpinner.tsx
│   │   ├── QuizList.tsx
│   │   └── QuizAnswers.tsx
│   ├── api.ts
│   ├── types.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── vite.config.ts
```

## Usage

1. **View Quizzes**: The dashboard shows all available quizzes with their basic information
2. **Create Quiz**: Click "Create New Quiz" to build a new quiz with steps and inputs
3. **Edit Quiz**: Click "Edit" on any quiz to modify its structure and content
4. **View Responses**: Click on any quiz to see detailed responses from users
5. **Delete Quiz**: Use the delete button to remove quizzes (with confirmation)
6. **Navigate**: Use the back button to return to the quiz list

## Quiz Editor Features

The quiz editor allows you to:

- **Add/Remove Steps**: Create multi-step quizzes
- **Configure Inputs**: Add various input types:
  - Text Input
  - Text Area
  - Radio Buttons
  - Checkboxes
  - Dropdown Select
  - Number Input
  - Email Input
  - URL Input
- **Set Options**: For radio, checkbox, and select inputs, define custom options
- **Required Fields**: Mark inputs as required
- **Field Names**: Set unique field identifiers for data collection

## Development

- **Port**: 3001 (different from quiz viewer)
- **Proxy**: API requests are proxied to `http://localhost:4000`
- **Styling**: Uses Tailwind CSS for styling
- **TypeScript**: Full TypeScript support with proper type definitions
