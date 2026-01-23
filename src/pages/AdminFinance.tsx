
import { useState } from 'react';
import {
    DollarSign, TrendingUp, Download,
    ArrowUpRight, ArrowDownRight,
    Users, CreditCard, Search
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const AdminFinance = () => {
    const [period, setPeriod] = useState('30d');
    const [searchTerm, setSearchTerm] = useState('');

    // Simulated Financial Data
    const stats = {
        totalRevenue: 42850,
        mrr: 15400,
        pending: 2300,
        churn: 1.8
    };

    const chartData = [
        { name: 'Jan', revenue: 32000, expenses: 12000 },
        { name: 'Fev', revenue: 35000, expenses: 13000 },
        { name: 'Mar', revenue: 38000, expenses: 14000 },
        { name: 'Abr', revenue: 41000, expenses: 15500 },
        { name: 'Mai', revenue: 42500, expenses: 16000 },
        { name: 'Jun', revenue: 45000, expenses: 17000 }
    ];

    const transactions = [
        { id: 'TX1024', customer: 'Gabinete João Silva', amount: 597.00, status: 'paid', date: '2024-06-15', plan: 'Pro' },
        { id: 'TX1023', customer: 'Gabinete Maria Costa', amount: 297.00, status: 'pending', date: '2024-06-14', plan: 'Starter' },
        { id: 'TX1022', customer: 'Gabinete Ricardo Lima', amount: 1297.00, status: 'paid', date: '2024-06-14', plan: 'Enterprise' },
        { id: 'TX1021', customer: 'Gabinete Ana Santos', amount: 597.00, status: 'failed', date: '2024-06-13', plan: 'Pro' },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ paddingBottom: '3rem' }}>
            <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Gestão <span className="text-gold">Financeira SaaS</span></h1>
                    <p style={{ color: 'var(--text-light)' }}>Controle de faturamento, planos e pagamentos da plataforma.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Download size={18} /> Exportar Relatório
                    </button>
                    <select value={period} onChange={e => setPeriod(e.target.value)} style={{ padding: '8px 12px', borderRadius: '10px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                        <option value="7d">Últimos 7 dias</option>
                        <option value="30d">Últimos 30 dias</option>
                        <option value="90d">Últimos 90 dias</option>
                    </select>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {[
                    { label: 'Receita Total', value: `R$ ${stats.totalRevenue.toLocaleString()}`, trend: '+18.5%', icon: DollarSign, color: '#38a169', positive: true },
                    { label: 'MRR Atual', value: `R$ ${stats.mrr.toLocaleString()}`, trend: '+5.2%', icon: TrendingUp, color: '#667eea', positive: true },
                    { label: 'Pagamentos Pendentes', value: `R$ ${stats.pending.toLocaleString()}`, trend: '-12%', icon: CreditCard, color: '#d4af37', positive: false },
                    { label: 'Churn Rate', value: `${stats.churn}%`, trend: '+0.2%', icon: Users, color: '#e53e3e', positive: false }
                ].map((m, i) => (
                    <div key={i} className="glass-card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{ background: `${m.color}15`, padding: '8px', borderRadius: '10px', color: m.color }}><m.icon size={22} /></div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700, color: m.positive ? '#38a169' : '#e53e3e' }}>
                                {m.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {m.trend}
                            </div>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 600 }}>{m.label}</p>
                        <h2 style={{ margin: '5px 0 0', fontWeight: 800, fontSize: '1.8rem' }}>{m.value}</h2>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                        <h3 style={{ margin: 0, fontWeight: 800 }}>Fluxo de Caixa (Mensal)</h3>
                        <div style={{ display: 'flex', gap: '15px', fontSize: '0.8rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38a169' }}></div> Receita</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e53e3e' }}></div> Custos</div>
                        </div>
                    </div>
                    <div style={{ height: '350px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#38a169" stopOpacity={0.2} /><stop offset="95%" stopColor="#38a169" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-light)', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-light)', fontSize: 12 }} />
                                <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: 'var(--shadow-lg)', background: 'var(--surface)' }} />
                                <Area type="monotone" dataKey="revenue" stroke="#38a169" strokeWidth={3} fill="url(#colorRev)" />
                                <Area type="monotone" dataKey="expenses" stroke="#e53e3e" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ margin: '0 0 1.5rem 0', fontWeight: 800 }}>Pagamentos por Gateway</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {[
                            { name: 'Stripe', share: 65, color: '#635bff', amount: 'R$ 27.850' },
                            { name: 'Asaas', share: 25, color: '#0030ff', amount: 'R$ 10.712' },
                            { name: 'Pix Direto', share: 10, color: '#32bcad', amount: 'R$ 4.288' }
                        ].map((g, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                    <span style={{ fontWeight: 700 }}>{g.name}</span>
                                    <span style={{ color: 'var(--text-light)' }}>{g.amount}</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: 'var(--bg-color)', borderRadius: '10px', overflow: 'hidden' }}>
                                    <div style={{ width: `${g.share}%`, height: '100%', background: g.color, borderRadius: '10px' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--bg-color)', borderRadius: '12px', textAlign: 'center' }}>
                        <p style={{ margin: '0 0 5px 0', fontSize: '0.8rem', color: 'var(--text-light)' }}>Próximo Repasse (Net)</p>
                        <h4 style={{ margin: 0, fontWeight: 800 }}>R$ 12.450,80</h4>
                        <span style={{ fontSize: '0.7rem', color: '#38a169' }}>Agendado para 20/06</span>
                    </div>
                </div>
            </div>

            <div className="glass-card" style={{ padding: 0 }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontWeight: 800 }}>Últimas Transações</h3>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                        <input
                            type="text"
                            placeholder="Buscar transação..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{ padding: '8px 12px 8px 36px', borderRadius: '10px', width: '250px', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text)' }}
                        />
                    </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'var(--bg-color)', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.7rem', color: 'var(--text-light)' }}>ID</th>
                                <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.7rem', color: 'var(--text-light)' }}>Cliente</th>
                                <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.7rem', color: 'var(--text-light)' }}>Plano</th>
                                <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.7rem', color: 'var(--text-light)' }}>Valor</th>
                                <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.7rem', color: 'var(--text-light)' }}>Status</th>
                                <th style={{ padding: '12px 20px', textAlign: 'right', fontSize: '0.7rem', color: 'var(--text-light)' }}>Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(tx => (
                                <tr key={tx.id} style={{ borderBottom: '1px solid var(--border)' }} className="hover-row">
                                    <td style={{ padding: '12px 20px', fontWeight: 600 }}>{tx.id}</td>
                                    <td style={{ padding: '12px 20px' }}>{tx.customer}</td>
                                    <td style={{ padding: '12px 20px' }}><span style={{ fontSize: '0.7rem', fontWeight: 800, background: 'var(--bg-color)', padding: '2px 8px', borderRadius: '5px' }}>{tx.plan}</span></td>
                                    <td style={{ padding: '12px 20px', fontWeight: 700 }}>R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                    <td style={{ padding: '12px 20px' }}>
                                        <span style={{
                                            padding: '4px 10px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 800,
                                            background: tx.status === 'paid' ? '#38a16920' : tx.status === 'pending' ? '#d4af3720' : '#e53e3e20',
                                            color: tx.status === 'paid' ? '#38a169' : tx.status === 'pending' ? '#d4af37' : '#e53e3e'
                                        }}>
                                            {tx.status === 'paid' ? 'PAGO' : tx.status === 'pending' ? 'AGUARDANDO' : 'FALHOU'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 20px', textAlign: 'right', color: 'var(--text-light)', fontSize: '0.85rem' }}>{new Date(tx.date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminFinance;
