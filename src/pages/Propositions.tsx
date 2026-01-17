import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Search, Filter, Plus, BookOpen, Clock,
    CheckCircle, FileText, ChevronRight, RefreshCw, Save
} from 'lucide-react';
import { Drawer, Modal } from '../components/UIComponents';
import { supabase } from '../lib/supabase';
import { useTenant } from '../context/TenantContext';

interface Proposition {
    id: string;
    title: string;
    category: string;
    author: string;
    status: string;
    description: string;
    type: string;
    created_at: string;
}

const Propositions = () => {
    const { tenant } = useTenant();
    const [propositions, setPropositions] = useState<Proposition[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProp, setSelectedProp] = useState<Proposition | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Form states
    const [title, setTitle] = useState('');
    const [type, setType] = useState('Projeto de Lei');
    const [category, setCategory] = useState('Saúde');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (tenant.id) {
            fetchPropositions();
        }
    }, [tenant.id]);

    const fetchPropositions = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('propositions')
            .select('*')
            .eq('tenant_id', tenant.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching propositions:', error);
        } else {
            setPropositions(data || []);
        }
        setIsLoading(false);
    };

    const handleAddProposition = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tenant.id) return;

        const newProp = {
            tenant_id: tenant.id,
            title,
            type,
            category,
            description,
            author: tenant.name || 'Gabinete Digital',
            status: 'Rascunho'
        };

        const { data, error } = await supabase
            .from('propositions')
            .insert([newProp])
            .select();

        if (error) {
            console.error('Error adding prop:', error);
            alert('Erro ao salvar proposição');
        } else if (data) {
            setPropositions([data[0], ...propositions]);
            setIsModalOpen(false);
            // Clear form
            setTitle('');
            setDescription('');
        }
    };

    const filteredProps = propositions.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
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
                            <BookOpen size={32} />
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Biblioteca de Proposições</h1>
                    </div>
                    <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', fontWeight: 500 }}>
                        Pesquise, crie e acompanhe projetos de lei e indicações legislativas.
                    </p>
                </div>
                <button
                    className="btn-gold"
                    onClick={() => setIsModalOpen(true)}
                    style={{ borderRadius: '14px', padding: '12px 24px' }}
                >
                    <Plus size={20} /> Nova Proposição
                </button>
            </header>

            <div className="glass-card" style={{ marginBottom: '2.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', opacity: 0.6 }} />
                    <input
                        type="text"
                        placeholder="Buscar por título, categoria ou palavra-chave..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', paddingLeft: '3rem', borderRadius: '14px' }}
                    />
                </div>
                <button className="btn-gold outline" style={{ borderRadius: '14px' }}>
                    <Filter size={18} /> Filtrar
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}><RefreshCw className="spin" /></div>
                ) : filteredProps.length === 0 ? (
                    <div className="glass-card" style={{ textAlign: 'center', padding: '4rem', opacity: 0.5 }}>
                        Nenhuma proposição encontrada para o termo pesquisado.
                    </div>
                ) : (
                    filteredProps.map((prop) => (
                        <motion.div
                            key={prop.id}
                            whileHover={{ scale: 1.01 }}
                            onClick={() => { setSelectedProp(prop); setIsDrawerOpen(true); }}
                            className="glass-card"
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                cursor: 'pointer',
                                borderLeft: '4px solid var(--secondary)'
                            }}
                        >
                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                <div style={{
                                    padding: '12px',
                                    background: 'rgba(212, 175, 55, 0.1)',
                                    borderRadius: '12px',
                                    color: 'var(--secondary)'
                                }}>
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text)' }}>{prop.title}</h3>
                                    <div style={{ display: 'flex', gap: '1.5rem', marginTop: '8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 700, textTransform: 'uppercase' }}>
                                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--secondary)' }}></span>
                                            {prop.type}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 700, textTransform: 'uppercase' }}>
                                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-light)' }}></span>
                                            {prop.category}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{
                                    padding: '6px 14px',
                                    borderRadius: '20px',
                                    fontSize: '0.75rem',
                                    fontWeight: 800,
                                    background: prop.status === 'Aprovado' ? 'rgba(56, 161, 105, 0.1)' : 'var(--bg-color)',
                                    color: prop.status === 'Aprovado' ? '#38a169' : 'var(--text-light)',
                                    textTransform: 'uppercase',
                                    border: '1px solid',
                                    borderColor: prop.status === 'Aprovado' ? '#38a169' : 'var(--border)'
                                }}>
                                    {prop.status}
                                </span>
                                <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--secondary)', fontWeight: 800 }}>
                                    DETALHES <ChevronRight size={16} />
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Proposição Legislativa">
                <form onSubmit={handleAddProposition} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem 0.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>Título da Proposição</label>
                        <input
                            type="text"
                            required
                            placeholder="Ex: Projeto de Lei sobre o Uso de Drones no Monitoramento Rural"
                            className="form-input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>Tipo</label>
                            <select
                                className="form-input"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                style={{ width: '100%' }}
                            >
                                <option>Projeto de Lei</option>
                                <option>Indicação</option>
                                <option>Requerimento</option>
                                <option>Moção</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>Categoria</label>
                            <select
                                className="form-input"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                style={{ width: '100%' }}
                            >
                                <option>Saúde</option>
                                <option>Educação</option>
                                <option>Segurança</option>
                                <option>Infraestrutura</option>
                                <option>Zeladoria</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>Resumo / Justificativa</label>
                        <textarea
                            rows={4}
                            placeholder="Descreva o impacto esperado desta medida para a comunidade..."
                            className="form-input"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={{ width: '100%' }}
                        ></textarea>
                    </div>
                    <button type="submit" className="btn-gold" style={{ padding: '16px', borderRadius: '14px', fontSize: '1rem', fontWeight: 800 }}>
                        <Save size={20} /> Salvar Rascunho Legislativo
                    </button>
                </form>
            </Modal>

            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                title="Detalhamento Técnico"
            >
                {selectedProp && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div>
                            <span style={{
                                padding: '4px 12px',
                                borderRadius: '8px',
                                background: 'rgba(212, 175, 55, 0.1)',
                                color: 'var(--secondary)',
                                fontWeight: 800,
                                fontSize: '0.75rem',
                                textTransform: 'uppercase'
                            }}>{selectedProp.type}</span>
                            <h2 style={{ fontSize: '1.75rem', marginTop: '12px', marginBottom: '4px' }}>{selectedProp.title}</h2>
                            <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Protocolo Web: #{selectedProp.id.substring(0, 8).toUpperCase()}</p>
                        </div>

                        <div className="glass-card" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                                <Clock size={16} className="text-gold" />
                                <span style={{ fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase' }}>Tramitação Atual</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <p style={{ margin: 0, fontWeight: 700 }}>{selectedProp.status}</p>
                                <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Atualizado em 16/01</span>
                            </div>
                        </div>

                        <div>
                            <h4 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem' }}>Resumo & Justificativa</h4>
                            <p style={{ lineHeight: 1.6, color: 'var(--text)', fontSize: '1rem' }}>
                                {selectedProp.description || "Nenhuma descrição fornecida para este projeto."}
                            </p>
                        </div>

                        <div style={{ marginTop: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <button className="btn-gold outline" style={{ borderRadius: '12px', fontSize: '0.9rem' }}>Gerar PDF</button>
                            <button className="btn-gold" style={{ borderRadius: '12px', fontSize: '0.9rem' }}>Editar Texto</button>
                        </div>
                    </div>
                )}
            </Drawer>
        </motion.div>
    );
};

export default Propositions;
