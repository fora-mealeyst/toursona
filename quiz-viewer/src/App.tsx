import { useQuiz } from './hooks';
import { 
  LoadingSpinner, 
  ErrorMessage, 
  QuizResults, 
  QuizForm 
} from './components';

const App = () => {
  const {
    quiz,
    form,
    step,
    submitted,
    error,
    loading,
    scoringResult,
    handleChange,
    handleNext,
    handlePrevious,
    handleRetake,
  } = useQuiz();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!quiz) return <LoadingSpinner />;
  if (submitted && scoringResult) return <QuizResults result={scoringResult} onRetake={handleRetake} />;
  if (submitted) return <div className="text-center py-12">Calculating your results...</div>;

  const currentStep = quiz.steps[step];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-8 text-center">
            {quiz.title}
          </h1>
          <QuizForm
            quiz={quiz}
            currentStep={currentStep}
            step={step}
            form={form}
            onChange={handleChange}
            onSubmit={handleNext}
            onPrevious={handlePrevious}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
