
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, Users, Globe, Search, Edit, Trash2, Plus,
    Save, TrendingUp, DollarSign, Activity, AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
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

const SuperAdmin = () => {
    const { tenant } = useTenant();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalTenants: 0,
        activeTenants: 0,
        mrr: 0,
        growth: 15
    });

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

    const [newTenant, setNewTenant] = useState({
        name: '',
        plan: 'free'
    });

    useEffect(() => {
        if (tenant.role !== 'SUPER_ADMIN') {
            navigate('/');
        }
    }, [tenant.role, navigate]);

    useEffect(() => {
        fetchTenants();
    }, []);

    const fetchTenants = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('tenants')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                const enriched = data.map(t => ({
                    ...t,
                    revenue: t.plan === 'enterprise' ? 1297 : t.plan === 'pro' ? 597 : t.plan === 'starter' ? 297 : 0
                }));
                setTenants(enriched);

                const active = enriched.filter(t => t.plan_status === 'active').length;
                const mrr = enriched.reduce((acc, t) => acc + (t.revenue || 0), 0);

                setStats({
                    totalTenants: enriched.length,
                    activeTenants: active,
                    mrr: mrr,
                    growth: 12
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
            const { error } = await supabase
                .from('tenants')
                .insert([{
                    name: newTenant.name,
                    plan: newTenant.plan,
                    plan_status: 'active'
                }]);

            if (error) throw error;
            setIsAddModalOpen(false);
            fetchTenants();
            setNewTenant({ name: '', plan: 'free' });
        } catch (error) {
            console.error(error);
            alert("Erro ao criar gabinete.");
        }
    };

    const handleUpdateTenant = async () => {
        if (!selectedTenant) return;
        try {
            const { error } = await supabase
                .from('tenants')
                .update({
                    name: selectedTenant.name,
                    plan: selectedTenant.plan,
                    plan_status: selectedTenant.plan_status
                })
                .eq('id', selectedTenant.id);

            if (error) throw error;
            setIsEditModalOpen(false);
            fetchTenants();
        } catch (e) {
            console.error(e);
            alert("Erro ao atualizar.");
        }
    };

    const handleDeleteTenant = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este gabinete? Esta ação é irreversível.")) return;
        const { error } = await supabase.from('tenants').delete().eq('id', id);
        if (error) alert("Erro ao excluir.");
        else fetchTenants();
    };

    const filteredTenants = tenants.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.includes(searchTerm)
    );

    // Simulated Chart Data
    const revenueData = [
        { name: 'Jan', revenue: stats.mrr * 0.7 },
        { name: 'Feb', revenue: stats.mrr * 0.75 },
        { name: 'Mar', revenue: stats.mrr * 0.8 },
        { name: 'Apr', revenue: stats.mrr * 0.85 },
        { name: 'May', revenue: stats.mrr * 0.95 },
        { name: 'Jun', revenue: stats.mrr }
    ];

    const planData = [
        { name: 'Enterprise', value: tenants.filter(t => t.plan === 'enterprise').length, color: '#d4af37' },
        { name: 'Pro', value: tenants.filter(t => t.plan === 'pro').length, color: '#667eea' },
        { name: 'Starter', value: tenants.filter(t => t.plan === 'starter').length, color: '#3182ce' },
        { name: 'Free', value: tenants.filter(t => t.plan === 'free').length, color: '#a0aec0' }
    ].filter(p => p.value > 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ paddingBottom: '3rem' }}
        >
            <style>{`
                .admin-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2.5rem;
                }
                .admin-card {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: 20px;
                    padding: 1.5rem;
                    box-shadow: var(--shadow-sm);
                    position: relative;
                    overflow: hidden;
                }
                .plan-badge {
                   padding: 4px 12px;
                    border-radius: 8px;
                    font-size: 0.7rem;
                    font-weight: 800;
                    text-transform: uppercase;
                }
            `}</style>

            <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                        HQ <span className="text-gold">Administrative</span>
                    </h1>
                    <p style={{ color: 'var(--text-light)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Shield size={16} color="var(--secondary)" /> SaaS Global Control Center • v2.5.0 Premium
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setIsAddModalOpen(true)} className="btn-gold" style={{ height: '48px' }}>
                        <Plus size={20} /> Deploy New Tenant
                    </button>
                </div>
            </header>

            {/* Metrics Row */}
            <div className="admin-grid">
                {[
                    { label: 'Total MRR', value: `R$ ${stats.mrr.toLocaleString()}`, icon: DollarSign, color: '#38a169', trend: `+${stats.growth}%` },
                    { label: 'Active Tenants', value: stats.activeTenants.toLocaleString(), icon: Globe, color: '#667eea', trend: 'Global' },
                    { label: 'Avg Ticket', value: `R$ ${(stats.mrr / (stats.totalTenants || 1)).toFixed(0)}`, icon: Activity, color: '#d4af37', trend: 'Health' },
                    { label: 'Churn Rate', value: '1.2%', icon: AlertTriangle, color: '#e53e3e', trend: 'Low' }
                ].map((m, i) => (
                    <div key={i} className="admin-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{ background: `${m.color}15`, padding: '10px', borderRadius: '12px', color: m.color }}>
                                <m.icon size={22} />
                            </div>
                            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: m.color, background: `${m.color}10`, padding: '2px 8px', borderRadius: '50px' }}>
                                {m.trend}
                            </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 700, textTransform: 'uppercase' }}>{m.label}</p>
                        <h2 style={{ margin: '5px 0 0', fontSize: '1.8rem', fontWeight: 800 }}>{loading ? '...' : m.value}</h2>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="admin-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                        <h3 style={{ margin: 0, fontWeight: 800 }}>Revenue Growth (MRR)</h3>
                        <TrendingUp size={20} color="#38a169" />
                    </div>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#38a169" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#38a169" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-light)' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-light)' }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }} />
                                <Area type="monotone" dataKey="revenue" stroke="#38a169" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="admin-card">
                    <h3 style={{ margin: '0 0 1.5rem 0', fontWeight: 800 }}>Plan Distribution</h3>
                    <div style={{ height: '200px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={planData} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: 'var(--text)' }} width={80} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="value" barSize={20} radius={[0, 10, 10, 0]}>
                                    {planData.map((entry, index) => (
                                        <Cell key={index} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {planData.map((p, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: p.color }}></div>
                                    <span style={{ fontWeight: 600 }}>{p.name}</span>
                                </div>
                                <span style={{ fontWeight: 800 }}>{p.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* User Management Table */}
            <div className="admin-card" style={{ padding: 0 }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Users size={20} className="text-gold" />
                        <h3 style={{ margin: 0, fontWeight: 800 }}>Tenant Ecosystem</h3>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                            <input
                                type="text"
                                placeholder="Search tenant..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                style={{ padding: '8px 12px 8px 36px', borderRadius: '10px', width: '250px' }}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'var(--bg-color)', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.7rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Organization</th>
                                <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.7rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>SaaS Plan</th>
                                <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.7rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.7rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>MRR Contribution</th>
                                <th style={{ padding: '12px 20px', textAlign: 'right', fontSize: '0.7rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center' }}>Optimizing view...</td></tr>
                            ) : filteredTenants.map(t => (
                                <tr key={t.id} style={{ borderBottom: '1px solid var(--border)', transition: 'all 0.2s' }} className="hover-bg">
                                    <td style={{ padding: '16px 20px' }}>
                                        <div style={{ fontWeight: 800, color: 'var(--text)', fontSize: '0.95rem' }}>{t.name}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>ID: {t.id.slice(0, 8)}... • {new Date(t.created_at).toLocaleDateString()}</div>
                                    </td>
                                    <td style={{ padding: '16px 20px' }}>
                                        <span className="plan-badge" style={{
                                            background: t.plan === 'enterprise' ? '#d4af3720' : t.plan === 'pro' ? '#667eea20' : '#a0aec020',
                                            color: t.plan === 'enterprise' ? '#d4af37' : t.plan === 'pro' ? '#667eea' : 'var(--text-light)'
                                        }}>
                                            {t.plan}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.plan_status === 'active' ? '#38a169' : '#e53e3e' }}></div>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: t.plan_status === 'active' ? '#38a169' : '#e53e3e' }}>{t.plan_status}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 20px', fontWeight: 800, color: 'var(--text)' }}>R$ {(t.revenue || 0).toLocaleString()}</td>
                                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <button onClick={() => { setSelectedTenant(t); setIsEditModalOpen(true); }} style={{ padding: '6px', borderRadius: '8px', background: 'var(--bg-color)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDeleteTenant(t.id)} style={{ padding: '6px', borderRadius: '8px', background: 'var(--bg-color)', border: '1px solid var(--border)', color: '#e53e3e' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Deploy New Cabinet">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group">
                        <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-light)' }}>Cabinet Name</label>
                        <input
                            type="text"
                            className="form-input"
                            value={newTenant.name}
                            onChange={e => setNewTenant({ ...newTenant, name: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-light)' }}>Selection Plan</label>
                        <select
                            className="form-input"
                            value={newTenant.plan}
                            onChange={e => setNewTenant({ ...newTenant, plan: e.target.value })}
                        >
                            <option value="free">Free Tier</option>
                            <option value="starter">Starter Monthly</option>
                            <option value="pro">Pro Scale</option>
                            <option value="enterprise">Enterprise Custom</option>
                        </select>
                    </div>
                    <button className="btn-gold" style={{ width: '100%', marginTop: '1rem' }} onClick={handleCreateTenant}>
                        Confirm Deployment
                    </button>
                </div>
            </Modal>

            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Manage Tenant Settings">
                {selectedTenant && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="form-group">
                            <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-light)' }}>Cabinet Name</label>
                            <input
                                type="text"
                                className="form-input"
                                value={selectedTenant.name}
                                onChange={e => setSelectedTenant({ ...selectedTenant, name: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-light)' }}>Subscription Plan</label>
                            <select
                                className="form-input"
                                value={selectedTenant.plan}
                                onChange={e => setSelectedTenant({ ...selectedTenant, plan: e.target.value })}
                            >
                                <option value="free">Free Tier</option>
                                <option value="starter">Starter</option>
                                <option value="pro">Pro Scale</option>
                                <option value="enterprise">Enterprise</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-light)' }}>Lifecycle Status</label>
                            <select
                                className="form-input"
                                value={selectedTenant.plan_status}
                                onChange={e => setSelectedTenant({ ...selectedTenant, plan_status: e.target.value })}
                            >
                                <option value="active">Active (Paid)</option>
                                <option value="past_due">Past Due (Warning)</option>
                                <option value="canceled">Canceled</option>
                            </select>
                        </div>
                        <button className="btn-gold" style={{ width: '100%', marginTop: '1rem' }} onClick={handleUpdateTenant}>
                            <Save size={20} /> Update Deployment
                        </button>
                    </div>
                )}
            </Modal>
        </motion.div>
    );
};

export default SuperAdmin;
