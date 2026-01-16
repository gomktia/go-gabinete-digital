import { useState } from 'react';
import {
    LayoutDashboard, Map, FileText, Bot, Share2, DollarSign, Users,
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
        { id: 'messages', label: 'WhatsApp', icon: MessageSquare, path: '/messages', roles: ['SUPER_ADMIN', 'VEREADOR', 'ASSESSOR'] },

        // Config Items (Visible only to Vereador/Admin)
        { id: 'wa-config', label: 'Conexão Zap', icon: Zap, path: '/wa-config', roles: ['SUPER_ADMIN', 'VEREADOR'] },
    ];

    const filteredItems = navItems.filter(item => item.roles.includes(tenant.role));

    return (
        <>
            <div className="mobile-header">
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{tenant.name}</h3>
                <button onClick={toggleMobile} style={{ background: 'none', border: 'none', color: 'white', display: 'flex', alignItems: 'center' }}>
                    {isMobileOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-logo" style={{ marginBottom: '2rem', textAlign: 'center', position: 'relative' }}>
                    {!isCollapsed && (
                        <>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                background: 'white',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1rem',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}>
                                <Shield size={32} color="var(--primary)" />
                            </div>
                            <h2 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                                {tenant.name}
                            </h2>
                            <div style={{ fontSize: '0.8rem', opacity: 0.7, color: 'white' }}>
                                Mandato Inovador
                            </div>
                        </>
                    )}
                    {isCollapsed && (
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Shield size={28} color="white" />
                        </div>
                    )}

                    <button
                        onClick={toggleSidebar}
                        className="desktop-only"
                        style={{
                            position: 'absolute',
                            right: '-12px',
                            top: '20px',
                            background: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'var(--primary)',
                            zIndex: 10,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    </button>
                </div>

                <nav style={{ flex: 1, overflowY: 'auto' }} className="sidebar-scroll">
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
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
                                            color: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.8)',
                                            textDecoration: 'none',
                                            borderRadius: '0.5rem',
                                            background: isActive ? 'white' : 'transparent',
                                            fontWeight: isActive ? 600 : 400,
                                            transition: 'all 0.2s',
                                            margin: isCollapsed ? '0 auto' : '0 0.5rem',
                                            justifyContent: isCollapsed ? 'center' : 'flex-start'
                                        }}
                                        title={isCollapsed ? item.label : ''}
                                    >
                                        <Icon size={20} />
                                        {!isCollapsed && <span>{item.label}</span>}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="sidebar-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        background: 'rgba(0,0,0,0.2)',
                        marginBottom: '10px'
                    }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            flexShrink: 0
                        }}>
                            {tenant.photoUrl ? (
                                <img src={tenant.photoUrl} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <User size={20} color="var(--primary)" />
                            )}
                        </div>
                        {!isCollapsed && (
                            <div style={{ overflow: 'hidden', flex: 1 }}>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'white', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                    {tenant.name.split(' ')[0]}
                                </p>
                                <div
                                    onClick={toggleTheme}
                                    style={{
                                        fontSize: '0.7rem',
                                        color: 'rgba(255,255,255,0.7)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        marginTop: '2px'
                                    }}
                                >
                                    {tenant.theme === 'light' ? <Moon size={10} /> : <Sun size={10} />}
                                    {tenant.theme === 'light' ? 'Escuro' : 'Claro'}
                                </div>
                            </div>
                        )}
                    </div>

                    {!isCollapsed && (tenant.role === 'SUPER_ADMIN' || tenant.role === 'VEREADOR') && (
                        <Link to="/settings" onClick={() => setIsMobileOpen(false)} style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.9rem', opacity: 0.8, padding: '0.5rem', borderRadius: '0.5rem', transition: 'background 0.2s' }}>
                            <Settings size={18} />
                            <span>Configurações</span>
                        </Link>
                    )}

                    <button
                        onClick={logout}
                        style={{ background: 'none', border: 'none', color: '#ff8a8a', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', outline: 'none', padding: '0.5rem', fontSize: '0.9rem', justifyContent: isCollapsed ? 'center' : 'flex-start' }}
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
                        backdropFilter: 'blur(2px)',
                        zIndex: 998
                    }}
                />
            )}
        </>
    );
};

export default Sidebar;
