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
});
