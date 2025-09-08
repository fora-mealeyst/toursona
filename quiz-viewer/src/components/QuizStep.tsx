import { QuizStep as QuizStepType, QuestionStep as QuestionStepType, InfoStep as InfoStepType } from '../types';
import { QuestionStep } from './QuestionStep';
import { InfoStep } from './InfoStep';

interface QuizStepProps {
  step: QuizStepType;
  form: Record<string, string>;
  onChange: (name: string, value: string) => void;
}

export const QuizStep = ({ step, form, onChange }: QuizStepProps) => {
  // Route to the appropriate step component based on step type
  switch (step.type) {
    case 'question':
      return <QuestionStep step={step as QuestionStepType} form={form} onChange={onChange} />;
    case 'info':
      return <InfoStep step={step as InfoStepType} />;
    default:
      // Fallback to QuestionStep for backward compatibility
      return <QuestionStep step={step as QuestionStepType} form={form} onChange={onChange} />;
  }
};