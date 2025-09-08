import { QuestionStep as QuestionStepType } from '../types';
import { Field } from './Field';

interface QuestionStepProps {
  step: QuestionStepType;
  form: Record<string, string>;
  onChange: (name: string, value: string) => void;
}

export const QuestionStep = ({ step, form, onChange }: QuestionStepProps) => {
  return (
        <>
        {step.inputs.map((field) => (
          <Field
            key={field.name}
            field={field}
            value={form[field.name]}
            onChange={onChange}
          />
        ))}
    </>
  );
}
