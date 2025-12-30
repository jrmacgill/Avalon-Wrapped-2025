import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Use '/' for local dev, '/DED-Wrapped-2025/' for GitHub Pages production builds
  base: command === 'build' ? '/DED-Wrapped-2025/' : '/',
  build: {
    outDir: 'dist',
  }
}))

