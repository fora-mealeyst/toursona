import { useState, useEffect } from 'react';
import { Quiz } from '../types';
import { API_BASE_URL } from '../constants';
import { calculateScores, ScoringResult } from '../services/scoringService';

export function useQuiz() {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [scoringResult, setScoringResult] = useState<ScoringResult | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('quiz_id');
    
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
        console.log('Quiz data received:', data);
        const quizData = Array.isArray(data) ? data[0] : data;
        console.log('Processed quiz data:', quizData);
        setQuiz(quizData);
        setLoading(false);
      })
      .catch((err: Error) => {
        console.error('Failed to fetch quiz:', err);
        setError(`Failed to load quiz: ${err.message}`);
        setLoading(false);
      });
  }, [API_BASE_URL]);

  // Get quiz ID from URL parameters
  const getQuizId = (): string | null => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('quiz_id');
  };

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
      // Calculate scores when quiz is completed
      try {
        const result = calculateScores(quiz, { [step]: stepAnswers });
        setScoringResult(result);
        
        // Send calculated scores to server
        const requestBody = {
          sessionId,
          stepIndex: step,
          stepAnswers,
          calculatedScores: result.scores,
        };
        
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });
        
        const data = await res.json();
        if (data.sessionId) setSessionId(data.sessionId);
        
        setSubmitted(true);
      } catch (err) {
        console.error('Error calculating scores:', err);
        setSubmitted(true); // Still mark as submitted even if scoring fails
      }
    }
  };

  const handleRetake = () => {
    setForm({});
    setStep(0);
    setSubmitted(false);
    setScoringResult(null);
    setSessionId(null);
  };

  return {
    quiz,
    form,
    step,
    submitted,
    error,
    loading,
    scoringResult,
    handleChange,
    handleNext,
    handlePrevious,
    handleRetake,
  };
}
