import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TextField } from "./TextField";
import { QuizField } from "../types";

describe.skip("TextField", () => {
  const mockOnChange = vi.fn();
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  const createField = (overrides: Partial<QuizField> = {}): QuizField => ({
    type: "text",
    label: "Test Field",
    name: "test_field",
    ...overrides,
  });

  it("renders text input with label", () => {
    const field = createField({ label: "Enter your name" });
    render(<TextField field={field} value="" onChange={mockOnChange} />);

    expect(screen.getByText("Enter your name")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("displays provided value", () => {
    const field = createField();
    render(
      <TextField field={field} value="Hello World" onChange={mockOnChange} />
    );

    expect(screen.getByRole("textbox")).toHaveValue("Hello World");
  });

  it("handles undefined value", () => {
    const field = createField();
    render(
      <TextField field={field} value={undefined} onChange={mockOnChange} />
    );

    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("calls onChange when user types", async () => {
    const field = createField({ name: "test_input" });
    render(<TextField field={field} value="" onChange={mockOnChange} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "Hello");

    expect(mockOnChange).toHaveBeenCalledWith("test_input", expect.any(String));
  });

  it("sets required attribute when field is required", () => {
    const field = createField({ required: true });
    render(<TextField field={field} value="" onChange={mockOnChange} />);

    expect(screen.getByRole("textbox")).toHaveAttribute("required");
  });

  it("has proper label association", () => {
    const field = createField({ label: "Email", name: "email" });
    render(<TextField field={field} value="" onChange={mockOnChange} />);

    const label = screen.getByText("Email");
    const input = screen.getByRole("textbox");

    expect(label).toHaveAttribute("for", "email");
    expect(input).toHaveAttribute("id", "email");
  });
});
