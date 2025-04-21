import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Check if we're using a custom domain or GitHub Pages
// If using custom domain, we want base to be '/' instead of '/ouderverlof-planner/'
const isCustomDomain = process.env.CUSTOM_DOMAIN === 'true';
const base = process.env.GITHUB_PAGES && !isCustomDomain ? '/ouderverlof-planner/' : '/';

// https://vitejs.dev/config/
export default defineConfig({
  base: base,
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});