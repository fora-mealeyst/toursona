import { Quiz, QuizStep as QuizStepType } from "../types";
import { QuizStep } from "./QuizStep";

type QuizFormProps = {
  quiz: Quiz;
  currentStep: QuizStepType;
  step: number;
  form: Record<string, string>;
  onChange: (name: string, value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onStepClick?: (stepIndex: number) => void;
};

export const QuizForm = ({
  quiz,
  currentStep,
  form,
  onChange,
  onSubmit,
}: QuizFormProps) => {
  return (
    <form className="flex flex-col justify-end" onSubmit={onSubmit}>
      <h1 className="text-base font-normal font-sans uppercase text-gray-100 mb-6 mt-0 text-left h-10 w-full lg:w-[480px]">
        {quiz.title}
      </h1>
      <QuizStep step={currentStep} form={form} onChange={onChange} />
    </form>
  );
};
