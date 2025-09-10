import Quiz from './Quiz.js';
import { IQuestionStep } from '../types/index.js';

describe('Quiz Model', () => {
  test('should create a quiz with valid data', () => {
    const quizData = {
      title: 'Test Quiz',
      steps: [
        {
          title: 'Step 1',
          type: 'question',
          inputs: [
            {
              label: 'Name',
              type: 'text',
              name: 'name',
              required: true
            }
          ]
        }
      ]
    };

    const quiz = new Quiz(quizData);
    
    expect(quiz.title).toBe('Test Quiz');
    expect(quiz.steps).toHaveLength(1);
    expect(quiz.steps[0]?.title).toBe('Step 1');
    
    const questionStep = quiz.steps[0] as IQuestionStep;
    expect(questionStep.inputs).toHaveLength(1);
    expect(questionStep.inputs[0]?.name).toBe('name');
  });

  test('should handle quiz with multiple steps', () => {
    const quizData = {
      title: 'Multi-step Quiz',
      steps: [
        {
          title: 'Step 1',
          type: 'question',
          inputs: [
            {
              label: 'Question 1',
              type: 'text',
              name: 'q1',
              required: true
            }
          ]
        },
        {
          title: 'Step 2',
          type: 'question',
          inputs: [
            {
              label: 'Question 2',
              type: 'text',
              name: 'q2',
              required: false
            }
          ]
        }
      ]
    };

    const quiz = new Quiz(quizData);
    
    expect(quiz.title).toBe('Multi-step Quiz');
    expect(quiz.steps).toHaveLength(2);
    expect(quiz.steps[0]?.title).toBe('Step 1');
    expect(quiz.steps[1]?.title).toBe('Step 2');
  });

  test('should handle quiz with question options and scores', () => {
    const quizData = {
      title: 'Scored Quiz',
      steps: [
        {
          title: 'Question Step',
          type: 'question',
          inputs: [
            {
              label: 'What is your preference?',
              type: 'radio',
              name: 'preference',
              required: true,
              options: [
                {
                  label: 'Option A',
                  value: 'option_a',
                  scores: new Map([['Adventurer', 1], ['Luxe Seeker', 0]])
                },
                {
                  label: 'Option B',
                  value: 'option_b',
                  scores: new Map([['Adventurer', 0], ['Luxe Seeker', 1]])
                }
              ]
            }
          ]
        }
      ]
    };

    const quiz = new Quiz(quizData);
    
    const questionStep = quiz.steps[0] as IQuestionStep;
    const input = questionStep.inputs[0];
    const option1 = input?.options?.[0];
    const option2 = input?.options?.[1];
    
    expect(input?.options).toHaveLength(2);
    expect(option1?.value).toBe('option_a');
    expect(option1?.scores?.get('Adventurer')).toBe(1);
    expect(option2?.scores?.get('Luxe Seeker')).toBe(1);
  });
});
