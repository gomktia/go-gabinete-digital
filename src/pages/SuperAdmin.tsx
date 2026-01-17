
import { useState, useEffect } from 'react';
import { Shield, Users, Globe, Settings, Search, Edit, Trash2, Plus, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { Modal } from '../components/UIComponents';

interface Tenant {
    id: string;
    name: string;
    created_at: string;
    plan: string;
    plan_status: string;
    settings: any;
    revenue?: string; // Sims
}

interface NewTenantData {
    name: string;
    email: string;
    plan: 'free' | 'starter' | 'pro' | 'enterprise';
}

const SuperAdmin = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);

    // CRUD States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

    const [newTenant, setNewTenant] = useState<NewTenantData>({
        name: '',
        email: '',
        plan: 'free'
    });

    useEffect(() => {
        fetchTenants();
    }, []);

    const fetchTenants = async () => {
        setLoading(true);
        // In a real scenario, we might need a specific RPC or permissive RLS to see all tenants
        // For this demo, we assume the user has access.
        const { data } = await supabase
            .from('tenants')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) {
            // Enrich with mock revenue/stats data
            const enriched = data.map(t => ({
                ...t,
                // generate consistent fake revenue based on ID char
                revenue: t.plan === 'pro' ? 'R$ 597,00' : t.plan === 'starter' ? 'R$ 297,00' : 'R$ 0,00'
            }));
            setTenants(enriched);
        }
        setLoading(false);
    };

    const handleCreateTenant = async () => {
        // Limited manual creation - only creates Tenant record. User invitation would be separate.
        try {
            const { error } = await supabase
                .from('tenants')
                .insert([{
                    name: newTenant.name,
                    plan: newTenant.plan,
                    plan_status: 'active'
                }])
                .select();

            if (error) throw error;
            setIsAddModalOpen(false);
            fetchTenants();
            // Reset form
            setNewTenant({ name: '', email: '', plan: 'free' });
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

        const { error } = await supabase
            .from('tenants')
            .delete()
            .eq('id', id);

        if (error) {
            alert("Erro ao excluir. Pode haver restrições de FK.");
            console.error(error);
        } else {
            fetchTenants();
        }
    };

    const filteredTenants = tenants.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.includes(searchTerm)
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ paddingBottom: '3rem' }}
        >
            <header style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', background: '#667eea', borderRadius: '0.75rem', color: 'white', boxShadow: '0 4px 6px rgba(102, 126, 234, 0.25)' }}>
                        <Shield size={32} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>Painel Administrativo</h1>
                        <p style={{ color: 'var(--text-light)', margin: 0, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Globe size={14} /> Sistema Global • v2.4.0 (Stable)
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        className="btn-primary"
                        onClick={() => setIsAddModalOpen(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Plus size={18} /> Novo Gabinete
                    </button>
                    <div style={{ padding: '0.5rem 1rem', background: 'var(--surface)', borderRadius: '0.5rem', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#48bb78', boxShadow: '0 0 8px #48bb78' }}></div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Operational</span>
                    </div>
                </div>
            </header>

            {/* Metrics Overview (Simulated based on fetched data count) */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="glass-card" style={{ background: 'linear-gradient(120deg, var(--surface) 0%, var(--bg-color) 100%)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                        <Users size={20} color="#667eea" />
                        <h3 style={{ margin: 0 }}>Crescimento de Gabinetes</h3>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Total Ativos</span>
                            <p style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>{tenants.length}</p>
                            <span style={{ fontSize: '0.75rem', color: '#48bb78', background: 'rgba(72, 187, 120, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>+12% mês</span>
                        </div>
                        <div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Receita Estimada (MRR)</span>
                            <p style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>
                                R$ {tenants.reduce((acc, t) => acc + (t.plan === 'pro' ? 597 : t.plan === 'starter' ? 297 : 0), 0).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#667eea', color: 'white' }}>
                    <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                        <h3 style={{ margin: 0, color: 'white' }}>Ações Rápidas</h3>
                        <Settings size={20} color="white" style={{ opacity: 0.8 }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <button style={{ background: 'rgba(255,255,255,0.2)', border: 'none', padding: '0.75rem', borderRadius: '0.5rem', color: 'white', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                            <Shield size={16} /> Auditoria de Segurança
                        </button>
                    </div>
                </div>
            </div>

            {/* Tenants Table */}
            <div className="glass-card" style={{ padding: '0', overflow: 'hidden', background: 'var(--surface)' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0 }}>Gestão de Clientes (Tenants)</h3>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                        <input
                            type="text"
                            placeholder="Buscar gabinete..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{ padding: '0.5rem 0.5rem 0.5rem 2rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text)', outline: 'none' }}
                        />
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'var(--bg-color)', color: 'var(--text-light)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                <th style={{ padding: '1rem', fontWeight: 600 }}>Gabinete / Cliente</th>
                                <th style={{ padding: '1rem', fontWeight: 600 }}>Plano</th>
                                <th style={{ padding: '1rem', fontWeight: 600 }}>Status</th>
                                <th style={{ padding: '1rem', fontWeight: 600 }}>Receita</th>
                                <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'right' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</td></tr>
                            ) : filteredTenants.map(t => (
                                <tr key={t.id} style={{ borderBottom: '1px solid var(--border)', fontSize: '0.9rem', transition: 'background 0.2s' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 600, color: 'var(--text)' }}>{t.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Date: {new Date(t.created_at).toLocaleDateString()}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '2px 8px',
                                            borderRadius: '10px',
                                            background: t.plan === 'pro' ? 'rgba(102, 126, 234, 0.1)' : t.plan === 'enterprise' ? 'rgba(212, 175, 55, 0.1)' : 'var(--bg-color)',
                                            color: t.plan === 'pro' ? '#667eea' : t.plan === 'enterprise' ? '#d4af37' : 'var(--text-light)',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            textTransform: 'uppercase'
                                        }}>
                                            {t.plan || 'Free'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.plan_status === 'active' ? '#48bb78' : '#e53e3e' }}></div>
                                            <span style={{ color: t.plan_status === 'active' ? '#48bb78' : '#e53e3e', fontWeight: 500 }}>{t.plan_status}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text)' }}>{t.revenue}</td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <button
                                                className="btn-primary"
                                                onClick={() => { setSelectedTenant(t); setIsEditModalOpen(true); }}
                                                style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', background: 'var(--surface)', color: 'var(--primary)', border: '1px solid var(--border)' }}
                                            >
                                                <Edit size={14} />
                                            </button>
                                            <button
                                                className="btn-primary"
                                                onClick={() => handleDeleteTenant(t.id)}
                                                style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', background: 'var(--surface)', color: '#e53e3e', border: '1px solid var(--border)' }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Novo Gabinete">
                <div className="form-group">
                    <label>Nome do Gabinete</label>
                    <input
                        type="text"
                        className="form-input"
                        value={newTenant.name}
                        onChange={e => setNewTenant({ ...newTenant, name: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>Plano Inicial</label>
                    <select
                        className="form-input"
                        value={newTenant.plan}
                        onChange={e => setNewTenant({ ...newTenant, plan: e.target.value as any })}
                    >
                        <option value="free">Free</option>
                        <option value="starter">Starter</option>
                        <option value="pro">Pro</option>
                        <option value="enterprise">Enterprise</option>
                    </select>
                </div>
                <button className="btn-gold" style={{ width: '100%', marginTop: '1rem' }} onClick={handleCreateTenant}>
                    Criar Gabinete
                </button>
            </Modal>

            {/* Edit Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Gabinete">
                {selectedTenant && (
                    <>
                        <div className="form-group">
                            <label>Nome do Gabinete</label>
                            <input
                                type="text"
                                className="form-input"
                                value={selectedTenant.name}
                                onChange={e => setSelectedTenant({ ...selectedTenant, name: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Plano</label>
                            <select
                                className="form-input"
                                value={selectedTenant.plan}
                                onChange={e => setSelectedTenant({ ...selectedTenant, plan: e.target.value })}
                            >
                                <option value="free">Free</option>
                                <option value="starter">Starter</option>
                                <option value="pro">Pro</option>
                                <option value="enterprise">Enterprise</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <select
                                className="form-input"
                                value={selectedTenant.plan_status}
                                onChange={e => setSelectedTenant({ ...selectedTenant, plan_status: e.target.value })}
                            >
                                <option value="active">Ativo</option>
                                <option value="past_due">Atrasado</option>
                                <option value="canceled">Cancelado</option>
                            </select>
                        </div>
                        <button className="btn-gold" style={{ width: '100%', marginTop: '1rem' }} onClick={handleUpdateTenant}>
                            <Save size={18} /> Salvar Alterações
                        </button>
                    </>
                )}
            </Modal>
        </motion.div>
    );
};

export default SuperAdmin;
