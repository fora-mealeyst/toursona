interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar = ({ currentStep, totalSteps }: ProgressBarProps) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  
  return (
    <div className="mx-[24px] my-[12px]">
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>{currentStep + 1} / {totalSteps}</span>
      </div>
    </div>
  );
}
