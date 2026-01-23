import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users, MapPin, CheckCircle, Plus,
    Briefcase, RefreshCw, Mail, Phone, ExternalLink, Trash2, Edit
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

    useEffect(() => {
        if (tenant.id) {
            fetchTeam();
        }
    }, [tenant.id]);

    const fetchTeam = async () => {
        setLoading(true);
        try {
            const { data: profiles, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('tenant_id', tenant.id);

            if (error) throw error;

            // Fetch tasks for all profiles
            const { data: tasks } = await supabase
                .from('team_tasks')
                .select('*')
                .eq('tenant_id', tenant.id);

            const merged = (profiles || []).map(p => ({
                ...p,
                tasks: tasks?.filter(t => t.assigned_to === p.id) || []
            }));

            setTeam(merged);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const stats = {
        total: team.length,
        tasksActive: team.reduce((acc, curr) => acc + (curr.tasks?.filter(t => t.status !== 'completed').length || 0), 0),
        votersHelped: 1240 // Sumulation
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
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
                            <Briefcase size={32} />
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Gestão de Gabinete</h1>
                    </div>
                    <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', fontWeight: 500 }}>
                        Gerencie sua equipe de assessores, delegue tarefas e acompanhe a produtividade.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }} className="flex-col-mobile">
                    <button className="btn-gold outline" style={{ borderRadius: '14px' }}>
                        <MapPin size={18} /> Equipe no Campo
                    </button>
                    <button className="btn-gold" onClick={() => setIsAddModalOpen(true)} style={{ borderRadius: '14px' }}>
                        <Plus size={18} /> Novo Assessor
                    </button>
                </div>
            </header>

            <div className="responsive-grid" style={{ marginBottom: '2.5rem' }}>
                <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid var(--secondary)' }}>
                    <div style={{ padding: '15px', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '16px', color: 'var(--secondary)' }}>
                        <Users size={24} />
                    </div>
                    <div>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 700, textTransform: 'uppercase' }}>Equipe Atika</p>
                        <h3 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 900 }}>{stats.total} Assessores</h3>
                    </div>
                </div>
                <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid #38a169' }}>
                    <div style={{ padding: '15px', background: 'rgba(56, 161, 105, 0.1)', borderRadius: '16px', color: '#38a169' }}>
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 700, textTransform: 'uppercase' }}>Tarefas Ativas</p>
                        <h3 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 900 }}>{stats.tasksActive} Pendentes</h3>
                    </div>
                </div>
                <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid #3182ce' }}>
                    <div style={{ padding: '15px', background: 'rgba(49, 130, 206, 0.1)', borderRadius: '16px', color: '#3182ce' }}>
                        <MapPin size={24} />
                    </div>
                    <div>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 700, textTransform: 'uppercase' }}>Cidadãos Atendidos</p>
                        <h3 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 900 }}>+{stats.votersHelped}</h3>
                    </div>
                </div>
            </div>

            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontWeight: 800 }}>QUADRO DE COLABORADORES</h3>
                    <button className="close-btn" style={{ transform: 'none' }} onClick={fetchTeam}><RefreshCw size={14} /></button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className="responsive-table">
                        <thead>
                            <tr>
                                <th>ASSESSOR</th>
                                <th>CONTATO</th>
                                <th>ATIVIDADES ATUAIS</th>
                                <th style={{ textAlign: 'right' }}>GERENCIAR</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '3rem' }}><RefreshCw className="spin" /></td></tr>
                            ) : team.length === 0 ? (
                                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>Sem assessores vinculados.</td></tr>
                            ) : team.map(member => (
                                <tr key={member.id} className="hover-bg">
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                                                {member.full_name?.charAt(0) || 'A'}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{member.full_name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 800, textTransform: 'uppercase' }}>{member.role || 'ASSESSOR'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                                                <Mail size={12} style={{ opacity: 0.5 }} /> {member.email}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
                                                <Phone size={12} style={{ opacity: 0.5 }} /> {member.phone || 'Não informado'}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                            {member.tasks && member.tasks.length > 0 ? (
                                                member.tasks.slice(0, 2).map((t, idx) => (
                                                    <span key={idx} style={{
                                                        padding: '2px 8px',
                                                        background: 'var(--bg-color)',
                                                        borderRadius: '4px',
                                                        fontSize: '0.7rem',
                                                        fontWeight: 700,
                                                        borderLeft: t.status === 'in_progress' ? '2px solid #38a169' : '2px solid var(--border)'
                                                    }}>
                                                        {t.title}
                                                    </span>
                                                ))
                                            ) : (
                                                <span style={{ fontSize: '0.8rem', opacity: 0.5, fontStyle: 'italic' }}>Nenhuma tarefa ativa</span>
                                            )}
                                            {member.tasks && member.tasks.length > 2 && (
                                                <span style={{ padding: '2px 8px', fontSize: '0.7rem', opacity: 0.5 }}>+{member.tasks.length - 2}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                            <button className="close-btn" style={{ transform: 'none' }} title="Editar"><Edit size={16} /></button>
                                            <button className="close-btn" style={{ transform: 'none' }} title="Ver Produtividade"><ExternalLink size={16} /></button>
                                            <button className="close-btn" style={{ transform: 'none', color: '#e53e3e' }} title="Remover"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Adicionar Novo Colaborador">
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                    <div style={{ padding: '2rem', background: 'rgba(212, 175, 55, 0.05)', borderRadius: '24px', marginBottom: '2rem' }}>
                        <Users size={48} className="text-gold" style={{ marginBottom: '1rem' }} />
                        <p style={{ fontWeight: 600, color: 'var(--text)' }}>Link de Convite para o Gabinete</p>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginTop: '8px' }}>Compartilhe este link com seu assessor para que ele se vincule automaticamente ao seu tenant.</p>
                    </div>

                    <div style={{
                        background: 'var(--bg-color)',
                        padding: '1.25rem',
                        borderRadius: '16px',
                        border: '1px solid var(--border)',
                        fontFamily: 'monospace',
                        fontSize: '0.85rem',
                        marginBottom: '2rem',
                        wordBreak: 'break-all'
                    }}>
                        {window.location.origin}/invite/{tenant.id}
                    </div>

                    <button className="btn-gold" style={{ width: '100%', padding: '16px', borderRadius: '16px', fontWeight: 800 }}>
                        <ExternalLink size={20} /> Copiar Link de Convite
                    </button>
                </div>
            </Modal>
        </motion.div>
    );
};

export default TeamManagement;
