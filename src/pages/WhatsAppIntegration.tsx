import { MessageSquare, MapPin, CheckCircle, Clock, Sparkles, AlertCircle, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Drawer } from '../components/UIComponents';

const messages = [
    {
        id: 1,
        sender: '+55 (55) 99876-5432',
        text: 'Olá Vereador, tem um buraco enorme aqui na Rua das Flores, 123. Quase aconteceu um acidente hoje.',
        location: 'Rua das Flores, 123',
        time: '10:24',
        status: 'pending',
        sentiment: 'negative',
        urgency: 'high'
    },
    {
        id: 2,
        sender: 'Grupo Vila Nova',
        text: 'Pessoal, a iluminação da praça está queimada de novo. @Vereador pode dar uma olhada?',
        location: 'Praça da Vila Nova',
        time: '09:15',
        status: 'processed',
        sentiment: 'neutral',
        urgency: 'medium'
    },
    {
        id: 3,
        sender: '+55 (55) 98822-1100',
        text: 'Gostaria de parabenizar pelo novo projeto das escolas, meus filhos estão adorando a robótica!',
        location: 'Bairro Centro',
        time: 'Ontem',
        status: 'pending',
        sentiment: 'positive',
        urgency: 'low'
    }
];

const WhatsAppIntegration = () => {
    const [selectedMsg, setSelectedMsg] = useState<any>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [draft, setDraft] = useState<string | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [drawerType, setDrawerType] = useState<string>('');

    const generateDraft = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setDraft(`PROJETO DE LEI Nº ____/2026\n\nEmenta: Dispõe sobre a manutenção emergencial de vias públicas no bairro ${selectedMsg?.location.split(' - ')[0]} e dá outras providências.\n\nO VEREADOR infra-assinado, no uso de suas atribuições legais...\n\nJustificativa: A presente proposição visa atender demanda direta da comunidade via Gabinete Digital, relatando riscos de acidentes...`);
            setIsGenerating(false);
        }, 2000);
    };

    const openDrawer = (type: string) => {
        setDrawerType(type);
        setIsDrawerOpen(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <header style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <div style={{ padding: '0.5rem', background: '#25D366', borderRadius: '0.5rem', color: 'white' }}>
                        <MessageSquare size={24} />
                    </div>
                    <h1>Triagem Inteligente WhatsApp</h1>
                </div>
                <p style={{ color: 'var(--text-light)' }}>
                    Mensagens analisadas por IA para extração de demandas e análise de sentimento.
                </p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.5fr', gap: '2rem' }}>
                <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid #edf2f7', background: '#f8f9fa' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem' }}>Fluxo de Entrada</h3>
                    </div>
                    <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                onClick={() => { setSelectedMsg(msg); setDraft(null); }}
                                style={{
                                    padding: '1rem',
                                    borderBottom: '1px solid #edf2f7',
                                    cursor: 'pointer',
                                    background: selectedMsg?.id === msg.id ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                                    borderLeft: `4px solid ${msg.sentiment === 'negative' ? '#e53e3e' : msg.sentiment === 'positive' ? '#38a169' : '#cbd5e0'}`
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{msg.sender}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{msg.time}</span>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text)', marginBottom: '0.75rem' }}>{msg.text}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
                                        <MapPin size={14} />
                                        <span>{msg.location}</span>
                                    </div>
                                    {msg.urgency === 'high' && <AlertCircle size={14} color="#e53e3e" />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-card">
                    {selectedMsg ? (
                        <div>
                            <div style={{ marginBottom: '2rem' }}>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', background: selectedMsg.sentiment === 'negative' ? '#fff5f5' : '#f0fff4', color: selectedMsg.sentiment === 'negative' ? '#e53e3e' : '#38a169', border: '1px solid currentColor' }}>
                                    Sentimento: {selectedMsg.sentiment === 'negative' ? 'Insatisfação' : 'Elogio/Neutro'}
                                </span>
                                <h3 style={{ marginTop: '1rem' }}>Processar Demanda</h3>
                                <p style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', fontStyle: 'italic' }}>
                                    "{selectedMsg.text}"
                                </p>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                                <button className="btn-primary flex-center gap-1" onClick={() => openDrawer('link')}>
                                    <CheckCircle size={18} /> Vincular Proposição
                                </button>
                                <button className="btn-gold flex-center gap-1" onClick={generateDraft} disabled={isGenerating}>
                                    <Sparkles size={18} /> {isGenerating ? 'IA escrevendo...' : 'Gerar Minuta de Lei'}
                                </button>
                                <button className="btn-primary flex-center gap-1" style={{ background: '#edf2f7', color: 'var(--primary)' }} onClick={() => openDrawer('visit')}>
                                    <Clock size={18} /> Agendar Visita
                                </button>
                            </div>

                            <AnimatePresence>
                                {draft && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        style={{ background: '#1a365d', color: '#e2e8f0', padding: '1.5rem', borderRadius: '0.8rem', position: 'relative' }}
                                    >
                                        <div style={{ position: 'absolute', right: '1rem', top: '1rem' }}>
                                            <FileText size={20} opacity={0.5} />
                                        </div>
                                        <h4 style={{ color: 'var(--secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Sparkles size={16} /> Minuta Sugerida pela IA
                                        </h4>
                                        <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.85rem', lineHeight: '1.6', fontFamily: 'serif' }}>
                                            {draft}
                                        </pre>
                                        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                                            <button className="btn-gold" style={{ fontSize: '0.8rem' }}>Copiar Texto</button>
                                            <button style={{ background: 'transparent', border: '1px solid white', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.8rem', cursor: 'pointer' }}>Refinar com IA</button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                            <MessageSquare size={48} style={{ color: '#cbd5e0', margin: '0 auto 1rem' }} />
                            <h3>Selecione uma mensagem</h3>
                            <p style={{ color: 'var(--text-light)' }}>A IA analisará o sentimento e sugerirá ações automáticas.</p>
                        </div>
                    )}
                </div>
            </div>

            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                title={drawerType === 'link' ? 'Vincular a Proposição Existente' : 'Agendar Visita ao Local'}
            >
                {drawerType === 'link' ? (
                    <div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '1.5rem' }}>Selecione um projeto de lei ou indicação já cadastrada para vincular a esta demanda do WhatsApp.</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', cursor: 'pointer' }}>
                                <h4 style={{ margin: 0 }}>Programa Escola Conectada</h4>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Educação • Em Tramitação</span>
                            </div>
                            <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', cursor: 'pointer' }}>
                                <h4 style={{ margin: 0 }}>Rede de Apoio à Saúde Mental</h4>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Saúde • Aprovado</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label>Data da Visita</label>
                            <input type="date" />
                        </div>
                        <div>
                            <label>Horário</label>
                            <input type="time" />
                        </div>
                        <div>
                            <label>Acompanhantes</label>
                            <input type="text" placeholder="Ex: Assessor Jurídico, Engenheiro" />
                        </div>
                        <div>
                            <label>Notas de Campo</label>
                            <textarea rows={4} placeholder="O que deve ser verificado no local?"></textarea>
                        </div>
                        <button type="button" className="btn-primary" style={{ marginTop: '1rem' }}>Confirmar Agendamento</button>
                    </form>
                )}
            </Drawer>
        </motion.div>
    );
};

export default WhatsAppIntegration;
