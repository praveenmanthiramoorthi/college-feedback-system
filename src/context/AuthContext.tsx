import React, { createContext, useContext, useState } from 'react';
import type { User, Role } from '../types';

interface AuthContextType {
    user: User | null;
    login: (role: Role) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        try {
            const saved = localStorage.getItem('auth_user');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const login = (role: Role) => {
        const mockUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            name: `Mock ${role.charAt(0).toUpperCase() + role.slice(1)}`,
            email: `${role}@college.edu`,
            role: role,
            department: role === 'admin' ? undefined : 'CSE',
            isHOD: role === 'hod'
        };
        setUser(mockUser);
        localStorage.setItem('auth_user', JSON.stringify(mockUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('auth_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
