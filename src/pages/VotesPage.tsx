import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle, XCircle, Clock, Search, MessageSquare,
    Sparkles, TrendingUp, ShieldCheck, UserCheck, Scale,
    Info, FileText
} from 'lucide-react';
import { useTenant } from '../context/TenantContext';

interface Vote {
    id: string;
    title: string;
    category: string;
    status: 'voting' | 'completed' | 'upcoming';
    myVote: 'yes' | 'no' | 'abstain' | null;
    justification: string;
    othersVotes: { name: string, vote: 'yes' | 'no' | 'abstain' }[];
    lawLink?: string;
    date: string;
}

const VotesPage = () => {
    const { } = useTenant();
    const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedVote, setSelectedVote] = useState<Vote | null>(null);

    const votes: Vote[] = [
        {
            id: '1',
            title: 'PL 452/2025 - Reforma do Plano Diretor',
            category: 'Urbanismo',
            status: 'voting',
            myVote: null,
            justification: '',
            date: '2026-01-25',
            othersVotes: [
                { name: 'João Silva', vote: 'yes' },
                { name: 'Maria Santos', vote: 'no' },
                { name: 'Ricardo Melo', vote: 'yes' }
            ],
            lawLink: '#'
        },
        {
            id: '2',
            title: 'PL 112/2026 - Taxa de Iluminação Pública',
            category: 'Tributário',
            status: 'completed',
            myVote: 'no',
            justification: 'Votamos contra pois onera excessivamente o cidadão de baixa renda em um momento de crise.',
            date: '2026-01-20',
            othersVotes: [
                { name: 'João Silva', vote: 'yes' },
                { name: 'Maria Santos', vote: 'no' }
            ]
        }
    ];

    const filteredVotes = votes.filter(v =>
        (activeTab === 'current' ? v.status === 'voting' || v.status === 'upcoming' : v.status === 'completed') &&
        (v.title.toLowerCase().includes(searchQuery.toLowerCase()) || v.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleRegisterVote = (voteType: 'yes' | 'no' | 'abstain') => {
        if (!selectedVote) return;
        // In a real app, this would update the DB
        console.log(`Voting ${voteType} on ${selectedVote.title}`);
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header */}
            <header className="responsive-header">
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.5rem', letterSpacing: '-1px' }}>
                        Votações
                    </h1>
                    <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
                        Acompanhe, analise e registre seu posicionamento legislativo.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '400px' }} className="flex-col-mobile">
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} size={18} />
                        <input
                            type="text"
                            placeholder="Buscar votação..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                padding: '0.75rem 1rem 0.75rem 2.5rem',
                                borderRadius: '12px',
                                border: '1px solid var(--border)',
                                background: 'var(--surface)',
                                color: 'var(--text)',
                                width: '100%',
                                outline: 'none'
                            }}
                        />
                    </div>
                </div>
            </header>

            <div className="grid-2-1">
                {/* Main Content */}
                <div>
                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)' }}>
                        <button
                            onClick={() => setActiveTab('current')}
                            style={{
                                padding: '1rem 0.5rem',
                                background: 'none',
                                border: 'none',
                                borderBottom: activeTab === 'current' ? '2px solid var(--secondary)' : '2px solid transparent',
                                color: activeTab === 'current' ? 'var(--secondary)' : 'var(--text-light)',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            Pauta da Semana
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            style={{
                                padding: '1rem 0.5rem',
                                background: 'none',
                                border: 'none',
                                borderBottom: activeTab === 'history' ? '2px solid var(--secondary)' : '2px solid transparent',
                                color: activeTab === 'history' ? 'var(--secondary)' : 'var(--text-light)',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}
                        >
                            Histórico de Votos
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {filteredVotes.map(vote => (
                            <motion.div
                                key={vote.id}
                                layoutId={vote.id}
                                onClick={() => setSelectedVote(vote)}
                                whileHover={{ y: -4 }}
                                style={{
                                    background: 'var(--surface)',
                                    borderRadius: '20px',
                                    padding: '1.5rem',
                                    border: '1px solid var(--border)',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div>
                                        <span style={{
                                            padding: '4px 12px',
                                            background: 'rgba(212, 175, 55, 0.1)',
                                            color: 'var(--secondary)',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            textTransform: 'uppercase'
                                        }}>
                                            {vote.category}
                                        </span>
                                        <h3 style={{ fontSize: '1.25rem', marginTop: '0.75rem', fontWeight: 700 }}>{vote.title}</h3>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-light)', fontSize: '0.85rem' }}>
                                            <Clock size={14} />
                                            {new Date(vote.date).toLocaleDateString('pt-BR')}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80' }} />
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Favoráveis: 12</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f87171' }} />
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Contrários: 5</span>
                                        </div>
                                    </div>

                                    {vote.myVote && (
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '6px 12px',
                                            background: vote.myVote === 'yes' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                                            color: vote.myVote === 'yes' ? '#4ade80' : '#f87171',
                                            borderRadius: '10px',
                                            fontSize: '0.85rem',
                                            fontWeight: 600
                                        }}>
                                            {vote.myVote === 'yes' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                            Meu Voto: {vote.myVote === 'yes' ? 'Favorável' : 'Contrário'}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* AI & Quick Actions Sidebar */}
                <div>
                    <div style={{
                        background: 'linear-gradient(135deg, var(--primary), #1e293b)',
                        borderRadius: '24px',
                        padding: '1.5rem',
                        color: 'white',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        marginBottom: '1.5rem',
                        position: 'sticky',
                        top: '2rem'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                            <div style={{ padding: '8px', background: 'rgba(212, 175, 55, 0.2)', borderRadius: '12px', color: 'var(--secondary)' }}>
                                <Sparkles size={20} />
                            </div>
                            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Assessor de Voto IA</h4>
                        </div>

                        {!selectedVote ? (
                            <div style={{ textAlign: 'center', padding: '1rem', opacity: 0.7 }}>
                                <Info size={32} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                <p style={{ fontSize: '0.9rem' }}>Selecione uma votação para receber análise estratégica da IA.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <button className="ai-action-btn">
                                    <ShieldCheck size={16} />
                                    Análise Jurídica Básica
                                </button>
                                <button className="ai-action-btn">
                                    <Scale size={16} />
                                    Análise de Interesse Público
                                </button>
                                <button className="ai-action-btn">
                                    <TrendingUp size={16} />
                                    Impacto Político (Base)
                                </button>
                                <button className="ai-action-btn">
                                    <MessageSquare size={16} />
                                    Sugestão de Justificativa
                                </button>
                                <button className="ai-action-btn">
                                    <FileText size={16} />
                                    Sujestão de Emenda
                                </button>
                            </div>
                        )}
                    </div>

                    {selectedVote && (
                        <div style={{
                            background: 'var(--surface)',
                            borderRadius: '24px',
                            padding: '1.5rem',
                            border: '1px solid var(--border)'
                        }}>
                            <h4 style={{ marginBottom: '1rem', fontWeight: 700 }}>Ações Rápidas</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                <button
                                    onClick={() => handleRegisterVote('yes')}
                                    style={{
                                        padding: '0.75rem',
                                        borderRadius: '12px',
                                        border: '1px solid #4ade80',
                                        background: 'rgba(74, 222, 128, 0.05)',
                                        color: '#4ade80',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Votar Sim
                                </button>
                                <button
                                    onClick={() => handleRegisterVote('no')}
                                    style={{
                                        padding: '0.75rem',
                                        borderRadius: '12px',
                                        border: '1px solid #f87171',
                                        background: 'rgba(248, 113, 113, 0.05)',
                                        color: '#f87171',
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Votar Não
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Vote Detail Modal */}
            <AnimatePresence>
                {selectedVote && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(0,0,0,0.6)',
                            backdropFilter: 'blur(8px)',
                            zIndex: 1100,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '1.5rem'
                        }}
                        onClick={() => setSelectedVote(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: 'white',
                                borderRadius: '32px',
                                width: '100%',
                                maxWidth: '900px',
                                maxHeight: '90vh',
                                overflowY: 'auto',
                                position: 'relative'
                            }}
                        >
                            <div style={{ padding: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }} className="flex-col-mobile">
                                    <div>
                                        <span style={{ color: 'var(--secondary)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem' }}>{selectedVote.category}</span>
                                        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem' }}>{selectedVote.title}</h2>
                                    </div>
                                    <button onClick={() => setSelectedVote(null)} style={{ background: '#f1f5f9', border: 'none', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}>
                                        <XCircle size={24} />
                                    </button>
                                </div>

                                <div className="flex-col-mobile" style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '3rem' }}>
                                    <div>
                                        <section style={{ marginBottom: '2.5rem' }}>
                                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', color: 'var(--text-light)' }}>
                                                <Info size={18} /> Descrição e Impacto
                                            </h4>
                                            <p style={{ lineHeight: '1.7', color: 'var(--text)' }}>
                                                Este projeto visa regulamentar as novas diretrizes de zoneamento urbano para a região metropolitana,
                                                focando em densidade sustentável e preservação de áreas verdes. A análise preliminar indica um
                                                impacto positivo na mobilidade, mas potencial aumento no custo de novos empreendimentos.
                                            </p>
                                        </section>

                                        <section>
                                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', color: 'var(--text-light)' }}>
                                                <UserCheck size={18} /> Votos de outros Vereadores
                                            </h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                {selectedVote.othersVotes.map((v, i) => (
                                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '16px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <UserCheck size={18} color="#64748b" />
                                                            </div>
                                                            <span style={{ fontWeight: 600 }}>{v.name}</span>
                                                        </div>
                                                        <span style={{
                                                            padding: '4px 12px',
                                                            borderRadius: '8px',
                                                            background: v.vote === 'yes' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                                                            color: v.vote === 'yes' ? '#4ade80' : '#f87171',
                                                            fontSize: '0.8rem',
                                                            fontWeight: 700
                                                        }}>
                                                            {v.vote === 'yes' ? 'A FAVOR' : 'CONTRA'}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    </div>

                                    <div>
                                        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '24px', marginBottom: '1.5rem' }}>
                                            <h4 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Sua Justificativa</h4>
                                            <textarea
                                                placeholder="Descreva o motivo do seu voto para registro público..."
                                                style={{
                                                    width: '100%',
                                                    height: '150px',
                                                    padding: '1rem',
                                                    borderRadius: '16px',
                                                    border: '1px solid #e2e8f0',
                                                    resize: 'none',
                                                    fontSize: '0.9rem',
                                                    outline: 'none',
                                                    marginBottom: '1rem'
                                                }}
                                                defaultValue={selectedVote.justification}
                                            />
                                            <button style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                background: 'var(--primary)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '12px',
                                                fontWeight: 600,
                                                cursor: 'pointer'
                                            }}>
                                                Salvar Justificativa
                                            </button>
                                        </div>

                                        <div style={{ border: '1px dashed #cbd5e1', padding: '1.5rem', borderRadius: '24px' }}>
                                            <h4 style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>Documentação</h4>
                                            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
                                                <FileText size={16} /> Texto Integral do Projeto.pdf
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .ai-action-btn {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: white;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 0.9rem;
                    font-weight: 500;
                    text-align: left;
                }
                .ai-action-btn:hover {
                    background: rgba(255,255,255,0.2);
                    border-color: var(--secondary);
                    transform: translateX(5px);
                }
            `}</style>
        </div >
    );
};

export default VotesPage;
