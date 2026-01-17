import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users, UserPlus, Filter, Search, Phone,
    MapPin, Star, ThumbsUp, ThumbsDown, MessageCircle,
    MoreHorizontal, TrendingUp, Award, Loader2, Save
} from 'lucide-react';
import { Modal, Drawer } from '../components/UIComponents';
import { supabase } from '../lib/supabase';
import { useTenant } from '../context/TenantContext';

// Interface matching Supabase table
interface Voter {
    id: string; // UUID from supabase
    name: string;
    neighborhood: string;
    phone: string;
    status: 'ganho' | 'indeciso' | 'perdido' | 'pendente';
    leader: string;
    interactions: number;
    last_contact: string | null;
    notes: string;
}

const VoterCrm = () => {
    const { tenant } = useTenant();
    const [voters, setVoters] = useState<Voter[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedVoter, setSelectedVoter] = useState<Voter | null>(null);
    const [filterStatus, setFilterStatus] = useState('todos');

    // Form states
    const [newVoterName, setNewVoterName] = useState('');
    const [newVoterPhone, setNewVoterPhone] = useState('');
    const [newVoterNeighborhood, setNewVoterNeighborhood] = useState('Centro');

    // Notes state
    const [notesBuffer, setNotesBuffer] = useState('');

    useEffect(() => {
        if (tenant.id) {
            fetchVoters();
        }
    }, [tenant.id]);

    useEffect(() => {
        if (selectedVoter) {
            setNotesBuffer(selectedVoter.notes || '');
        }
    }, [selectedVoter]);

    const fetchVoters = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('voters')
            .select('*')
            .eq('tenant_id', tenant.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching voters:', error);
            alert('Erro ao carregar eleitores');
        } else {
            setVoters(data || []);
        }
        setIsLoading(false);
    };

    const handleAddVoter = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!tenant.id) {
            alert('Erro: ID do Gabinete não encontrado.');
            return;
        }

        const newVoter = {
            name: newVoterName,
            phone: newVoterPhone,
            neighborhood: newVoterNeighborhood,
            status: 'pendente',
            leader: 'Vereador', // Default for now
            tenant_id: tenant.id
        };

        const { data, error } = await supabase
            .from('voters')
            .insert([newVoter])
            .select();

        if (error) {
            console.error('Error adding voter:', error);
            alert('Erro ao cadastrar eleitor');
        } else if (data) {
            setVoters([data[0], ...voters]);
            setIsAddModalOpen(false);
            setNewVoterName('');
            setNewVoterPhone('');
            // Show success feedback if needed
        }
    };

    const handleUpdateStatus = async (voterId: string, newStatus: string) => {
        if (!selectedVoter) return;

        // Optimistic update
        const updatedVoter = { ...selectedVoter, status: newStatus as any };
        setSelectedVoter(updatedVoter);
        setVoters(voters.map(v => v.id === voterId ? updatedVoter : v));

        const { error } = await supabase
            .from('voters')
            .update({ status: newStatus })
            .eq('id', voterId);

        if (error) {
            console.error('Error updating status:', error);
            alert('Erro ao atualizar status');
            fetchVoters(); // Revert on error
        }
    };

    const handleSaveNotes = async () => {
        if (!selectedVoter) return;

        const { error } = await supabase
            .from('voters')
            .update({ notes: notesBuffer })
            .eq('id', selectedVoter.id);

        if (error) {
            alert('Erro ao salvar anotação');
        } else {
            // Update local state
            const updatedVoter = { ...selectedVoter, notes: notesBuffer };
            setSelectedVoter(updatedVoter);
            setVoters(voters.map(v => v.id === selectedVoter.id ? updatedVoter : v));
            alert('Anotações salvas com sucesso!');
        }
    };

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

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <header className="responsive-header">
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
                <div style={{ display: 'flex', gap: '1rem' }} className="flex-col-mobile">
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
            <div className="responsive-grid" style={{ marginBottom: '2.5rem' }}>
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
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, color: 'var(--text)' }} />
                        <input
                            type="text"
                            placeholder="Buscar por nome, bairro ou telefone..."
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem 0.75rem 2.8rem',
                                borderRadius: '0.5rem',
                                background: 'var(--bg-color)',
                                border: '1px solid var(--border)',
                                color: 'var(--text)'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {['todos', 'ganho', 'indeciso', 'pendente'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                style={{
                                    background: filterStatus === status ? 'var(--secondary)' : 'transparent',
                                    border: filterStatus === status ? '1px solid var(--secondary)' : '1px solid var(--border)',
                                    color: filterStatus === status ? 'var(--primary)' : 'var(--text-light)',
                                    padding: '0.4rem 1rem',
                                    borderRadius: '2rem',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    textTransform: 'capitalize',
                                    fontWeight: filterStatus === status ? 700 : 400
                                }}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ padding: '0.5rem', overflowX: 'auto' }}>
                    {isLoading ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>
                            <Loader2 className="animate-spin" style={{ margin: '0 auto', marginBottom: '0.5rem' }} />
                            Carregando eleitores...
                        </div>
                    ) : (
                        <table className="responsive-table" style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text)' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '1rem', textAlign: 'left', opacity: 0.8, fontSize: '0.8rem', color: 'var(--text-light)' }}>Nome</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', opacity: 0.8, fontSize: '0.8rem', color: 'var(--text-light)' }}>Bairro</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', opacity: 0.8, fontSize: '0.8rem', color: 'var(--text-light)' }}>Status</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', opacity: 0.8, fontSize: '0.8rem', color: 'var(--text-light)' }}>Responsável</th>
                                    <th style={{ padding: '1rem', textAlign: 'right', opacity: 0.8, fontSize: '0.8rem', color: 'var(--text-light)' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {voters.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>
                                            Nenhum eleitor encontrado.
                                        </td>
                                    </tr>
                                ) : (
                                    voters.filter(v => filterStatus === 'todos' || v.status === filterStatus).map((voter) => (
                                        <tr
                                            key={voter.id}
                                            style={{ cursor: 'pointer', transition: 'background 0.2s', borderBottom: '1px solid var(--border)' }}
                                            className="hover-bg"
                                            onClick={() => setSelectedVoter(voter)}
                                        >
                                            <td style={{ padding: '1rem' }} data-label="Nome">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ width: '32px', height: '32px', background: 'var(--bg-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>
                                                        {voter.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 600, color: 'var(--text)' }}>{voter.name}</div>
                                                        <div style={{ fontSize: '0.75rem', opacity: 0.8, color: 'var(--text-light)' }}>{voter.phone}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem' }} data-label="Bairro">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', color: 'var(--text)' }}>
                                                    <MapPin size={14} style={{ opacity: 0.6 }} /> {voter.neighborhood}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1rem' }} data-label="Status">
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
                                            <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--text-light)' }} data-label="Responsável">
                                                {voter.leader}
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'right' }} data-label="Ações">
                                                <button className="icon-btn" style={{ marginRight: '0.5rem', background: 'transparent', border: 'none', cursor: 'pointer' }} title="Chamar no WhatsApp">
                                                    <MessageCircle size={18} color="#25D366" />
                                                </button>
                                                <button className="icon-btn" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }}>
                                                    <MoreHorizontal size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
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
                                    onClick={() => handleUpdateStatus(selectedVoter.id, 'ganho')}
                                    className="glass-card"
                                    style={{
                                        padding: '0.75rem',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        borderColor: selectedVoter.status === 'ganho' ? '#38a169' : 'transparent',
                                        background: selectedVoter.status === 'ganho' ? 'rgba(56, 161, 105, 0.1)' : undefined
                                    }}
                                >
                                    <ThumbsUp size={20} color="#38a169" style={{ marginBottom: '0.25rem' }} />
                                    <div style={{ fontSize: '0.7rem', color: '#38a169' }}>Ganho</div>
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus(selectedVoter.id, 'indeciso')}
                                    className="glass-card"
                                    style={{
                                        padding: '0.75rem',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        borderColor: selectedVoter.status === 'indeciso' ? '#d69e2e' : 'transparent',
                                        background: selectedVoter.status === 'indeciso' ? 'rgba(214, 158, 46, 0.1)' : undefined
                                    }}
                                >
                                    <div style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>🤔</div>
                                    <div style={{ fontSize: '0.7rem', color: '#d69e2e' }}>Indeciso</div>
                                </button>
                                <button
                                    onClick={() => handleUpdateStatus(selectedVoter.id, 'perdido')}
                                    className="glass-card"
                                    style={{
                                        padding: '0.75rem',
                                        textAlign: 'center',
                                        cursor: 'pointer',
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
                                <div style={{ fontSize: '1rem' }}>{formatDate(selectedVoter.last_contact)}</div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <h4 style={{ marginBottom: '0.5rem' }}>Anotações</h4>
                            <textarea
                                value={notesBuffer}
                                onChange={(e) => setNotesBuffer(e.target.value)}
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
                            <button className="btn-gold" style={{ width: '100%', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }} onClick={handleSaveNotes}>
                                <Save size={18} /> Salvar Alterações
                            </button>
                        </div>
                    </div>
                )}
            </Drawer>

            {/* Quick Add Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Novo Eleitor">
                <form onSubmit={handleAddVoter} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Nome Completo</label>
                        <input
                            type="text"
                            required
                            className="form-input"
                            placeholder="Ex: Maria da Silva"
                            style={{ width: '100%' }}
                            value={newVoterName}
                            onChange={(e) => setNewVoterName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Telefone (WhatsApp)</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="(00) 00000-0000"
                            style={{ width: '100%' }}
                            value={newVoterPhone}
                            onChange={(e) => setNewVoterPhone(e.target.value)}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Bairro</label>
                        <select
                            className="form-input"
                            style={{ width: '100%' }}
                            value={newVoterNeighborhood}
                            onChange={(e) => setNewVoterNeighborhood(e.target.value)}
                        >
                            <option>Centro</option>
                            <option>Vila Nova</option>
                            <option>Jardim</option>
                            <option>Rural</option>
                        </select>
                    </div>

                    <button type="submit" className="btn-gold" style={{ marginTop: '1rem' }}>
                        Cadastrar Eleitor
                    </button>
                </form>
            </Modal>
        </motion.div>
    );
};

export default VoterCrm;
