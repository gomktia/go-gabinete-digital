import { Users, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight, DollarSign, Share2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTenant } from '../context/TenantContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const Dashboard = () => {
    const { tenant } = useTenant();
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        voters: 0,
        visits: 0,
        campaignSpend: 0, // Placeholder
        engagement: 0, // Placeholder
    });

    const [visitDistribution, setVisitDistribution] = useState<{ name: string, visits: number, color: string }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (tenant.id) {
            fetchDashboardData();
        }
    }, [tenant.id]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // 1. Get Voters Count
            const { count: votersCount, error: votersError } = await supabase
                .from('voters')
                .select('*', { count: 'exact', head: true });

            // 2. Get Visits for Distribution
            const { data: visitsData, error: visitsError } = await supabase
                .from('demand_visits')
                .select('responsible');

            if (votersError) throw votersError;
            if (visitsError) throw visitsError;

            // Process Visits Distribution
            const distribution = (visitsData || []).reduce((acc: any, curr: any) => {
                const responsible = curr.responsible || 'Desconhecido';
                acc[responsible] = (acc[responsible] || 0) + 1;
                return acc;
            }, {});

            const sortedDistribution = Object.entries(distribution)
                .map(([name, count]) => ({
                    name,
                    visits: count as number,
                    color: getColorForName(name)
                }))
                .sort((a, b) => b.visits - a.visits) // Sort by highest
                .slice(0, 5); // Take top 5

            setVisitDistribution(sortedDistribution);
            setStats(prev => ({
                ...prev,
                voters: votersCount || 0,
                visits: visitsData?.length || 0
            }));

        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const getColorForName = (name: string) => {
        // Simple consistent color hash or mapping
        const colors = ['#3182ce', '#38a169', '#d4af37', '#e53e3e', '#805ad5', '#dd6b20'];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    const dashboardStats = [
        { label: 'Eleitores na Base', value: stats.voters.toLocaleString(), icon: Users, color: '#d4af37', trend: 'CRM Ativo', trendUp: true, path: '/voters' },
        { label: 'Gastos Campanha', value: 'R$ 0,00', icon: DollarSign, color: '#38a169', trend: 'Simulado', trendUp: true, path: '/finance' }, // Keep as placeholder for now
        { label: 'Visitas em Campo', value: stats.visits.toLocaleString(), icon: Share2, color: '#E1306C', trend: 'Real-time', trendUp: true, path: '/demands' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ flex: 1 }}
        >
            <header className="responsive-header">
                <div>
                    <h1 style={{ marginBottom: '0.25rem' }}>Olá, {tenant.name}</h1>
                    <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
                        Gestão do Mandato em Tempo Real
                    </p>
                </div>
                <div
                    onClick={() => navigate('/calendar')}
                    style={{ padding: '0.75rem 1.25rem', background: 'var(--surface)', borderRadius: '1rem', boxShadow: 'var(--shadow)', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', border: '1px solid var(--border)' }}
                >
                    <Calendar size={20} style={{ color: 'var(--primary)' }} />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>
                        {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </span>
                </div>
            </header>

            <div className="responsive-grid" style={{ marginBottom: '2.5rem' }}>
                {dashboardStats.map((stat, index) => {
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
                                <h2 style={{ margin: 0, fontSize: '2rem' }}>
                                    {loading ? <Loader2 className="animate-spin" size={24} /> : stat.value}
                                </h2>
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

            <div className="responsive-grid-large" style={{ display: 'grid', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0 }}>Funil de Votos (Quociente)</h3>
                            <span
                                onClick={() => navigate('/voters')}
                                style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
                            >
                                Ver CRM
                            </span>
                        </div>
                        <div style={{ padding: '1rem', background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%)', borderRadius: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--secondary)', fontWeight: 700 }}>
                                <span>{stats.voters} Votos</span>
                                <span>Meta: 3.500</span>
                            </div>
                            <div style={{ width: '100%', height: '12px', background: 'rgba(0,0,0,0.1)', borderRadius: '6px', overflow: 'hidden' }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min((stats.voters / 3500) * 100, 100)}%` }}
                                    transition={{ duration: 1 }}
                                    style={{ width: `${Math.min((stats.voters / 3500) * 100, 100)}%`, height: '100%', background: 'var(--secondary)' }}
                                />
                            </div>
                            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--text-light)' }}>
                                {stats.voters === 0 ? 'Cadastre eleitores para iniciar o funil.' : 'Continue cadastrando para atingir a meta.'}
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '0.5rem', textAlign: 'center' }}>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-light)' }}>Gastos (Semana)</p>
                                <p style={{ margin: 0, fontWeight: 700, color: '#e53e3e' }}>R$ 0,00</p>
                            </div>
                            <div style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '0.5rem', textAlign: 'center' }}>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-light)' }}>Novos Apoios</p>
                                <p style={{ margin: 0, fontWeight: 700, color: '#38a169' }}>+{stats.voters}</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0 }}>Produtividade: Visitas em Campo</h3>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Total: {loading ? '...' : stats.visits} visitas</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '1rem' }}><Loader2 className="animate-spin" /></div>
                            ) : visitDistribution.length === 0 ? (
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', fontStyle: 'italic' }}>Nenhuma visita registrada ainda.</p>
                            ) : (
                                visitDistribution.map((item, idx) => (
                                    <div key={idx}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.85rem' }}>
                                            <span style={{ fontWeight: 600 }}>{item.name}</span>
                                            <span style={{ fontWeight: 700 }}>{item.visits} visitas</span>
                                        </div>
                                        <div style={{ height: '8px', background: 'var(--bg-color)', borderRadius: '4px', overflow: 'hidden' }}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(item.visits / Math.max(stats.visits, 1)) * 100}%` }}
                                                transition={{ duration: 0.8, delay: idx * 0.1 }}
                                                style={{ height: '100%', background: item.color }}
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
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
                        <p style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '1.5rem', color: 'white' }}>
                            Você está a <b>{(stats.visits / 10 * 100).toFixed(0)}%</b> de completar seu objetivo de visitas legislativas desta semana (Meta: 10).
                        </p>
                        <div style={{ height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min((stats.visits / 10) * 100, 100)}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                style={{ height: '100%', background: 'var(--secondary)' }}
                            />
                        </div>
                        <p style={{ fontSize: '0.75rem', textAlign: 'right', opacity: 0.8, color: 'white' }}>
                            {stats.visits >= 10 ? 'Meta atingida!' : `falta ${10 - stats.visits} visita(s)`}
                        </p>
                    </div>

                    <div className="glass-card">
                        <h3>Agenda de Hoje</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', fontStyle: 'italic' }}>Nenhum evento agendado para hoje.</p>
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
