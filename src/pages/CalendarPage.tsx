import { useState, useEffect } from 'react';
import { Clock, MapPin, Plus, ChevronLeft, ChevronRight, Save, Calendar as CalendarIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Modal } from '../components/UIComponents';
import { supabase } from '../lib/supabase';
import { useTenant } from '../context/TenantContext';

interface CalendarEvent {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    category: 'Eleitoral' | 'Legislativo' | 'Comunicação' | 'Outros';
}

const CalendarPage = () => {
    const { tenant } = useTenant();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [events, setEvents] = useState<CalendarEvent[]>([]);

    // Form states
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState<CalendarEvent['category']>('Outros');

    useEffect(() => {
        if (tenant.id) {
            fetchEvents();
        }
    }, [tenant.id]);

    const fetchEvents = async () => {
        const { data, error } = await supabase
            .from('calendar_events')
            .select('*')
            .eq('tenant_id', tenant.id)
            .order('date', { ascending: true })
            .order('time', { ascending: true });

        if (error) {
            console.error('Error fetching events:', error);
        } else {
            setEvents(data || []);
        }
    };

    const handleAddEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tenant.id) return;

        const newEvent = {
            tenant_id: tenant.id,
            title,
            description,
            date,
            time,
            location,
            category
        };

        const { data, error } = await supabase
            .from('calendar_events')
            .insert([newEvent])
            .select();

        if (error) {
            console.error('Error adding event:', error);
            alert('Erro ao salvar evento');
        } else if (data) {
            setEvents([...events, data[0]].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
            setIsModalOpen(false);
            // Clear form
            setTitle('');
            setDescription('');
            setDate('');
            setTime('');
            setLocation('');
        }
    };

    const todayEvents = events.filter(e => e.date === new Date().toISOString().split('T')[0]);

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
                            <CalendarIcon size={32} />
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Agenda do Gabinete</h1>
                    </div>
                    <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', fontWeight: 500 }}>
                        Gestão de compromissos legislativos e de campanha.
                    </p>
                </div>
                <button
                    className="btn-gold"
                    onClick={() => setIsModalOpen(true)}
                    style={{ borderRadius: '14px', padding: '12px 24px' }}
                >
                    <Plus size={20} /> Novo Compromisso
                </button>
            </header>

            <div className="grid-2-1" style={{ gap: '2rem' }}>
                <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 800 }}>Calendário Estratégico</h2>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button className="close-btn" style={{ transform: 'none' }}><ChevronLeft size={18} /></button>
                            <button className="close-btn" style={{ transform: 'none' }}><ChevronRight size={18} /></button>
                        </div>
                    </div>

                    <div style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '8px' }}>
                            {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map(day => (
                                <div key={day} style={{ padding: '10px', textAlign: 'center', fontWeight: 800, fontSize: '0.7rem', color: 'var(--text-light)', letterSpacing: '0.1em' }}>{day}</div>
                            ))}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                            {[...Array(31)].map((_, i) => {
                                const day = i + 1;
                                const hasEvent = events.some(e => new Date(e.date).getDate() === day);
                                return (
                                    <motion.div
                                        whileHover={{ y: -2 }}
                                        key={i}
                                        style={{
                                            background: i + 1 === 16 ? 'var(--primary)' : 'rgba(255,255,255,0.02)',
                                            minHeight: '100px',
                                            padding: '12px',
                                            borderRadius: '16px',
                                            border: '1px solid',
                                            borderColor: i + 1 === 16 ? 'var(--primary)' : 'var(--border)',
                                            position: 'relative',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: i + 1 === 16 ? 'white' : 'inherit' }}>
                                            {day}
                                        </span>
                                        {hasEvent && (
                                            <div style={{
                                                marginTop: '8px',
                                                width: '6px',
                                                height: '6px',
                                                borderRadius: '50%',
                                                background: i + 1 === 16 ? 'white' : 'var(--secondary)',
                                                boxShadow: i + 1 === 16 ? 'none' : '0 0 10px var(--secondary)'
                                            }} />
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="glass-card">
                        <h3 style={{ margin: '0 0 2rem 0', fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Compromissos de Hoje</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {todayEvents.length === 0 ? (
                                <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>
                                    <Clock size={32} style={{ margin: '0 auto 10px' }} />
                                    <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Nenhum evento para hoje.</p>
                                </div>
                            ) : (
                                todayEvents.map((event) => (
                                    <div key={event.id} style={{
                                        padding: '1.25rem',
                                        background: 'rgba(255,255,255,0.02)',
                                        borderRadius: '16px',
                                        border: '1px solid var(--border)',
                                        position: 'relative'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '4px 10px', borderRadius: '8px', background: 'var(--secondary)', color: 'var(--primary)', textTransform: 'uppercase' }}>
                                                {event.category}
                                            </span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-light)' }}>
                                                <Clock size={14} /> {event.time}
                                            </div>
                                        </div>
                                        <h4 style={{ fontSize: '1.1rem', margin: '0 0 8px 0', fontWeight: 800 }}>{event.title}</h4>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 600 }}>
                                            <MapPin size={14} /> {event.location}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="glass-card" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-accent) 100%)', color: 'white' }}>
                        <h3 style={{ color: 'white', margin: '0 0 2rem 0', fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase' }}>Monitoramento de Presença</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', textAlign: 'center' }}>
                            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '16px' }}>
                                <p style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>{events.filter(e => e.category === 'Legislativo').length}</p>
                                <p style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.8, marginTop: '4px', textTransform: 'uppercase' }}>Câmara</p>
                            </div>
                            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '16px' }}>
                                <p style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>{events.filter(e => e.category === 'Eleitoral').length}</p>
                                <p style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.8, marginTop: '4px', textTransform: 'uppercase' }}>Campo</p>
                            </div>
                            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '16px' }}>
                                <p style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>{events.filter(e => e.category === 'Comunicação').length}</p>
                                <p style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.8, marginTop: '4px', textTransform: 'uppercase' }}>Mídia</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Novo Compromisso Estratégico"
            >
                <form onSubmit={handleAddEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem 0.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>Título do Compromisso</label>
                        <input
                            type="text"
                            required
                            placeholder="Ex: Reunião Bairro Vila Nova"
                            className="form-input"
                            style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'var(--bg-color)', border: '1px solid var(--border)' }}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>Data</label>
                            <input
                                type="date"
                                required
                                className="form-input"
                                style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'var(--bg-color)', border: '1px solid var(--border)' }}
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>Horário</label>
                            <input
                                type="time"
                                required
                                className="form-input"
                                style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'var(--bg-color)', border: '1px solid var(--border)' }}
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>Localização</label>
                        <input
                            type="text"
                            required
                            placeholder="Associação de Moradores, Plenário, etc."
                            className="form-input"
                            style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'var(--bg-color)', border: '1px solid var(--border)' }}
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>Categoria Estratégica</label>
                        <select
                            className="form-input"
                            style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'var(--bg-color)', border: '1px solid var(--border)', fontWeight: 600 }}
                            value={category}
                            onChange={(e) => setCategory(e.target.value as any)}
                        >
                            <option value="Eleitoral">Eleitoral (Campo)</option>
                            <option value="Legislativo">Legislativo (Câmara)</option>
                            <option value="Comunicação">Comunicação (Mídia)</option>
                            <option value="Outros">Outros Transversais</option>
                        </select>
                    </div>
                    <button type="submit" className="btn-gold" style={{ marginTop: '0.5rem', padding: '16px', borderRadius: '14px', fontSize: '1rem', fontWeight: 800 }}>
                        <Save size={20} /> Salvar na Agenda do Mandato
                    </button>
                </form>
            </Modal>
        </motion.div>
    );
};

export default CalendarPage;
