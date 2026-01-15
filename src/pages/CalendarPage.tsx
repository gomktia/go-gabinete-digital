import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Modal } from '../components/UIComponents';

const events = [
    { id: 1, title: 'Reunião de Bairro - Vila Nova', time: '09:00', location: 'Centro Comunitário', category: 'Eleitoral', description: 'Ouvir demandas sobre saneamento.' },
    { id: 2, title: 'Sessão Ordinária - Câmara', time: '14:00', location: 'Plenário Principal', category: 'Legislativo', description: 'Votação do orçamento anual.' },
    { id: 3, title: 'Entrevista Rádio Local', time: '18:30', location: 'Rádio Comunitária FM', category: 'Comunicação', description: 'Divulgação dos projetos de educação.' },
];

const CalendarPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1>Agenda do Gabinete</h1>
                    <p style={{ color: 'var(--text-light)' }}>Gestão de compromissos legislativos e de campanha.</p>
                </div>
                <button className="btn-gold flex-center gap-1" onClick={() => setIsModalOpen(true)}>
                    <Plus size={18} /> Novo Evento
                </button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: 0 }}>Janeiro 2026</h2>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button style={{ background: '#edf2f7', border: 'none', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}><ChevronLeft size={18} /></button>
                            <button style={{ background: '#edf2f7', border: 'none', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}><ChevronRight size={18} /></button>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: '#e2e8f0', border: '1px solid #e2e8f0' }}>
                        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                            <div key={day} style={{ background: '#f8fafc', padding: '0.75rem', textAlign: 'center', fontWeight: 600, fontSize: '0.8rem' }}>{day}</div>
                        ))}
                        {[...Array(31)].map((_, i) => (
                            <div key={i} style={{
                                background: 'white',
                                minHeight: '100px',
                                padding: '0.5rem',
                                position: 'relative',
                                opacity: i + 1 > 14 && i + 1 < 20 ? 1 : 0.8
                            }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: (i + 1 === 14) ? 700 : 400, color: (i + 1 === 14) ? 'var(--primary)' : 'inherit' }}>
                                    {i + 1}
                                </span>
                                {i + 1 === 14 && (
                                    <div style={{ marginTop: '0.25rem', padding: '0.25rem', background: 'rgba(212, 175, 55, 0.2)', borderLeft: '3px solid var(--secondary)', fontSize: '0.65rem', borderRadius: '2px' }}>
                                        Sessão Câmara...
                                    </div>
                                )}
                                {i + 1 === 14 && (
                                    <div style={{ marginTop: '0.25rem', padding: '0.25rem', background: 'rgba(26, 54, 93, 0.1)', borderLeft: '3px solid var(--primary)', fontSize: '0.65rem', borderRadius: '2px' }}>
                                        Reunião Vila...
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-card">
                        <h3>Compromissos de Hoje</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {events.map((event) => (
                                <div key={event.id} style={{ padding: '1rem', background: 'white', borderRadius: '0.8rem', border: '1px solid #edf2f7', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', background: 'var(--primary)', color: 'white' }}>
                                            {event.category}
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-light)' }}>
                                            <Clock size={12} /> {event.time}
                                        </div>
                                    </div>
                                    <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{event.title}</h4>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-light)' }}>
                                        <MapPin size={12} /> {event.location}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card" style={{ background: 'var(--primary)', color: 'white' }}>
                        <h3 style={{ color: 'white' }}>Resumo da Semana</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center', marginTop: '1rem' }}>
                            <div>
                                <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>12</p>
                                <p style={{ fontSize: '0.7rem', opacity: 0.8 }}>Reuniões</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>4</p>
                                <p style={{ fontSize: '0.7rem', opacity: 0.8 }}>Sessões</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>5</p>
                                <p style={{ fontSize: '0.7rem', opacity: 0.8 }}>Visitas</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Agendar Novo Evento"
            >
                <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label>Título do Evento</label>
                        <input type="text" placeholder="Ex: Reunião com Secretário de Obras" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>Data</label>
                            <input type="date" />
                        </div>
                        <div>
                            <label>Horário</label>
                            <input type="time" />
                        </div>
                    </div>
                    <div>
                        <label>Local</label>
                        <input type="text" placeholder="Localização do evento" />
                    </div>
                    <div>
                        <label>Categoria</label>
                        <select>
                            <option>Eleitoral</option>
                            <option>Legislativo</option>
                            <option>Comunicação</option>
                            <option>Outros</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button type="button" className="btn-primary" style={{ flex: 1 }}>Salvar Evento</button>
                        <button type="button" className="btn-primary" style={{ background: '#f1f5f9', color: 'var(--text)' }} onClick={() => setIsModalOpen(false)}>Cancelar</button>
                    </div>
                </form>
            </Modal>
        </motion.div>
    );
};

export default CalendarPage;
