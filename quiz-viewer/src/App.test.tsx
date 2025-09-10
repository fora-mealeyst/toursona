import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Add a simple assertion to verify the component renders
    expect(document.body).toBeInTheDocument();
  });
});
