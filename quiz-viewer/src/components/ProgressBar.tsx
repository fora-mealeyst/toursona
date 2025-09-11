interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  return (
    <div className="flex justify-between items-center px-5 py-2.5  text-sm text-gray-600 dark:text-gray-400 h-11">
      <span>
        {currentStep + 1} / {totalSteps}
      </span>
    </div>
  );
};
