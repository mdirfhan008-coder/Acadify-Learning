import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Setting base to './' ensures assets are loaded relatively, 
  // preventing 404 errors on GitHub Pages subdirectories.
  base: './',
  build: {
    outDir: 'dist',
  }
});