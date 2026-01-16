import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users, UserPlus, Filter, Search, Phone,
    MapPin, Star, ThumbsUp, ThumbsDown, MessageCircle,
    MoreHorizontal, TrendingUp, Award
} from 'lucide-react';
import { Modal, Drawer } from '../components/UIComponents';

const initialVoters = [
    { id: 1, name: 'João Silva', neighborhood: 'Centro', phone: '(55) 99999-9999', status: 'ganho', leader: 'Maria (Assessor)', interactions: 5, lastContact: '15/05' },
    { id: 2, name: 'Ana Oliveira', neighborhood: 'Vila Nova', phone: '(55) 98888-8888', status: 'indeciso', leader: 'Pedro (Cabo)', interactions: 2, lastContact: '10/05' },
    { id: 3, name: 'Carlos Santos', neighborhood: 'Rural', phone: '(55) 97777-7777', status: 'pendente', leader: '-', interactions: 0, lastContact: '-' },
    { id: 4, name: 'Lucia Ferreira', neighborhood: 'Centro', phone: '(55) 96666-6666', status: 'ganho', leader: 'Maria (Assessor)', interactions: 8, lastContact: '16/05' },
    { id: 5, name: 'Roberto Costa', neighborhood: 'Jardim', phone: '(55) 95555-5555', status: 'perdido', leader: 'João (Assessor)', interactions: 1, lastContact: '02/05' },
];

const VoterCrm = () => {
    const [voters] = useState(initialVoters);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedVoter, setSelectedVoter] = useState<any>(null);
    const [filterStatus, setFilterStatus] = useState('todos');

    // Stats
    const totalVoters = voters.length;
    const votesWon = voters.filter(v => v.status === 'ganho').length;
    const votesUndecided = voters.filter(v => v.status === 'indeciso').length;

    // Funnel Calculation (Simple Quotient Goal)
    const quotientGoal = 2500; // Example goal
    const progress = (votesWon / quotientGoal) * 100;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ganho': return '#38a169'; // Green
            case 'indeciso': return '#d69e2e'; // Yellow
            case 'perdido': return '#e53e3e'; // Red
            default: return '#718096'; // Gray
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'ganho': return 'Voto Consolidado';
            case 'indeciso': return 'Em Negociação';
            case 'perdido': return 'Voto Perdido';
            default: return 'Pendente';
        }
    };

    const handleVoterClick = (voter: any) => {
        setSelectedVoter(voter);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <div style={{ padding: '0.5rem', background: 'var(--primary)', borderRadius: '0.5rem', color: 'var(--secondary)' }}>
                            <Users size={32} />
                        </div>
                        <h1>Gestão de Eleitores (CRM)</h1>
                    </div>
                    <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
                        Funil de votos e gestão de relacionamento com cidadãos.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn-gold outline" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <Filter size={18} /> Filtrar
                    </button>
                    <button
                        className="btn-gold"
                        onClick={() => setIsAddModalOpen(true)}
                        style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                    >
                        <UserPlus size={18} /> Novo Eleitor
                    </button>
                </div>
            </header>

            {/* Funnel/Stats Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(56, 161, 105, 0.1) 0%, rgba(56, 161, 105, 0.05) 100%)', border: '1px solid rgba(56, 161, 105, 0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.9rem', color: '#38a169', fontWeight: 600 }}>Votos Consolidados</span>
                        <Award size={20} color="#38a169" />
                    </div>
                    <h2 style={{ fontSize: '2.5rem', margin: 0, color: '#38a169' }}>{votesWon}</h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
                        Meta: {quotientGoal} ({progress.toFixed(1)}%)
                    </p>
                    <div style={{ width: '100%', height: '4px', background: 'rgba(56, 161, 105, 0.2)', marginTop: '1rem', borderRadius: '2px' }}>
                        <div style={{ width: `${progress}%`, height: '100%', background: '#38a169', borderRadius: '2px' }}></div>
                    </div>
                </div>

                <div className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.9rem', color: '#d69e2e', fontWeight: 600 }}>Potencial / Indecisos</span>
                        <TrendingUp size={20} color="#d69e2e" />
                    </div>
                    <h2 style={{ fontSize: '2.5rem', margin: 0, color: '#d69e2e' }}>{votesUndecided}</h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
                        Foco da campanha esta semana
                    </p>
                </div>

                <div className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Total na Base</span>
                        <Users size={20} color="var(--text-light)" />
                    </div>
                    <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{totalVoters}</h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
                        Cidadãos cadastrados
                    </p>
                </div>
            </div>

            {/* Main List */}
            <div className="glass-card" style={{ padding: '0' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                        <input
                            type="text"
                            placeholder="Buscar por nome, bairro ou telefone..."
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem 0.75rem 2.8rem',
                                borderRadius: '0.5rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'white'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {['todos', 'ganho', 'indeciso', 'pendente'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                style={{
                                    background: filterStatus === status ? 'rgba(212, 175, 55, 0.2)' : 'transparent',
                                    border: filterStatus === status ? '1px solid var(--secondary)' : '1px solid rgba(255,255,255,0.1)',
                                    color: filterStatus === status ? 'var(--secondary)' : 'var(--text-light)',
                                    padding: '0.4rem 1rem',
                                    borderRadius: '2rem',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    textTransform: 'capitalize'
                                }}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ padding: '0.5rem' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <th style={{ padding: '1rem', textAlign: 'left', opacity: 0.6, fontSize: '0.8rem' }}>Nome</th>
                                <th style={{ padding: '1rem', textAlign: 'left', opacity: 0.6, fontSize: '0.8rem' }}>Bairro</th>
                                <th style={{ padding: '1rem', textAlign: 'left', opacity: 0.6, fontSize: '0.8rem' }}>Status</th>
                                <th style={{ padding: '1rem', textAlign: 'left', opacity: 0.6, fontSize: '0.8rem' }}>Responsável</th>
                                <th style={{ padding: '1rem', textAlign: 'right', opacity: 0.6, fontSize: '0.8rem' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {voters.filter(v => filterStatus === 'todos' || v.status === filterStatus).map((voter) => (
                                <tr
                                    key={voter.id}
                                    style={{ cursor: 'pointer', transition: 'background 0.2s', borderBottom: '1px solid rgba(255,255,255,0.02)' }}
                                    className="hover-bg"
                                    onClick={() => handleVoterClick(voter)}
                                >
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                                                {voter.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{voter.name}</div>
                                                <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{voter.phone}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                                            <MapPin size={14} style={{ opacity: 0.6 }} /> {voter.neighborhood}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            background: `${getStatusColor(voter.status)}20`,
                                            color: getStatusColor(voter.status),
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '1rem',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            border: `1px solid ${getStatusColor(voter.status)}40`
                                        }}>
                                            {getStatusLabel(voter.status)}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>
                                        {voter.leader}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <button className="icon-btn" style={{ marginRight: '0.5rem' }} title="Chamar no WhatsApp">
                                            <MessageCircle size={18} color="#25D366" />
                                        </button>
                                        <button className="icon-btn">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Drawer for Voter Details */}
            <Drawer
                isOpen={!!selectedVoter}
                onClose={() => setSelectedVoter(null)}
                title={selectedVoter ? selectedVoter.name : 'Detalhes'}
            >
                {selectedVoter && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Profile Header */}
                        <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem' }}>
                            <div style={{ width: '80px', height: '80px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, margin: '0 auto 1rem auto', color: 'var(--secondary)' }}>
                                {selectedVoter.name.charAt(0)}
                            </div>
                            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{selectedVoter.name}</h2>
                            <p style={{ color: 'var(--text-light)', margin: '0.5rem 0 0 0' }}>{selectedVoter.neighborhood}</p>

                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
                                <button className="btn-gold outline" style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Phone size={18} />
                                </button>
                                <button className="btn-gold" style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <MessageCircle size={18} />
                                </button>
                                <button className="btn-gold outline" style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Star size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Status Control */}
                        <div>
                            <h4 style={{ marginBottom: '1rem', color: 'var(--secondary)' }}>Status do Voto</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                                <button
                                    className="glass-card"
                                    style={{
                                        padding: '0.75rem',
                                        textAlign: 'center',
                                        borderColor: selectedVoter.status === 'ganho' ? '#38a169' : 'transparent',
                                        background: selectedVoter.status === 'ganho' ? 'rgba(56, 161, 105, 0.1)' : undefined
                                    }}
                                >
                                    <ThumbsUp size={20} color="#38a169" style={{ marginBottom: '0.25rem' }} />
                                    <div style={{ fontSize: '0.7rem', color: '#38a169' }}>Ganho</div>
                                </button>
                                <button
                                    className="glass-card"
                                    style={{
                                        padding: '0.75rem',
                                        textAlign: 'center',
                                        borderColor: selectedVoter.status === 'indeciso' ? '#d69e2e' : 'transparent',
                                        background: selectedVoter.status === 'indeciso' ? 'rgba(214, 158, 46, 0.1)' : undefined
                                    }}
                                >
                                    <div style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>🤔</div>
                                    <div style={{ fontSize: '0.7rem', color: '#d69e2e' }}>Indeciso</div>
                                </button>
                                <button
                                    className="glass-card"
                                    style={{
                                        padding: '0.75rem',
                                        textAlign: 'center',
                                        borderColor: selectedVoter.status === 'perdido' ? '#e53e3e' : 'transparent',
                                        background: selectedVoter.status === 'perdido' ? 'rgba(229, 62, 62, 0.1)' : undefined
                                    }}
                                >
                                    <ThumbsDown size={20} color="#e53e3e" style={{ marginBottom: '0.25rem' }} />
                                    <div style={{ fontSize: '0.7rem', color: '#e53e3e' }}>Perdido</div>
                                </button>
                            </div>
                        </div>

                        {/* Info Fields */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block', marginBottom: '0.25rem' }}>Telefone</label>
                                <div style={{ fontSize: '1rem' }}>{selectedVoter.phone}</div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block', marginBottom: '0.25rem' }}>Responsável (Cabo/Assessor)</label>
                                <div style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '20px', height: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
                                    {selectedVoter.leader}
                                </div>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'block', marginBottom: '0.25rem' }}>Último Contato</label>
                                <div style={{ fontSize: '1rem' }}>{selectedVoter.lastContact}</div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <h4 style={{ marginBottom: '0.5rem' }}>Anotações</h4>
                            <textarea
                                placeholder="Adicione observações sobre este eleitor..."
                                style={{
                                    width: '100%',
                                    minHeight: '100px',
                                    padding: '0.75rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '0.5rem',
                                    color: 'white',
                                    resize: 'none'
                                }}
                            ></textarea>
                            <button className="btn-gold" style={{ width: '100%', marginTop: '1rem' }}>Salvar Alterações</button>
                        </div>
                    </div>
                )}
            </Drawer>

            {/* Quick Add Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Novo Eleitor">
                <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Nome Completo</label>
                        <input type="text" className="form-input" placeholder="Ex: Maria da Silva" style={{ width: '100%' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Telefone (WhatsApp)</label>
                        <input type="text" className="form-input" placeholder="(00) 00000-0000" style={{ width: '100%' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Bairro</label>
                        <select className="form-input" style={{ width: '100%' }}>
                            <option>Centro</option>
                            <option>Vila Nova</option>
                            <option>Jardim</option>
                            <option>Rural</option>
                        </select>
                    </div>

                    <button className="btn-gold" style={{ marginTop: '1rem' }} onClick={() => setIsAddModalOpen(false)}>
                        Cadastrar Eleitor
                    </button>
                </form>
            </Modal>
        </motion.div>
    );
};

export default VoterCrm;
