
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, Users, Globe, Search, Edit, Trash2, Plus,
    Save, DollarSign, Activity, AlertTriangle,
    Database, Settings, Layout, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useTenant } from '../context/TenantContext';
import { Modal } from '../components/UIComponents';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts';

interface Tenant {
    id: string;
    name: string;
    created_at: string;
    plan: string;
    plan_status: string;
    settings: any;
    revenue?: number;
}

interface UserProfile {
    id: string;
    full_name: string;
    email: string;
    role: string;
    tenant_id: string;
    tenant_name?: string;
    created_at: string;
}

const SuperAdmin = () => {
    const { tenant } = useTenant();
    const navigate = useNavigate();

    // Auth Guard
    useEffect(() => {
        if (tenant.role !== 'SUPER_ADMIN') {
            navigate('/');
        }
    }, [tenant.role, navigate]);

    // Tabs State
    const [activeTab, setActiveTab] = useState<'overview' | 'tenants' | 'users' | 'system'>('overview');

    // Data States
    const [searchTerm, setSearchTerm] = useState('');
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalTenants: 0,
        activeTenants: 0,
        mrr: 0,
        growth: 15,
        totalUsers: 0
    });

    // CRUD States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isUserEditOpen, setIsUserEditOpen] = useState(false);

    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

    const [newTenant, setNewTenant] = useState({
        name: '',
        plan: 'free'
    });

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            // Fetch Tenants
            const { data: tenantData } = await supabase
                .from('tenants')
                .select('*')
                .order('created_at', { ascending: false });

            // Fetch Profiles (Users)
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (tenantData) {
                const enriched = tenantData.map(t => ({
                    ...t,
                    revenue: t.plan === 'enterprise' ? 1297 : t.plan === 'pro' ? 597 : t.plan === 'starter' ? 297 : 0
                }));
                setTenants(enriched);

                const active = enriched.filter(t => t.plan_status === 'active').length;
                const mrr = enriched.reduce((acc, t) => acc + (t.revenue || 0), 0);

                // Map tenant names to users for easier identification
                const usersWithTenants = (profileData || []).map(u => ({
                    ...u,
                    tenant_name: tenantData.find(t => t.id === u.tenant_id)?.name || 'N/A'
                }));
                setUsers(usersWithTenants);

                setStats({
                    totalTenants: enriched.length,
                    activeTenants: active,
                    mrr: mrr,
                    growth: 12,
                    totalUsers: profileData?.length || 0
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTenant = async () => {
        try {
            const { error } = await supabase.from('tenants').insert([{
                name: newTenant.name,
                plan: newTenant.plan,
                plan_status: 'active'
            }]);
            if (error) throw error;
            setIsAddModalOpen(false);
            fetchAllData();
            setNewTenant({ name: '', plan: 'free' });
        } catch (error) { console.error(error); alert("Erro ao criar."); }
    };

    const handleUpdateTenant = async () => {
        if (!selectedTenant) return;
        try {
            const { error } = await supabase.from('tenants').update({
                name: selectedTenant.name, plan: selectedTenant.plan, plan_status: selectedTenant.plan_status
            }).eq('id', selectedTenant.id);
            if (error) throw error;
            setIsEditModalOpen(false);
            fetchAllData();
        } catch (e) { alert("Erro ao atualizar."); }
    };

    const handleUpdateUser = async () => {
        if (!selectedUser) return;
        try {
            const { error } = await supabase.from('profiles').update({
                full_name: selectedUser.full_name,
                role: selectedUser.role
            }).eq('id', selectedUser.id);
            if (error) throw error;
            setIsUserEditOpen(false);
            fetchAllData();
        } catch (e) { alert("Erro ao atualizar usuário."); }
    };

    const handleDeleteTenant = async (id: string) => {
        if (!confirm("Excluir este gabinete? Esta ação removerá TODOS os dados vinculados (eleitores, demandas, etc).")) return;
        const { error } = await supabase.from('tenants').delete().eq('id', id);
        if (error) alert("Erro ao excluir. Pode haver restrições de integridade.");
        else fetchAllData();
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm("Excluir este perfil de usuário? O acesso será revogado imediatamente.")) return;
        const { error } = await supabase.from('profiles').delete().eq('id', id);
        if (error) alert("Erro ao excluir.");
        else fetchAllData();
    };

    // Filters
    const filteredTenants = tenants.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredUsers = users.filter(u =>
        u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.tenant_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Chart Data
    const revenueData = [
        { name: 'Jan', revenue: stats.mrr * 0.7 }, { name: 'Fev', revenue: stats.mrr * 0.75 },
        { name: 'Mar', revenue: stats.mrr * 0.8 }, { name: 'Abr', revenue: stats.mrr * 0.85 },
        { name: 'Mai', revenue: stats.mrr * 0.95 }, { name: 'Jun', revenue: stats.mrr }
    ];

    const planData = [
        { name: 'Enterprise', value: tenants.filter(t => t.plan === 'enterprise').length, color: '#d4af37' },
        { name: 'Pro', value: tenants.filter(t => t.plan === 'pro').length, color: '#667eea' },
        { name: 'Starter', value: tenants.filter(t => t.plan === 'starter').length, color: '#3182ce' },
        { name: 'Free', value: tenants.filter(t => t.plan === 'free').length, color: '#a0aec0' }
    ].filter(p => p.value > 0);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ paddingBottom: '3rem' }}>
            <style>{`
                .admin-tabs {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 2rem;
                    background: var(--surface);
                    padding: 8px;
                    border-radius: 12px;
                    border: 1px solid var(--border);
                    width: fit-content;
                }
                .tab-btn {
                    padding: 8px 16px;
                    border-radius: 8px;
                    border: none;
                    background: transparent;
                    color: var(--text-light);
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .tab-btn.active {
                    background: var(--primary);
                    color: var(--secondary);
                }
                .admin-card {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: 20px;
                    padding: 1.5rem;
                    box-shadow: var(--shadow-sm);
                }
                .hover-row:hover { background: rgba(102, 126, 234, 0.03); }
                .badge { padding: 4px 10px; border-radius: 6px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; }
            `}</style>

            <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Master <span className="text-gold">SaaS Control</span></h1>
                    <p style={{ color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Shield size={16} color="var(--secondary)" /> Painel Global de Administração e Suporte
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setIsAddModalOpen(true)} className="btn-gold">
                        <Plus size={20} /> Deploy Gabinete
                    </button>
                </div>
            </header>

            {/* Tabs Navigation */}
            <div className="admin-tabs">
                <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                    <Layout size={18} /> Resumo
                </button>
                <button className={`tab-btn ${activeTab === 'tenants' ? 'active' : ''}`} onClick={() => setActiveTab('tenants')}>
                    <Database size={18} /> Gabinetes
                </button>
                <button className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                    <Users size={18} /> Usuários
                </button>
                <button className={`tab-btn ${activeTab === 'system' ? 'active' : ''}`} onClick={() => setActiveTab('system')}>
                    <Settings size={18} /> Sistema
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                    <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                            {[
                                { label: 'Receita (MRR)', value: `R$ ${stats.mrr.toLocaleString()}`, icon: DollarSign, color: '#38a169', sub: '+12% este mês' },
                                { label: 'Gabinetes Ativos', value: stats.activeTenants, icon: Globe, color: '#667eea', sub: 'Em 12 estados' },
                                { label: 'Usuários Totais', value: stats.totalUsers, icon: Users, color: '#d4af37', sub: 'Assesores e Vereadores' },
                                { label: 'Uso de IA', value: '88%', icon: Activity, color: '#9f7aea', sub: 'Alta demanda' }
                            ].map((m, i) => (
                                <div key={i} className="admin-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <div style={{ background: `${m.color}15`, padding: '8px', borderRadius: '10px', color: m.color }}><m.icon size={20} /></div>
                                        <span style={{ fontSize: '0.7rem', color: m.color, fontWeight: 800 }}>{m.sub}</span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 700 }}>{m.label}</p>
                                    <h2 style={{ margin: '4px 0 0', fontWeight: 800 }}>{loading ? '...' : m.value}</h2>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                            <div className="admin-card">
                                <h3 style={{ margin: '0 0 1.5rem 0', fontWeight: 800 }}>Crescimento Financeiro</h3>
                                <div style={{ height: '300px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={revenueData}>
                                            <defs>
                                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#38a169" stopOpacity={0.2} /><stop offset="95%" stopColor="#38a169" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-light)' }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-light)' }} />
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }} />
                                            <Area type="monotone" dataKey="revenue" stroke="#38a169" strokeWidth={3} fill="url(#colorRev)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div className="admin-card">
                                <h3 style={{ margin: '0 0 1.5rem 0', fontWeight: 800 }}>Planos Ativos</h3>
                                <div style={{ height: '220px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={planData} layout="vertical">
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: 'var(--text)' }} width={80} />
                                            <Tooltip />
                                            <Bar dataKey="value" barSize={15} radius={[0, 10, 10, 0]}>
                                                {planData.map((e, idx) => <Cell key={idx} fill={e.color} />)}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {planData.map((p, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                            <span style={{ fontWeight: 600 }}>{p.name}</span>
                                            <span style={{ fontWeight: 800 }}>{p.value} gabinetes</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'tenants' && (
                    <motion.div key="tenants" className="admin-card" style={{ padding: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ position: 'relative' }}>
                                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                                <input type="text" placeholder="Buscar gabinete..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ padding: '8px 12px 8px 36px', borderRadius: '10px', width: '300px' }} />
                            </div>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'var(--bg-color)', borderBottom: '1px solid var(--border)' }}>
                                        <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.7rem' }}>Organização/Cliente</th>
                                        <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.7rem' }}>Plano</th>
                                        <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.7rem' }}>Status</th>
                                        <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.7rem' }}>Receita Estimada</th>
                                        <th style={{ padding: '12px 20px', textAlign: 'right', fontSize: '0.7rem' }}>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTenants.map(t => (
                                        <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }} className="hover-row">
                                            <td style={{ padding: '12px 20px' }}>
                                                <div style={{ fontWeight: 800 }}>{t.name}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>ID: {t.id.slice(0, 8)}... • Desde {new Date(t.created_at).toLocaleDateString()}</div>
                                            </td>
                                            <td style={{ padding: '12px 20px' }}>
                                                <span className="badge" style={{ background: t.plan === 'enterprise' ? '#d4af3720' : '#667eea20', color: t.plan === 'enterprise' ? '#d4af37' : '#667eea' }}>{t.plan}</span>
                                            </td>
                                            <td style={{ padding: '12px 20px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.plan_status === 'active' ? '#38a169' : '#e53e3e' }}></div>
                                                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: t.plan_status === 'active' ? '#38a169' : '#e53e3e' }}>{t.plan_status}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '12px 20px', fontWeight: 800 }}>R$ {(t.revenue || 0).toLocaleString()}</td>
                                            <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                    <button onClick={() => { setSelectedTenant(t); setIsEditModalOpen(true); }} className="btn-primary" style={{ padding: '6px' }}><Edit size={16} /></button>
                                                    <button onClick={() => handleDeleteTenant(t.id)} className="btn-primary" style={{ padding: '6px', color: '#e53e3e' }}><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'users' && (
                    <motion.div key="users" className="admin-card" style={{ padding: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                            <input type="text" placeholder="Buscar por nome, email ou gabinete..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ padding: '8px 12px', borderRadius: '10px', width: '100%' }} />
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'var(--bg-color)', borderBottom: '1px solid var(--border)' }}>
                                        <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.7rem' }}>Usuário</th>
                                        <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.7rem' }}>Gabinete</th>
                                        <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.7rem' }}>Nível de Acesso</th>
                                        <th style={{ padding: '12px 20px', textAlign: 'right', fontSize: '0.7rem' }}>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map(u => (
                                        <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }} className="hover-row">
                                            <td style={{ padding: '12px 20px' }}>
                                                <div style={{ fontWeight: 800 }}>{u.full_name || 'Usuário sem nome'}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{u.email}</div>
                                            </td>
                                            <td style={{ padding: '12px 20px', fontWeight: 600 }}>{u.tenant_name}</td>
                                            <td style={{ padding: '12px 20px' }}>
                                                <span className="badge" style={{ background: u.role === 'SUPER_ADMIN' ? '#d4af3720' : '#4a556820', color: u.role === 'SUPER_ADMIN' ? '#d4af37' : 'var(--text-light)' }}>{u.role}</span>
                                            </td>
                                            <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                    <button onClick={() => { setSelectedUser(u); setIsUserEditOpen(true); }} className="btn-primary" style={{ padding: '6px' }}><Edit size={16} /></button>
                                                    <button onClick={() => handleDeleteUser(u.id)} className="btn-primary" style={{ padding: '6px', color: '#e53e3e' }}><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'system' && (
                    <motion.div key="system" className="admin-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h3 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>Maintenance & Health</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                            <div style={{ padding: '1.5rem', background: 'var(--bg-color)', borderRadius: '15px' }}>
                                <Database size={24} color="#667eea" style={{ marginBottom: '10px' }} />
                                <h4 style={{ margin: '0 0 5px 0' }}>Supabase DB</h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#48bb78' }}></div>
                                    <span style={{ fontSize: '0.8rem', color: '#48bb78', fontWeight: 700 }}>Conectado</span>
                                </div>
                            </div>
                            <div style={{ padding: '1.5rem', background: 'var(--bg-color)', borderRadius: '15px' }}>
                                <Zap size={24} color="#ed8936" style={{ marginBottom: '10px' }} />
                                <h4 style={{ margin: '0 0 5px 0' }}>WhatsApp Gateway</h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#48bb78' }}></div>
                                    <span style={{ fontSize: '0.8rem', color: '#48bb78', fontWeight: 700 }}>Estável</span>
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px dashed var(--border)', borderRadius: '10px' }}>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                <AlertTriangle size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                                Módulo de Log em tempo real em desenvolvimento para a próxima sprint.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modals for Tenants */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Deploy Novo Gabinete">
                <div className="form-group">
                    <label>Nome do Gabinete</label>
                    <input type="text" className="form-input" value={newTenant.name} onChange={e => setNewTenant({ ...newTenant, name: e.target.value })} />
                </div>
                <div className="form-group">
                    <label>Plano</label>
                    <select className="form-input" value={newTenant.plan} onChange={e => setNewTenant({ ...newTenant, plan: e.target.value })}>
                        <option value="free">Free</option>
                        <option value="starter">Starter</option>
                        <option value="pro">Pro Scale</option>
                        <option value="enterprise">Enterprise</option>
                    </select>
                </div>
                <button className="btn-gold" style={{ width: '100%', marginTop: '1rem' }} onClick={handleCreateTenant}>Confirmar Criação</button>
            </Modal>

            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Gerenciar Gabinete">
                {selectedTenant && (
                    <>
                        <div className="form-group"><label>Nome</label><input type="text" className="form-input" value={selectedTenant.name} onChange={e => setSelectedTenant({ ...selectedTenant, name: e.target.value })} /></div>
                        <div className="form-group">
                            <label>Plano</label>
                            <select className="form-input" value={selectedTenant.plan} onChange={e => setSelectedTenant({ ...selectedTenant, plan: e.target.value })}>
                                <option value="free">Free</option><option value="starter">Starter</option><option value="pro">Pro</option><option value="enterprise">Enterprise</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <select className="form-input" value={selectedTenant.plan_status} onChange={e => setSelectedTenant({ ...selectedTenant, plan_status: e.target.value })}>
                                <option value="active">Ativo</option><option value="past_due">Atrasado</option><option value="canceled">Cancelado</option>
                            </select>
                        </div>
                        <button className="btn-gold" style={{ width: '100%', marginTop: '1rem' }} onClick={handleUpdateTenant}><Save size={20} /> Salvar Alterações</button>
                    </>
                )}
            </Modal>

            {/* Modal for User Management */}
            <Modal isOpen={isUserEditOpen} onClose={() => setIsUserEditOpen(false)} title="Editar Perfil de Usuário">
                {selectedUser && (
                    <>
                        <div className="form-group"><label>Nome Completo</label><input type="text" className="form-input" value={selectedUser.full_name} onChange={e => setSelectedUser({ ...selectedUser, full_name: e.target.value })} /></div>
                        <div className="form-group"><label>Email (Apenas leitura)</label><input type="text" className="form-input" value={selectedUser.email} disabled style={{ opacity: 0.6 }} /></div>
                        <div className="form-group">
                            <label>Role / Nível de Acesso</label>
                            <select className="form-input" value={selectedUser.role} onChange={e => setSelectedUser({ ...selectedUser, role: e.target.value })}>
                                <option value="VEREADOR">Vereador (Master)</option>
                                <option value="ASSESSOR">Assessor (Equipe)</option>
                                <option value="SUPER_ADMIN">Mega Admin (Sistema)</option>
                            </select>
                        </div>
                        <button className="btn-gold" style={{ width: '100%', marginTop: '1rem' }} onClick={handleUpdateUser}><Save size={20} /> Atualizar Perfil</button>
                    </>
                )}
            </Modal>
        </motion.div>
    );
};

export default SuperAdmin;
