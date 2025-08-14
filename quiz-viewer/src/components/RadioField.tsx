import { QuizField } from '../types';

interface RadioFieldProps {
  field: QuizField;
  value: string | undefined;
  onChange: (name: string, value: string) => void;
}

export const RadioField = ({ field, value, onChange }: RadioFieldProps) => {
  return (
    <div className="grid">
      <span className="blanco-text-italic block text-[32px] font-medium text-gray-700 dark:text-gray-300 text-left">
        {field.label}
      </span>
      <div className="grid justify-center">
        {field.options?.map((option) => {
          const isSelected = value === option.value;
          const baseClasses = "p-4 text-center border-2 transition-all duration-200 h-full w-full flex items-center justify-center";
          const selectedClasses = "bg-gray-700 border-gray-100 text-gray-100";
          const unselectedClasses = "bg-gray-800 border-transparent";
          
          return (
          <label 
            key={option.value}
            className="relative cursor-pointer min-w-[480px] h-[56px] mb-[8px]"
          >
            <input
              type="radio"
              name={field.name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(field.name, option.value)}
              required={field.required}
              className="sr-only"
            />
            <div className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}>
              {option.label}
            </div>
          </label>
        )}
        )}
      </div>
    </div>
  );
}
