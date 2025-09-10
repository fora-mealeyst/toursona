import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuizForm } from './QuizForm';
import { Quiz, QuestionStep } from '../types';

// Simple mock for QuizStep - just verify it's rendered
vi.mock('./QuizStep', () => ({
  QuizStep: () => <div data-testid="quiz-step" />,
}));

describe('QuizForm', () => {
  const mockOnChange = vi.fn();
  const mockOnSubmit = vi.fn();

  const mockStep: QuestionStep = {
    title: 'Test Question',
    type: 'question',
    inputs: [],
  };

  const mockQuiz: Quiz = {
    id: 'test-quiz',
    title: 'Test Quiz Title',
    steps: [mockStep],
  };

  const mockForm = {};

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render quiz title', () => {
    render(
      <QuizForm
        quiz={mockQuiz}
        currentStep={mockStep}
        step={0}
        form={mockForm}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Test Quiz Title')).toBeInTheDocument();
  });

  it('should render QuizStep component', () => {
    render(
      <QuizForm
        quiz={mockQuiz}
        currentStep={mockStep}
        step={0}
        form={mockForm}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByTestId('quiz-step')).toBeInTheDocument();
  });

  it('should call onSubmit when form is submitted', () => {
    const { container } = render(
      <QuizForm
        quiz={mockQuiz}
        currentStep={mockStep}
        step={0}
        form={mockForm}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />
    );

    const form = container.querySelector('form');
    fireEvent.submit(form!);

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('should pass form event to onSubmit handler', () => {
    const { container } = render(
      <QuizForm
        quiz={mockQuiz}
        currentStep={mockStep}
        step={0}
        form={mockForm}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />
    );

    const form = container.querySelector('form');
    fireEvent.submit(form!);

    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'submit',
        target: form,
      })
    );
  });

  it('should apply correct CSS classes', () => {
    const { container } = render(
      <QuizForm
        quiz={mockQuiz}
        currentStep={mockStep}
        step={0}
        form={mockForm}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />
    );

    const form = container.querySelector('form');
    const title = screen.getByText('Test Quiz Title');

    expect(form).toHaveClass('flex', 'flex-col', 'justify-end');
    expect(title).toHaveClass('text-[16px]', 'font-normal', 'uppercase');
  });

  it('should handle optional onStepClick prop', () => {
    const mockOnStepClick = vi.fn();
    
    expect(() => {
      render(
        <QuizForm
          quiz={mockQuiz}
          currentStep={mockStep}
          step={0}
          form={mockForm}
          onChange={mockOnChange}
          onSubmit={mockOnSubmit}
          onStepClick={mockOnStepClick}
        />
      );
    }).not.toThrow();
  });
});
