import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const backendUrl =
  process.env.VITE_API_URL?.replace(/\/$/, '') ||
  'https://mymento-backend.onrender.com'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: backendUrl,
        changeOrigin: true,
        secure: true,
      },
      '/uploads': {
        target: backendUrl,
        changeOrigin: true,
        secure: true,
      },
      '/socket.io': {
        target: backendUrl,
        changeOrigin: true,
        secure: true,
        ws: true,
      },
    },
  },
})
