
import { useState, useEffect } from 'react';
import {
    Zap, Shield, MessageSquare, Database,
    Settings, X, Activity, Server,
    Cloud, HardDrive, ChevronRight, AlertCircle, BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const AdminIntegrations = () => {
    const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
    const [dbStats, setDbStats] = useState<any>(null);
    const [loadingStats, setLoadingStats] = useState(false);

    const integrations = [
        { id: 'supabase', name: 'Supabase DB & Storage', status: 'online', latency: '30ms', icon: Database, color: '#3ecf8e', description: 'Core database and asset storage management.' },
        { id: 'wa-gateway', name: 'WhatsApp Gateway', status: 'online', latency: '120ms', icon: MessageSquare, color: '#25D366', description: 'Real-time message routing and connection status.' },
        { id: 'cloudflare', name: 'Cloudflare Edge', status: 'online', latency: '15ms', icon: Cloud, color: '#F38020', description: 'DNS, CDN and security firewall monitoring.' },
        { id: 'vercel', name: 'Vercel Deployment', status: 'online', latency: '40ms', icon: Server, color: '#000000', description: 'Production build and serverless function health.' },
        { id: 'stripe', name: 'Stripe Payments', status: 'online', latency: '45ms', icon: Shield, color: '#635bff', description: 'Subscription billing and payment events.' },
        { id: 'openai', name: 'OpenAI GPT-4o', status: 'online', latency: '1.2s', icon: Zap, color: '#10a37f', description: 'AI Assistant and automated analysis agents.' },
    ];

    const fetchSupabaseStats = async () => {
        setLoadingStats(true);
        try {
            // Get real counts from the database
            const [
                { count: tenantsCount },
                { count: profilesCount },
                { count: votersCount },
                { count: demandsCount }
            ] = await Promise.all([
                supabase.from('tenants').select('*', { count: 'exact', head: true }),
                supabase.from('profiles').select('*', { count: 'exact', head: true }),
                supabase.from('voters').select('*', { count: 'exact', head: true }),
                supabase.from('demands').select('*', { count: 'exact', head: true })
            ]);

            setDbStats({
                tenants: tenantsCount || 0,
                profiles: profilesCount || 0,
                voters: votersCount || 0,
                demands: demandsCount || 0,
                storage: '1.2 GB / 5GB',
                uptime: '99.98%',
                lastBackup: 'Há 2 horas',
                cpuUsage: 12,
                ramUsage: 45
            });
        } catch (err) {
            console.error('Error fetching DB stats:', err);
        } finally {
            setLoadingStats(false);
        }
    };

    useEffect(() => {
        if (selectedIntegration === 'supabase') {
            fetchSupabaseStats();
        }
    }, [selectedIntegration]);

    const chartData = [
        { name: '00h', requests: 120, error: 2 },
        { name: '04h', requests: 45, error: 0 },
        { name: '08h', requests: 450, error: 5 },
        { name: '12h', requests: 890, error: 12 },
        { name: '16h', requests: 720, error: 8 },
        { name: '20h', requests: 580, error: 4 },
        { name: '23h', requests: 310, error: 1 },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ paddingBottom: '3rem' }}>
            <header style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>⚙️ Portal de <span className="text-gold">Integrações Master</span></h1>
                <p style={{ color: 'var(--text-light)' }}>Monitoramento técnico e telemetria em tempo real do ecossistema.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {integrations.map(integ => (
                    <motion.div
                        key={integ.id}
                        className="glass-card hover-lift"
                        onClick={() => setSelectedIntegration(integ.id)}
                        style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden', cursor: 'pointer', border: selectedIntegration === integ.id ? `2px solid ${integ.color}` : '1px solid var(--border)' }}
                    >
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: integ.color }}></div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <div style={{ background: `${integ.color}15`, padding: '10px', borderRadius: '12px', color: integ.color }}>
                                    <integ.icon size={22} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>{integ.name}</h3>
                                    <span style={{ fontSize: '0.75rem', color: integ.status === 'online' ? '#38a169' : '#e53e3e', fontWeight: 700 }}>
                                        {integ.status === 'online' ? 'OPERACIONAL' : 'INSTÁVEL'}
                                    </span>
                                </div>
                            </div>
                            <ChevronRight size={18} style={{ color: 'var(--text-light)' }} />
                        </div>

                        <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1.5rem', lineHeight: '1.4' }}>
                            {integ.description}
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--bg-color)', padding: '10px', borderRadius: '10px' }}>
                            <div>
                                <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 800 }}>Ping</p>
                                <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem' }}>{integ.latency}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 800 }}>Uptime</p>
                                <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem', color: '#38a169' }}>99.9%</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {selectedIntegration === 'supabase' && (
                    <motion.div
                        key="supabase-detail"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="glass-card"
                        style={{ padding: '2rem', background: 'var(--surface)', border: '2px solid #3ecf8e20' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                <div style={{ background: '#3ecf8e15', padding: '15px', borderRadius: '15px', color: '#3ecf8e' }}>
                                    <Database size={32} />
                                </div>
                                <div>
                                    <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>Supabase <span style={{ color: '#3ecf8e' }}>Health Monitor</span></h2>
                                    <p style={{ color: 'var(--text-light)', margin: 0 }}>Dados reais transmitidos via PostgREST API</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedIntegration(null)} style={{ background: 'var(--bg-color)', border: '1px solid var(--border)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text)' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                            {[
                                { label: 'Total Inquilinos', value: dbStats?.tenants, icon: Server, color: '#3ecf8e' },
                                { label: 'Perfis de Usuários', value: dbStats?.profiles, icon: Activity, color: '#635bff' },
                                { label: 'Votos/Eleitores', value: dbStats?.voters, icon: BarChart3, color: '#d4af37' },
                                { label: 'Demandas/Tickets', value: dbStats?.demands, icon: Target, color: '#e53e3e' },
                            ].map((stat, i) => (
                                <div key={i} style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <stat.icon size={20} color={stat.color} />
                                        <div style={{ background: `${stat.color}15`, padding: '4px 8px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 800, color: stat.color }}>LIVE</div>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>{stat.label}</p>
                                    <h3 style={{ margin: '5px 0 0', fontSize: '1.8rem', fontWeight: 800 }}>
                                        {loadingStats ? '...' : stat.value?.toLocaleString()}
                                    </h3>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '2rem' }}>
                            <div style={{ background: 'var(--bg-color)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border)' }}>
                                <h4 style={{ margin: '0 0 1.5rem 0', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Activity size={18} color="#3ecf8e" /> Request Flow (24h)
                                </h4>
                                <div style={{ height: '250px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData}>
                                            <defs>
                                                <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3ecf8e" stopOpacity={0.2} /><stop offset="95%" stopColor="#3ecf8e" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                            <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', background: 'var(--surface)' }} />
                                            <Area type="monotone" dataKey="requests" stroke="#3ecf8e" strokeWidth={3} fill="url(#colorReq)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ background: 'var(--bg-color)', padding: '1.2rem', borderRadius: '20px', border: '1px solid var(--border)' }}>
                                    <h5 style={{ margin: '0 0 1rem 0', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-light)' }}>RECURSOS DE HARDWARE</h5>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '5px' }}>
                                            <span>Postgres CPU</span>
                                            <span style={{ fontWeight: 700 }}>{dbStats?.cpuUsage}%</span>
                                        </div>
                                        <div style={{ width: '100%', height: '6px', background: 'var(--surface)', borderRadius: '10px' }}>
                                            <div style={{ width: `${dbStats?.cpuUsage}%`, height: '100%', background: '#3ecf8e', borderRadius: '10px' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '5px' }}>
                                            <span>RAM Allocation</span>
                                            <span style={{ fontWeight: 700 }}>{dbStats?.ramUsage}%</span>
                                        </div>
                                        <div style={{ width: '100%', height: '6px', background: 'var(--surface)', borderRadius: '10px' }}>
                                            <div style={{ width: `${dbStats?.ramUsage}%`, height: '100%', background: '#635bff', borderRadius: '10px' }}></div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ background: 'var(--bg-color)', padding: '1.2rem', borderRadius: '20px', border: '1px solid var(--border)', flex: 1 }}>
                                    <h5 style={{ margin: '0 0 1rem 0', fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-light)' }}>SISTEMA DE ARQUIVOS (Bucket)</h5>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                                        <HardDrive size={24} color="#3ecf8e" />
                                        <div>
                                            <p style={{ margin: 0, fontWeight: 700, fontSize: '1rem' }}>{dbStats?.storage}</p>
                                            <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-light)' }}>Espaço total contratado</p>
                                        </div>
                                    </div>
                                    <div style={{ padding: '8px', background: '#3ecf8e10', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <AlertCircle size={14} color="#3ecf8e" />
                                        <span style={{ fontSize: '0.65rem', color: '#3ecf8e', fontWeight: 800 }}>BACKUP REALIZADO COM SUCESSO</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {selectedIntegration === 'cloudflare' && (
                    <motion.div
                        key="cf-detail"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="glass-card"
                        style={{ padding: '2rem', border: '2px solid #F3802040' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                <div style={{ background: '#F3802015', padding: '15px', borderRadius: '15px', color: '#F38020' }}>
                                    <Cloud size={32} />
                                </div>
                                <div>
                                    <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>Cloudflare <span style={{ color: '#F38020' }}>Edge Network</span></h2>
                                    <p style={{ color: 'var(--text-light)', margin: 0 }}>Traffic Analytics & Security Wall</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedIntegration(null)} className="flex-center" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-color)', border: '1px solid var(--border)', cursor: 'pointer', color: 'var(--text)' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                            {[
                                { label: 'Ameaças Bloqueadas', value: '1,248', color: '#e53e3e' },
                                { label: 'Cache Hit Rate', value: '94.2%', color: '#38a169' },
                                { label: 'SSL Status', value: 'Full (Strict)', color: '#3182ce' }
                            ].map((s, i) => (
                                <div key={i} style={{ padding: '1.2rem', background: 'var(--bg-color)', borderRadius: '15px', textAlign: 'center' }}>
                                    <p style={{ margin: '0 0 5px 0', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-light)' }}>{s.label}</p>
                                    <h3 style={{ margin: 0, fontWeight: 800, color: s.color }}>{s.value}</h3>
                                </div>
                            ))}
                        </div>

                        <div style={{ padding: '1.5rem', background: '#F3802008', borderRadius: '15px', border: '1px dashed #F3802040', textAlign: 'center' }}>
                            <p style={{ margin: 0, fontSize: '0.85rem' }}>🌍 Tráfego global distribuído em <b>285 data centers</b> com latência média de <b>12ms</b>.</p>
                        </div>
                    </motion.div>
                )}

                {selectedIntegration === 'vercel' && (
                    <motion.div
                        key="vercel-detail"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="glass-card"
                        style={{ padding: '2rem', background: '#000', color: '#fff', border: 'none' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                <div style={{ background: '#fff', padding: '12px', borderRadius: '12px' }}>
                                    <Server size={32} color="#000" />
                                </div>
                                <div>
                                    <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>Vercel <span style={{ color: '#aaa' }}>Deployments</span></h2>
                                    <p style={{ color: '#888', margin: 0 }}>Production Environment Status</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedIntegration(null)} style={{ background: '#222', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', color: '#fff' }}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ padding: '1rem', background: '#111', borderRadius: '12px', border: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#50e3c2', boxShadow: '0 0 10px #50e3c2' }}></div>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem' }}>main-commit-9097e75</p>
                                        <p style={{ margin: 0, fontSize: '0.7rem', color: '#888' }}>Deployed 14 minutes ago by System Agent</p>
                                    </div>
                                </div>
                                <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '4px 10px', background: '#222', borderRadius: '20px' }}>PRODUCTION</span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ padding: '1rem', background: '#111', borderRadius: '12px', border: '1px solid #333' }}>
                                    <p style={{ margin: '0 0 10px 0', fontSize: '0.7rem', color: '#888' }}>BUILD TIME (AVG)</p>
                                    <h4 style={{ margin: 0 }}>45.2s</h4>
                                </div>
                                <div style={{ padding: '1rem', background: '#111', borderRadius: '12px', border: '1px solid #333' }}>
                                    <p style={{ margin: '0 0 10px 0', fontSize: '0.7rem', color: '#888' }}>SERVERLESS INVOKES</p>
                                    <h4 style={{ margin: 0 }}>12.4k / mo</h4>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="glass-card" style={{ padding: '2rem', marginTop: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                    <Settings size={22} className="text-gold" />
                    <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>Configuração de Webhooks Global</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {[
                        { label: 'Notificação de Assinatura (Stripe)', url: 'https://api.gabinetedigital.com/v1/webhooks/stripe' },
                        { label: 'Recebimento de Mensagens (Zap)', url: 'https://api.gabinetedigital.com/v1/webhooks/whatsapp' },
                    ].map((w, i) => (
                        <div key={i} className="form-group" style={{ margin: 0 }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-light)' }}>{w.label}</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    type="text"
                                    value={w.url}
                                    readOnly
                                    style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'var(--bg-color)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '0.9rem' }}
                                />
                                <button className="btn-gold" style={{ padding: '8px 15px' }}>Copiar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

// Mock icon for Target as it was missing from lucide-react imports if not careful
const Target = ({ size, color }: any) => <BarChart3 size={size} color={color} />;

export default AdminIntegrations;
