
import {
    Users, TrendingUp, Calendar, DollarSign, Share2,
    Award, Sparkles, Filter,
    UserCheck, Activity, RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTenant } from '../context/TenantContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { MandateIntelligence } from '../components/MandateIntelligence';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';

const Dashboard = () => {
    const { tenant } = useTenant();
    const navigate = useNavigate();
    const isDark = tenant.theme === 'dark';

    const [stats, setStats] = useState({
        voters: 0,
        totalVisits: 0,
        activeDemands: 0,
        totalExpenses: 0,
        conversionRate: 0,
        teamSize: 0,
    });

    const [chartsData, setChartsData] = useState({
        votersTrend: [] as any[],
        demandDistribution: [] as any[],
        categoryDistribution: [] as any[],
        productivityRanking: [] as any[],
        recentActivities: [] as any[]
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (tenant.id) {
            fetchDashboardData();
        }
    }, [tenant.id]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const { data: votersData } = await supabase
                .from('voters')
                .select('id, created_at')
                .eq('tenant_id', tenant.id);

            const { data: demandsData } = await supabase
                .from('demands')
                .select('id, status, category')
                .eq('tenant_id', tenant.id);

            const { data: visitsData } = await supabase
                .from('demand_visits')
                .select('*')
                .eq('tenant_id', tenant.id)
                .order('created_at', { ascending: false });

            const { data: financeData } = await supabase
                .from('campaign_finance')
                .select('value, type')
                .eq('tenant_id', tenant.id);

            const totalVoters = votersData?.length || 0;
            const activeDemands = demandsData?.filter(d => d.status !== 'resolved').length || 0;
            const totalVisits = visitsData?.length || 0;
            const totalExpenses = financeData?.filter(f => f.type === 'expense').reduce((sum, f) => sum + Number(f.value), 0) || 0;
            const teamMembers = [...new Set(visitsData?.map(v => v.responsible))].filter(Boolean);

            setStats({
                voters: totalVoters,
                activeDemands,
                totalVisits,
                totalExpenses,
                conversionRate: Math.min((totalVoters / 3500) * 100, 100),
                teamSize: teamMembers.length
            });

            const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'];
            const trend = months.map((m, i) => ({
                name: m,
                votos: Math.floor((totalVoters / 7) * (i + 1) * (0.8 + Math.random() * 0.4)),
                meta: Math.floor((3500 / 12) * (i + 1))
            }));

            const statusCounts = (demandsData || []).reduce((acc: any, d: any) => {
                acc[d.status] = (acc[d.status] || 0) + 1;
                return acc;
            }, {});

            const demandDist = [
                { name: 'Pendente', value: statusCounts.pending || 0, color: '#e53e3e' },
                { name: 'Em Andamento', value: statusCounts['in-progress'] || 0, color: '#d4af37' },
                { name: 'Resolvida', value: statusCounts.resolved || 0, color: '#38a169' }
            ].filter(d => d.value > 0);

            const catCounts = (demandsData || []).reduce((acc: any, d: any) => {
                acc[d.category] = (acc[d.category] || 0) + 1;
                return acc;
            }, {});
            const categoryDist = Object.entries(catCounts)
                .map(([name, value]) => ({ name, value }))
                .sort((a: any, b: any) => b.value - a.value)
                .slice(0, 5);

            const prod = (visitsData || []).reduce((acc: any, v: any) => {
                acc[v.responsible] = (acc[v.responsible] || 0) + 1;
                return acc;
            }, {});
            const productivity = Object.entries(prod)
                .map(([name, visits]) => ({ name, visits: visits as number }))
                .sort((a, b) => b.visits - a.visits)
                .slice(0, 5);

            setChartsData({
                votersTrend: trend,
                demandDistribution: demandDist,
                categoryDistribution: categoryDist,
                productivityRanking: productivity,
                recentActivities: (visitsData || []).slice(0, 5)
            });

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const dashboardStats = [
        { label: 'Base Eleitoral', value: stats.voters.toLocaleString(), icon: Users, color: '#d4af37', trend: 'Crescente', trendUp: true, path: '/voters' },
        { label: 'Visitas Campo', value: stats.totalVisits.toLocaleString(), icon: Share2, color: '#3182ce', trend: 'Auditável', trendUp: true, path: '/demands' },
        { label: 'Demandas Ativas', value: stats.activeDemands.toLocaleString(), icon: Activity, color: '#e53e3e', trend: 'Urgente', trendUp: false, path: '/demands' },
        { label: 'Gastos Reais', value: `R$ ${stats.totalExpenses.toLocaleString('pt-BR')}`, icon: DollarSign, color: '#38a169', trend: 'Controle', trendUp: true, path: '/finance' },
        { label: 'Performance', value: `${stats.conversionRate.toFixed(1)}%`, icon: Award, color: '#805ad5', trend: 'Meta', trendUp: true, path: '/voters' },
        { label: 'Equipe Ativa', value: stats.teamSize.toLocaleString(), icon: UserCheck, color: '#718096', trend: 'Online', trendUp: true, path: '/team' },
    ];

    // Theme-aware colors for Recharts
    const chartAxisColor = isDark ? '#94a3b8' : '#64748b';
    const chartGridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
    const tooltipColor = isDark ? '#0f172a' : '#ffffff';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ flex: 1, paddingBottom: '40px' }}
        >
            <style>{`
                .ultra-grid-metrics {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1rem;
                }
                .ultra-grid-analytics {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1.5rem;
                }
                .chart-card {
                    background: var(--surface);
                    border-radius: 24px;
                    padding: 24px;
                    border: 1px solid var(--border);
                    box-shadow: var(--shadow-sm);
                    transition: var(--transition);
                }
                .stat-card {
                    background: var(--surface);
                    padding: 20px;
                    border-radius: 20px;
                    border: 1px solid var(--border);
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    position: relative;
                    overflow: hidden;
                    transition: var(--transition);
                }
                .stat-card:hover { y: -4; box-shadow: var(--shadow-md); border-color: var(--secondary); }
                
                .activity-item {
                    display: flex; 
                    gap: 12px; 
                    padding: 10px; 
                    background: var(--bg-color); 
                    border-radius: 12px; 
                    border: 1px solid var(--border);
                    transition: all 0.2s;
                }

                @media (max-width: 1200px) {
                    .ultra-grid-analytics { grid-template-columns: 1fr; }
                }
                @media (max-width: 768px) {
                    .ultra-grid-metrics { grid-template-columns: repeat(2, 1fr); }
                }
            `}</style>

            <header className="responsive-header" style={{ alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <motion.h1 style={{ marginBottom: '0.25rem', fontSize: '2.2rem', fontWeight: 800 }}>
                        Dashboard <span className="text-gold">Estratégico</span>
                    </motion.h1>
                    <p style={{ color: 'var(--text-light)', fontWeight: 500 }}>Mandato Digital • Inteligência Política</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={fetchDashboardData} className="btn-primary" style={{ padding: '8px 16px', borderRadius: '12px', background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' }}>
                        <RefreshCw size={18} className={loading ? 'spin' : ''} /> <span className="desktop-only">Atualizar</span>
                    </button>
                    <div style={{ padding: '10px 15px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: 'var(--shadow-sm)' }}>
                        <Calendar size={18} color="var(--secondary)" />
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>
                            {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                        </span>
                    </div>
                </div>
            </header>

            {/* KPI ROW - 6 Cards */}
            <div className="ultra-grid-metrics" style={{ marginBottom: '2rem' }}>
                {dashboardStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={index}
                            whileHover={{ y: -4 }}
                            onClick={() => navigate(stat.path)}
                            className="stat-card"
                        >
                            <div style={{ position: 'absolute', right: '-10px', top: '-10px', width: '60px', height: '60px', background: `${stat.color}08`, borderRadius: '50%' }}></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ background: `${stat.color}15`, padding: '8px', borderRadius: '10px', color: stat.color }}>
                                    <Icon size={20} />
                                </div>
                                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: stat.trendUp ? '#38a169' : '#e53e3e', background: stat.trendUp ? '#38a16910' : '#e53e3e10', padding: '2px 8px', borderRadius: '50px' }}>
                                    {stat.trend}
                                </span>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>{stat.label}</p>
                                <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>{loading ? '...' : stat.value}</h3>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* MAIN CHART AREA */}
            <div className="grid-2-1" style={{ marginBottom: '2rem' }}>
                <div className="chart-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)' }}>Atividade do Mandato</h3>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-light)' }}>Engajamento e crescimento da base eleitoral</p>
                        </div>
                        <div className="desktop-only" style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--secondary)' }}></div>
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-light)' }}>Votos Reais</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: isDark ? '#334155' : '#CBD5E0' }}></div>
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-light)' }}>Meta Projetada</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartsData.votersTrend}>
                                <defs>
                                    <linearGradient id="colorVotos" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridColor} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: chartAxisColor }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: chartAxisColor }} />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '15px',
                                        border: 'none',
                                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                        background: tooltipColor,
                                        color: isDark ? '#fff' : '#000'
                                    }}
                                    itemStyle={{ fontWeight: 800 }}
                                />
                                <Area type="monotone" dataKey="meta" stroke={isDark ? '#334155' : '#CBD5E0'} fill="transparent" strokeDasharray="5 5" />
                                <Area type="monotone" dataKey="votos" stroke="var(--secondary)" fillOpacity={1} fill="url(#colorVotos)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text)' }}>Distribuição de Demandas</h3>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={chartsData.demandDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartsData.demandDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ position: 'absolute', textAlign: 'center' }}>
                            <span style={{ display: 'block', fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)' }}>{stats.activeDemands}</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', fontWeight: 700, textTransform: 'uppercase' }}>Ativas</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '20px' }}>
                        {chartsData.demandDistribution.map((d, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: d.color }}></div>
                                    <span style={{ fontWeight: 600, color: 'var(--text)' }}>{d.name}</span>
                                </div>
                                <span style={{ fontWeight: 800, color: 'var(--text)' }}>{d.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* THREE COLUMN GRID - ANALYTICS */}
            <div className="ultra-grid-analytics">
                {/* 1. Categorias Mais Relevantes */}
                <div className="chart-card">
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text)' }}>
                        <Filter size={18} color="var(--secondary)" /> Categorias em Alta
                    </h3>
                    <div style={{ height: '200px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartsData.categoryDistribution} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: 'var(--text)' }} width={100} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="value" fill="var(--primary)" radius={[0, 10, 10, 0]} barSize={15} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Ranking de Produtividade */}
                <div className="chart-card">
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text)' }}>
                        <TrendingUp size={18} color="#38a169" /> Time de Elite
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {chartsData.productivityRanking.length === 0 ? (
                            <p style={{ textAlign: 'center', opacity: 0.5, fontSize: '0.9rem', color: 'var(--text-light)' }}>Nenhum dado de campo.</p>
                        ) : (
                            chartsData.productivityRanking.map((p, i) => (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.85rem' }}>
                                        <span style={{ fontWeight: 700, color: 'var(--text)' }}>{p.name}</span>
                                        <span style={{ fontWeight: 800, color: 'var(--secondary)' }}>{p.visits} visitas</span>
                                    </div>
                                    <div style={{ height: '8px', background: 'var(--bg-color)', borderRadius: '10px', overflow: 'hidden' }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(p.visits / chartsData.productivityRanking[0].visits) * 100}%` }}
                                            style={{ height: '100%', background: i === 0 ? 'var(--secondary)' : 'var(--primary)', borderRadius: '10px' }}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* 3. Últimas Atividades */}
                <div className="chart-card">
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text)' }}>
                        <Activity size={18} color="#e53e3e" /> Atividades Recentes
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {chartsData.recentActivities.length === 0 ? (
                            <p style={{ textAlign: 'center', opacity: 0.5, fontSize: '0.9rem', color: 'var(--text-light)' }}>Aguardando primeira ação...</p>
                        ) : (
                            chartsData.recentActivities.map((act, i) => (
                                <div key={i} className="activity-item">
                                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <UserCheck size={18} color="var(--secondary)" />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 800, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{act.responsible}</p>
                                        <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-light)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            Visitou uma demanda em campo
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-light)' }}>
                                            {new Date(act.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* AI INTEL - ROADMAP ELEMENT */}
            <div style={{ marginTop: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.2rem' }}>
                    <Sparkles className="text-gold" size={24} />
                    <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)' }}>Recomendações da I.A.</h3>
                </div>
                <MandateIntelligence />
            </div>
        </motion.div>
    );
};

export default Dashboard;
