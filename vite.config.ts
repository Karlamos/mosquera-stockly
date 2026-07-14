import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const apiRoutes = [
  '/auth', '/users', '/bodegas', '/categorias', '/materiales',
  '/inventario', '/movimientos', '/proveedores', '/proyectos',
  '/requirements', '/compras', '/ajustes-inventario',
]

function createProxy() {
  const proxy: Record<string, any> = {}
  for (const route of apiRoutes) {
    proxy[route] = {
      target: 'http://localhost:3000',
      bypass: (req: { headers: { accept?: string } }) => {
        if (req.headers.accept?.includes('text/html')) {
          return '/index.html'
        }
      },
    }
  }
  return proxy
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: createProxy(),
  }
})
