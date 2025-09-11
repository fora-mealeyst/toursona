import { useState, useEffect } from "react";
import { Quiz } from "../types";
import { API_BASE_URL } from "../constants";

export function useQuiz() {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get("quiz_id");

    if (!quizId) {
      setError(
        "No quiz ID provided. Please add ?quiz_id=YOUR_QUIZ_ID to the URL."
      );
      setLoading(false);
      return;
    }

    const API_URL = `${API_BASE_URL}${quizId}`;

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `Failed to fetch quiz: ${res.status} ${res.statusText}`
          );
        }
        return res.json();
      })
      .then((data: Quiz | Quiz[]) => {
        const quizData = Array.isArray(data) ? data[0] : data;
        setQuiz(quizData);
        setLoading(false);
      })
      .catch((err: Error) => {
        console.error("Failed to fetch quiz:", err);
        setError(`Failed to load quiz: ${err.message}`);
        setLoading(false);
      });
  }, [API_BASE_URL]);

  // Get quiz ID from URL parameters
  const getQuizId = (): string | null => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("quiz_id");
  };

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleNext = async () => {
    if (!quiz) return;

    const currentStep = quiz.steps[step];

    // Prepare answers for this step
    const stepAnswers: Record<string, string> = {};
    if (currentStep.type === "question") {
      currentStep.inputs.forEach((field) => {
        stepAnswers[field.name] = form[field.name] || "";
      });
    }

    const quizId = getQuizId();
    if (!quizId) return;

    const API_URL = `${API_BASE_URL}${quizId}/answers`;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          stepIndex: step,
          stepAnswers,
        }),
      });
      const data = await res.json();
      if (data.sessionId) {
        setSessionId(data.sessionId);
        // Don't set session_id in URL until quiz is completed
      }
    } catch (err) {
      console.error("Failed to submit step answers:", err);
    }

    if (step < quiz.steps.length - 1) {
      setStep(step + 1);
    } else {
      // Quiz completed - just submit final answers and mark as submitted
      // The scoring will be handled by the QuizResults component via the backend API
      try {
        const requestBody = {
          sessionId,
          stepIndex: step,
          stepAnswers,
        };

        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        const data = await res.json();
        if (data.sessionId) {
          setSessionId(data.sessionId);
          // Update URL with session ID for sharing
          const url = new URL(window.location.href);
          url.searchParams.set("session_id", data.sessionId);
          window.history.replaceState({}, "", url.toString());
        }

        setSubmitted(true);
      } catch (err) {
        console.error("Error submitting final answers:", err);
        setSubmitted(true); // Still mark as submitted even if submission fails
      }
    }
  };

  const handleRetake = () => {
    setForm({});
    setStep(0);
    setSubmitted(false);
    setSessionId(null);
  };

  // Check if current step has all required fields filled
  const isCurrentStepValid = (): boolean => {
    if (!quiz) return false;

    const currentStep = quiz.steps[step];

    // Info steps don't have required fields, so they're always valid
    if (currentStep.type === "info") {
      return true;
    }

    // For question steps, check if all required fields are filled
    if (currentStep.type === "question") {
      return currentStep.inputs.every((field) => {
        // If field is required, check if it has a value
        if (field.required) {
          const value = form[field.name];
          return value && value.trim() !== "";
        }
        // Non-required fields are always valid
        return true;
      });
    }

    return false;
  };

  return {
    quiz,
    form,
    step,
    submitted,
    error,
    loading,
    sessionId,
    handleChange,
    handleNext,
    handlePrevious,
    handleRetake,
    isCurrentStepValid,
  };
}
