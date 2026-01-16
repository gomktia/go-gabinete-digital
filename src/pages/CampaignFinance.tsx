import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    DollarSign, TrendingDown, TrendingUp, PieChart,
    AlertTriangle, FileText, Plus, Receipt, AlertCircle, Wallet, Upload, RefreshCw
} from 'lucide-react';
import { Modal } from '../components/UIComponents';

// Mock Data
const initialBudget = {
    totalLimit: 500000,
    spent: 145000,
    categories: [
        { name: 'Impulsionamento (Redes)', limit: 50000, spent: 32000, color: '#3182ce' },
        { name: 'Pessoal / Cabo Eleitoral', limit: 200000, spent: 85000, color: '#38a169' },
        { name: 'Material Gráfico', limit: 100000, spent: 12000, color: '#d69e2e' },
        { name: 'Combustível / Transporte', limit: 30000, spent: 8000, color: '#e53e3e' },
        { name: 'Comitê / Aluguel', limit: 50000, spent: 8000, color: '#805ad5' },
    ]
};

const initialTransactions = [
    { id: 1, type: 'expense', category: 'Impulsionamento', description: 'Ads Facebook - Semana 1', value: 2500, date: '15/05', status: 'verified' },
    { id: 2, type: 'expense', category: 'Material Gráfico', description: 'Impressão Santinhos', value: 4500, date: '14/05', status: 'pending' },
    { id: 3, type: 'income', category: 'Doação', description: 'Fundo Partidário', value: 50000, date: '10/05', status: 'verified' },
    { id: 4, type: 'expense', category: 'Pessoal', description: 'Pagamento Cabos Eleitorais', value: 12000, date: '05/05', status: 'verified' },
];

const CampaignFinance = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [transactions, setTransactions] = useState(initialTransactions);
    const [isProcessing, setIsProcessing] = useState(false);
    const [uploadStep, setUploadStep] = useState(0); // 0: Upload, 1: Processing, 2: Review

    // Calculate Percentages
    const totalProgress = (initialBudget.spent / initialBudget.totalLimit) * 100;

    const handleFileUpload = () => {
        setIsProcessing(true);
        setUploadStep(1);

        // Simulate processing time
        setTimeout(() => {
            setUploadStep(2);
            setIsProcessing(false);
        }, 2000);
    };

    const confirmImport = () => {
        const newTransactions = [
            { id: 5, type: 'expense', category: 'Combustível', description: 'Posto Shell - Abastecimento', value: 350.00, date: '18/05', status: 'pending' },
            { id: 6, type: 'expense', category: 'Alimentação', description: 'Restaurante Bom Sabor', value: 120.50, date: '18/05', status: 'pending' },
            { id: 7, type: 'income', category: 'Doação', description: 'Transferência Pix - João da Silva', value: 1000.00, date: '19/05', status: 'verified' }
        ];

        setTransactions([...newTransactions, ...transactions]);
        setIsImportModalOpen(false);
        setUploadStep(0);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
            <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <div style={{ padding: '0.5rem', background: 'var(--primary)', borderRadius: '0.5rem', color: 'var(--secondary)' }}>
                            <DollarSign size={32} />
                        </div>
                        <h1>Financeiro de Campanha</h1>
                    </div>
                    <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
                        Controle rigoroso de gastos e receitas eleitorais (TSE Compliance).
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        className="btn-gold outline"
                        onClick={() => setIsImportModalOpen(true)}
                        style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                    >
                        <Upload size={18} /> Importar Extrato
                    </button>
                    <button
                        className="btn-gold"
                        onClick={() => setIsModalOpen(true)}
                        style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                    >
                        <Plus size={18} /> Nova Despesa
                    </button>
                </div>
            </header>

            {/* Top Summaries */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Teto de Gastos (TSE)</span>
                        <AlertCircle size={18} color="var(--secondary)" />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', margin: 0 }}>R$ 500.000,00</h2>
                    <div style={{ marginTop: '1rem', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${totalProgress}%`, height: '100%', background: totalProgress > 80 ? '#e53e3e' : '#38a169' }}></div>
                    </div>
                    <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--text-light)' }}>
                        {totalProgress.toFixed(1)}% utilizado
                    </p>
                </div>

                <div className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Total Gasto</span>
                        <TrendingDown size={18} color="#e53e3e" />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', margin: 0, color: '#e53e3e' }}>R$ 145.000,00</h2>
                    <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--text-light)' }}>
                        +12% vs semana anterior
                    </p>
                </div>

                <div className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Disponível em Caixa</span>
                        <Wallet size={18} color="#38a169" />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', margin: 0, color: '#38a169' }}>R$ 55.000,00</h2>
                    <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--text-light)' }}>
                        Baseado em doações confirmadas
                    </p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Categories & Limits */}
                <div className="glass-card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <PieChart size={20} /> Distribuição e Metas
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {initialBudget.categories.map((cat, i) => {
                            const percent = (cat.spent / cat.limit) * 100;
                            const isNearLimit = percent > 80;

                            return (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                        <span style={{ fontWeight: 600 }}>{cat.name}</span>
                                        <span>R$ {cat.spent.toLocaleString()} / <span style={{ opacity: 0.6 }}>R$ {cat.limit.toLocaleString()}</span></span>
                                    </div>
                                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                                        <div
                                            style={{
                                                width: `${percent}%`,
                                                height: '100%',
                                                background: isNearLimit ? '#e53e3e' : cat.color,
                                                borderRadius: '4px',
                                                transition: 'width 1s ease-in-out'
                                            }}
                                        ></div>
                                    </div>
                                    {isNearLimit && (
                                        <p style={{ color: '#e53e3e', fontSize: '0.75rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <AlertTriangle size={12} /> Atenção: Próximo ao limite da categoria
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="glass-card">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <FileText size={20} /> Últimos Lançamentos
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {transactions.map((t) => (
                            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{
                                    padding: '0.6rem',
                                    borderRadius: '50%',
                                    background: t.type === 'expense' ? 'rgba(229, 62, 62, 0.1)' : 'rgba(56, 161, 105, 0.1)',
                                    color: t.type === 'expense' ? '#e53e3e' : '#38a169'
                                }}>
                                    {t.type === 'expense' ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>{t.description}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{t.category}</span>
                                        {t.status === 'pending' && (
                                            <span style={{ fontSize: '0.6rem', background: '#d69e2e', color: 'white', padding: '1px 4px', borderRadius: '4px' }}>Pendente NF</span>
                                        )}
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ margin: 0, fontWeight: 700, color: t.type === 'expense' ? '#e53e3e' : '#38a169' }}>
                                        {t.type === 'expense' ? '-' : '+'} R$ {t.value.toLocaleString()}
                                    </p>
                                    <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{t.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="btn-gold outline" style={{ width: '100%', marginTop: '1rem', fontSize: '0.9rem' }}>
                        Ver Extrato Completo
                    </button>
                </div>
            </div>

            {/* Manual Entry Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Despesa / Receita">
                <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Tipo</label>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="glass-card" style={{ flex: 1, textAlign: 'center', padding: '0.75rem', borderColor: '#e53e3e', color: '#e53e3e' }}>Despesa</button>
                            <button className="glass-card" style={{ flex: 1, textAlign: 'center', padding: '0.75rem', opacity: 0.5 }}>Receita</button>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Descrição</label>
                        <input type="text" placeholder="Ex: Combustível Hilux da Campanha" style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }} />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Valor (R$)</label>
                            <input type="number" placeholder="0,00" style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Categoria</label>
                            <select style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}>
                                <option>Combustível</option>
                                <option>Material Gráfico</option>
                                <option>Pessoal</option>
                                <option>Impulsionamento</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '0.5rem', padding: '1.5rem', textAlign: 'center', marginTop: '0.5rem', cursor: 'pointer' }}>
                        <Receipt size={24} style={{ opacity: 0.5, marginBottom: '0.5rem' }} />
                        <p style={{ fontSize: '0.9rem', margin: 0 }}>Anexar Nota Fiscal / Recibo</p>
                        <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>(Obrigatório para despesas acima de R$ 50)</span>
                    </div>

                    <button className="btn-gold" style={{ marginTop: '1rem' }} onClick={() => setIsModalOpen(false)}>
                        Lançar no Sistema
                    </button>
                </form>
            </Modal>

            {/* Import Statement Modal */}
            <Modal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} title="Importar Extrato Bancário">
                {uploadStep === 0 && (
                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                        <div style={{ border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '1rem', padding: '3rem', cursor: 'pointer', marginBottom: '1.5rem', position: 'relative' }}>
                            <input
                                type="file"
                                accept=".pdf,.ofx,.csv,.jpg,.jpeg,.png,.heic,image/*"
                                onChange={handleFileUpload}
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                            />
                            <Upload size={48} style={{ color: 'var(--secondary)', marginBottom: '1rem' }} />
                            <p>Arraste seu extrato ou foto aqui (PDF, Fotos, CSV...)</p>
                            <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>Aceita extratos bancários e fotos de notas fiscais (JPG, PNG)</p>
                        </div>
                        <div style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '1rem', borderRadius: '0.5rem', fontSize: '0.9rem', color: 'var(--secondary)' }}>
                            <p style={{ margin: 0 }}>ℹ️ Nossa IA lê documentos e também reconhece textos em <b>fotos</b> de comprovantes.</p>
                        </div>
                    </div>
                )}

                {uploadStep === 1 && (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <RefreshCw size={48} className="spin" style={{ color: 'var(--secondary)', marginBottom: '1.5rem' }} />
                        <h3>Processando Arquivo...</h3>
                        <p style={{ opacity: 0.7 }}>Identificando transações e categorizando...</p>
                    </div>
                )}

                {uploadStep === 2 && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h4 style={{ margin: 0 }}>3 Transações Encontradas</h4>
                            <span style={{ fontSize: '0.8rem', color: '#38a169' }}>Sucesso</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto' }}>
                            <div className="glass-card" style={{ padding: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>Posto Shell</p>
                                    <span style={{ fontSize: '0.7rem', background: '#e53e3e', color: 'white', padding: '1px 4px', borderRadius: '4px' }}>Combustível</span>
                                </div>
                                <span style={{ color: '#e53e3e', fontWeight: 700 }}>- R$ 350,00</span>
                            </div>
                            <div className="glass-card" style={{ padding: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>Restaurante Bom Sabor</p>
                                    <span style={{ fontSize: '0.7rem', background: '#e53e3e', color: 'white', padding: '1px 4px', borderRadius: '4px' }}>Alimentação</span>
                                </div>
                                <span style={{ color: '#e53e3e', fontWeight: 700 }}>- R$ 120,50</span>
                            </div>
                            <div className="glass-card" style={{ padding: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>Pix Recebido (João)</p>
                                    <span style={{ fontSize: '0.7rem', background: '#38a169', color: 'white', padding: '1px 4px', borderRadius: '4px' }}>Doação</span>
                                </div>
                                <span style={{ color: '#38a169', fontWeight: 700 }}>+ R$ 1.000,00</span>
                            </div>
                        </div>
                        <button className="btn-gold" style={{ width: '100%', marginTop: '1.5rem' }} onClick={confirmImport}>
                            Confirmar Importação
                        </button>
                    </div>
                )}
            </Modal>
        </motion.div>
    );
};

export default CampaignFinance;
