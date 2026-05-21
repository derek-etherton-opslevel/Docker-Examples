/**
 * Vite Configuration
 *
 * Configuration file for Vite, the build tool and development server for this React application.
 *
 * Key configurations:
 * - React plugin for JSX transformation and Fast Refresh
 * - Development server settings for Docker networking
 * - API proxy for backend communication during development
 * - Build output directory configuration
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Enable React plugin for JSX support and Fast Refresh during development
  plugins: [react()],

  // Development server configuration
  server: {
    // Listen on all network interfaces (0.0.0.0) to allow Docker container access
    host: '0.0.0.0',

    // Port number for the development server
    port: 5173,

    // Proxy configuration to forward API requests to the backend during development
    proxy: {
      '/api': {
        // Forward all /api requests to the backend service
        target: 'http://backend:3001',
        // Change the origin header to match the target URL (required for CORS)
        changeOrigin: true
      }
    }
  },

  // Build configuration
  build: {
    // Output directory for production build files
    outDir: 'dist'
  }
});
