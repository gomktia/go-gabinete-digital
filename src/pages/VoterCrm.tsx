import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users, UserPlus, Search, Phone,
    MapPin, Star, ThumbsUp, ThumbsDown, MessageCircle,
    MoreHorizontal, TrendingUp, Award, Loader2, Save, Sparkles
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
    status: 'lideranca' | 'apoiador' | 'neutro' | 'pendente' | 'indeciso' | 'ganho' | 'perdido';
    leader: string;
    interactions: number;
    last_contact: string | null;
    notes: string;
    birth_date?: string;
    referrer_id?: string;
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
    const [newVoterReferrer, setNewVoterReferrer] = useState('');

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
            leader: 'Vereador', // Default for now, could be dynamic based on referrer
            tenant_id: tenant.id,
            referrer_id: newVoterReferrer || null
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
            setNewVoterReferrer('');
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

    const birthdayVoters = voters.filter(v => {
        if (!v.birth_date) return false;
        const today = new Date();
        const birth = new Date(v.birth_date);
        return today.getDate() === birth.getUTCDate() && today.getMonth() === birth.getUTCMonth();
    });

    const handleWhatsAppGreeting = (voter: Voter) => {
        const messages = [
            `Olá ${voter.name?.split(' ')[0] || ''}! Aqui é o Gabinete do Vereador. Passando para te desejar um feliz aniversário! Muita saúde e conquistas! 🎂✨`,
            `Grande abraço, ${voter.name?.split(' ')[0] || ''}! Parabéns pelo seu dia! Que seu novo ciclo seja de muita luz. Conte conosco! 🥂`,
            `Feliz aniversário, ${voter.name?.split(' ')[0] || ''}! Que alegria celebrar mais um ano da sua vida. Parabéns! 🎈`
        ];
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        const url = `https://wa.me/55${voter.phone.replace(/\D/g, '')}?text=${encodeURIComponent(randomMsg)}`;
        window.open(url, '_blank');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'lideranca': return '#38a169'; // Green
            case 'apoiador': return '#3182ce'; // Blue
            case 'neutro': return '#718096'; // Gray
            default: return '#cbd5e1'; // Light Gray
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'lideranca': return 'Liderança';
            case 'apoiador': return 'Apoiador';
            case 'neutro': return 'Neutro';
            default: return 'Pendente';
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

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
                            <Users size={32} />
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Gestão de Eleitores</h1>
                    </div>
                    <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', fontWeight: 500 }}>
                        Relacionamento e monitoramento da base eleitoral em tempo real.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }} className="flex-col-mobile">
                    <button className="btn-gold outline" style={{ borderRadius: '14px', border: '1px solid var(--secondary)', background: 'rgba(212,175,55,0.05)', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', fontSize: '0.85rem' }}>
                        <Sparkles size={18} /> Regiões Estratégicas
                    </button>
                    <button className="btn-gold outline" style={{ borderRadius: '14px', border: '1px solid var(--secondary)', background: 'rgba(212,175,55,0.05)', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', fontSize: '0.85rem' }}>
                        <Sparkles size={18} /> Ações de Aproximação
                    </button>
                    <button className="btn-gold outline" style={{ borderRadius: '14px', border: '1px solid var(--secondary)', background: 'rgba(212,175,55,0.05)', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', fontSize: '0.85rem' }}>
                        <Sparkles size={18} /> Identificar Lideranças
                    </button>
                    <button
                        className="btn-gold"
                        onClick={(e) => { e.stopPropagation(); setIsAddModalOpen(true); }}
                        style={{ borderRadius: '14px', padding: '10px 20px' }}
                    >
                        <UserPlus size={18} /> Novo Eleitor
                    </button>
                </div>
            </header>

            {/* Quick Actions & Birthday Alert - Roadmap Implementation */}
            {birthdayVoters.length > 0 && (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass-card"
                    style={{
                        marginBottom: '2.5rem',
                        background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
                        color: 'white',
                        border: 'none',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1.5rem 2.5rem',
                        flexWrap: 'wrap',
                        gap: '1.5rem'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ padding: '12px', background: 'rgba(212,175,55,0.2)', borderRadius: '16px', color: 'var(--secondary)' }}>
                            <Star size={28} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, color: 'white', fontSize: '1.25rem' }}>Aniversariantes do Dia ({birthdayVoters.length})</h3>
                            <p style={{ margin: 0, opacity: 0.8, fontSize: '0.9rem' }}>Mantenha o relacionamento ativo parabenizando seus eleitores hoje.</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {birthdayVoters.map((v) => (
                            <motion.div
                                key={v.id}
                                whileHover={{ scale: 1.1 }}
                                onClick={() => handleWhatsAppGreeting(v)}
                                style={{
                                    width: '45px',
                                    height: '45px',
                                    background: 'var(--secondary)',
                                    color: 'var(--primary)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    border: '2px solid white'
                                }}
                                title={`Parabenizar ${v.name}`}
                            >
                                {v.name.charAt(0)}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Funnel/Stats Section */}
            <div className="responsive-grid" style={{ marginBottom: '3rem' }}>
                <motion.div
                    whileHover={{ y: -5 }}
                    className="glass-card"
                    style={{
                        background: 'linear-gradient(135deg, rgba(56, 161, 105, 0.1) 0%, rgba(56, 161, 105, 0.02) 100%)',
                        borderLeft: '4px solid #38a169'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.9rem', color: '#38a169', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Votos Consolidados</span>
                        <div style={{ padding: '8px', background: 'rgba(56,161,105,0.1)', borderRadius: '10px' }}>
                            <Award size={20} color="#38a169" />
                        </div>
                    </div>
                    <h2 style={{ fontSize: '3rem', margin: 0, color: '#38a169', fontWeight: 800 }}>{votesWon}</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '0.85rem' }}>
                        <span style={{ color: 'var(--text-light)', fontWeight: 600 }}>Meta: {quotientGoal}</span>
                        <span style={{ color: '#38a169', fontWeight: 800 }}>{progress.toFixed(1)}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(56, 161, 105, 0.1)', marginTop: '0.75rem', borderRadius: '10px', overflow: 'hidden' }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            style={{ height: '100%', background: '#38a169', boxShadow: '0 0 10px rgba(56,161,105,0.3)' }}
                        ></motion.div>
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ y: -5 }}
                    className="glass-card"
                    style={{ borderLeft: '4px solid #d4af37' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.9rem', color: '#d4af37', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Potencial / Indecisos</span>
                        <div style={{ padding: '8px', background: 'rgba(212,175,55,0.1)', borderRadius: '10px' }}>
                            <TrendingUp size={20} color="#d4af37" />
                        </div>
                    </div>
                    <h2 style={{ fontSize: '3rem', margin: 0, color: '#d4af37', fontWeight: 800 }}>{votesUndecided}</h2>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginTop: '1rem', fontWeight: 500 }}>
                        Foco estratégico de conversão
                    </p>
                </motion.div>

                <motion.div
                    whileHover={{ y: -5 }}
                    className="glass-card"
                    style={{ borderLeft: '4px solid var(--primary)' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-light)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total na Base</span>
                        <div style={{ padding: '8px', background: 'rgba(15,23,42,0.05)', borderRadius: '10px' }}>
                            <Users size={20} color="var(--primary)" />
                        </div>
                    </div>
                    <h2 style={{ fontSize: '3rem', margin: 0, fontWeight: 800 }}>{totalVoters}</h2>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginTop: '1rem', fontWeight: 500 }}>
                        Cidadãos catalogados
                    </p>
                </motion.div>
            </div>


            {/* Main List */}
            <div className="glass-card" style={{ padding: '0', border: '1px solid var(--border)' }}>
                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4, color: 'var(--text)' }} />
                        <input
                            type="text"
                            placeholder="Buscar nome, bairro ou telefone..."
                            style={{
                                width: '100%',
                                padding: '0.875rem 1rem 0.875rem 3.2rem',
                                borderRadius: '12px',
                                background: 'var(--bg-color)',
                                border: '1px solid var(--border)',
                                fontSize: '0.95rem'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {['todos', 'ganho', 'indeciso', 'pendente'].map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                style={{
                                    background: filterStatus === status ? 'var(--primary)' : 'var(--bg-color)',
                                    border: '1px solid',
                                    borderColor: filterStatus === status ? 'var(--primary)' : 'var(--border)',
                                    color: filterStatus === status ? 'white' : 'var(--text-light)',
                                    padding: '0.5rem 1.25rem',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    fontSize: '0.85rem',
                                    textTransform: 'capitalize',
                                    fontWeight: 700,
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {status === 'todos' ? 'Todos' : getStatusLabel(status)}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ padding: '0.5rem', overflowX: 'auto' }}>
                    {isLoading ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)' }}>
                            <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto 1rem' }} />
                            <p style={{ fontWeight: 600 }}>Carregando Base de Dados...</p>
                        </div>
                    ) : (
                        <table className="responsive-table">
                            <thead>
                                <tr>
                                    <th>Nome / Contato</th>
                                    <th>Círculo / Bairro</th>
                                    <th>Status do Voto</th>
                                    <th>Captador</th>
                                    <th style={{ textAlign: 'right' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {voters.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)' }}>
                                            Nenhum eleitor encontrado na base.
                                        </td>
                                    </tr>
                                ) : (
                                    voters.filter(v => filterStatus === 'todos' || v.status === filterStatus).map((voter) => (
                                        <tr
                                            key={voter.id}
                                            style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                            className="hover-bg"
                                            onClick={() => setSelectedVoter(voter)}
                                        >
                                            <td data-label="Eleitor">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        background: 'var(--primary)',
                                                        borderRadius: '12px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '0.9rem',
                                                        fontWeight: 800,
                                                        color: 'var(--secondary)',
                                                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                                                    }}>
                                                        {voter.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>{voter.name}</div>
                                                        <div style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-light)' }}>{voter.phone || '(S/ Contato)'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td data-label="Bairro">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>
                                                    <MapPin size={14} style={{ color: 'var(--secondary)' }} /> {voter.neighborhood}
                                                </div>
                                            </td>
                                            <td data-label="Status">
                                                <span style={{
                                                    background: `${getStatusColor(voter.status)}15`,
                                                    color: getStatusColor(voter.status),
                                                    padding: '6px 14px',
                                                    borderRadius: '10px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 800,
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em'
                                                }}>
                                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: getStatusColor(voter.status) }}></div>
                                                    {getStatusLabel(voter.status)}
                                                </span>
                                            </td>
                                            <td data-label="Captador">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bg-color)', border: '1px solid var(--border)' }}></div>
                                                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{voter.leader}</span>
                                                </div>
                                            </td>
                                            <td style={{ textAlign: 'right' }} data-label="Ações">
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                                    <button className="btn-primary" style={{ padding: '8px', borderRadius: '10px', background: '#25D366' }} title="WhatsApp">
                                                        <MessageCircle size={18} color="white" />
                                                    </button>
                                                    <button className="btn-primary" style={{ padding: '8px', borderRadius: '10px', background: 'var(--bg-color)', color: 'var(--text-light)', border: '1px solid var(--border)' }}>
                                                        <MoreHorizontal size={18} />
                                                    </button>
                                                </div>
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
                title="Perfil do Eleitor"
            >
                {selectedVoter && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Profile Header */}
                        <div style={{
                            textAlign: 'center',
                            padding: '2rem 1.5rem',
                            background: 'linear-gradient(180deg, var(--primary) 0%, var(--primary-accent) 100%)',
                            borderRadius: '24px',
                            color: 'white',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{ position: 'absolute', right: '-10%', top: '-10%', width: '150px', height: '150px', background: 'var(--secondary)', opacity: 0.1, borderRadius: '50%', filter: 'blur(40px)' }}></div>

                            <div style={{
                                width: '100px',
                                height: '100px',
                                background: 'white',
                                borderRadius: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2.5rem',
                                fontWeight: 800,
                                margin: '0 auto 1.5rem auto',
                                color: 'var(--primary)',
                                boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                            }}>
                                {selectedVoter.name.charAt(0)}
                            </div>
                            <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: 'white' }}>{selectedVoter.name}</h2>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '0.5rem', opacity: 0.8 }}>
                                <MapPin size={16} />
                                <span style={{ fontWeight: 500 }}>{selectedVoter.neighborhood}</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', marginTop: '2rem' }}>
                                <motion.button whileHover={{ y: -3 }} className="btn-gold" style={{ borderRadius: '14px', width: '48px', height: '48px', padding: 0 }}>
                                    <Phone size={20} />
                                </motion.button>
                                <motion.button whileHover={{ y: -3 }} className="btn-gold" style={{ borderRadius: '14px', width: '48px', height: '48px', padding: 0, background: '#25D366', color: 'white', border: 'none' }}>
                                    <MessageCircle size={24} />
                                </motion.button>
                                <motion.button whileHover={{ y: -3 }} className="btn-gold outline" style={{ borderRadius: '14px', width: '48px', height: '48px', padding: 0, borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}>
                                    <Star size={20} />
                                </motion.button>
                            </div>
                        </div>

                        {/* Status Control */}
                        <div>
                            <h4 style={{ marginBottom: '1.25rem', color: 'var(--text)', fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status do Voto</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                                <button
                                    onClick={() => handleUpdateStatus(selectedVoter.id, 'ganho')}
                                    style={{
                                        padding: '1.25rem 0.5rem',
                                        background: selectedVoter.status === 'ganho' ? 'rgba(56, 161, 105, 0.1)' : 'var(--bg-color)',
                                        border: '2px solid',
                                        borderColor: selectedVoter.status === 'ganho' ? '#38a169' : 'var(--border)',
                                        borderRadius: '16px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <ThumbsUp size={24} color={selectedVoter.status === 'ganho' ? '#38a169' : '#cbd5e1'} />
                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: selectedVoter.status === 'ganho' ? '#38a169' : 'var(--text-light)' }}>FECHADO</div>
                                </button>

                                <button
                                    onClick={() => handleUpdateStatus(selectedVoter.id, 'indeciso')}
                                    style={{
                                        padding: '1.25rem 0.5rem',
                                        background: selectedVoter.status === 'indeciso' ? 'rgba(214, 158, 46, 0.1)' : 'var(--bg-color)',
                                        border: '2px solid',
                                        borderColor: selectedVoter.status === 'indeciso' ? '#d69e2e' : 'var(--border)',
                                        borderRadius: '16px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <div style={{ fontSize: '1.5rem' }}>🤔</div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: selectedVoter.status === 'indeciso' ? '#d69e2e' : 'var(--text-light)' }}>NEGOCIAÇÃO</div>
                                </button>

                                <button
                                    onClick={() => handleUpdateStatus(selectedVoter.id, 'perdido')}
                                    style={{
                                        padding: '1.25rem 0.5rem',
                                        background: selectedVoter.status === 'perdido' ? 'rgba(229, 62, 62, 0.1)' : 'var(--bg-color)',
                                        border: '2px solid',
                                        borderColor: selectedVoter.status === 'perdido' ? '#e53e3e' : 'var(--border)',
                                        borderRadius: '16px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    <ThumbsDown size={24} color={selectedVoter.status === 'perdido' ? '#e53e3e' : '#cbd5e1'} />
                                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: selectedVoter.status === 'perdido' ? '#e53e3e' : 'var(--text-light)' }}>PERDIDO</div>
                                </button>
                            </div>
                        </div>

                        {/* Info Fields */}
                        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem', background: 'var(--bg-color)' }}>
                            <div>
                                <label style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block', marginBottom: '4px', fontWeight: 700, textTransform: 'uppercase' }}>WhatsApp / Celular</label>
                                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>{selectedVoter.phone || 'Não informado'}</div>
                            </div>
                            <div style={{ height: '1px', background: 'var(--border)' }}></div>
                            <div>
                                <label style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase' }}>Responsável pela Captura</label>
                                <div style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600 }}>
                                    <div style={{ width: '28px', height: '28px', background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.7rem' }}>
                                        {selectedVoter.leader.charAt(0)}
                                    </div>
                                    {selectedVoter.leader}
                                </div>
                            </div>
                            <div style={{ height: '1px', background: 'var(--border)' }}></div>
                            <div>
                                <label style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block', marginBottom: '4px', fontWeight: 700, textTransform: 'uppercase' }}>Data de Cadastro</label>
                                <div style={{ fontSize: '1rem', fontWeight: 600 }}>{formatDate(selectedVoter.last_contact)}</div>
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <h4 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase' }}>Observações do Mandato</h4>
                            <textarea
                                value={notesBuffer}
                                onChange={(e) => setNotesBuffer(e.target.value)}
                                placeholder="Descreva demandas, alianças ou observações importantes sobre este eleitor..."
                                style={{
                                    width: '100%',
                                    minHeight: '150px',
                                    padding: '1.25rem',
                                    background: 'var(--bg-color)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '16px',
                                    color: 'var(--text)',
                                    resize: 'none',
                                    fontSize: '0.95rem',
                                    lineHeight: 1.6
                                }}
                            ></textarea>
                            <button
                                className="btn-gold"
                                style={{ width: '100%', marginTop: '1.25rem', padding: '1rem', borderRadius: '14px', fontSize: '1rem' }}
                                onClick={handleSaveNotes}
                            >
                                <Save size={20} /> Salvar Histórico
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
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Quem indicou? (Opcional)</label>
                        <select
                            className="form-input"
                            style={{ width: '100%' }}
                            value={newVoterReferrer}
                            onChange={(e) => setNewVoterReferrer(e.target.value)}
                        >
                            <option value="">-- Selecione ou deixe em branco --</option>
                            {voters.map(v => (
                                <option key={v.id} value={v.id}>{v.name} ({v.neighborhood})</option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="btn-gold" style={{ marginTop: '1rem' }}>
                        Cadastrar Eleitor
                    </button>
                </form>
            </Modal>
        </motion.div >
    );
};

export default VoterCrm;
