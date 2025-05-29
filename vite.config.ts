import path from 'path';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [tailwindcss()],
    resolve: {
        alias: [
            {
                find: '@',
                replacement: path.resolve(__dirname, './src'),
            },
        ],
    },
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'EmiTrax',
            fileName: 'EmiTrax',
        },
        sourcemap: 'inline',
        emptyOutDir: true,
    },
});
