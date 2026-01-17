import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    DollarSign, TrendingDown, TrendingUp, PieChart,
    AlertTriangle, FileText, Plus, Receipt, AlertCircle, Wallet, Upload, RefreshCw, Save
} from 'lucide-react';
import { Modal } from '../components/UIComponents';
import { supabase } from '../lib/supabase';
import { useTenant } from '../context/TenantContext';

interface Transaction {
    id: string;
    type: 'income' | 'expense';
    category: string;
    description: string;
    value: number;
    date: string;
    status: 'pending' | 'verified' | 'rejected';
}

const CampaignFinance = () => {
    const { tenant } = useTenant();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [uploadStep, setUploadStep] = useState(0); // 0: Upload, 1: Processing, 2: Review

    // Form states
    const [type, setType] = useState<'income' | 'expense'>('expense');
    const [description, setDescription] = useState('');
    const [value, setValue] = useState('');
    const [category, setCategory] = useState('Combustível');

    useEffect(() => {
        if (tenant.id) {
            fetchTransactions();
        }
    }, [tenant.id]);

    const fetchTransactions = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('campaign_finance')
            .select('*')
            .eq('tenant_id', tenant.id)
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching transactions:', error);
        } else {
            setTransactions(data || []);
        }
        setIsLoading(false);
    };

    const handleAddTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tenant.id) return;

        const newTx = {
            tenant_id: tenant.id,
            type,
            description,
            value: parseFloat(value),
            category,
            date: new Date().toISOString().split('T')[0],
            status: 'pending'
        };

        const { data, error } = await supabase
            .from('campaign_finance')
            .insert([newTx])
            .select();

        if (error) {
            console.error('Error adding transaction:', error);
            alert('Erro ao salvar transação');
        } else if (data) {
            setTransactions([data[0], ...transactions]);
            setIsModalOpen(false);
            setDescription('');
            setValue('');
        }
    };

    const totalSpent = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + Number(t.value), 0);

    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + Number(t.value), 0);

    const balance = totalIncome - totalSpent;
    const limit = 500000;
    const progress = (totalSpent / limit) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <header className="responsive-header">
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <div style={{
                            padding: '12px',
                            background: 'var(--primary)',
                            borderRadius: '16px',
                            color: 'var(--secondary)',
                            boxShadow: '0 8px 16px rgba(15,23,42,0.1)'
                        }}>
                            <DollarSign size={32} />
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Financeiro de Campanha</h1>
                    </div>
                    <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', fontWeight: 500 }}>
                        Controle rigoroso de gastos e receitas eleitorais (TSE Compliance).
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }} className="flex-col-mobile">
                    <button
                        className="btn-gold outline"
                        onClick={() => setIsImportModalOpen(true)}
                        style={{ borderRadius: '14px' }}
                    >
                        <Upload size={18} /> Importar Extrato
                    </button>
                    <button
                        className="btn-gold"
                        onClick={() => setIsModalOpen(true)}
                        style={{ borderRadius: '14px' }}
                    >
                        <Plus size={18} /> Nova Transação
                    </button>
                </div>
            </header>

            {/* Top Summaries */}
            <div className="responsive-grid" style={{ marginBottom: '3rem' }}>
                <motion.div whileHover={{ y: -5 }} className="glass-card" style={{ borderLeft: '4px solid var(--secondary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-light)', fontWeight: 800, textTransform: 'uppercase' }}>Teto TSE</span>
                        <AlertCircle size={20} color="var(--secondary)" />
                    </div>
                    <h2 style={{ fontSize: '2.5rem', margin: 0, fontWeight: 800 }}>R$ {limit.toLocaleString('pt-BR')}</h2>
                    <div style={{ marginTop: '1.5rem', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ width: `${progress}%`, height: '100%', background: progress > 80 ? '#e53e3e' : '#38a169', transition: 'width 1s' }}></div>
                    </div>
                    <p style={{ fontSize: '0.85rem', marginTop: '0.75rem', color: 'var(--text-light)', fontWeight: 600 }}>
                        {progress.toFixed(1)}% do limite utilizado
                    </p>
                </motion.div>

                <motion.div whileHover={{ y: -5 }} className="glass-card" style={{ borderLeft: '4px solid #e53e3e' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.9rem', color: '#e53e3e', fontWeight: 800, textTransform: 'uppercase' }}>Total Gasto</span>
                        <TrendingDown size={20} color="#e53e3e" />
                    </div>
                    <h2 style={{ fontSize: '2.5rem', margin: 0, color: '#e53e3e', fontWeight: 800 }}>R$ {totalSpent.toLocaleString('pt-BR')}</h2>
                    <p style={{ fontSize: '0.85rem', marginTop: '0.75rem', color: 'var(--text-light)', fontWeight: 600 }}>
                        Despesas registradas em campo
                    </p>
                </motion.div>

                <motion.div whileHover={{ y: -5 }} className="glass-card" style={{ borderLeft: '4px solid #38a169' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.9rem', color: '#38a169', fontWeight: 800, textTransform: 'uppercase' }}>Saldo Atual</span>
                        <Wallet size={20} color="#38a169" />
                    </div>
                    <h2 style={{ fontSize: '2.5rem', margin: 0, color: '#38a169', fontWeight: 800 }}>R$ {balance.toLocaleString('pt-BR')}</h2>
                    <p style={{ fontSize: '0.85rem', marginTop: '0.75rem', color: 'var(--text-light)', fontWeight: 600 }}>
                        Arrecadação líquida disponível
                    </p>
                </motion.div>
            </div>

            <div className="grid-2-1">
                {/* Recent Transactions */}
                <div className="glass-card" style={{ padding: '0' }}>
                    <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Últimos Lançamentos</h3>
                        <FileText size={20} style={{ opacity: 0.5 }} />
                    </div>

                    <div style={{ padding: '1rem' }}>
                        {isLoading ? (
                            <div style={{ padding: '3rem', textAlign: 'center' }}><RefreshCw className="spin" /></div>
                        ) : transactions.length === 0 ? (
                            <div style={{ padding: '3rem', textAlign: 'center', opacity: 0.5 }}>Sem transações registradas.</div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {transactions.map((t) => (
                                    <div key={t.id} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1.25rem',
                                        padding: '1.25rem',
                                        background: 'rgba(255,255,255,0.02)',
                                        borderRadius: '16px',
                                        border: '1px solid var(--border)'
                                    }}>
                                        <div style={{
                                            width: '44px',
                                            height: '44px',
                                            borderRadius: '12px',
                                            background: t.type === 'expense' ? 'rgba(229, 62, 62, 0.1)' : 'rgba(56, 161, 105, 0.1)',
                                            color: t.type === 'expense' ? '#e53e3e' : '#38a169',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {t.type === 'expense' ? <TrendingDown size={20} /> : <TrendingUp size={20} />}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{t.description}</p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '4px' }}>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase' }}>{t.category}</span>
                                                {t.status === 'pending' && (
                                                    <span style={{ fontSize: '0.65rem', background: '#d69e2e', color: 'white', padding: '2px 6px', borderRadius: '6px', fontWeight: 800 }}>EM ANÁLISE</span>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ margin: 0, fontWeight: 800, fontSize: '1.1rem', color: t.type === 'expense' ? '#e53e3e' : '#38a169' }}>
                                                {t.type === 'expense' ? '-' : '+'} R$ {Number(t.value).toLocaleString('pt-BR')}
                                            </p>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 600, opacity: 0.6 }}>{new Date(t.date).toLocaleDateString('pt-BR')}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Categories Distribution */}
                <div className="glass-card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem', fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase' }}>
                        <PieChart size={20} className="text-gold" /> Alocação de Verba
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* This could be dynamic based on categories, but using key categories for now */}
                        {['Pessoal', 'Marketing', 'Logística', 'Material'].map((cat, i) => {
                            const catTotal = transactions.filter(t => t.category === cat).reduce((acc, t) => acc + Number(t.value), 0);
                            const catPercent = totalSpent > 0 ? (catTotal / totalSpent) * 100 : 0;

                            return (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{cat}</span>
                                        <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{catPercent.toFixed(1)}%</span>
                                    </div>
                                    <div style={{ height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                        <div style={{ width: `${catPercent}%`, height: '100%', background: 'var(--secondary)', borderRadius: '10px' }}></div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'rgba(212, 175, 55, 0.05)', borderRadius: '16px', border: '1px solid rgba(212, 175, 55, 0.1)' }}>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <AlertTriangle size={20} style={{ color: 'var(--secondary)', flexShrink: 0 }} />
                            <div>
                                <h4 style={{ margin: '0 0 5px 0', fontSize: '0.9rem', fontWeight: 800, color: 'var(--secondary)' }}>Aviso Legal (TSE)</h4>
                                <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8, lineHeight: 1.5 }}>Lembre-se de anexar as Notas Fiscais para todas as despesas acima de R$ 50,00 para evitar glosas na prestação final.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Manual Entry Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Lançamento Financeiro">
                <form onSubmit={handleAddTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem 0.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>Tipo de Lançamento</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <button
                                type="button"
                                onClick={() => setType('expense')}
                                style={{
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    border: '2px solid',
                                    borderColor: type === 'expense' ? '#e53e3e' : 'var(--border)',
                                    background: type === 'expense' ? 'rgba(229, 62, 62, 0.1)' : 'var(--bg-color)',
                                    color: type === 'expense' ? '#e53e3e' : 'var(--text-light)',
                                    fontWeight: 800,
                                    cursor: 'pointer'
                                }}
                            >DESPESA</button>
                            <button
                                type="button"
                                onClick={() => setType('income')}
                                style={{
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    border: '2px solid',
                                    borderColor: type === 'income' ? '#38a169' : 'var(--border)',
                                    background: type === 'income' ? 'rgba(56, 161, 105, 0.1)' : 'var(--bg-color)',
                                    color: type === 'income' ? '#38a169' : 'var(--text-light)',
                                    fontWeight: 800,
                                    cursor: 'pointer'
                                }}
                            >RECEITA</button>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>Descrição</label>
                        <input
                            type="text"
                            required
                            placeholder="Ex: Impulsionamento de vídeo Bairro Central"
                            className="form-input"
                            style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'var(--bg-color)', border: '1px solid var(--border)' }}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>Valor (R$)</label>
                            <input
                                type="number"
                                required
                                step="0.01"
                                placeholder="0,00"
                                className="form-input"
                                style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'var(--bg-color)', border: '1px solid var(--border)' }}
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>Categoria</label>
                            <select
                                className="form-input"
                                style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'var(--bg-color)', border: '1px solid var(--border)', fontWeight: 600 }}
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option>Combustível</option>
                                <option>Marketing</option>
                                <option>Pessoal</option>
                                <option>Material</option>
                                <option>Logística</option>
                                <option>Doação</option>
                                <option>Fundo Partidário</option>
                            </select>
                        </div>
                    </div>

                    <div style={{
                        border: '2px dashed var(--border)',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        textAlign: 'center',
                        cursor: 'not-allowed',
                        opacity: 0.6,
                        background: 'rgba(255,255,255,0.02)'
                    }}>
                        <Receipt size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
                        <p style={{ fontSize: '0.85rem', margin: 0, fontWeight: 700 }}>Anexar Comprovante / NF</p>
                        <span style={{ fontSize: '0.7rem' }}>(Disponível na versão PRO)</span>
                    </div>

                    <button type="submit" className="btn-gold" style={{ marginTop: '0.5rem', padding: '16px', borderRadius: '14px', fontSize: '1rem', fontWeight: 800 }}>
                        <Save size={20} /> Registrar no TSE Compliance
                    </button>
                </form>
            </Modal>
        </motion.div>
    );
};

export default CampaignFinance;
