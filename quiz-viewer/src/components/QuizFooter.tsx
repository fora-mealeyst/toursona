import styles from '../App.module.css';
import { Quiz } from '../types';
import { ProgressBar } from './ProgressBar';

type QuizFooterProps = {
    quiz: Quiz;
    onPrevious: () => void;
    onNext: () => void;
    step: number;
}
export const QuizFooter = ({
    quiz,
    onPrevious,
    onNext,
    step
}: QuizFooterProps) => {
    const isAfterFirstQuizStep = step > 0;
    const isLastStep = step === quiz.steps.length - 1;
    const footerElements = {
        backButton: isAfterFirstQuizStep ? (
            <button 
                type="button"
                onClick={onPrevious}
                className="px-6 py-3 mr-[8px] bg-gray-500 text-white font-medium hover:bg-gray-600 transition-colors duration-200"
            >
                Back
            </button>
        ) : null,
        nextButton: step === 0 ? (
            <button 
                onClick={onNext}
                className="px-6 py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200"
            >
                Start your journey
            </button>
        ) : isLastStep ? (
            <button 
                onClick={onNext}
                className="px-6 py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200"
            >
                Submit
            </button>
        ) : (
            <button 
                type="submit"
                onClick={onNext}
                className="px-6 py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200"
            >
                Next
            </button>
        ),
        progressBar: isAfterFirstQuizStep ? (
            <ProgressBar 
                currentStep={step} 
                totalSteps={quiz.steps.length} 
            />
        ) : null
    }

    return(
        <div className={`${styles.footer} flex items-center justify-start  h-[108px]`}>
            {footerElements.backButton}
            {footerElements.nextButton}
            {footerElements.progressBar}
        </div>
    );
}