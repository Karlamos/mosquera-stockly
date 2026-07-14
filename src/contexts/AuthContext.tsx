import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginRequest, LoginResponse, UserRole } from '../types/index';
import api from '../api/client';

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => void;
    hasRole: (allowedRoles: UserRole[]) => boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem('token');
    });

    const login = async (credentials: LoginRequest) => {
        const { data } = await api.post<LoginResponse>('/auth/login', credentials);

        // Guardar en estado
        setToken(data.data.access_token);
        // Mapeo temporal hasta tener la data completa del usuario en el response
        const userData = data.data.user as User;
        setUser(userData);

        // Guardar en persistencia (localStorage)
        localStorage.setItem('token', data.data.access_token);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const hasRole = (allowedRoles: UserRole[]) => {
        if (!user) return false;
        return allowedRoles.includes(user.rol);
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            logout,
            hasRole,
            isAuthenticated: !!token
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};