import { Users, TrendingUp, Calendar, DollarSign, Share2, Loader2, Award, Zap, Bell } from 'lucide-react';
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
                .select('*', { count: 'exact', head: true })
                .eq('tenant_id', tenant.id);

            // 2. Get Visits for Distribution
            const { data: visitsData, error: visitsError } = await supabase
                .from('demand_visits')
                .select('responsible')
                .eq('tenant_id', tenant.id);

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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ flex: 1 }}
        >
            <header className="responsive-header" style={{ alignItems: 'center' }}>
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{ marginBottom: '0.25rem', fontSize: '2.5rem', fontWeight: 800 }}
                    >
                        Olá, <span style={{ color: 'var(--secondary)' }}>{tenant.name.split(' ')[0]}</span>
                    </motion.h1>
                    <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', fontWeight: 500 }}>
                        Mandato Inovador • Gestão em tempo real
                    </p>
                </div>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/calendar')}
                    style={{
                        padding: '1rem 1.5rem',
                        background: 'var(--surface)',
                        borderRadius: '16px',
                        boxShadow: 'var(--shadow-md)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        border: '1px solid var(--border)'
                    }}
                >
                    <div style={{ padding: '8px', background: 'rgba(212,175,55,0.1)', borderRadius: '12px', color: 'var(--secondary)' }}>
                        <Calendar size={20} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>
                        {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </span>
                </motion.div>
            </header>

            <div className="responsive-grid" style={{ marginBottom: '3rem' }}>
                {dashboardStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={index}
                            className="glass-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -8, boxShadow: 'var(--shadow-lg)' }}
                            onClick={() => navigate(stat.path)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1.5rem',
                                position: 'relative',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                borderLeft: `4px solid ${stat.color}`
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{
                                    background: `${stat.color}15`,
                                    padding: '12px',
                                    borderRadius: '14px',
                                    color: stat.color,
                                    boxShadow: `0 8px 16px ${stat.color}10`
                                }}>
                                    <Icon size={24} />
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '0.75rem',
                                    fontWeight: 800,
                                    color: '#38a169',
                                    background: 'rgba(56, 161, 105, 0.1)',
                                    padding: '4px 10px',
                                    borderRadius: '20px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    {stat.trend}
                                </div>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    {stat.label}
                                </p>
                                <h2 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800 }}>
                                    {loading ? <Loader2 className="animate-spin" size={24} /> : stat.value}
                                </h2>
                            </div>
                            <div style={{ height: '50px', display: 'flex', alignItems: 'flex-end', gap: '3px', opacity: 0.3 }}>
                                {[...Array(12)].map((_, i) => (
                                    <div key={i} style={{
                                        flex: 1,
                                        height: `${30 + Math.random() * 70}%`,
                                        background: stat.color,
                                        borderRadius: '2px'
                                    }}></div>
                                ))}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="responsive-grid-large" style={{ display: 'grid', gap: '2.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ padding: '8px', background: 'rgba(212,175,55,0.1)', borderRadius: '10px', color: 'var(--secondary)' }}>
                                    <Award size={20} />
                                </div>
                                <h3 style={{ margin: 0 }}>Meta Eleitoral (Quociente)</h3>
                            </div>
                            <button
                                onClick={() => navigate('/voters')}
                                className="btn-gold outline"
                                style={{ padding: '6px 16px', fontSize: '0.8rem', borderRadius: '10px' }}
                            >
                                Detalhes CRM
                            </button>
                        </div>

                        <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-accent) 100%)', borderRadius: '20px', color: 'white', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '100px', height: '100px', background: 'var(--secondary)', opacity: 0.1, borderRadius: '50%', filter: 'blur(30px)' }}></div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontWeight: 700 }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase' }}>Consolidado</span>
                                    <span style={{ fontSize: '1.5rem' }}>{stats.voters} Votos</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <span style={{ fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase' }}>Objetivo</span>
                                    <span style={{ fontSize: '1.5rem' }}>3.500</span>
                                </div>
                            </div>

                            <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)' }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min((stats.voters / 3500) * 100, 100)}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    style={{
                                        width: `${Math.min((stats.voters / 3500) * 100, 100)}%`,
                                        height: '100%',
                                        background: 'linear-gradient(90deg, var(--secondary) 0%, #f6e05e 100%)',
                                        boxShadow: '0 0 15px var(--secondary-glow)'
                                    }}
                                />
                            </div>

                            <p style={{ fontSize: '0.85rem', marginTop: '1rem', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Zap size={14} /> {stats.voters === 0 ? 'Inicie o cadastro de eleitores hoje para tracionar o funil.' : `Você já atingiu ${((stats.voters / 3500) * 100).toFixed(1)}% da sua meta eleitoral.`}
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div style={{ padding: '1.25rem', background: 'rgba(229, 62, 62, 0.03)', border: '1px solid rgba(229, 62, 62, 0.1)', borderRadius: '16px', textAlign: 'center' }}>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>Gastos (Semana)</p>
                                <p style={{ margin: '4px 0 0', fontSize: '1.25rem', fontWeight: 800, color: '#e53e3e' }}>R$ 0,00</p>
                            </div>
                            <div style={{ padding: '1.25rem', background: 'rgba(56, 161, 105, 0.03)', border: '1px solid rgba(56, 161, 105, 0.1)', borderRadius: '16px', textAlign: 'center' }}>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>Novos Apoios</p>
                                <p style={{ margin: '4px 0 0', fontSize: '1.25rem', fontWeight: 800, color: '#38a169' }}>+{stats.voters}</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ padding: '8px', background: 'rgba(66, 153, 225, 0.1)', borderRadius: '10px', color: '#4299e1' }}>
                                    <TrendingUp size={20} />
                                </div>
                                <h3 style={{ margin: 0 }}>Ranking de Produtividade</h3>
                            </div>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', background: 'var(--bg-color)', padding: '4px 12px', borderRadius: '10px', fontWeight: 600 }}>
                                {loading ? '...' : stats.visits} Visitas Totais
                            </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '2rem' }}><Loader2 className="animate-spin" /></div>
                            ) : visitDistribution.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2rem', border: '2px dashed var(--border)', borderRadius: '16px' }}>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', fontStyle: 'italic' }}>Nenhuma visita registrada em campo.</p>
                                </div>
                            ) : (
                                visitDistribution.map((item, idx) => (
                                    <div key={idx}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'flex-end' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }}></div>
                                                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.name}</span>
                                            </div>
                                            <span style={{ fontWeight: 800, fontSize: '0.9rem', color: item.color }}>{item.visits} <span style={{ fontWeight: 500, opacity: 0.7 }}>visitas</span></span>
                                        </div>
                                        <div style={{ height: '10px', background: 'var(--bg-color)', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(item.visits / Math.max(stats.visits, 1)) * 100}%` }}
                                                transition={{ duration: 1, delay: idx * 0.1 }}
                                                style={{
                                                    height: '100%',
                                                    background: item.color,
                                                    boxShadow: `0 0 10px ${item.color}30`,
                                                    borderRadius: '10px'
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <motion.div
                        whileHover={{ y: -5 }}
                        onClick={() => navigate('/advisor')}
                        className="glass-card"
                        style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #1e3a8a 100%)', color: 'white', cursor: 'pointer', border: 'none' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                            <div style={{ padding: '8px', background: 'rgba(212,175,55,0.2)', borderRadius: '10px', color: 'var(--secondary)' }}>
                                <Zap size={20} />
                            </div>
                            <h3 style={{ margin: 0, color: 'white' }}>Meta de Atuação</h3>
                        </div>
                        <p style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '2rem', lineHeight: 1.6 }}>
                            Otimização de rotas: Você está a <b>{(stats.visits / 10 * 100).toFixed(0)}%</b> da sua meta semanal de fiscalização.
                        </p>

                        <div style={{ marginBottom: '0.5rem' }}>
                            <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', overflow: 'hidden' }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min((stats.visits / 10) * 100, 100)}%` }}
                                    transition={{ duration: 1.2, delay: 0.3 }}
                                    style={{ height: '100%', background: 'var(--secondary)', boxShadow: '0 0 20px var(--secondary-glow)' }}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.8rem', fontWeight: 600 }}>
                                <span style={{ opacity: 0.7 }}>Semanal</span>
                                <span>{stats.visits >= 10 ? 'Meta Alcançada! 🏆' : `${stats.visits}/10 Visitas`}</span>
                            </div>
                        </div>
                    </motion.div>

                    <div className="glass-card" style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                            <div style={{ padding: '8px', background: 'rgba(15,23,42,0.05)', borderRadius: '10px', color: 'var(--primary)' }}>
                                <Bell size={20} />
                            </div>
                            <h3 style={{ margin: 0 }}>Agenda Estratégica</h3>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--bg-color)', borderRadius: '14px', border: '1px solid var(--border)' }}>
                                <div style={{ padding: '10px', background: 'white', borderRadius: '10px', textAlign: 'center', minWidth: '50px' }}>
                                    <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, color: 'var(--secondary)', textTransform: 'uppercase' }}>HOJE</span>
                                    <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>{new Date().getDate()}</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>Nenhum compromisso oficial</p>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-light)' }}>Horário disponível para gabinete</p>
                                </div>
                            </div>

                            <div style={{ padding: '1.5rem', border: '2px dashed var(--border)', borderRadius: '16px', textAlign: 'center' }}>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1rem' }}>Mantenha sua agenda parlamentar atualizada.</p>
                                <button
                                    onClick={() => navigate('/calendar')}
                                    className="btn-primary"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '12px' }}
                                >
                                    Gerenciar Agenda
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
