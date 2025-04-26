import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),               // ← enables the React JSX transform/runtime
  ],
  server: {
    headers: {
      // only for local dev—allows inline styles/eval needed by Stripe etc
      "Content-Security-Policy": "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;"
    }
  }
});
