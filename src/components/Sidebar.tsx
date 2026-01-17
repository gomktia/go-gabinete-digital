import { useState } from 'react';
import {
    LayoutDashboard, Map, FileText, Bot, Share2, DollarSign, Users,
    Settings, LogOut, MessageSquare, ChevronLeft, ChevronRight, Menu, X, Calendar, Sun, Moon, User, Shield, Zap, Globe, Briefcase, ChevronDown, List
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTenant } from '../context/TenantContext';
import { AnimatePresence, motion } from 'framer-motion';

const Sidebar = () => {
    const location = useLocation();
    const { tenant, toggleTheme, logout } = useTenant();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // State to track expanded groups. 
    // In collapsed sidebar mode, groups might behavior differently (e.g. popups), but for now we'll just keep them expandable.
    const [expandedGroups, setExpandedGroups] = useState<string[]>(['gestao', 'legislativo', 'comunicacao', 'estrategia']);

    const toggleSidebar = () => setIsCollapsed(!isCollapsed);
    const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

    const toggleGroup = (groupId: string) => {
        if (isCollapsed) return; // Don't toggle in collapsed mode
        setExpandedGroups(prev =>
            prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
        );
    };

    // Organized Groups
    const navGroups = [
        {
            id: 'gestao',
            label: 'Gestão',
            icon: Briefcase,
            items: [
                { id: 'dashboard', label: 'Painel', icon: LayoutDashboard, path: '/', roles: ['SUPER_ADMIN', 'VEREADOR', 'ASSESSOR'] },
                { id: 'calendar', label: 'Agenda', icon: Calendar, path: '/calendar', roles: ['SUPER_ADMIN', 'VEREADOR', 'ASSESSOR'] },
                { id: 'finance', label: 'Financeiro', icon: DollarSign, path: '/finance', roles: ['SUPER_ADMIN', 'VEREADOR', 'ASSESSOR'] },
                { id: 'team', label: 'Equipe', icon: Users, path: '/team', roles: ['SUPER_ADMIN', 'VEREADOR', 'ASSESSOR'] },
            ]
        },
        {
            id: 'legislativo',
            label: 'Legislativo',
            icon: FileText,
            items: [
                { id: 'docs', label: 'Tramitação', icon: FileText, path: '/documents', roles: ['SUPER_ADMIN', 'VEREADOR', 'ASSESSOR'] },
                { id: 'proposals', label: 'Proposições', icon: FileText, path: '/proposals', roles: ['SUPER_ADMIN', 'VEREADOR', 'ASSESSOR'] },
                { id: 'demands', label: 'Demandas', icon: List, path: '/demands', roles: ['SUPER_ADMIN', 'VEREADOR', 'ASSESSOR'] },
            ]
        },
        {
            id: 'comunicacao',
            label: 'Comunicação',
            icon: Share2,
            items: [
                { id: 'site', label: 'Meu Site', icon: Globe, path: '/site-builder', roles: ['SUPER_ADMIN', 'VEREADOR', 'ASSESSOR'] },
                { id: 'social-media', label: 'Agente Social', icon: Share2, path: '/social-media', roles: ['SUPER_ADMIN', 'VEREADOR', 'ASSESSOR'] },
                { id: 'messages', label: 'WhatsApp', icon: MessageSquare, path: '/messages', roles: ['SUPER_ADMIN', 'VEREADOR', 'ASSESSOR'] },
                { id: 'voters', label: 'Eleitores CRM', icon: Users, path: '/voters', roles: ['SUPER_ADMIN', 'VEREADOR', 'ASSESSOR'] },
                { id: 'wa-config', label: 'Conexão Zap', icon: Zap, path: '/wa-config', roles: ['SUPER_ADMIN', 'VEREADOR'] },
            ]
        },
        {
            id: 'estrategia',
            label: 'Estratégia',
            icon: Bot,
            items: [
                { id: 'ai-advisor', label: 'Estratégia IA', icon: Bot, path: '/advisor', roles: ['SUPER_ADMIN', 'VEREADOR', 'ASSESSOR'] },
                { id: 'map', label: 'Mapa da Mina', icon: Map, path: '/map', roles: ['SUPER_ADMIN', 'VEREADOR', 'ASSESSOR'] },
            ]
        }
    ];

    // Check if a group has any visible items for the current role
    const getVisibleItems = (groupItems: any[]) => {
        return groupItems.filter(item => item.roles.includes(tenant.role));
    };

    return (
        <>
            <div className="mobile-header">
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{tenant.name}</h3>
                <button onClick={toggleMobile} style={{ background: 'none', border: 'none', color: 'white', display: 'flex', alignItems: 'center' }}>
                    {isMobileOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-logo" style={{ marginBottom: '1.5rem', textAlign: 'center', position: 'relative' }}>
                    {!isCollapsed && (
                        <>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                background: 'var(--primary)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1rem',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}>
                                <Shield size={32} color="white" />
                            </div>
                            <h2 style={{ color: 'var(--sidebar-text)', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                                {tenant.name}
                            </h2>
                            <div style={{ fontSize: '0.8rem', opacity: 0.7, color: 'var(--sidebar-text)' }}>
                                Mandato Inovador
                            </div>
                        </>
                    )}
                    {isCollapsed && (
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Shield size={28} color="var(--primary)" />
                        </div>
                    )}

                    <button
                        onClick={toggleSidebar}
                        className="desktop-only"
                        style={{
                            position: 'absolute',
                            right: '-12px',
                            top: '20px',
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
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
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {navGroups.map((group) => {
                            const visibleItems = getVisibleItems(group.items);
                            if (visibleItems.length === 0) return null;

                            const isExpanded = expandedGroups.includes(group.id);

                            return (
                                <li key={group.id} style={{ marginBottom: isCollapsed ? '0.5rem' : '0' }}>
                                    {!isCollapsed ? (
                                        // Expanded Sidebar Group Header
                                        <div style={{ padding: '0 0.5rem' }}>
                                            <div
                                                onClick={() => toggleGroup(group.id)}
                                                style={{
                                                    padding: '1rem 0.5rem 0.5rem',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 800,
                                                    color: 'rgba(255,255,255,0.4)',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.1em',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    cursor: 'pointer',
                                                    userSelect: 'none'
                                                }}
                                            >
                                                {group.label}
                                                <ChevronDown size={12} style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
                                            </div>

                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.ul
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                                        style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px', overflow: 'hidden' }}
                                                    >
                                                        {visibleItems.map(item => {
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
                                                                            gap: '12px',
                                                                            padding: '0.75rem 1rem',
                                                                            color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                                                                            textDecoration: 'none',
                                                                            borderRadius: '12px',
                                                                            background: isActive ? 'linear-gradient(90deg, rgba(212,175,55,0.2) 0%, rgba(212,175,55,0.05) 100%)' : 'transparent',
                                                                            boxShadow: isActive ? 'inset 0 0 0 1px rgba(212,175,55,0.3)' : 'none',
                                                                            fontWeight: isActive ? 600 : 500,
                                                                            transition: 'all 0.2s ease',
                                                                            fontSize: '0.9rem'
                                                                        }}
                                                                    >
                                                                        <Icon size={18} style={{ color: isActive ? 'var(--secondary)' : 'inherit' }} />
                                                                        <span>{item.label}</span>
                                                                    </Link>
                                                                </li>
                                                            );
                                                        })}
                                                    </motion.ul>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ) : (
                                        // Collapsed Sidebar - Show Icons Only (Linear)
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                                            <div style={{ width: '24px', height: '1px', background: 'rgba(255,255,255,0.1)', margin: '1rem 0 0.5rem' }} />
                                            {visibleItems.map(item => {
                                                const Icon = item.icon;
                                                const isActive = location.pathname === item.path;
                                                return (
                                                    <Link
                                                        key={item.id}
                                                        to={item.path}
                                                        onClick={() => setIsMobileOpen(false)}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            width: '44px',
                                                            height: '44px',
                                                            color: isActive ? 'var(--secondary)' : 'rgba(255,255,255,0.6)',
                                                            borderRadius: '12px',
                                                            background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                                                            transition: 'all 0.2s',
                                                            boxShadow: isActive ? 'inset 0 0 0 1px rgba(212,175,55,0.2)' : 'none',
                                                        }}
                                                        title={item.label}
                                                    >
                                                        <Icon size={20} />
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="sidebar-footer" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        background: 'var(--sidebar-active-bg)',
                        marginBottom: '10px'
                    }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'var(--surface)',
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
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--sidebar-text)', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                    {tenant.name.split(' ')[0]}
                                </p>
                                <div
                                    onClick={toggleTheme}
                                    style={{
                                        fontSize: '0.7rem',
                                        color: 'var(--text-light)',
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
                        <Link to="/settings" onClick={() => setIsMobileOpen(false)} style={{ color: 'var(--sidebar-text)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.9rem', opacity: 0.8, padding: '0.5rem', borderRadius: '0.5rem', transition: 'background 0.2s' }}>
                            <Settings size={18} />
                            <span>Configurações</span>
                        </Link>
                    )}

                    <button
                        onClick={logout}
                        style={{ background: 'none', border: 'none', color: '#ff6b6b', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', outline: 'none', padding: '0.5rem', fontSize: '0.9rem', justifyContent: isCollapsed ? 'center' : 'flex-start' }}
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
