import styles from "../App.module.css";
import { Quiz } from "../types";
import { Button } from "./FormElements/Button";
import { ProgressBar } from "./ProgressBar";

type QuizFooterProps = {
  quiz: Quiz;
  onPrevious: () => void;
  onNext: () => void;
  step: number;
  isCurrentStepValid: boolean;
};
export const QuizFooter = ({
  quiz,
  onPrevious,
  onNext,
  step,
  isCurrentStepValid,
}: QuizFooterProps) => {
  const isAfterFirstQuizStep = step > 0;
  const isLastStep = step === quiz.steps.length - 1;
  const footerElements = {
    backButton: isAfterFirstQuizStep ? (
      <Button variant="secondary" type="button" onClick={onPrevious}>
        Back
      </Button>
    ) : null,
    nextButton:
      step === 0 ? (
        <Button onClick={onNext} disabled={!isCurrentStepValid}>
          Start your journey
        </Button>
      ) : isLastStep ? (
        <Button onClick={onNext} disabled={!isCurrentStepValid}>
          Submit
        </Button>
      ) : (
        <Button type="submit" onClick={onNext} disabled={!isCurrentStepValid}>
          Next
        </Button>
      ),
    progressBar: isAfterFirstQuizStep ? (
      <ProgressBar currentStep={step} totalSteps={quiz.steps.length} />
    ) : null,
  };

  return (
    <div
      className={`${styles.footer} flex items-center justify-start  h-[108px] gap-2`}
    >
      {footerElements.backButton}
      {footerElements.nextButton}
      {footerElements.progressBar}
    </div>
  );
};
