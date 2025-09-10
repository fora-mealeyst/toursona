/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/setupTests.ts',
        '**/vite-env.d.ts',
        '**/index.css',
        '**/*.module.css',
        '**/App.module.css',
        '**/GlassElement.module.css',
        '**/BreakdownChart.module.css',
        '**/CollapsiblePanel.module.css',
        '**/QuizResults.module.css',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
        // Specific thresholds for critical files
        'src/main.tsx': {
          branches: 100,
          functions: 100,
          lines: 100,
          statements: 100,
        },
      },
    },
  },
})
