import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/index';

interface ProtectedRouteProps {
    allowedRoles?: UserRole[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const { isAuthenticated, hasRole } = useAuth();
    const location = useLocation();

    // Si no está autenticado, lo enviamos al login guardando la ruta a la que intentaba ir
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Si la ruta exige roles específicos y el usuario no los tiene, lo mandamos al home
    if (allowedRoles && allowedRoles.length > 0 && !hasRole(allowedRoles)) {
        return <Navigate to="/" replace />;
    }

    // Si todo está correcto, renderizamos las rutas hijas
    return <Outlet />;
}