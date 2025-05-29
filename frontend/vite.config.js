// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(), // enables the React JSX transform/runtime
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // backend server running on port 5000
        changeOrigin: true,
        secure: false,
      },
    },
    headers: {
      "Content-Security-Policy": "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;"
    }
  }
});
