import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// @ts-expect-error legacy problem
import eslint from 'vite-plugin-eslint';

export default defineConfig({
  plugins: [
    react(),
    eslint({
      include: ['src/**/*.{ts,tsx,js,jsx}'], // 检查 src 目录下的 TS、TSX、JS 和 JSX 文件
    }),
  ],
  server: { // 处理跨域问题
    proxy: {
      '/api': {
        target: 'http://62.234.16.19',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
