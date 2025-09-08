import { Quiz, QuizStep as QuizStepType } from '../types';
import { QuizStep } from './QuizStep';

type QuizFormProps = {
  quiz: Quiz;
  currentStep: QuizStepType;
  step: number;
  form: Record<string, string>;
  onChange: (name: string, value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onStepClick?: (stepIndex: number) => void;
}

export const QuizForm = ({ 
  quiz, 
  currentStep,
  form, 
  onChange, 
  onSubmit,
}: QuizFormProps) => {
  return (
    <form className="flex flex-col justify-end" onSubmit={onSubmit}>
      <h1 className="text-[16px] font-normal uppercase text-gray-100 dark:text-white mb-[24px] mt-0 text-center h-[40px] w-full lg:w-[480px] text-left">
        {quiz.title}
      </h1>
      <QuizStep 
        step={currentStep} 
        form={form} 
        onChange={onChange} 
      />
    </form>
  );
}
