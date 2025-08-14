
import { useEffect, useState } from 'react';
import './App.css';

const API_URL = 'http://localhost:4000/api/quizzes/689c0a1528d25d8e353228fd'; // Update with your actual API endpoint and quiz ID as needed

function Field({ field, value, onChange }) {
  switch (field.type) {
    case 'radio':
      return (
        <div className="radio-question">
          <label>{field.label}</label>
          <div className="radio-options">
            {field.options.map((option) => (
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
  const [quiz, setQuiz] = useState(null);
  const [form, setForm] = useState({});
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setQuiz(Array.isArray(data) ? data[0] : data))
      .catch((err) => console.error('Failed to fetch quiz:', err));
  }, []);

  if (!quiz) return <div>Loading quiz...</div>;

  const currentStep = quiz.steps[step];

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = async (e) => {
    e.preventDefault();
    // Prepare answers for this step
    const stepAnswers = {};
    currentStep.inputs.forEach((field) => {
      console.log(field)
      stepAnswers[field.name] = form[field.name];
    });
    console.log(stepAnswers)
    try {
      const res = await fetch(`${API_URL}/answers`, {
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
