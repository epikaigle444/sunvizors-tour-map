import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Important pour LWS : chemins relatifs
  build: {
    outDir: '../lws', // On met le site directement dans le dossier "lws"
    emptyOutDir: false // Pour ne pas effacer le dossier "api" qu'on vient de créer
  },
  server: {
    port: 5173,
    proxy: {
        '/api': {
            target: 'http://localhost:8000',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, '')
        }
    }
  }
})
