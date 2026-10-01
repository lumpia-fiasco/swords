import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Free keys: https://api.nlt.to — "TEST" works for light development use.
  const key = env.NLT_API_KEY || 'TEST'
  const nltProxy = {
    target: 'https://api.nlt.to',
    changeOrigin: true,
    rewrite: (path) => {
      const p = path.replace(/^\/nlt/, '')
      return `${p}${p.includes('?') ? '&' : '?'}key=${encodeURIComponent(key)}`
    },
  }
  return {
    plugins: [react()],
    server: { proxy: { '/nlt': nltProxy } },
    preview: { proxy: { '/nlt': nltProxy } },
  }
})
