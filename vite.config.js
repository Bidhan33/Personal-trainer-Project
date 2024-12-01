import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/Personal-trainer-Project/', // Replace 'Personal-trainer-Project' with your repo name
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
