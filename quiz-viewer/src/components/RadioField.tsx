import { QuizField } from '../types';

interface RadioFieldProps {
  field: QuizField;
  value: string | undefined;
  onChange: (name: string, value: string) => void;
}

export const RadioField = ({ field, value, onChange }: RadioFieldProps) => {
  
  return (
    <div className="flex flex-col justify-between basis-full">
      <span className="blanco-text-italic block text-[32px] font-medium text-gray-700 text-left">
        {field.label}
      </span>
      <div className="grid justify-center">
        {field.options?.map((option, index) => {
          // Ensure we have a valid option
          if (!option) return null;
          
          const optionLabel = typeof option === 'string' ? option : option.label;
          const optionValue = typeof option === 'string' ? option : option.value || option.label;
          const isSelected = value === optionValue;
          
          const baseClasses = "p-4 text-center border-2 transition-all duration-200 h-full w-full flex items-center justify-center";
          const selectedClasses = "bg-gray-700 border-gray-100 text-gray-100";
          const unselectedClasses = "bg-gray-800 border-transparent";
          
          return (
            <label 
              key={typeof option === 'string' ? option : `option-${index}`}
              className="relative cursor-pointer min-w-[480px] h-[56px] mb-[8px]"
            >
              <input
                type="radio"
                name={field.name}
                value={optionValue}
                checked={isSelected}
                onChange={() => onChange(field.name, optionValue)}
                required={field.required}
                className="sr-only"
              />
              <div className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}>
                {optionLabel}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
