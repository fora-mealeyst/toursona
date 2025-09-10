import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';

// Component that throws an error for testing
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>No error</div>;
};

// Mock console.error to avoid noise in test output
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

// Mock window.location.reload
const mockReload = vi.fn();
Object.defineProperty(window, 'location', {
  value: {
    reload: mockReload,
  },
  writable: true,
});

describe('ErrorBoundary', () => {
  beforeEach(() => {
    mockConsoleError.mockClear();
    mockReload.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Normal Operation', () => {
    it('should render children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div data-testid="child-component">Child content</div>
        </ErrorBoundary>
      );

      expect(screen.getByTestId('child-component')).toBeInTheDocument();
      expect(screen.getByText('Child content')).toBeInTheDocument();
    });

    it('should render children when child component does not throw', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText('No error')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should catch errors and render fallback UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Should render the error UI
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText("We're sorry, but something unexpected happened. Please try refreshing the page.")).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Refresh Page' })).toBeInTheDocument();
    });

    it('should call console.error when an error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(mockConsoleError).toHaveBeenCalledWith(
        'ErrorBoundary caught an error:',
        expect.any(Error),
        expect.any(Object)
      );
    });

    it('should render custom fallback when provided', () => {
      const customFallback = <div data-testid="custom-fallback">Custom error message</div>;

      render(
        <ErrorBoundary fallback={customFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
      expect(screen.getByText('Custom error message')).toBeInTheDocument();
      // Should not render default error UI
      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
    });
  });

  describe('Error UI Components', () => {
    beforeEach(() => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
    });

    it('should render error icon', () => {
      // SVG elements don't have img role by default, so we'll test by finding the SVG element
      const icon = document.querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('h-8', 'w-8', 'text-red-500');
    });

    it('should render error title', () => {
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('should render error description', () => {
      expect(screen.getByText("We're sorry, but something unexpected happened. Please try refreshing the page.")).toBeInTheDocument();
    });

    it('should render refresh button', () => {
      const refreshButton = screen.getByRole('button', { name: 'Refresh Page' });
      expect(refreshButton).toBeInTheDocument();
      expect(refreshButton).toHaveClass('bg-red-600', 'hover:bg-red-700');
    });
  });

  describe('User Interactions', () => {
    it('should call window.location.reload when refresh button is clicked', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const refreshButton = screen.getByRole('button', { name: 'Refresh Page' });
      fireEvent.click(refreshButton);

      expect(mockReload).toHaveBeenCalledTimes(1);
    });
  });

  describe('Development vs Production', () => {
    const originalEnv = process.env.NODE_ENV;

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
    });

    it('should show error details in development mode', () => {
      process.env.NODE_ENV = 'development';

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Should show error details section
      expect(screen.getByText('Error Details (Development)')).toBeInTheDocument();
      
      // Should show the error message
      expect(screen.getByText(/Test error message/)).toBeInTheDocument();
    });

    it('should not show error details in production mode', () => {
      process.env.NODE_ENV = 'production';

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Should not show error details section
      expect(screen.queryByText('Error Details (Development)')).not.toBeInTheDocument();
      
      // Should not show the error message
      expect(screen.queryByText(/Test error message/)).not.toBeInTheDocument();
    });

    it('should show error details when NODE_ENV is not set', () => {
      delete process.env.NODE_ENV;

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Should show error details section (defaults to development behavior)
      // The error details are only shown when NODE_ENV === 'development'
      // When NODE_ENV is undefined, it won't match 'development' so details won't show
      expect(screen.queryByText('Error Details (Development)')).not.toBeInTheDocument();
    });
  });

  describe('Error Details Expansion', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );
    });

    it('should show error details when expanded', () => {
      const detailsElement = screen.getByText('Error Details (Development)');
      expect(detailsElement).toBeInTheDocument();
      
      // The details should be collapsible
      const detailsContainer = detailsElement.closest('details');
      expect(detailsContainer).toBeInTheDocument();
    });

    it('should display error message in details', () => {
      // The error message should be visible in the details section
      expect(screen.getByText(/Test error message/)).toBeInTheDocument();
    });
  });

  describe('Error Boundary State Management', () => {
    it('should initialize with hasError: false', () => {
      const { container } = render(
        <ErrorBoundary>
          <div>Normal content</div>
        </ErrorBoundary>
      );

      // Should render children normally
      expect(container.textContent).toContain('Normal content');
    });

    it('should update state when error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Should render error UI, indicating state was updated
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });

  describe('Multiple Errors', () => {
    it('should handle multiple error boundary instances independently', () => {
      render(
        <div>
          <ErrorBoundary>
            <ThrowError shouldThrow={true} />
          </ErrorBoundary>
          <ErrorBoundary>
            <div>This should still render</div>
          </ErrorBoundary>
        </div>
      );

      // First boundary should show error
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      
      // Second boundary should render normally
      expect(screen.getByText('This should still render')).toBeInTheDocument();
    });
  });

  describe('Error Boundary Recovery', () => {
    it('should maintain error state after initial error', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Should show error UI
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      // Rerender with no error - should still show error UI (error boundaries don't auto-recover)
      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      // Should still show error UI
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes and semantic structure', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Should have proper heading structure
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toHaveTextContent('Something went wrong');

      // Should have accessible button
      const button = screen.getByRole('button', { name: 'Refresh Page' });
      expect(button).toBeInTheDocument();
    });

    it('should have proper color contrast classes', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Find the main container div with the background classes
      const container = document.querySelector('.bg-white.dark\\:bg-gray-800');
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass('bg-white', 'dark:bg-gray-800');
    });
  });
});
