import { QuizField } from '../types';
import { RadioField } from './RadioField';
import { TextField } from './TextField';

interface FieldProps {
  field: QuizField;
  value: string | undefined;
  onChange: (name: string, value: string) => void;
}

export const Field = ({ field, value, onChange }: FieldProps) => {
  switch (field.type) {
    case 'radio':
      return <RadioField field={field} value={value} onChange={onChange} />;
    case 'text':
    default:
      return <TextField field={field} value={value} onChange={onChange} />;
  }
}
