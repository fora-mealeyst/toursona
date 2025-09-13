import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Quiz } from "../types";
import { API_BASE_URL } from "../constants";

export function useQuiz() {
  const { quizSlug } = useParams<{ quizSlug: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!quizSlug) {
      setError("No quiz slug provided in URL");
      setLoading(false);
      return;
    }

    const API_URL = `${API_BASE_URL}slug/${quizSlug}`;

    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `Failed to fetch quiz: ${res.status} ${res.statusText}`
          );
        }
        return res.json();
      })
      .then((data: Quiz) => {
        setQuiz(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        console.error("Failed to fetch quiz:", err);
        setError(`Failed to load quiz: ${err.message}`);
        setLoading(false);
      });
  }, [API_BASE_URL]);

  // Clear any existing session when component mounts to ensure fresh start
  useEffect(() => {
    localStorage.removeItem("quiz_session_id");
    localStorage.removeItem("quiz_slug");
    setSessionId(null);
  }, []); // Only run once on mount

  // Get quiz slug from URL parameters
  const getQuizSlug = (): string => {
    return quizSlug || "honeymoon-match";
  };

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleNext = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    if (!quiz) return;

    const currentStep = quiz.steps[step];

    // Prepare answers for this step
    const stepAnswers: Record<string, string> = {};
    if (currentStep.type === "question") {
      currentStep.inputs.forEach((field) => {
        stepAnswers[field.name] = form[field.name] || "";
      });
    }

    const quizSlug = getQuizSlug();
    const API_URL = `${API_BASE_URL}slug/${quizSlug}/answers`;

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
          // Store session ID and quiz slug in localStorage for persistence
          localStorage.setItem("quiz_session_id", data.sessionId);
          const currentQuizSlug = getQuizSlug();
          localStorage.setItem("quiz_slug", currentQuizSlug);
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
    // Clear sessionId and quizSlug from localStorage when retaking
    localStorage.removeItem("quiz_session_id");
    localStorage.removeItem("quiz_slug");
  };

  const startFreshQuiz = () => {
    setForm({});
    setStep(0);
    setSubmitted(false);
    setSessionId(null);
    // Clear sessionId and quizSlug from localStorage when starting fresh
    localStorage.removeItem("quiz_session_id");
    localStorage.removeItem("quiz_slug");
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
    startFreshQuiz,
    isCurrentStepValid,
  };
}
