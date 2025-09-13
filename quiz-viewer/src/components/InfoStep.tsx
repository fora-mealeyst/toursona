import { InfoStep as InfoStepType } from "../types";

interface InfoStepProps {
  step: InfoStepType;
}

export const InfoStep = ({ step }: InfoStepProps) => {
  return (
    <div className="flex flex-col justify-between items-center h-full">
      <div className="flex-1 w-full">
        <div className="mb-8">
          <h1 className="chiswick-text-italic text-gray-100 text-[56px] lg:text-[72px] leading-relaxed">
            {step.title}
          </h1>
        </div>
      </div>

      <div className="flex flex-col items-start w-full">
        <div className="mb-8 space-y-4">
          {step.description.map((block, index) => (
            <p key={index} className="text-gray-700 dark:text-gray-300 text-lg">
              {block.content}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};
