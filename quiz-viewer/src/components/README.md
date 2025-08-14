# Quiz Viewer Components

This directory contains the React components for the quiz viewer application, organized into smaller, reusable components.

## Component Structure

### Core Components

- **`App.tsx`** - Main application component that orchestrates the quiz flow
- **`Field.tsx`** - Dispatcher component that renders the appropriate field type
- **`QuizForm.tsx`** - Handles form submission and navigation between steps
- **`QuizStep.tsx`** - Renders individual quiz steps with their fields

### Field Components

- **`RadioField.tsx`** - Renders radio button input fields
- **`TextField.tsx`** - Renders text input fields

### UI Components

- **`LoadingSpinner.tsx`** - Loading indicator with spinner animation
- **`ErrorMessage.tsx`** - Error display component
- **`QuizComplete.tsx`** - Quiz completion message

### Hooks

- **`useQuiz.ts`** - Custom hook that manages quiz state, API calls, and form handling

### Constants

- **`constants.ts`** - Centralized configuration (API endpoints, etc.)

## Architecture Benefits

1. **Separation of Concerns**: Each component has a single responsibility
2. **Reusability**: Components can be easily reused across different parts of the app
3. **Maintainability**: Smaller components are easier to understand and modify
4. **Testability**: Individual components can be tested in isolation
5. **Type Safety**: Strong TypeScript typing throughout the component hierarchy

## Component Hierarchy

```
App
├── LoadingSpinner (when loading)
├── ErrorMessage (when error)
├── QuizComplete (when submitted)
└── QuizForm
    └── QuizStep
        └── Field
            ├── RadioField
            └── TextField
```

## Usage

All components are exported through the `index.ts` file for clean imports:

```typescript
import { 
  LoadingSpinner, 
  ErrorMessage, 
  QuizComplete, 
  QuizForm 
} from './components';
```

## Adding New Field Types

To add a new field type:

1. Create a new component (e.g., `CheckboxField.tsx`)
2. Add the new type to the `QuizField` interface in `types.ts`
3. Update the `Field.tsx` dispatcher to handle the new type
4. Export the new component from `index.ts`
