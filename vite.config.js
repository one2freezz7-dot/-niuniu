import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // 相对路径：本地、Vercel 根路径、GitHub Pages 子路径都能正常加载资源
  base: './',
  plugins: [react()],
})
