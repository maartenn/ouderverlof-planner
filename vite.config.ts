import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Determine the base path based on the deployment environment
// For GitHub Pages without custom domain, use '/ouderverlof-planner/'
// For custom domain or local development, use '/'
const base = process.env.GITHUB_PAGES === 'true' ? '/ouderverlof-planner/' : '/';

// https://vitejs.dev/config/
export default defineConfig({
  base: base,
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});