import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    // Setting base to './' ensures assets are loaded relatively, 
    // preventing 404 errors on GitHub Pages subdirectories.
    base: './',
    build: {
      outDir: 'dist',
    },
    define: {
      // This ensures process.env.API_KEY is replaced by the actual string value during build
      // We default to '' if env.API_KEY is missing to avoid "undefined" in the code
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
      // Prevents "process is not defined" error in some libraries
      'process.env': {} 
    }
  };
});