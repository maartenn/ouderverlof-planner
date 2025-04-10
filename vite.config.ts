import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
const base = process.env.GITHUB_PAGES  ? '/ouderverlof-planner/' : '/';
// https://vitejs.dev/config/
export default defineConfig({
  base: base,
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
