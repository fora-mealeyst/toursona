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
        const quizData = Array.isArray(data) ? data[0] : data;
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
      if (data.sessionId) {
        setSessionId(data.sessionId);
        // Don't set session_id in URL until quiz is completed
      }
    } catch (err) {
      console.error('Failed to submit step answers:', err);
    }
    
    if (step < quiz.steps.length - 1) {
      setStep(step + 1);
    } else {
      // Calculate scores when quiz is completed
      try {
        // Get the current session ID (might have been updated in the previous API call)
        const currentSessionId = sessionId || data?.sessionId;
        
        // Fetch all answers for this session to calculate proper scores
        let allAnswers = {};
        if (currentSessionId) {
          try {
            const answersRes = await fetch(`${API_BASE_URL}${quizId}/answers/${currentSessionId}`);
            if (answersRes.ok) {
              const answerData = await answersRes.json();
              allAnswers = answerData.answers || {};
            } else {
              console.error('Failed to fetch answers, status:', answersRes.status);
            }
          } catch (err) {
            console.error('Failed to fetch session answers:', err);
          }
        }
        
        // Add current step answers to all answers
        allAnswers = { ...allAnswers, [step]: stepAnswers };
        
        const result = calculateScores(quiz, allAnswers);
        setScoringResult(result);
        
        // Send calculated scores to server
        const requestBody = {
          sessionId: currentSessionId,
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
        if (data.sessionId) {
          setSessionId(data.sessionId);
          // Update URL with session ID for sharing
          const url = new URL(window.location.href);
          url.searchParams.set('session_id', data.sessionId);
          window.history.replaceState({}, '', url.toString());
        }
        
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
