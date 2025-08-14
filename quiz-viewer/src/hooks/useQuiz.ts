import { useState, useEffect } from 'react';
import { Quiz } from '../types';
import { API_BASE_URL } from '../constants';

export function useQuiz() {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Get quiz ID from URL parameters
  const getQuizId = (): string | null => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('quiz_id');
  };

  useEffect(() => {
    const quizId = getQuizId();
    
    if (!quizId) {
      setError('No quiz ID provided. Please add ?quiz_id=YOUR_QUIZ_ID to the URL.');
      setLoading(false);
      return;
    }

    const API_URL = `${API_BASE_URL}${quizId}`;
    
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch quiz: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data: Quiz | Quiz[]) => {
        setQuiz(Array.isArray(data) ? data[0] : data);
        setLoading(false);
      })
      .catch((err: Error) => {
        console.error('Failed to fetch quiz:', err);
        setError(`Failed to load quiz: ${err.message}`);
        setLoading(false);
      });
  }, []);

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleNext = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!quiz) return;
    
    const currentStep = quiz.steps[step];
    
    // Prepare answers for this step
    const stepAnswers: Record<string, string> = {};
    currentStep.inputs.forEach((field) => {
      stepAnswers[field.name] = form[field.name] || '';
    });
    
    const quizId = getQuizId();
    if (!quizId) return;
    
    const API_URL = `${API_BASE_URL}${quizId}/answers`;
    
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          stepIndex: step,
          stepAnswers,
        }),
      });
      const data = await res.json();
      if (data.sessionId) setSessionId(data.sessionId);
    } catch (err) {
      console.error('Failed to submit step answers:', err);
    }
    
    if (step < quiz.steps.length - 1) {
      setStep(step + 1);
    } else {
      setSubmitted(true);
    }
  };

  return {
    quiz,
    form,
    step,
    submitted,
    error,
    loading,
    handleChange,
    handleNext,
    handlePrevious,
  };
}
