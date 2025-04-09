import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
const base = process.env.GITHUB_PAGES  ? '/ouderverlof-planner/' : '/';

export default defineConfig({
  plugins: [react()],
  base: base,
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    globals: true,
  },
});
