import React, { createContext, useContext, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    Users,
    UserCircle,
    MessageSquare,
    BarChart3,
    LogOut,
    UserCheck,
    ClipboardList,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ── Admin page context so sibling components can share which page is active ── */
export type AdminPage = 'staff' | 'analytics' | 'feedback-forms';
interface AdminNavCtx { page: AdminPage; setPage: (p: AdminPage) => void; }
export const AdminNavContext = createContext<AdminNavCtx>({ page: 'staff', setPage: () => {} });
export const useAdminNav = () => useContext(AdminNavContext);

const Sidebar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { page, setPage } = useAdminNav();

    const handleLogout = () => {
        logout();
        navigate(`/login/${user?.role || 'student'}`);
    };

    const adminItems: { icon: React.ElementType; label: string; id: AdminPage }[] = [
        { icon: Users,         label: 'Staff Management',  id: 'staff' },
        { icon: BarChart3,     label: 'System Analytics',  id: 'analytics' },
        { icon: ClipboardList, label: 'Feedback Forms',    id: 'feedback-forms' },
    ];

    const otherItems = () => {
        switch (user?.role) {
            case 'hod':
                return [
                    { icon: MessageSquare, label: 'Manage Feedback', active: true },
                    { icon: UserCheck,     label: 'Department Staff', active: false },
                    { icon: Users,         label: 'Students',         active: false },
                ];
            case 'staff':
                return [
                    { icon: MessageSquare, label: 'Student Feedback', active: true },
                    { icon: BarChart3,     label: 'My Reports',       active: false },
                ];
            default:
                return [
                    { icon: MessageSquare, label: 'Available Feedback', active: true },
                    { icon: BarChart3,     label: 'My Submissions',     active: false },
                ];
        }
    };

    return (
        <aside className="sidebar">
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, background: 'linear-gradient(to right, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    EduFeedback
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>College Management</p>
            </div>

            <nav style={{ flex: 1 }}>
                <ul style={{ listStyle: 'none' }}>
                    {user?.role === 'admin'
                        ? adminItems.map(item => {
                            const active = page === item.id;
                            return (
                                <li key={item.id} style={{ marginBottom: '0.5rem' }}>
                                    <button
                                        onClick={() => setPage(item.id)}
                                        style={{
                                            display: 'flex', alignItems: 'center', width: '100%',
                                            padding: '0.75rem 1rem', borderRadius: '8px',
                                            color: active ? 'white' : 'var(--text-muted)',
                                            background: active ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                                            textDecoration: 'none', transition: '0.2s',
                                            border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.95rem',
                                        }}
                                    >
                                        <item.icon size={20} style={{ marginRight: '0.75rem', color: active ? 'var(--primary)' : 'var(--text-muted)' }} />
                                        <span style={{ fontWeight: active ? 600 : 400 }}>{item.label}</span>
                                    </button>
                                </li>
                            );
                        })
                        : otherItems().map((item, idx) => (
                            <li key={idx} style={{ marginBottom: '0.5rem' }}>
                                <a href="#" style={{
                                    display: 'flex', alignItems: 'center',
                                    padding: '0.75rem 1rem', borderRadius: '8px',
                                    color: item.active ? 'white' : 'var(--text-muted)',
                                    background: item.active ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                                    textDecoration: 'none', transition: '0.2s'
                                }}>
                                    <item.icon size={20} style={{ marginRight: '0.75rem', color: item.active ? 'var(--primary)' : 'var(--text-muted)' }} />
                                    <span style={{ fontWeight: item.active ? 600 : 400 }}>{item.label}</span>
                                </a>
                            </li>
                        ))
                    }
                </ul>
            </nav>

            <div style={{ borderTop: '1px solid var(--surface-border)', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '0.75rem' }}>
                        <UserCircle color="white" />
                    </div>
                    <div>
                        <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user?.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.role.toUpperCase()} {user?.isHOD ? '(HOD)' : ''}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    style={{
                        display: 'flex', alignItems: 'center', width: '100%',
                        padding: '0.75rem', borderRadius: '8px',
                        color: 'var(--error)', background: 'rgba(239, 68, 68, 0.1)', fontWeight: 600
                    }}
                >
                    <LogOut size={18} style={{ marginRight: '0.75rem' }} />
                    Logout
                </button>
            </div>
        </aside>
    );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [page, setPage] = useState<AdminPage>('staff');

    return (
        <AdminNavContext.Provider value={{ page, setPage }}>
            <div className="dashboard-layout">
                <Sidebar />
                <main className="main-content">
                    {/* For non-admin, just render children directly */}
                    {user?.role !== 'admin' ? children : null}
                    {/* For admin, children is AdminDashboard which reads page from context */}
                    {user?.role === 'admin' ? children : null}
                </main>
            </div>
        </AdminNavContext.Provider>
    );
};

export default Layout;
