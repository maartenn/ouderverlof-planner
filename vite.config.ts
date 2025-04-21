import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Gebruik altijd een base path van '/' voor zowel lokale ontwikkeling
// als voor productie met custom domain
const base = '/';

// https://vitejs.dev/config/
export default defineConfig({
  base: base,
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});