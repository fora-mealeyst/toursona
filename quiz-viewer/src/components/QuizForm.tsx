import { Quiz, QuizStep as QuizStepType } from '../types';
import { QuizStep } from './QuizStep';
import { ProgressBar } from './ProgressBar';

interface QuizFormProps {
  quiz: Quiz;
  currentStep: QuizStepType;
  step: number;
  form: Record<string, string>;
  onChange: (name: string, value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const QuizForm = ({ 
  quiz, 
  currentStep, 
  step, 
  form, 
  onChange, 
  onSubmit 
}: QuizFormProps) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <ProgressBar currentStep={step} totalSteps={quiz.steps.length} />
      <QuizStep 
        step={currentStep} 
        form={form} 
        onChange={onChange} 
      />
      <button 
        type="submit"
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 self-center mt-4"
      >
        {step < quiz.steps.length - 1 ? 'Next' : 'Submit'}
      </button>
    </form>
  );
}
