import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ['sonner'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://chatdeeback.vercel.app/', 
        changeOrigin: true,
      },
    },
  },
})
