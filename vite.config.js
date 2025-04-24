import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr() // Add svgr plugin to handle SVGs as components
  ],
  server: {
    port: 3000, // Optional: specify dev server port
    open: true // Optional: automatically open browser
  },
  build: {
    outDir: 'build' // Keep output directory as 'build' to match existing setup (server.js, Procfile)
  },
  define: {
    global: '{}', // Define global as an empty object for browser compatibility
    'process.env': {} // Define process.env as an empty object
  }
})
