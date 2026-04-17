import { defineConfig } from 'vite'

// https://www.electronforge.io/config/plugins/vite
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['electron']
    }
  }
})
