import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorMessage } from "./ErrorMessage";

describe("ErrorMessage", () => {
  it("renders error message with provided text", () => {
    render(<ErrorMessage message="Something went wrong" />);

    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders with proper semantic structure", () => {
    render(<ErrorMessage message="Test message" />);

    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "Error"
    );
    expect(screen.getByRole("paragraph")).toHaveTextContent("Test message");
  });

  it("handles empty message", () => {
    render(<ErrorMessage message="" />);

    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByRole("paragraph")).toHaveTextContent("");
  });
});
