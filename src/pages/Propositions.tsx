import { useState } from 'react';
import { Search, Filter, Plus, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { Drawer, Modal } from '../components/UIComponents';

const projects = [
    { id: 1, title: 'Programa Escola Conectada', category: 'Educação', author: 'Vereador Silva', status: 'Em Tramitação' },
    { id: 2, title: 'Rede de Apoio à Saúde Mental', category: 'Saúde', author: 'Vereadora Maria', status: 'Aprovado' },
    { id: 3, title: 'Incentivo ao Comércio Local', category: 'Economia', author: 'Vereador João', status: 'Análise de Comissão' },
    { id: 4, title: 'Revitalização do Parque Central', category: 'Urbanismo', author: 'Gabinete Digital (Sugestão IA)', status: 'Rascunho' },
];

const Propositions = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const openProjectDetails = (project: any) => {
        setSelectedProject(project);
        setIsDrawerOpen(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1>Biblioteca de Proposições</h1>
                    <p style={{ color: 'var(--text-light)' }}>Pesquise, crie e acompanhe projetos de lei e indicações.</p>
                </div>
                <button className="btn-gold flex-center gap-1" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} /> Nova Proposição
                </button>
            </header>

            <div className="glass-card" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, position: 'relative', minWidth: '250px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                    <input
                        type="text"
                        placeholder="Buscar por título, categoria ou palavra-chave..."
                        style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text)', outline: 'none', marginTop: 0 }}
                    />
                </div>
                <button className="btn-primary flex-center gap-1" style={{ background: 'var(--bg-color)', color: 'var(--primary)', border: '1px solid var(--border)' }}>
                    <Filter size={18} /> Filtros
                </button>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {projects.map((project) => (
                    <div key={project.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', background: 'var(--surface)' }}>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <div style={{ padding: '0.75rem', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '0.5rem', color: 'var(--secondary)' }}>
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text)' }}>{project.title}</h3>
                                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                                    <span><b>Categoria:</b> {project.category}</span>
                                    <span><b>Autor:</b> {project.author}</span>
                                </div>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right', minWidth: '120px' }}>
                            <span style={{
                                padding: '0.25rem 0.75rem',
                                borderRadius: '1rem',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                background: project.status === 'Aprovado' ? 'rgba(56, 161, 105, 0.1)' : project.status === 'Rascunho' ? 'var(--bg-color)' : 'rgba(237, 137, 54, 0.1)',
                                color: project.status === 'Aprovado' ? '#38a169' : project.status === 'Rascunho' ? 'var(--text-light)' : '#ed8936',
                                border: '1px solid transparent',
                                borderColor: project.status === 'Aprovado' ? '#38a169' : 'transparent',
                                display: 'inline-block'
                            }}>
                                {project.status}
                            </span>
                            <div style={{ marginTop: '0.5rem' }}>
                                <button
                                    onClick={() => openProjectDetails(project)}
                                    style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                >
                                    Ver Detalhes →
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Nova Proposição Legislativa"
            >
                <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label>Título da Proposição</label>
                        <input type="text" placeholder="Ex: Projeto de Lei sobre..." />
                    </div>
                    <div>
                        <label>Tipo</label>
                        <select>
                            <option>Projeto de Lei</option>
                            <option>Indicação</option>
                            <option>Requerimento</option>
                            <option>Moção</option>
                        </select>
                    </div>
                    <div>
                        <label>Categoria</label>
                        <select>
                            <option>Saúde</option>
                            <option>Educação</option>
                            <option>Infraestrutura</option>
                            <option>Segurança</option>
                        </select>
                    </div>
                    <div>
                        <label>Resumo/Justificativa</label>
                        <textarea rows={4} placeholder="Descreva brevemente o objetivo da proposição..."></textarea>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button type="button" className="btn-gold" style={{ flex: 1 }}>Criar Rascunho</button>
                        <button type="button" className="btn-primary" style={{ background: '#f1f5f9', color: 'var(--text)' }} onClick={() => setIsModalOpen(false)}>Cancelar</button>
                    </div>
                </form>
            </Modal>

            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                title="Detalhes da Proposição"
            >
                {selectedProject && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <span style={{
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                background: 'rgba(212, 175, 55, 0.1)',
                                color: 'var(--secondary)',
                                border: '1px solid var(--secondary)'
                            }}>
                                {selectedProject.category}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>PL #{selectedProject.id}/2024</span>
                        </div>

                        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{selectedProject.title}</h2>

                        <div style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
                            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-light)' }}>Autor:</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.7rem' }}>
                                    {selectedProject.author.charAt(0)}
                                </div>
                                <span style={{ fontWeight: 600 }}>{selectedProject.author}</span>
                            </div>
                        </div>

                        <div>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Resumo & Tramitação</h3>
                            <p style={{ color: 'var(--text)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                                Esta proposição visa instituir normas e diretrizes para melhoria do setor de {selectedProject.category.toLowerCase()} no município.
                                O projeto encontra-se atualmente <strong>{selectedProject.status}</strong> e aguarda pauta para próxima sessão.
                            </p>
                        </div>

                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                            <h4 style={{ marginBottom: '1rem' }}>Linha do Tempo</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--secondary)' }}></div>
                                        <div style={{ width: '2px', flex: 1, background: 'var(--border)', minHeight: '30px' }}></div>
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>Protocolado na Mesa Diretora</p>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>15 Out 2024 - 14:30</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3182ce' }}></div>
                                        <div style={{ width: '2px', flex: 1, background: 'var(--border)', minHeight: '30px' }}></div>
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>Encaminhado para CCJ</p>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>18 Out 2024 - 10:00</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--border)' }}></div>
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem', opacity: 0.6 }}>Aguardando Parecer</p>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Previsão: 25 Out 2024</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: 'auto', display: 'grid', gap: '0.5rem' }}>
                            <button className="btn-primary">Ver Texto Completo (PDF)</button>
                            <button className="btn-gold outline">Criar Emenda</button>
                        </div>
                    </div>
                )}
            </Drawer>
        </motion.div>
    );
};

export default Propositions;
