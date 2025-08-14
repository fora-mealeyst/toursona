# Server - TypeScript Migration

This server has been migrated from JavaScript to TypeScript to provide better type safety and developer experience.

## Features

- **TypeScript**: Full TypeScript support with strict type checking
- **Express.js**: RESTful API server
- **MongoDB**: Database with Mongoose ODM
- **ES Modules**: Modern ES module imports/exports
- **Jest Testing**: Unit tests with TypeScript support

## Project Structure

```
server/
├── dist/           # Compiled JavaScript output
├── models/         # Mongoose models
│   ├── Quiz.ts
│   └── QuizAnswer.ts
├── routes/         # Express routes
│   ├── quizzes.ts
│   └── quizzes.test.ts
├── types/          # TypeScript type definitions
│   └── index.ts
├── index.ts        # Main server entry point
├── package.json    # Dependencies and scripts
└── tsconfig.json   # TypeScript configuration
```

## Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled server
- `npm run dev` - Run development server with hot reload
- `npm test` - Run unit tests

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. The server will run on `http://localhost:4000`

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/quizzes/:id` - Get quiz by ID
- `POST /api/quizzes` - Create new quiz
- `PATCH /api/quizzes/:id` - Update quiz
- `DELETE /api/quizzes/:id` - Delete quiz
- `POST /api/quizzes/:id/answers` - Submit quiz answers

## TypeScript Benefits

- **Type Safety**: Catch errors at compile time
- **Better IDE Support**: Enhanced autocomplete and refactoring
- **Interface Definitions**: Clear contracts for data structures
- **Modern JavaScript**: Use latest ES features with type safety

## Migration Notes

The migration from JavaScript to TypeScript included:

1. **Package Updates**: Added TypeScript and type definitions
2. **File Extensions**: Changed from `.js` to `.ts`
3. **Import/Export**: Converted to ES modules
4. **Type Definitions**: Added interfaces for all data structures
5. **Error Handling**: Improved error handling with proper types
6. **Testing**: Updated tests to work with TypeScript

## Environment Variables

- `PORT` - Server port (default: 4000)
- `MONGODB_URI` - MongoDB connection string (default: mongodb://localhost:27017/quizdb)
- `NODE_ENV` - Environment (development/production)
