import React from 'react';
import { IQuiz, IQuizAnswer } from '../types';

interface QuizAnswersProps {
  quiz: IQuiz;
  answers: IQuizAnswer[];
  onBack: () => void;
}

const QuizAnswers: React.FC<QuizAnswersProps> = ({ quiz, answers, onBack }) => {
  const formatAnswer = (answer: any): string => {
    if (typeof answer === 'string') return answer;
    if (typeof answer === 'number') return answer.toString();
    if (Array.isArray(answer)) return answer.join(', ');
    if (typeof answer === 'object') return JSON.stringify(answer, null, 2);
    return String(answer);
  };

  const getStepTitle = (stepIndex: number): string => {
    return quiz.steps[stepIndex]?.title || `Step ${stepIndex + 1}`;
  };

  const getInputLabel = (stepIndex: number, inputName: string): string => {
    const step = quiz.steps[stepIndex];
    const input = step?.inputs.find(input => input.name === inputName);
    return input?.label || inputName;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Quizzes
        </button>
        <h2 className="text-2xl font-semibold text-gray-900">{quiz.title} - Responses</h2>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Quiz Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Total Steps:</span> {quiz.steps.length}
            </div>
            <div>
              <span className="font-medium">Total Responses:</span> {answers.length}
            </div>
            <div>
              <span className="font-medium">Created:</span> {new Date(quiz.createdAt).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Latest Response:</span> {answers.length > 0 ? new Date(answers[0].submittedAt).toLocaleDateString() : 'None'}
            </div>
          </div>
        </div>

        {answers.length === 0 ? (
          <div className="text-center py-8">
            <h4 className="text-lg font-medium text-gray-600 mb-2">No responses yet</h4>
            <p className="text-gray-500">Share this quiz with users to start collecting responses.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Response Details</h3>
            {answers.map((answer, answerIndex) => (
              <div key={answer._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-medium text-gray-900">
                    Response #{answers.length - answerIndex}
                  </h4>
                  <span className="text-sm text-gray-500">
                    {new Date(answer.submittedAt).toLocaleString()}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {Object.entries(answer.answers).map(([stepIndex, stepAnswers]) => (
                    <div key={stepIndex} className="border-l-4 border-blue-500 pl-4">
                      <h5 className="font-medium text-gray-900 mb-2">
                        {getStepTitle(parseInt(stepIndex))}
                      </h5>
                      <div className="space-y-2">
                        {typeof stepAnswers === 'object' && stepAnswers !== null ? (
                          Object.entries(stepAnswers).map(([inputName, inputAnswer]) => (
                            <div key={inputName} className="text-sm">
                              <span className="font-medium text-gray-700">
                                {getInputLabel(parseInt(stepIndex), inputName)}:
                              </span>
                              <span className="ml-2 text-gray-600">
                                {formatAnswer(inputAnswer)}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-gray-600">
                            {formatAnswer(stepAnswers)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizAnswers;
