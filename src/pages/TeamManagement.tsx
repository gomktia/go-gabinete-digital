import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users, MapPin, CheckCircle, Plus,
    Briefcase, AlertCircle
} from 'lucide-react';
import { Modal } from '../components/UIComponents';
import { supabase } from '../lib/supabase';
import { useTenant } from '../context/TenantContext';

interface TeamMember {
    id: string;
    full_name: string;
    role: string;
    email?: string;
    phone?: string;
    avatar_url?: string;
    tasks?: Task[];
}

interface Task {
    id: string;
    title: string;
    status: 'pending' | 'in_progress' | 'completed' | 'blocked';
}

const TeamManagement = () => {
    const { tenant } = useTenant();
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Initial Load
    useEffect(() => {
        fetchTeam();
    }, [tenant.id]);

    const fetchTeam = async () => {
        try {
            setLoading(true);

            // 1. Fetch Profiles (Assessors)
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('*')
                .eq('tenant_id', tenant.id);

            if (profilesError) throw profilesError;

            // 2. Fetch Tasks (if table exists)
            // We use a try-catch for the query in case the migration isn't applied yet
            let tasksData: any[] = [];
            try {
                const { data: tasks, error: tasksError } = await supabase
                    .from('team_tasks')
                    .select('*')
                    .eq('tenant_id', tenant.id);

                if (!tasksError && tasks) {
                    tasksData = tasks;
                }
            } catch (e) {
                console.warn('team_tasks table might not exist yet', e);
            }

            // Merge
            const mergedTeam = profiles?.map(profile => ({
                ...profile,
                tasks: tasksData.filter((t: any) => t.assigned_to === profile.id)
            })) || [];

            setTeam(mergedTeam);

        } catch (error) {
            console.error('Error loading team:', error);
        } finally {
            setLoading(false);
        }
    };

    // Stats
    const totalActive = team.length; // Assuming all profiles are active for now

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
                        Acompanhe seus assessores e suas atividades.
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
                        <Plus size={18} /> Convidar Assessor
                    </button>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="responsive-grid" style={{ marginBottom: '2.5rem' }}>
                <div className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Equipe Total</span>
                        <Users size={18} color="var(--primary)" />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', margin: 0 }}>{totalActive}</h2>
                    <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#38a169', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle size={12} /> Assessores cadastrados
                    </p>
                </div>

                <div className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Tarefas em Andamento</span>
                        <Briefcase size={18} color="var(--secondary)" />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', margin: 0, color: 'var(--text)' }}>
                        {team.reduce((acc, curr) => acc + (curr.tasks?.filter(t => t.status === 'in_progress').length || 0), 0)}
                    </h2>
                    <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--text-light)' }}>
                        Atividades sendo executadas
                    </p>
                </div>
            </div>

            {/* Team List */}
            <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users size={20} /> Lista de Assessores
                    </h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn-gold outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }} onClick={fetchTeam}>
                            Atualizar
                        </button>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className="responsive-table" style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text)' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '1rem', textAlign: 'left', opacity: 0.8, fontSize: '0.8rem' }}>Nome / Função</th>
                                <th style={{ padding: '1rem', textAlign: 'left', opacity: 0.8, fontSize: '0.8rem' }}>Contato</th>
                                <th style={{ padding: '1rem', textAlign: 'left', opacity: 0.8, fontSize: '0.8rem' }}>O que está fazendo?</th>
                                <th style={{ padding: '1rem', textAlign: 'right', opacity: 0.8, fontSize: '0.8rem' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center' }}>Carregando equipe...</td></tr>
                            ) : team.length === 0 ? (
                                <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', opacity: 0.6 }}>Nenhum assessor encontrado. Convide alguém!</td></tr>
                            ) : team.map((member) => (
                                <tr key={member.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem' }} data-label="Colaborador">
                                        <div style={{ fontWeight: 600 }}>{member.full_name || 'Sem nome'}</div>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{member.role}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }} data-label="Contact">
                                        <div style={{ fontSize: '0.9rem' }}>{member.email}</div>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{member.phone || '-'}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }} data-label="Atividades">
                                        {member.tasks && member.tasks.length > 0 ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                {member.tasks.slice(0, 2).map(task => ( // Show max 2
                                                    <span key={task.id} style={{
                                                        fontSize: '0.75rem',
                                                        background: 'rgba(255,255,255,0.05)',
                                                        padding: '2px 6px',
                                                        borderRadius: '4px',
                                                        display: 'inline-block',
                                                        borderLeft: task.status === 'in_progress' ? '2px solid #38a169' : '2px solid #718096'
                                                    }}>
                                                        {task.title}
                                                    </span>
                                                ))}
                                                {member.tasks.length > 2 && <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>+ {member.tasks.length - 2} tarefas</span>}
                                            </div>
                                        ) : (
                                            <span style={{ fontSize: '0.8rem', opacity: 0.5, fontStyle: 'italic' }}>Nenhuma tarefa ativa</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }} data-label="Ações">
                                        <button className="btn-gold outline" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}>
                                            Ver Detalhes
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Convidar Novo Assessor">
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                    <AlertCircle size={48} color="var(--secondary)" style={{ marginBottom: '1rem' }} />
                    <p>Para adicionar um novo assessor, peça para ele se cadastrar no sistema usando o link de cadastro.</p>
                    <p style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
                        Após o cadastro, o perfil dele aparecerá aqui se ele for vinculado ao seu gabinete.
                    </p>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '0.5rem', marginTop: '1.5rem', wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                        https://go-gabinete-digital.vercel.app/
                    </div>
                    <button className="btn-gold" style={{ marginTop: '1.5rem', width: '100%' }} onClick={() => setIsAddModalOpen(false)}>
                        Entendi
                    </button>
                </div>
            </Modal>
        </motion.div>
    );
};

export default TeamManagement;
