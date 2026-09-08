import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'https://ratnaya-backend.onrender.com',
        changeOrigin: true,
        secure: false
      },
      '/uploads': {
        target: 'https://ratnaya-backend.onrender.com',
        changeOrigin: true,
        secure: false
      },
      '/assets': {
        target: 'https://ratnaya-backend.onrender.com',
        changeOrigin: true,
        secure: false
      }
    },
    watch: {
      ignored: ['**/public/assets/**']
    }
  }
})
