import React, { useState, useEffect } from 'react';
import { quizApi } from './api';
import { IQuiz, IQuizAnswer, CreateQuizRequest } from './types';
import QuizList from './components/QuizList';
import QuizAnswers from './components/QuizAnswers';
import QuizEditor from './components/QuizEditor';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [quizzes, setQuizzes] = useState<IQuiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<IQuiz | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<IQuizAnswer[]>([]);
  const [editingQuiz, setEditingQuiz] = useState<IQuiz | null>(null);
  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const data = await quizApi.getQuizzes();
      setQuizzes(data);
      setError(null);
    } catch (err) {
      setError('Failed to load quizzes');
      console.error('Error loading quizzes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizSelect = async (quiz: IQuiz) => {
    try {
      setLoading(true);
      const answers = await quizApi.getQuizAnswers(quiz._id);
      setSelectedQuiz(quiz);
      setQuizAnswers(answers);
      setError(null);
    } catch (err) {
      setError('Failed to load quiz answers');
      console.error('Error loading quiz answers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    setSelectedQuiz(null);
    setQuizAnswers([]);
    setEditingQuiz(null);
    setIsCreatingQuiz(false);
  };

  const handleDeleteQuiz = async (quizId: string) => {
    try {
      await quizApi.deleteQuiz(quizId);
      await loadQuizzes();
      if (selectedQuiz?._id === quizId) {
        setSelectedQuiz(null);
        setQuizAnswers([]);
      }
      if (editingQuiz?._id === quizId) {
        setEditingQuiz(null);
      }
    } catch (err) {
      setError('Failed to delete quiz');
      console.error('Error deleting quiz:', err);
    }
  };

  const handleEditQuiz = (quiz: IQuiz) => {
    setEditingQuiz(quiz);
  };

  const handleCreateQuiz = () => {
    setIsCreatingQuiz(true);
  };

  const handleSaveQuiz = async (quizData: CreateQuizRequest) => {
    try {
      setLoading(true);
      if (editingQuiz) {
        await quizApi.updateQuiz(editingQuiz._id, quizData);
      } else {
        await quizApi.createQuiz(quizData);
      }
      await loadQuizzes();
      setEditingQuiz(null);
      setIsCreatingQuiz(false);
      setError(null);
    } catch (err) {
      setError(editingQuiz ? 'Failed to update quiz' : 'Failed to create quiz');
      console.error('Error saving quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Quiz Admin Dashboard</h1>
          <p className="text-gray-600">Manage and view quiz responses from your quiz viewer</p>
        </header>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {editingQuiz || isCreatingQuiz ? (
          <QuizEditor
            quiz={editingQuiz}
            onSave={handleSaveQuiz}
            onCancel={handleBackToList}
          />
        ) : selectedQuiz ? (
          <QuizAnswers
            quiz={selectedQuiz}
            answers={quizAnswers}
            onBack={handleBackToList}
          />
        ) : (
          <QuizList
            quizzes={quizzes}
            onQuizSelect={handleQuizSelect}
            onDeleteQuiz={handleDeleteQuiz}
            onEditQuiz={handleEditQuiz}
            onCreateQuiz={handleCreateQuiz}
          />
        )}
      </div>
    </div>
  );
}

export default App;
