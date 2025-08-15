import { QuizField } from '../types';

interface TextFieldProps {
  field: QuizField;
  value: string | undefined;
  onChange: (name: string, value: string) => void;
}

export const TextField = ({ field, value, onChange }: TextFieldProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {field.label}
      </label>
      <input
        type="text"
        name={field.name}
        value={value || ''}
        onChange={(e) => onChange(field.name, e.target.value)}
        required={field.required}
        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
      />
    </div>
  );
}
