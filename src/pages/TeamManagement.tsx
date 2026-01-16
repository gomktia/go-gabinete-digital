import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users, MapPin, DollarSign, CheckCircle, Clock, Plus, Filter,
    Briefcase, AlertTriangle
} from 'lucide-react';
import { Modal } from '../components/UIComponents';

const initialTeam = [
    { id: 1, name: 'Carlos Mendes', role: 'Líder de Bairro', region: 'Vila Nova', status: 'active', allocation: 'Rua das Flores (Bandeiraço)', paymentStatus: 'paid', amount: 150 },
    { id: 2, name: 'Fernanda Souza', role: 'Cabo Eleitoral', region: 'Centro', status: 'active', allocation: 'Praça Central (Panfletagem)', paymentStatus: 'pending', amount: 100 },
    { id: 3, name: 'Roberto Lima', role: 'Apoiador Voluntário', region: 'Zona Rural', status: 'inactive', allocation: '-', paymentStatus: 'n/a', amount: 0 },
    { id: 4, name: 'Ana Pereira', role: 'Coord. de Campanha', region: 'Geral', status: 'active', allocation: 'Comitê Central', paymentStatus: 'paid', amount: 300 },
];

const TeamManagement = () => {
    const [team, setTeam] = useState(initialTeam);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Stats
    const totalActive = team.filter(t => t.status === 'active').length;
    const pendingPayments = team.filter(t => t.paymentStatus === 'pending').length;
    const totalDailyCost = team.reduce((acc, curr) => acc + curr.amount, 0);

    const handlePayment = (id: number) => {
        const updatedTeam = team.map(t =>
            t.id === id ? { ...t, paymentStatus: 'paid' } : t
        );
        setTeam(updatedTeam);
        alert('Pagamento registrado com sucesso!');
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
            <header className="responsive-header">
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <div style={{ padding: '0.5rem', background: 'var(--primary)', borderRadius: '0.5rem', color: 'var(--secondary)' }}>
                            <Briefcase size={32} />
                        </div>
                        <h1>Gestão de Equipe</h1>
                    </div>
                    <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
                        Organização de cabos eleitorais, alocação de rua e folha de pagamento.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }} className="flex-col-mobile">
                    <button className="btn-gold outline" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <MapPin size={18} /> Ver no Mapa
                    </button>
                    <button
                        className="btn-gold"
                        onClick={() => setIsAddModalOpen(true)}
                        style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                    >
                        <Plus size={18} /> Novo Colaborador
                    </button>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="responsive-grid" style={{ marginBottom: '2.5rem' }}>
                <div className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Equipe Ativa (Hoje)</span>
                        <Users size={18} color="var(--primary)" />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', margin: 0 }}>{totalActive}</h2>
                    <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#38a169', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle size={12} /> Prontos para ação
                    </p>
                </div>

                <div className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Pagamentos Pendentes</span>
                        <AlertTriangle size={18} color="#ed8936" />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', margin: 0, color: pendingPayments > 0 ? '#ed8936' : 'var(--text)' }}>{pendingPayments}</h2>
                    <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--text-light)' }}>
                        Confirmar diárias
                    </p>
                </div>

                <div className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Custo Diário Estimado</span>
                        <DollarSign size={18} color="#e53e3e" />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', margin: 0, color: '#e53e3e' }}>R$ {totalDailyCost.toLocaleString()}</h2>
                    <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--text-light)' }}>
                        Baseado na alocação atual
                    </p>
                </div>
            </div>

            {/* Team List */}
            <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users size={20} /> Lista de Colaboradores
                    </h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn-gold outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                            <Filter size={14} style={{ marginRight: '4px' }} /> Filtrar
                        </button>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className="responsive-table" style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text)' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '1rem', textAlign: 'left', opacity: 0.8, fontSize: '0.8rem' }}>Nome / Função</th>
                                <th style={{ padding: '1rem', textAlign: 'left', opacity: 0.8, fontSize: '0.8rem' }}>Região / Alocação</th>
                                <th style={{ padding: '1rem', textAlign: 'left', opacity: 0.8, fontSize: '0.8rem' }}>Status</th>
                                <th style={{ padding: '1rem', textAlign: 'right', opacity: 0.8, fontSize: '0.8rem' }}>Pagamento (Dia)</th>
                                <th style={{ padding: '1rem', textAlign: 'right', opacity: 0.8, fontSize: '0.8rem' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {team.map((member) => (
                                <tr key={member.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem' }} data-label="Colaborador">
                                        <div style={{ fontWeight: 600 }}>{member.name}</div>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{member.role}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }} data-label="Alocação">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <MapPin size={14} style={{ color: 'var(--primary)' }} />
                                            {member.allocation}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.7, marginLeft: '20px' }}>{member.region}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }} data-label="Status">
                                        <span style={{
                                            padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600,
                                            background: member.status === 'active' ? 'rgba(56, 161, 105, 0.1)' : 'rgba(229, 62, 62, 0.1)',
                                            color: member.status === 'active' ? '#38a169' : '#e53e3e'
                                        }}>
                                            {member.status === 'active' ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }} data-label="Pagamento">
                                        <div style={{ fontWeight: 700 }}>R$ {member.amount},00</div>
                                        {member.paymentStatus === 'paid' ? (
                                            <span style={{ fontSize: '0.7rem', color: '#38a169', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                                                <CheckCircle size={10} /> Pago
                                            </span>
                                        ) : (
                                            <span style={{ fontSize: '0.7rem', color: '#ed8936', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                                                <Clock size={10} /> Pendente
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }} data-label="Ações">
                                        {member.paymentStatus === 'pending' && (
                                            <button
                                                onClick={() => handlePayment(member.id)}
                                                className="btn-primary"
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: '#38a169', color: 'white' }}
                                            >
                                                Pagar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Novo Colaborador">
                <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label>Nome Completo</label>
                        <input type="text" placeholder="Ex: João da Silva" />
                    </div>
                    <div>
                        <label>Função</label>
                        <select>
                            <option>Cabo Eleitoral</option>
                            <option>Líder de Bairro</option>
                            <option>Coordenador</option>
                            <option>Voluntário</option>
                        </select>
                    </div>
                    <div>
                        <label>Região de Atuação</label>
                        <input type="text" placeholder="Ex: Vila Nova" />
                    </div>
                    <div>
                        <label>Valor Diária (R$)</label>
                        <input type="number" placeholder="100.00" />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button className="btn-gold" style={{ flex: 1 }} onClick={() => setIsAddModalOpen(false)}>Cadastrar</button>
                        <button className="btn-primary" style={{ flex: 1, background: '#edf2f7', color: 'black' }} onClick={() => setIsAddModalOpen(false)}>Cancelar</button>
                    </div>
                </form>
            </Modal>
        </motion.div>
    );
};

export default TeamManagement;
