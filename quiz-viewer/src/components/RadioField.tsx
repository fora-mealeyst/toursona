import { QuizField } from '../types';

interface RadioFieldProps {
  field: QuizField;
  value: string | undefined;
  onChange: (name: string, value: string) => void;
}

export const RadioField = ({ field, value, onChange }: RadioFieldProps) => {
  // Debug logging to see what we're getting
  console.log('RadioField field:', field);
  console.log('RadioField options:', field.options);
  
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
        {field.label}
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
        {field.options?.map((option, index) => {
          // Ensure we have a valid option
          if (!option) return null;
          
          const optionLabel = typeof option === 'string' ? option : option.label;
          const optionValue = typeof option === 'string' ? option : option.value || option.label;
          
          return (
            <label 
              key={typeof option === 'string' ? option : `option-${index}`}
              className="relative cursor-pointer"
            >
              <input
                type="radio"
                name={field.name}
                value={optionValue}
                checked={value === optionValue}
                onChange={() => onChange(field.name, optionValue)}
                required={field.required}
                className="sr-only"
              />
              <div className={`
                p-4 text-center rounded-lg border-2 transition-all duration-200
                ${value === optionValue
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-300 shadow-md' 
                  : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600'
                }
              `}>
                {optionLabel}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
