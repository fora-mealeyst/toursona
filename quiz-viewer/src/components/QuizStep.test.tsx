import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QuizStep } from "./QuizStep";
import { QuestionStep, InfoStep } from "../types";

// Simple mocks - just verify the right component is rendered
vi.mock("./QuestionStep", () => ({
  QuestionStep: () => <div data-testid="question-step" />,
}));

vi.mock("./InfoStep", () => ({
  InfoStep: () => <div data-testid="info-step" />,
}));

describe("QuizStep", () => {
  const mockOnChange = vi.fn();
  const mockForm = {};

  describe("Step Type Routing", () => {
    it("should render QuestionStep for question type", () => {
      const questionStep: QuestionStep = {
        title: "Test Question",
        type: "question",
        inputs: [],
      };

      render(
        <QuizStep step={questionStep} form={mockForm} onChange={mockOnChange} />
      );

      expect(screen.getByTestId("question-step")).toBeInTheDocument();
      expect(screen.queryByTestId("info-step")).not.toBeInTheDocument();
    });

    it("should render InfoStep for info type", () => {
      const infoStep: InfoStep = {
        title: "Test Info",
        type: "info",
        description: [],
      };

      render(
        <QuizStep step={infoStep} form={mockForm} onChange={mockOnChange} />
      );

      expect(screen.getByTestId("info-step")).toBeInTheDocument();
      expect(screen.queryByTestId("question-step")).not.toBeInTheDocument();
    });

    it("should fallback to QuestionStep for unknown step type", () => {
      const unknownStep = {
        type: "unknown_type",
        inputs: [],
      } as any;

      render(
        <QuizStep step={unknownStep} form={mockForm} onChange={mockOnChange} />
      );

      expect(screen.getByTestId("question-step")).toBeInTheDocument();
      expect(screen.queryByTestId("info-step")).not.toBeInTheDocument();
    });
  });
});
