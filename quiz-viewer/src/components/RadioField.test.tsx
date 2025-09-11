import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RadioField } from "./RadioField";
import { QuizField, QuizOption } from "../types";

describe("RadioField", () => {
  const mockOnChange = vi.fn();
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  const createField = (overrides: Partial<QuizField> = {}): QuizField => ({
    type: "single_choice",
    label: "Test Field",
    name: "test_field",
    options: ["Option 1", "Option 2"],
    ...overrides,
  });

  describe("Rendering", () => {
    it("renders radio buttons with string options", () => {
      const field = createField({
        label: "Choose color",
        options: ["Red", "Blue", "Green"],
      });

      render(
        <RadioField field={field} value={undefined} onChange={mockOnChange} />
      );

      expect(screen.getByText("Choose color")).toBeInTheDocument();
      expect(screen.getByRole("radio", { name: "Red" })).toBeInTheDocument();
      expect(screen.getByRole("radio", { name: "Blue" })).toBeInTheDocument();
      expect(screen.getByRole("radio", { name: "Green" })).toBeInTheDocument();
    });

    it("renders radio buttons with object options", () => {
      const options: QuizOption[] = [
        { label: "Option A", value: "a" },
        { label: "Option B", value: "b" },
      ];

      const field = createField({ options });

      render(
        <RadioField field={field} value={undefined} onChange={mockOnChange} />
      );

      expect(
        screen.getByRole("radio", { name: "Option A" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("radio", { name: "Option B" })
      ).toBeInTheDocument();
    });

    it("handles empty or undefined options", () => {
      const field = createField({ options: [] });
      render(
        <RadioField field={field} value={undefined} onChange={mockOnChange} />
      );
      expect(screen.queryByRole("radio")).not.toBeInTheDocument();

      const fieldUndefined = createField({ options: undefined });
      render(
        <RadioField
          field={fieldUndefined}
          value={undefined}
          onChange={mockOnChange}
        />
      );
      expect(screen.queryByRole("radio")).not.toBeInTheDocument();
    });
  });

  describe("Selection Logic", () => {
    it("shows selected state correctly", () => {
      const field = createField({ options: ["A", "B", "C"] });
      render(<RadioField field={field} value="B" onChange={mockOnChange} />);

      expect(screen.getByRole("radio", { name: "A" })).not.toBeChecked();
      expect(screen.getByRole("radio", { name: "B" })).toBeChecked();
      expect(screen.getByRole("radio", { name: "C" })).not.toBeChecked();
    });

    it("calls onChange when option is selected", async () => {
      const field = createField({ name: "test", options: ["A", "B"] });
      render(
        <RadioField field={field} value={undefined} onChange={mockOnChange} />
      );

      await user.click(screen.getByRole("radio", { name: "B" }));

      expect(mockOnChange).toHaveBeenCalledWith("test", "B");
    });

    it("handles object options with correct values", async () => {
      const field = createField({
        name: "object_test",
        options: [
          { label: "First", value: "first" },
          { label: "Second", value: "second" },
        ],
      });
      render(
        <RadioField field={field} value={undefined} onChange={mockOnChange} />
      );

      await user.click(screen.getByRole("radio", { name: "Second" }));

      expect(mockOnChange).toHaveBeenCalledWith("object_test", "second");
    });
  });

  describe("Accessibility", () => {
    it("has proper label association", () => {
      const field = createField({ options: ["Option 1", "Option 2"] });
      render(
        <RadioField field={field} value={undefined} onChange={mockOnChange} />
      );

      const radios = screen.getAllByRole("radio");
      radios.forEach((radio) => {
        const label = radio.closest("label");
        expect(label).toBeInTheDocument();
        expect(label).toHaveTextContent(radio.getAttribute("value") || "");
      });
    });

    it("is keyboard navigable", async () => {
      const field = createField({ options: ["A", "B", "C"] });
      render(
        <RadioField field={field} value={undefined} onChange={mockOnChange} />
      );

      const firstRadio = screen.getByRole("radio", { name: "A" });
      const secondRadio = screen.getByRole("radio", { name: "B" });

      firstRadio.focus();
      expect(firstRadio).toHaveFocus();

      await user.keyboard("{ArrowDown}");
      expect(secondRadio).toHaveFocus();

      await user.keyboard(" ");
      expect(mockOnChange).toHaveBeenCalledWith("test_field", "B");
    });

    it("hides radio inputs visually but keeps them accessible", () => {
      const field = createField({ options: ["Hidden Option"] });
      render(
        <RadioField field={field} value={undefined} onChange={mockOnChange} />
      );

      const radio = screen.getByRole("radio", { name: "Hidden Option" });
      expect(radio).toHaveClass("sr-only");
    });
  });

  describe("Edge Cases", () => {
    it("handles null options in array", () => {
      const field = createField({
        options: ["Valid", null as any, "Also Valid"],
      });
      render(
        <RadioField field={field} value={undefined} onChange={mockOnChange} />
      );

      expect(screen.getByRole("radio", { name: "Valid" })).toBeInTheDocument();
      expect(
        screen.getByRole("radio", { name: "Also Valid" })
      ).toBeInTheDocument();
      expect(screen.getAllByRole("radio")).toHaveLength(2);
    });

    it("handles malformed object options", () => {
      const field = createField({
        options: [
          { label: "Valid" },
          { label: "", value: "empty" },
          { value: "no_label" } as any,
        ],
      });
      render(
        <RadioField field={field} value={undefined} onChange={mockOnChange} />
      );

      expect(screen.getByRole("radio", { name: "Valid" })).toBeInTheDocument();
      expect(screen.getAllByRole("radio", { name: "" })).toHaveLength(2);
      expect(screen.getByDisplayValue("no_label")).toBeInTheDocument();
    });
  });
});
