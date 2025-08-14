import { QuizStep as QuizStepType } from '../types';
import { Field } from './Field';

interface QuizStepProps {
  step: QuizStepType;
  form: Record<string, string>;
  onChange: (name: string, value: string) => void;
}

export const QuizStep = ({ step, form, onChange }: QuizStepProps) => {
  return (
    <div className="space-y-6">
        {step.inputs.map((field) => (
          <Field
            key={field.name}
            field={field}
            value={form[field.name]}
            onChange={onChange}
          />
        ))}
    </div>
  );
}
