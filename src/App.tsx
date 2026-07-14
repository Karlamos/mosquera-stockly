import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './guards/ProtectedRoute'
import { Login } from './pages/login/login'
import CategoriasPage from './pages/categorias/CategoriasPage'
import BodegasPage from './pages/bodegas/BodegasPage'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/categorias" element={<CategoriasPage />} />
        <Route path="/bodegas" element={<BodegasPage />} />
        <Route path="/" element={<Navigate to="/categorias" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
