import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/auth': 'http://localhost:3000',
      '/users': 'http://localhost:3000',
      '/bodegas': 'http://localhost:3000',
      '/categorias': 'http://localhost:3000',
      '/materiales': 'http://localhost:3000',
      '/inventario': 'http://localhost:3000',
      '/movimientos': 'http://localhost:3000',
      '/proveedores': 'http://localhost:3000',
      '/proyectos': 'http://localhost:3000',
      '/requirements': 'http://localhost:3000',
      '/compras': 'http://localhost:3000',
      '/ajustes-inventario': 'http://localhost:3000',
    }
  }
})