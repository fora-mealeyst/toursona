import React from 'react';
import { IQuiz } from '../types';

interface QuizListProps {
  quizzes: IQuiz[];
  onQuizSelect: (quiz: IQuiz) => void;
  onDeleteQuiz: (quizId: string) => void;
  onEditQuiz: (quiz: IQuiz) => void;
  onCreateQuiz: () => void;
}

const QuizList: React.FC<QuizListProps> = ({ quizzes, onQuizSelect, onDeleteQuiz, onEditQuiz, onCreateQuiz }) => {
  const handleDelete = (e: React.MouseEvent, quizId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      onDeleteQuiz(quizId);
    }
  }; 

  if (quizzes.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No quizzes found</h3>
        <p className="text-gray-500">Create some quizzes in your quiz viewer to see them here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Available Quizzes</h2>
        <button
          onClick={onCreateQuiz}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
        >
          + Create New Quiz
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <div
            key={quiz._id}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onQuizSelect(quiz)}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{quiz.title}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditQuiz(quiz);
                  }}
                  className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => handleDelete(e, quiz._id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-3">
              <p>Steps: {quiz.steps.length}</p>
              <p>Created: {new Date(quiz.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="text-blue-600 text-sm font-medium">
              Click to view answers →
            </div>
          </div>
        ))}
      </div>
    </div>
  ); 
};

export default QuizList;
