/* eslint-disable react-refresh/only-export-components */
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
    Menu,
    X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ── Admin page context so sibling components can share which page is active ── */
export type AdminPage = 'staff' | 'analytics' | 'feedback-forms';
interface AdminNavCtx { page: AdminPage; setPage: (p: AdminPage) => void; }
export const AdminNavContext = createContext<AdminNavCtx>({ page: 'staff', setPage: () => {} });
export const useAdminNav = () => useContext(AdminNavContext);

const Sidebar: React.FC<{ isOpen: boolean; toggle: () => void }> = ({ isOpen, toggle }) => {
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
        <>
            {isOpen && (
                <div 
                    onClick={toggle}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }}
                />
            )}
            <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                        <img 
                            src="/logo.png" 
                            alt="RIT Logo" 
                            style={{ width: '100%', maxWidth: '180px', height: 'auto' }} 
                        />
                        <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>College Management</p>
                    </div>
                    <button onClick={toggle} style={{ background: 'none', color: 'white', padding: '8px', border: 'none' }} className="md-hidden">
                        <X size={24} />
                    </button>
                </div>

                <nav style={{ flex: 1 }}>
                    <ul style={{ listStyle: 'none' }}>
                        {user?.role === 'admin'
                            ? adminItems.map(item => {
                                const active = page === item.id;
                                return (
                                    <li key={item.id} style={{ marginBottom: '0.5rem' }}>
                                        <button
                                            onClick={() => { setPage(item.id); toggle(); }}
                                            style={{
                                                display: 'flex', alignItems: 'center', width: '100%',
                                                padding: '0.85rem 1rem', borderRadius: '0',
                                                color: active ? 'white' : 'rgba(255, 255, 255, 0.7)',
                                                background: active ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                                                textDecoration: 'none', transition: '0.2s',
                                                border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem',
                                                borderLeft: active ? '4px solid var(--accent)' : '4px solid transparent',
                                                paddingLeft: '1.25rem'
                                            }}
                                        >
                                            <item.icon size={20} style={{ marginRight: '0.85rem', color: active ? 'var(--accent)' : 'rgba(255, 255, 255, 0.6)' }} />
                                            <span style={{ fontWeight: active ? 700 : 400 }}>{item.label}</span>
                                        </button>
                                    </li>
                                );
                            })
                            : otherItems().map((item, idx) => (
                                <li key={idx} style={{ marginBottom: '0.5rem' }}>
                                    <a href="#" onClick={(e) => { e.preventDefault(); toggle(); }} style={{
                                        display: 'flex', alignItems: 'center',
                                        padding: '0.85rem 1rem', borderRadius: '0',
                                        color: item.active ? 'white' : 'rgba(255, 255, 255, 0.7)',
                                        background: item.active ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                                        textDecoration: 'none', transition: '0.2s',
                                        borderLeft: item.active ? '4px solid var(--accent)' : '4px solid transparent',
                                        paddingLeft: '1.25rem'
                                    }}>
                                        <item.icon size={20} style={{ marginRight: '0.85rem', color: item.active ? 'var(--accent)' : 'rgba(255, 255, 255, 0.6)' }} />
                                        <span style={{ fontWeight: item.active ? 700 : 400 }}>{item.label}</span>
                                    </a>
                                </li>
                            ))
                        }
                    </ul>
                </nav>

                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '4px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '0.75rem' }}>
                            <UserCircle color="white" />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>{user?.name}</p>
                            <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>{user?.role.toUpperCase()} {user?.isHOD ? '(HOD)' : ''}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex', alignItems: 'center', width: '100%',
                            padding: '0.75rem', borderRadius: '8px',
                            color: '#fca5a5', background: 'rgba(239, 68, 68, 0.1)', fontWeight: 600, border: 'none', cursor: 'pointer'
                        }}
                    >
                        <LogOut size={18} style={{ marginRight: '0.75rem' }} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    useAuth();
    const [page, setPage] = useState<AdminPage>('staff');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <AdminNavContext.Provider value={{ page, setPage }}>
            <div className="dashboard-layout">
                {/* Mobile Header */}
                <div className="mobile-header" style={{
                    position: 'fixed', top: 0, left: 0, right: 0,
                    height: '60px', background: 'var(--primary)',
                    display: 'flex', alignItems: 'center', padding: '0 1rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 900,
                }}>
                    <button onClick={toggleSidebar} style={{ background: 'none', color: 'white', cursor: 'pointer', border: 'none' }}>
                        <Menu size={24} />
                    </button>
                    <div style={{ marginLeft: '1rem', flex: 1, display: 'flex', justifyContent: 'center' }}>
                        <img src="/logo.png" alt="RIT" style={{ height: '32px' }} />
                    </div>
                </div>

                <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
                <main className="main-content">
                    {children}
                </main>
            </div>
        </AdminNavContext.Provider>
    );
};

export default Layout;
