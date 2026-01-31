import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/p2b/', // TAMBAHKAN BARIS INI (sesuai nama repo kamu)
})