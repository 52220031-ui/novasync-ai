import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration: enables React Fast Refresh + JSX support.
//
// `base` is the URL path the site is served from:
//   - "/" for local dev, Vercel and Netlify (default)
//   - "/<repo-name>/" for GitHub Pages, set through the BASE_PATH env variable
//     (the GitHub Actions workflow does this automatically).
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()],
});
