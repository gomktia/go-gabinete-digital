import { useState } from 'react';
import { Shield, Users, Activity, Server, Database, Globe, Settings, Search, AlertOctagon } from 'lucide-react';
import { motion } from 'framer-motion';

const tenants = [
    { id: 1, name: 'Vereador João Silva', city: 'São Paulo/SP', plan: 'Premium', status: 'Ativo', revenue: 'R$ 890,00', users: 12, storage: '4.2GB' },
    { id: 2, name: 'Vereadora Maria Souza', city: 'Curitiba/PR', plan: 'Basic', status: 'Ativo', revenue: 'R$ 450,00', users: 5, storage: '1.1GB' },
    { id: 3, name: 'Gabinete Experimental', city: 'Beta', plan: 'Free', status: 'Inativo', revenue: 'R$ 0,00', users: 1, storage: '0.2GB' },
    { id: 4, name: 'Câmara Municipal Teste', city: 'Brasília/DF', plan: 'Enterprise', status: 'Bloqueado', revenue: 'R$ 1.500,00', users: 45, storage: '15.8GB' },
];

const SuperAdmin = () => {
    const [searchTerm, setSearchTerm] = useState('');

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
                    <div style={{ padding: '0.5rem 1rem', background: 'var(--surface)', borderRadius: '0.5rem', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#48bb78', boxShadow: '0 0 8px #48bb78' }}></div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Sistemas Operacionais</span>
                    </div>
                </div>
            </header>

            {/* System Health */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
                <div className="glass-card" style={{ padding: '1.25rem', background: 'var(--surface)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>CPU USAGE</span>
                        <Activity size={16} color="#667eea" />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', margin: 0 }}>24%</h3>
                    <div style={{ width: '100%', background: 'var(--bg-color)', height: '4px', marginTop: '0.5rem', borderRadius: '2px' }}>
                        <div style={{ width: '24%', background: '#667eea', height: '100%', borderRadius: '2px' }}></div>
                    </div>
                </div>
                <div className="glass-card" style={{ padding: '1.25rem', background: 'var(--surface)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>LATENCY</span>
                        <Server size={16} color="#ed8936" />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', margin: 0 }}>45ms</h3>
                    <span style={{ fontSize: '0.7rem', color: '#48bb78' }}>● Otimizado</span>
                </div>
                <div className="glass-card" style={{ padding: '1.25rem', background: 'var(--surface)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>DATABASE</span>
                        <Database size={16} color="#d4af37" />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', margin: 0 }}>128 Conn</h3>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>PostgreSQL Main Cluster</span>
                </div>
                <div className="glass-card" style={{ padding: '1.25rem', background: 'var(--surface)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>ACTIVE ERRORS</span>
                        <AlertOctagon size={16} color="#e53e3e" />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--text)' }}>0</h3>
                    <span style={{ fontSize: '0.7rem', color: '#48bb78' }}>System Healthy</span>
                </div>
            </div>

            {/* Metrics Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="glass-card" style={{ background: 'linear-gradient(120deg, var(--surface) 0%, var(--bg-color) 100%)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                        <Users size={20} color="#667eea" />
                        <h3 style={{ margin: 0 }}>Crescimento de Gabinetes</h3>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Total Ativos</span>
                            <p style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>142</p>
                            <span style={{ fontSize: '0.75rem', color: '#48bb78', background: 'rgba(72, 187, 120, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>+12% mês</span>
                        </div>
                        <div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Receita Mensal (MRR)</span>
                            <p style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>R$ 42.500</p>
                            <span style={{ fontSize: '0.75rem', color: '#48bb78', background: 'rgba(72, 187, 120, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>+8.4% mês</span>
                        </div>
                        <div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Churn Rate</span>
                            <p style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0, color: '#e53e3e' }}>1.2%</p>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Baixo Risco</span>
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
                        <button style={{ background: 'rgba(255,255,255,0.2)', border: 'none', padding: '0.75rem', borderRadius: '0.5rem', color: 'white', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                            <Users size={16} /> Gerenciar Permissões
                        </button>
                    </div>
                </div>
            </div>

            {/* Tenants Table */}
            <div className="glass-card" style={{ padding: '0', overflow: 'hidden', background: 'var(--surface)' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0 }}>Gestão de Gabinetes (Tenants)</h3>
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
                                <th style={{ padding: '1rem', fontWeight: 600 }}>Localização</th>
                                <th style={{ padding: '1rem', fontWeight: 600 }}>Plano</th>
                                <th style={{ padding: '1rem', fontWeight: 600 }}>Usuários / DB</th>
                                <th style={{ padding: '1rem', fontWeight: 600 }}>Status</th>
                                <th style={{ padding: '1rem', fontWeight: 600 }}>Receita</th>
                                <th style={{ padding: '1rem', fontWeight: 600, textAlign: 'right' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tenants.map(t => (
                                <tr key={t.id} style={{ borderBottom: '1px solid var(--border)', fontSize: '0.9rem', transition: 'background 0.2s' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 600, color: 'var(--text)' }}>{t.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>ID: #{t.id}992</div>
                                    </td>
                                    <td style={{ padding: '1rem', color: 'var(--text-light)' }}>{t.city}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '2px 8px',
                                            borderRadius: '10px',
                                            background: t.plan === 'Premium' ? 'rgba(102, 126, 234, 0.1)' : t.plan === 'Enterprise' ? 'rgba(212, 175, 55, 0.1)' : 'var(--bg-color)',
                                            color: t.plan === 'Premium' ? '#667eea' : t.plan === 'Enterprise' ? '#d4af37' : 'var(--text-light)',
                                            fontSize: '0.75rem',
                                            fontWeight: 700
                                        }}>
                                            {t.plan}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Users size={14} color="var(--text-light)" /> {t.users}
                                            <span style={{ color: 'var(--border)' }}>|</span>
                                            <Database size={14} color="var(--text-light)" /> {t.storage}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.status === 'Ativo' ? '#48bb78' : t.status === 'Inativo' ? '#e2e8f0' : '#e53e3e' }}></div>
                                            <span style={{ color: t.status === 'Ativo' ? '#48bb78' : t.status === 'Inativo' ? 'var(--text-light)' : '#e53e3e', fontWeight: 500 }}>{t.status}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text)' }}>{t.revenue}</td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <button className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'var(--surface)', color: 'var(--primary)', border: '1px solid var(--border)' }}>
                                            Gerenciar
                                        </button>
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
