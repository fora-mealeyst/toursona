import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Field } from "./Field";
import { QuizField } from "../types";

describe.skip("Field", () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Field Type Dispatching", () => {
    it("should render RadioField for single_choice field type", () => {
      const field: QuizField = {
        type: "single_choice",
        label: "Choose an option",
        name: "choice",
        options: ["Option 1", "Option 2"],
      };

      render(<Field field={field} value="Option 1" onChange={mockOnChange} />);

      // Verify RadioField is rendered by checking for radio buttons
      expect(
        screen.getByRole("radio", { name: "Option 1" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("radio", { name: "Option 2" })
      ).toBeInTheDocument();
    });

    it("should render TextField for text field type", () => {
      const field: QuizField = {
        type: "text",
        label: "Enter your name",
        name: "name",
      };

      render(<Field field={field} value="John Doe" onChange={mockOnChange} />);

      // Verify TextField is rendered by checking for text input
      const textInput = screen.getByRole("textbox", {
        name: "Enter your name",
      });
      expect(textInput).toBeInTheDocument();
    });

    it("should render TextField as default for unknown field type", () => {
      const field = {
        type: "unknown_type" as any,
        label: "Unknown field",
        name: "unknown",
      };

      render(<Field field={field} value="test" onChange={mockOnChange} />);

      // Should default to TextField
      const textInput = screen.getByRole("textbox", { name: "Unknown field" });
      expect(textInput).toBeInTheDocument();
    });

    it("should render TextField as default for missing type property", () => {
      const field = {
        label: "No Type",
        name: "no_type",
      } as any;

      render(<Field field={field} value="test" onChange={mockOnChange} />);

      // Should default to TextField
      const textInput = screen.getByRole("textbox", { name: "No Type" });
      expect(textInput).toBeInTheDocument();
    });
  });

  describe("Props Passing", () => {
    it("should pass all props to the rendered component", () => {
      const field: QuizField = {
        type: "single_choice",
        label: "Test Radio",
        name: "radio_test",
        required: true,
        options: ["A", "B"],
      };

      render(<Field field={field} value="A" onChange={mockOnChange} />);

      // Verify props are passed correctly by checking the rendered component
      expect(screen.getByText("Test Radio")).toBeInTheDocument();
      expect(screen.getByRole("radio", { name: "A" })).toBeChecked();
      expect(screen.getByRole("radio", { name: "B" })).not.toBeChecked();
    });
  });

  describe("Error Handling", () => {
    it("should throw error when field is null", () => {
      const field = null as any;

      expect(() => {
        render(<Field field={field} value="test" onChange={mockOnChange} />);
      }).toThrow();
    });
  });
});
