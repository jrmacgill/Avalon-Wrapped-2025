import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Use '/' for local dev, '/DED-Wrapped-2025/' for GitHub Pages production builds
  base: command === 'build' ? '/DED-Wrapped-2025/' : '/',
  build: {
    outDir: 'dist',
  },
  server: {
    host: true, // Listen on all addresses, including LAN and localhost
    port: 5173, // Default port, but explicit is good
    strictPort: false, // If 5173 is busy, try the next one
  }
}))
