import { Shield, Users, CreditCard, Activity, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const tenants = [
    { id: 1, name: 'Vereador João Silva', city: 'São Paulo/SP', plan: 'Premium', status: 'Ativo', revenue: 'R$ 890,00' },
    { id: 2, name: 'Vereadora Maria Souza', city: 'Curitiba/PR', plan: 'Basic', status: 'Ativo', revenue: 'R$ 450,00' },
    { id: 3, name: 'Gabinete Experimental', city: 'Beta', plan: 'Free', status: 'Inativo', revenue: 'R$ 0,00' },
];

const SuperAdmin = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ paddingBottom: '3rem' }}
        >
            <header style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <div style={{ padding: '0.5rem', background: '#4c51bf', borderRadius: '0.5rem', color: 'white' }}>
                        <Shield size={32} />
                    </div>
                    <h1>Painel Super Admin</h1>
                </div>
                <p style={{ color: 'var(--text-light)' }}>Gestão global da plataforma Gabinete Digital.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="glass-card" style={{ borderLeft: '4px solid #4c51bf' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Users size={20} color="#4c51bf" />
                        <span style={{ fontSize: '0.7rem', color: '#48bb78', fontWeight: 700 }}>+12%</span>
                    </div>
                    <h2 style={{ margin: '10px 0 5px' }}>142</h2>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-light)' }}>Gabinete Ativos</p>
                </div>
                <div className="glass-card" style={{ borderLeft: '4px solid #d4af37' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <CreditCard size={20} color="#d4af37" />
                        <span style={{ fontSize: '0.7rem', color: '#48bb78', fontWeight: 700 }}>R$ 4.2k</span>
                    </div>
                    <h2 style={{ margin: '10px 0 5px' }}>R$ 42.500</h2>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-light)' }}>MRR (Receita Mensal)</p>
                </div>
                <div className="glass-card" style={{ borderLeft: '4px solid #ed8936' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Activity size={20} color="#ed8936" />
                        <span style={{ fontSize: '0.7rem', color: '#48bb78', fontWeight: 700 }}>99.9%</span>
                    </div>
                    <h2 style={{ margin: '10px 0 5px' }}>854k</h2>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-light)' }}>Mensagens Processadas</p>
                </div>
            </div>

            <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h3 style={{ margin: 0 }}>Gestão de Gabinetes (Tenants)</h3>
                    <button className="btn-primary" style={{ background: '#4c51bf' }}>Novo Gabinete</button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #edf2f7', color: 'var(--text-light)', fontSize: '0.85rem' }}>
                                <th style={{ padding: '1rem' }}>Gabinete</th>
                                <th style={{ padding: '1rem' }}>Cidade</th>
                                <th style={{ padding: '1rem' }}>Plano</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                <th style={{ padding: '1rem' }}>Receita</th>
                                <th style={{ padding: '1rem' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tenants.map(t => (
                                <tr key={t.id} style={{ borderBottom: '1px solid #f8fafc', fontSize: '0.9rem' }}>
                                    <td style={{ padding: '1rem', fontWeight: 600 }}>{t.name}</td>
                                    <td style={{ padding: '1rem' }}>{t.city}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ padding: '2px 8px', borderRadius: '10px', background: '#ebf4ff', color: '#2b6cb0', fontSize: '0.75rem' }}>{t.plan}</span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ color: t.status === 'Ativo' ? '#38a169' : '#e53e3e' }}>● {t.status}</span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{t.revenue}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <button style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}><ArrowUpRight size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default SuperAdmin;
