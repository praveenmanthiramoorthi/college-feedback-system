import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types';
import { Lock, User, Shield, Users, Heart } from 'lucide-react';

const LoginPage: React.FC = () => {
    const { role } = useParams<{ role: string }>();
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        login(role as Role);
        const destination = role === 'student' ? '/' : `/${role}`;
        navigate(destination);
    };

    const getRoleIcon = () => {
        switch (role) {
            case 'admin': return <Shield size={48} className="text-primary" />;
            case 'staff': return <User size={48} className="text-primary" />;
            case 'parent': return <Heart size={48} className="text-primary" />;
            default: return <Users size={48} className="text-primary" />;
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div className="glass-card animate-fade" style={{ width: '100%', maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: 80,
                        height: 80,
                        borderRadius: '20px',
                        background: 'rgba(99, 102, 241, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        border: '1px solid var(--surface-border)'
                    }}>
                        {getRoleIcon()}
                    </div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                        {role?.toUpperCase()} LOGIN
                    </h2>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome back to the College Feedback System</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                            Institutional Email
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="email"
                                placeholder="name@college.edu"
                                defaultValue={`${role}@college.edu`}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            defaultValue="password"
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Lock size={18} style={{ marginRight: '0.5rem' }} />
                        Sign In as {role}
                    </button>
                </form>

                <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Contact IT support if you've forgotten your credentials.
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
