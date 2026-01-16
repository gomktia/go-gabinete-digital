import { useState } from 'react';
import {
    LayoutDashboard, Map, FileText, Bot, Share2, DollarSign, Users, Flag,
    Settings, LogOut, MessageSquare, ChevronLeft, ChevronRight, Menu, X, Calendar, Sun, Moon, User, Shield, Zap
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTenant } from '../context/TenantContext';

const Sidebar = () => {
    const location = useLocation();
    const { tenant, toggleTheme, logout } = useTenant();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

    const navItems = [
        // Super Admin Items
        { id: 'super-admin', label: 'Super Admin', icon: Shield, path: '/super-admin', roles: ['SUPER_ADMIN'] },

        // Cabinet Items
        { id: 'dashboard', label: 'Painel', icon: LayoutDashboard, path: '/', roles: ['SUPER_ADMIN', 'VEREADOR', 'ASSESSOR'] },
        { id: 'calendar', label: 'Agenda', icon: Calendar, path: '/calendar', roles: ['SUPER_ADMIN', 'VEREADOR', 'ASSESSOR'] },
        { id: 'demands', label: 'Demandas', icon: Map, path: '/demands', roles: ['SUPER_ADMIN', 'VEREADOR', 'ASSESSOR'] },
        { id: 'proposals', label: 'Proposições', icon: FileText, path: '/proposals', roles: ['SUPER_ADMIN', 'VEREADOR', 'ASSESSOR'] },
        { id: 'ai-advisor', label: 'Estratégia IA', icon: Bot, path: '/advisor', roles: ['SUPER_ADMIN', 'VEREADOR', 'ASSESSOR'] },
        { id: 'social-media', label: 'Agente Social', icon: Share2, path: '/social-media', roles: ['SUPER_ADMIN', 'VEREADOR', 'ASSESSOR'] },
        { id: 'finance', label: 'Financeiro', icon: DollarSign, path: '/finance', roles: ['SUPER_ADMIN', 'VEREADOR', 'ASSESSOR'] },
        { id: 'voters', label: 'Eleitores (CRM)', icon: Users, path: '/voters', roles: ['SUPER_ADMIN', 'VEREADOR', 'ASSESSOR'] },
        { id: 'election', label: 'Dia D (Operação)', icon: Flag, path: '/election-day', roles: ['SUPER_ADMIN', 'VEREADOR', 'ASSESSOR'] },
        { id: 'messages', label: 'WhatsApp', icon: MessageSquare, path: '/messages', roles: ['SUPER_ADMIN', 'VEREADOR', 'ASSESSOR'] },

        // Config Items (Visible only to Vereador/Admin)
        { id: 'wa-config', label: 'Conexão Zap', icon: Zap, path: '/wa-config', roles: ['SUPER_ADMIN', 'VEREADOR'] },
    ];

    const filteredItems = navItems.filter(item => item.roles.includes(tenant.role));

    return (
        <>
            <div className="mobile-header">
                <h3 style={{ margin: 0, color: 'var(--secondary)' }}>{tenant.name}</h3>
                <button onClick={toggleMobile} style={{ background: 'none', border: 'none', color: 'white' }}>
                    {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-logo" style={{ marginBottom: '2rem', textAlign: 'center', position: 'relative' }}>
                    {!isCollapsed && (
                        <>
                            <h2 style={{ color: 'var(--secondary)', fontSize: '1.25rem', letterSpacing: '1px', marginBottom: '0.25rem' }}>
                                {tenant.name.split(' ')[0]}<span style={{ color: 'white' }}>{tenant.name.split(' ')[1] || ''}</span>
                            </h2>
                            <div style={{ fontSize: '0.7rem', opacity: 0.8, color: 'white', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <span>Nº {tenant.candidateNumber || '00'}</span>
                                <span style={{ fontSize: '0.6rem', color: 'var(--secondary)', fontWeight: 700 }}>{tenant.role}</span>
                            </div>
                        </>
                    )}
                    {isCollapsed && <h2 style={{ color: 'var(--secondary)' }}>G</h2>}
                    <button
                        onClick={toggleSidebar}
                        className="desktop-only"
                        style={{
                            position: 'absolute',
                            right: '-10px',
                            top: '50%',
                            background: 'var(--secondary)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'var(--primary)',
                            zIndex: 10
                        }}
                    >
                        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    </button>
                </div>

                <nav style={{ flex: 1 }}>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {filteredItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;

                            return (
                                <li key={item.id}>
                                    <Link
                                        to={item.path}
                                        onClick={() => setIsMobileOpen(false)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem',
                                            padding: '0.75rem 1rem',
                                            color: isActive ? 'var(--secondary)' : 'white',
                                            textDecoration: 'none',
                                            borderRadius: '0.5rem',
                                            background: isActive ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        <Icon size={20} />
                                        {!isCollapsed && <span>{item.label}</span>}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="sidebar-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 0',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        marginBottom: '10px'
                    }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                        }}>
                            {tenant.photoUrl ? (
                                <img src={tenant.photoUrl} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <User size={16} color="white" />
                            )}
                        </div>
                        {!isCollapsed && (
                            <div style={{ overflow: 'hidden' }}>
                                <p style={{ margin: 0, fontSize: '0.7rem', color: 'white', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                    {tenant.email}
                                </p>
                                <div
                                    onClick={toggleTheme}
                                    style={{
                                        fontSize: '0.6rem',
                                        color: 'var(--secondary)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        marginTop: '2px'
                                    }}
                                >
                                    {tenant.theme === 'light' ? <Moon size={10} /> : <Sun size={10} />}
                                    {tenant.theme === 'light' ? 'Dark' : 'Light'}
                                </div>
                            </div>
                        )}
                        {isCollapsed && (
                            <div onClick={toggleTheme} style={{ cursor: 'pointer', color: 'var(--secondary)' }}>
                                {tenant.theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                            </div>
                        )}
                    </div>

                    {(tenant.role === 'SUPER_ADMIN' || tenant.role === 'VEREADOR') && (
                        <Link to="/settings" onClick={() => setIsMobileOpen(false)} style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.9rem', opacity: 0.7 }}>
                            <Settings size={18} />
                            {!isCollapsed && <span>Configurações</span>}
                        </Link>
                    )}

                    <button
                        onClick={logout}
                        style={{ background: 'none', border: 'none', color: '#ff6b6b', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', outline: 'none', padding: '0.5rem 0', fontSize: '0.9rem' }}
                    >
                        <LogOut size={18} />
                        {!isCollapsed && <span>Sair</span>}
                    </button>
                </div>
            </aside>

            {isMobileOpen && (
                <div
                    onClick={() => setIsMobileOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        zIndex: 998
                    }}
                />
            )}
        </>
    );
};

export default Sidebar;
