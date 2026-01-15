import { Users, FileCheck, MessageSquare, AlertTriangle, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTenant } from '../context/TenantContext';
import { useNavigate } from 'react-router-dom';

const stats = [
    { label: 'Demandas Ativas', value: '24', icon: MessageSquare, color: '#3182ce', trend: '+12%', trendUp: true, path: '/demands' },
    { label: 'Proposições', value: '8', icon: FileCheck, color: '#38a169', trend: '+2', trendUp: true, path: '/proposals' },
    { label: 'Cidadãos', value: '1,240', icon: Users, color: '#d4af37', trend: '+55', trendUp: true, path: '/' },
    { label: 'Urgências', value: '3', icon: AlertTriangle, color: '#e53e3e', trend: '-20%', trendUp: false, path: '/demands' },
];

const Dashboard = () => {
    const { tenant } = useTenant();
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ flex: 1 }}
        >
            <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Olá, Vereador</h1>
                    <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
                        {tenant.name} | Gestão do Mandato em Tempo Real
                    </p>
                </div>
                <div
                    onClick={() => navigate('/calendar')}
                    style={{ padding: '0.75rem 1.25rem', background: 'white', borderRadius: '1rem', boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                >
                    <Calendar size={20} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Quarta, 14 de Janeiro</span>
                </div>
            </header>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2.5rem'
            }}>
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={index}
                            className="glass-card"
                            whileHover={{ scale: 1.02 }}
                            onClick={() => navigate(stat.path)}
                            style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{
                                    background: `${stat.color}15`,
                                    padding: '0.75rem',
                                    borderRadius: '0.75rem',
                                    color: stat.color
                                }}>
                                    <Icon size={24} />
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '2px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    color: stat.trendUp ? '#38a169' : '#e53e3e',
                                    background: stat.trendUp ? '#f0fff4' : '#fff5f5',
                                    padding: '2px 8px',
                                    borderRadius: '10px'
                                }}>
                                    {stat.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    {stat.trend}
                                </div>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 600, marginBottom: '0.25rem' }}>{stat.label}</p>
                                <h2 style={{ margin: 0, fontSize: '2rem' }}>{stat.value}</h2>
                            </div>
                            <div style={{ height: '40px', marginTop: 'auto', display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
                                {[...Array(10)].map((_, i) => (
                                    <div key={i} style={{
                                        flex: 1,
                                        height: `${20 + Math.random() * 80}%`,
                                        background: stat.color,
                                        opacity: 0.1 + (i * 0.05),
                                        borderRadius: '2px'
                                    }}></div>
                                ))}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0 }}>Atividade nos Bairros</h3>
                            <span
                                onClick={() => navigate('/demands')}
                                style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
                            >
                                Ver Mapa Completo
                            </span>
                        </div>
                        <div
                            onClick={() => navigate('/demands')}
                            style={{ height: '350px', background: '#f1f5f9', borderRadius: '1rem', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                            <div style={{ width: '100%', height: '100%', opacity: 0.2, background: 'repeating-linear-gradient(90deg, #cbd5e1 0, #cbd5e1 1px, transparent 0, transparent 40px)' }}></div>
                            <div style={{ position: 'absolute', top: '30%', left: '40%', width: '120px', height: '120px', background: 'rgba(212, 175, 55, 0.4)', borderRadius: '50%', filter: 'blur(20px)' }}></div>
                            <div style={{ position: 'absolute', top: '50%', left: '20%', width: '80px', height: '80px', background: 'rgba(229, 62, 62, 0.3)', borderRadius: '50%', filter: 'blur(15px)' }}></div>

                            <div style={{ zIndex: 1, textAlign: 'center' }}>
                                <AlertTriangle size={32} color="var(--primary)" style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                                <p style={{ fontWeight: 700, color: 'var(--primary)' }}>Centro: Pico de demandas (Saúde)</p>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>3 novas mensagens nas últimas 2 horas.</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0 }}>Produtividade: Visitas em Campo</h3>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Total: 124 visitas</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { name: 'Assessor Marcos', visits: 45, color: '#3182ce' },
                                { name: 'Assessora Sandra', visits: 38, color: '#38a169' },
                                { name: 'Vereador João', visits: 22, color: '#d4af37' },
                                { name: 'Assessor Paulo', visits: 19, color: '#e53e3e' }
                            ].map((item, idx) => (
                                <div key={idx}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.85rem' }}>
                                        <span style={{ fontWeight: 600 }}>{item.name}</span>
                                        <span style={{ fontWeight: 700 }}>{item.visits} visitas</span>
                                    </div>
                                    <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(item.visits / 45) * 100}%` }}
                                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                                            style={{ height: '100%', background: item.color }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div
                        onClick={() => navigate('/advisor')}
                        className="glass-card"
                        style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #2c5282 100%)', color: 'white', cursor: 'pointer' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                            <TrendingUp size={20} color="var(--secondary)" />
                            <h3 style={{ margin: 0, color: 'white' }}>Meta Semanal</h3>
                        </div>
                        <p style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '1.5rem' }}>
                            Você está a <b>85%</b> de completar seu objetivo de visitas legislativas desta semana.
                        </p>
                        <div style={{ height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '85%' }}
                                transition={{ duration: 1, delay: 0.5 }}
                                style={{ height: '100%', background: 'var(--secondary)' }}
                            />
                        </div>
                        <p style={{ fontSize: '0.75rem', textAlign: 'right', opacity: 0.8 }}>falta 1 visita (Bairro Rural)</p>
                    </div>

                    <div className="glass-card">
                        <h3>Agenda de Hoje</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div onClick={() => navigate('/calendar')} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', cursor: 'pointer' }}>
                                <div style={{ background: '#f1f5f9', padding: '0.5rem', borderRadius: '0.5rem', textAlign: 'center', minWidth: '50px' }}>
                                    <p style={{ margin: 0, fontWeight: 700, color: 'var(--primary)' }}>14:00</p>
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontWeight: 600 }}>Sessão Ordinária</p>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-light)' }}>Câmara Municipal</p>
                                </div>
                            </div>
                            <div onClick={() => navigate('/calendar')} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', cursor: 'pointer' }}>
                                <div style={{ background: '#f1f5f9', padding: '0.5rem', borderRadius: '0.5rem', textAlign: 'center', minWidth: '50px' }}>
                                    <p style={{ margin: 0, fontWeight: 700, color: 'var(--primary)' }}>18:30</p>
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontWeight: 600 }}>Entrevista Rádio FM</p>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-light)' }}>Centro</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/calendar')}
                            className="btn-primary"
                            style={{ width: '100%', marginTop: '1.5rem', background: '#edf2f7', color: 'var(--primary)' }}
                        >
                            Ver Agenda Completa
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
