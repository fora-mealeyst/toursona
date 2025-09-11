import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { QuizComplete } from "./QuizComplete";

describe("QuizComplete", () => {
  it("renders thank you message and success text", () => {
    render(<QuizComplete />);

    expect(screen.getByText("Thank you!")).toBeInTheDocument();
    expect(
      screen.getByText("Your quiz has been submitted successfully.")
    ).toBeInTheDocument();
  });

  it("renders with proper semantic structure", () => {
    render(<QuizComplete />);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Thank you!"
    );
    expect(screen.getByRole("paragraph")).toHaveTextContent(
      "Your quiz has been submitted successfully."
    );
  });

  it("renders without crashing", () => {
    expect(() => render(<QuizComplete />)).not.toThrow();
  });
});
