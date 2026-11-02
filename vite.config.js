import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages serves a project site from /<repo-name>/, so the base path comes from the
// environment (set by .github/workflows/deploy.yml). Locally it stays '/'.
const base = process.env.BASE_PATH || '/'

/** GitHub Pages has no SPA fallback: serving index.html as 404.html lets /projects load directly. */
const spaFallback = () => ({
  name: 'spa-fallback-404',
  apply: 'build',
  closeBundle() {
    const dist = resolve(import.meta.dirname, 'dist')
    copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'))
  },
})

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react(), spaFallback()],
  build: {
    // three.js is lazy-loaded in its own chunk; it is large by nature
    chunkSizeWarningLimit: 1200,
  },
})
