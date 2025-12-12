import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        // Build to public_html for Cloudways deployment
        outDir: 'public_html',
        emptyOutDir: true,
    },
    server: {
        port: 5173,
        open: true,
    },
})
