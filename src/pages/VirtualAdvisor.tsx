import { useState } from 'react';
import { Bot, Sparkles, TrendingUp, Map as MapIcon, Users, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { Modal } from '../components/UIComponents';

const recommendations = [
    {
        category: 'Saúde',
        title: 'Ampliação do Horário da UBS Central',
        reason: 'Cruzamento de dados mostra que 40% das reclamações de "espera longa" ocorrem após as 17h.',
        impact: 'Alto impacto na satisfação dos moradores do centro.',
        complexity: 'Média'
    },
    {
        category: 'Infraestrutura',
        title: 'Operação Tapa-Buracos Setor Norte',
        reason: 'Acúmulo de 15 demandas de localização única na Av. Principal.',
        impact: 'Melhoria imediata do fluxo de trânsito.',
        complexity: 'Baixa'
    }
];

const VirtualAdvisor = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRec, setSelectedRec] = useState<any>(null);

    const openFeasibility = (rec: any) => {
        setSelectedRec(rec);
        setIsModalOpen(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <header style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <div style={{ padding: '0.5rem', background: 'var(--primary)', borderRadius: '0.5rem', color: 'var(--secondary)' }}>
                        <Bot size={32} />
                    </div>
                    <h1>Assessor de Estratégia IA</h1>
                </div>
                <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
                    Análise de sentimento e mapa de calor eleitoral baseado em interações reais.
                </p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                <div className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <MapIcon size={20} style={{ color: 'var(--primary)' }} />
                            <h3>Mapa de Calor: Clima nos Bairros</h3>
                        </div>
                        <div style={{ fontSize: '0.75rem', display: 'flex', gap: '1rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '10px', height: '10px', background: '#38a169', borderRadius: '50%' }}></div> Apoio</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '10px', height: '10px', background: '#ed8936', borderRadius: '50%' }}></div> Neutro</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '10px', height: '10px', background: '#e53e3e', borderRadius: '50%' }}></div> Crítico</span>
                        </div>
                    </div>
                    <div style={{ position: 'relative', height: '350px', background: '#f1f5f9', borderRadius: '1rem', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '100%', height: '100%', opacity: 0.1, background: 'repeating-linear-gradient(45deg, #cbd5e1, #cbd5e1 10px, #f1f5f9 10px, #f1f5f9 20px)' }}></div>

                        <div style={{ position: 'absolute', top: '20%', left: '30%', padding: '10px', background: 'rgba(56, 161, 105, 0.2)', borderRadius: '50%', border: '2px solid #38a169', cursor: 'pointer' }} onClick={() => openFeasibility({ title: 'Vila Nova', impact: 'Apoio Consolidado', reason: 'Forte recepção dos projetos de robótica nas escolas.' })}>
                            <div style={{ background: '#38a169', color: 'white', fontSize: '0.6rem', padding: '2px 6px', borderRadius: '10px' }}>Vila Nova (Bom)</div>
                        </div>

                        <div style={{ position: 'absolute', top: '50%', left: '60%', padding: '15px', background: 'rgba(229, 62, 62, 0.2)', borderRadius: '50%', border: '2px solid #e53e3e', cursor: 'pointer' }} onClick={() => openFeasibility({ title: 'Centro', impact: 'Zona Crítica', reason: 'Alto volume de reclamações sobre buracos e iluminação.' })}>
                            <div style={{ background: '#e53e3e', color: 'white', fontSize: '0.6rem', padding: '2px 6px', borderRadius: '10px' }}>Centro (Crítico)</div>
                        </div>

                        <div style={{ position: 'absolute', bottom: '20%', right: '20%', padding: '12px', background: 'rgba(237, 137, 54, 0.2)', borderRadius: '50%', border: '2px solid #ed8936', cursor: 'pointer' }} onClick={() => openFeasibility({ title: 'Rural', impact: 'Oportunidade', reason: 'Demandas por transporte escolar ainda não atendidas.' })}>
                            <div style={{ background: '#ed8936', color: 'white', fontSize: '0.6rem', padding: '2px 6px', borderRadius: '10px' }}>Rural (Neutro)</div>
                        </div>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '1rem', fontStyle: 'italic' }}>
                        * Dados baseados em sentimentos extraídos das últimas 250 mensagens de WhatsApp.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-card" style={{ background: 'var(--primary)', color: 'white' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <Sparkles size={20} style={{ color: 'var(--secondary)' }} />
                            <h3 style={{ color: 'white', margin: 0 }}>Índice de Popularidade</h3>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <h2 style={{ color: 'var(--secondary)', fontSize: '3rem', margin: '0' }}>74%</h2>
                            <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>Aprovação Geral</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center', color: '#68d391', fontSize: '0.85rem' }}>
                                <TrendingUp size={14} /> +5% este mês
                            </div>
                        </div>
                    </div>

                    <div className="glass-card">
                        <h3>Alcance Eleitoral Estimado</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <Users size={20} style={{ color: 'var(--primary)' }} />
                                <div>
                                    <p style={{ margin: 0, fontWeight: 700 }}>3.400 Cidadãos</p>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-light)' }}>Impactados diretamente</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <MessageSquare size={20} style={{ color: 'var(--primary)' }} />
                                <div>
                                    <p style={{ margin: 0, fontWeight: 700 }}>85% Taxa de Resposta</p>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-light)' }}>Engajamento do gabinete</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <h2>Projeto Sugeridos pela IA</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {recommendations.map((rec, i) => (
                    <div key={i} className="glass-card" style={{ borderTop: `4px solid ${i === 0 ? '#e53e3e' : '#3182ce'}` }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-light)' }}>
                            {rec.category}
                        </span>
                        <h3 style={{ fontSize: '1.2rem', marginTop: '0.5rem', marginBottom: '1rem' }}>{rec.title}</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
                            <b>Estratégia:</b> {rec.reason}
                        </p>
                        <div style={{ fontSize: '0.8rem', paddingTop: '1rem', borderTop: '1px solid #edf2f7', display: 'flex', justifyContent: 'space-between' }}>
                            <span><b>Impacto:</b> {rec.impact}</span>
                            <button
                                onClick={() => openFeasibility(rec)}
                                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
                            >
                                Ver Viabilidade →
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`Análise de Viabilidade: ${selectedRec?.title}`}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
                        <h4 style={{ marginBottom: '0.5rem' }}>Resumo do Insight</h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>{selectedRec?.reason}</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="glass-card" style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Custo Estimado</p>
                            <h4 style={{ color: '#38a169' }}>Baixo</h4>
                        </div>
                        <div className="glass-card" style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>Impacto Votos</p>
                            <h4 style={{ color: 'var(--secondary)' }}>Alto</h4>
                        </div>
                    </div>

                    <div>
                        <h4 style={{ marginBottom: '0.5rem' }}>Recomendação Legislativa</h4>
                        <p style={{ fontSize: '0.9rem' }}>A IA sugere que este projeto seja apresentado em regime de urgência dada a proximidade do período eleitoral e o alto engajamento orgânico nas redes sociais.</p>
                    </div>

                    <button className="btn-gold" style={{ width: '100%' }}>Aprovar e Enviar para Rascunho</button>
                </div>
            </Modal>
        </motion.div>
    );
};

export default VirtualAdvisor;
