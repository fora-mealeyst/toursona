import { useEffect, useState } from 'react';
import './App.css';
import { Quiz, QuizField, QuizStep } from './types';

const API_BASE_URL = 'http://localhost:4000/api/quizzes/'; // Base API endpoint

interface FieldProps {
  field: QuizField;
  value: string | undefined;
  onChange: (name: string, value: string) => void;
}

function Field({ field, value, onChange }: FieldProps) {
  switch (field.type) {
    case 'radio':
      return (
        <div className="radio-question">
          <label>{field.label}</label>
          <div className="radio-options">
            {field.options?.map((option) => (
              <label className="radio-input" key={option}>
                <input
                  type="radio"
                  name={field.name}
                  value={option}
                  checked={value === option}
                  onChange={() => onChange(field.name, option)}
                  required={field.required}
                />
                <div>{option}</div>
              </label>
            ))}
          </div>
        </div>
      );
    case 'text':
    default:
      return (
        <div>
          <label>{field.label}</label>
          <input
            type="text"
            name={field.name}
            value={value || ''}
            onChange={(e) => onChange(field.name, e.target.value)}
            required={field.required}
          />
        </div>
      );
  }
}

function App() {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get quiz ID from URL parameters
  const getQuizId = (): string | null => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('quiz_id');
  };

  useEffect(() => {
    const quizId = getQuizId();
    
    if (!quizId) {
      setError('No quiz ID provided. Please add ?quiz_id=YOUR_QUIZ_ID to the URL.');
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
      .then((data: Quiz | Quiz[]) => setQuiz(Array.isArray(data) ? data[0] : data))
      .catch((err: Error) => {
        console.error('Failed to fetch quiz:', err);
        setError(`Failed to load quiz: ${err.message}`);
      });
  }, []);

  if (error) return <div className="error">Error: {error}</div>;
  if (!quiz) return <div>Loading quiz...</div>;

  const currentStep: QuizStep = quiz.steps[step];

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Prepare answers for this step
    const stepAnswers: Record<string, string> = {};
    currentStep.inputs.forEach((field) => {
      console.log(field)
      stepAnswers[field.name] = form[field.name] || '';
    });
    console.log(stepAnswers)
    
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

  if (submitted) {
    return <div>Thank you for submitting the quiz!</div>;
  }

  return (
    <div className="quiz-viewer">
      <h1>{quiz.title}</h1>
      <form onSubmit={handleNext}>
        <h2>{currentStep.title}</h2>
        {currentStep.inputs.map((field) => (
          <Field
            key={field.name}
            field={field}
            value={form[field.name]}
            onChange={handleChange}
          />
        ))}
        <button type="submit">
          {step < quiz.steps.length - 1 ? 'Next' : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default App;
