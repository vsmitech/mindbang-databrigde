import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Usa require para importar el archivo de configuración de CommonJS
const tailwindConfig = require('./tailwind.config.js');

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(tailwindConfig),
  ],
});