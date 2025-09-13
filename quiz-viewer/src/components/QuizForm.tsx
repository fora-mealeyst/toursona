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
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form
      className={`flex flex-col w-full h-full ${
        currentStep.type === "info" ? "justify-end" : "justify-start"
      }`}
      onSubmit={handleSubmit}
    >
      <h1 className="text-base font-normal font-sans uppercase text-gray-100 mb-6 mt-0 text-center md:text-left h-10 w-full">
        {quiz.title}
      </h1>
      <QuizStep step={currentStep} form={form} onChange={onChange} />
    </form>
  );
};
