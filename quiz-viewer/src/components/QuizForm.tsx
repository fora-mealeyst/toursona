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
  onPrevious: () => void;
  onStepClick?: (stepIndex: number) => void;
}

export const QuizForm = ({ 
  quiz, 
  currentStep, 
  step, 
  form, 
  onChange, 
  onSubmit,
  onPrevious,
}: QuizFormProps) => {
  const isFirstStep = step === 0;
  const isLastStep = step === quiz.steps.length - 1;

  return (
    <form className="h-full"onSubmit={onSubmit}>
      <QuizStep 
        step={currentStep} 
        form={form} 
        onChange={onChange} 
      />
      <div className={`flex items-center mt-6 ${isFirstStep ? 'justify-end' : 'justify-between'}`}>
        {!isFirstStep && (
          <button 
            type="button"
            onClick={onPrevious}
            className="px-6 py-3 mr-[8px] bg-gray-500 text-white font-medium hover:bg-gray-600 transition-colors duration-200"
          >
            Previous
          </button>
        )}
        <button 
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200"
        >
          {isLastStep ? 'Submit' : 'Next'}
        </button>
        <ProgressBar 
        currentStep={step} 
        totalSteps={quiz.steps.length} 
      />
      </div>
    </form>
  );
}
