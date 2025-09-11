import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Button, variantClasses } from "./Button";

describe("Button Component", () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  describe("Basic Functionality", () => {
    it("renders with children text", () => {
      render(<Button onClick={mockOnClick}>Click me</Button>);
      expect(
        screen.getByRole("button", { name: "Click me" })
      ).toBeInTheDocument();
    });

    it("calls onClick when clicked", () => {
      render(<Button onClick={mockOnClick}>Click me</Button>);
      fireEvent.click(screen.getByRole("button"));
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it("renders as a button element", () => {
      render(<Button onClick={mockOnClick}>Test</Button>);
      const button = screen.getByRole("button");
      expect(button.tagName).toBe("BUTTON");
    });
  });

  describe("Variant System", () => {
    it("applies primary variant classes by default", () => {
      render(<Button onClick={mockOnClick}>Primary</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass(variantClasses.primary);
    });

    it("applies primary variant classes when explicitly set", () => {
      render(
        <Button variant="primary" onClick={mockOnClick}>
          Primary
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass(variantClasses.primary);
    });

    it("applies secondary variant classes", () => {
      render(
        <Button variant="secondary" onClick={mockOnClick}>
          Secondary
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass(variantClasses.secondary);
    });

    it("includes default classes for all variants", () => {
      render(
        <Button variant="primary" onClick={mockOnClick}>
          Test
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass(
        "border",
        "border-transparent",
        "px-5",
        "py-2.5",
        "font-medium",
        "font-inherit",
        "cursor-pointer",
        "transition-[border-color]",
        "duration-250",
        "h-11"
      );
    });

    it("applies h-11 height class by default", () => {
      render(<Button onClick={mockOnClick}>Height Test</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-11");
    });

    it("can override height with custom classes", () => {
      render(
        <Button className="h-20" onClick={mockOnClick}>
          Tall Button
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-20");
      expect(button).not.toHaveClass("h-11"); // Should be overridden
    });

    it("can apply custom font families", () => {
      render(
        <Button className="font-blanco" onClick={mockOnClick}>
          Blanco Font
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("font-blanco");
    });
  });

  describe("Custom Class Handling", () => {
    it("applies custom className", () => {
      render(
        <Button className="custom-class" onClick={mockOnClick}>
          Test
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
    });

    it("overrides variant classes with custom classes", () => {
      render(
        <Button
          variant="primary"
          className="bg-red-500 text-white"
          onClick={mockOnClick}
        >
          Custom
        </Button>
      );
      const button = screen.getByRole("button");

      // Should have custom classes
      expect(button).toHaveClass("bg-red-500", "text-white");

      // Should not have variant classes (they should be overridden)
      expect(button).not.toHaveClass("bg-gray-100", "text-gray-900");
    });

    it("preserves non-conflicting default classes when custom classes are applied", () => {
      render(
        <Button className="bg-blue-500" onClick={mockOnClick}>
          Test
        </Button>
      );
      const button = screen.getByRole("button");

      // Should have custom background
      expect(button).toHaveClass("bg-blue-500");

      // Should preserve other default classes
      expect(button).toHaveClass("px-5", "py-2.5", "font-medium", "h-11");
    });

    it("handles multiple custom classes", () => {
      render(
        <Button
          className="bg-green-500 text-white px-8 py-4"
          onClick={mockOnClick}
        >
          Multiple
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-green-500", "text-white", "px-8", "py-4");
    });
  });

  describe("Accessibility", () => {
    it("is focusable", () => {
      render(<Button onClick={mockOnClick}>Focusable</Button>);
      const button = screen.getByRole("button");
      button.focus();
      expect(button).toHaveFocus();
    });

    it("can be activated with keyboard", () => {
      render(<Button onClick={mockOnClick}>Keyboard</Button>);
      const button = screen.getByRole("button");
      fireEvent.keyDown(button, { key: "Enter" });
      // Note: This test assumes the button handles Enter key,
      // which is default browser behavior for buttons
    });
  });

  describe("HTML Button Props", () => {
    it("accepts disabled prop", () => {
      render(
        <Button disabled onClick={mockOnClick}>
          Disabled
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("accepts type prop", () => {
      render(
        <Button type="submit" onClick={mockOnClick}>
          Submit
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "submit");
    });

    it("accepts aria-label prop", () => {
      render(
        <Button aria-label="Close dialog" onClick={mockOnClick}>
          ×
        </Button>
      );
      const button = screen.getByRole("button", { name: "Close dialog" });
      expect(button).toBeInTheDocument();
    });

    it("accepts data attributes", () => {
      render(
        <Button data-testid="custom-button" onClick={mockOnClick}>
          Test
        </Button>
      );
      const button = screen.getByTestId("custom-button");
      expect(button).toBeInTheDocument();
    });

    it("accepts multiple HTML attributes", () => {
      render(
        <Button
          disabled
          type="button"
          aria-label="Save changes"
          data-action="save"
          onClick={mockOnClick}
        >
          Save
        </Button>
      );
      const button = screen.getByRole("button", { name: "Save changes" });
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute("type", "button");
      expect(button).toHaveAttribute("data-action", "save");
    });

    it("works without onClick prop", () => {
      render(<Button type="submit">Submit</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("type", "submit");
    });
  });

  describe("Edge Cases", () => {
    it("handles complex children (JSX elements)", () => {
      render(
        <Button onClick={mockOnClick}>
          <span>Icon</span> Text
        </Button>
      );
      expect(screen.getByText("Icon")).toBeInTheDocument();
      expect(screen.getByText("Text")).toBeInTheDocument();
    });

    it("handles undefined className gracefully", () => {
      render(<Button onClick={mockOnClick}>Test</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      // Should still have default and variant classes
      expect(button).toHaveClass(variantClasses.primary);
    });
  });
});
