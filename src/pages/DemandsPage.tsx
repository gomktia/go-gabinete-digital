import { MapPin, Filter, Search, Clock, CheckCircle, AlertTriangle, List, Map as MapIcon, ChevronRight, Camera, User, Plus, Loader2, Mic, Sparkles, Download, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Drawer, Modal } from '../components/UIComponents';
import { supabase } from '../lib/supabase';
import { useTenant } from '../context/TenantContext';

// Interfaces matching Supabase schema
interface Visit {
    id: number;
    created_at: string;
    demand_id: number;
    date: string;
    responsible: string;
    notes: string;
    photo_url?: string;
}

interface Demand {
    id: number;
    created_at: string;
    title: string;
    local: string;
    category: string;
    status: 'pending' | 'in-progress' | 'resolved';
    priority: 'low' | 'medium' | 'high';
    description: string;
    visits: Visit[];
}

const DemandsPage = () => {
    const { tenant } = useTenant();
    const [view, setView] = useState<'list' | 'map'>('list');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
    const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);

    // Data Loading
    const [demands, setDemands] = useState<Demand[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [filterResponsible, setFilterResponsible] = useState('Todos');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (tenant.id) {
            fetchDemands();
        }
    }, [tenant.id]);

    const fetchDemands = async () => {
        setIsLoading(true);
        // RLS will automatically filter by tenant, but good practice to rely on it.
        const { data, error } = await supabase
            .from('demands')
            .select(`
                *,
                visits:demand_visits(*)
            `)
            .eq('tenant_id', tenant.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching demands:', error);
            alert('Erro ao carregar demandas');
        } else {
            const sortedData = data?.map((d: any) => ({
                ...d,
                visits: d.visits?.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) || []
            })) || [];
            setDemands(sortedData);
        }
        setIsLoading(false);
    };

    const openDemandDetails = (demand: Demand) => {
        setSelectedDemand(demand);
        setIsDrawerOpen(true);
    };

    const handleUpdateStatus = async () => {
        if (!selectedDemand) return;

        const newStatus = selectedDemand.status === 'resolved' ? 'in-progress' : 'resolved';

        const updatedDemand = { ...selectedDemand, status: newStatus as any };
        setDemands(demands.map(d => d.id === selectedDemand.id ? updatedDemand : d));
        setSelectedDemand(updatedDemand);

        const { error } = await supabase
            .from('demands')
            .update({ status: newStatus })
            .eq('id', selectedDemand.id);

        if (error) {
            console.error('Error updating status:', error);
            alert('Erro ao atualizar status');
            fetchDemands();
        } else {
            alert(`Status atualizado para: ${newStatus === 'resolved' ? 'Resolvido' : 'Em Andamento'}`);
        }
    };

    const [isNewDemandModalOpen, setIsNewDemandModalOpen] = useState(false);
    const [newDemandTitle, setNewDemandTitle] = useState('');
    const [newDemandLocal, setNewDemandLocal] = useState('');
    const [newDemandCategory, setNewDemandCategory] = useState('Infraestrutura');
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessingIA, setIsProcessingIA] = useState(false);
    const [isDocModalOpen, setIsDocModalOpen] = useState(false);
    const docRef = useRef<HTMLDivElement>(null);

    const handleCreateIndication = () => {
        setIsDocModalOpen(true);
    };

    const handlePrintDoc = () => {
        const content = docRef.current;
        if (!content) return;

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        printWindow.document.write(`
            <html>
                <head>
                    <title>Ofício - ${selectedDemand?.title}</title>
                    <style>
                        body { font-family: 'Times New Roman', serif; padding: 40px; line-height: 1.6; }
                        .header { text-align: center; border-bottom: 2px solid black; padding-bottom: 20px; margin-bottom: 30px; }
                        .content { text-align: justify; }
                        .footer { margin-top: 100px; text-align: center; }
                        .signature { border-top: 1px solid black; display: inline-block; padding: 10px 40px; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    ${content.innerHTML}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    const handleRegisterVisit = async (visitData: any) => {
        if (!selectedDemand || !tenant.id) return;

        const newVisitPayload = {
            demand_id: selectedDemand.id,
            responsible: visitData.responsible,
            notes: visitData.notes,
            photo_url: visitData.photo,
            date: new Date().toISOString().split('T')[0],
            tenant_id: tenant.id
        };

        const { data, error } = await supabase
            .from('demand_visits')
            .insert([newVisitPayload])
            .select();

        if (error) {
            console.error('Error creating visit:', error);
            alert('Erro ao registrar visita');
        } else if (data) {
            const newVisit = data[0];
            const updatedVisits = [newVisit, ...selectedDemand.visits];
            const updatedDemand = { ...selectedDemand, visits: updatedVisits };

            setSelectedDemand(updatedDemand);
            setDemands(demands.map(d => d.id === selectedDemand.id ? updatedDemand : d));

            setIsVisitModalOpen(false);
        }
    };

    const simulateIAExtraction = (text: string) => {
        setIsProcessingIA(true);
        // Simulate LLM processing delay
        setTimeout(() => {
            const lowerText = text.toLowerCase();

            // Basic extraction logic (Mocking a real NLP)
            let category = 'Infraestrutura';
            if (lowerText.includes('saúde') || lowerText.includes('médico') || lowerText.includes('ubs')) category = 'Saúde';
            else if (lowerText.includes('escola') || lowerText.includes('ensino')) category = 'Educação';
            else if (lowerText.includes('luz') || lowerText.includes('iluminação')) category = 'Iluminação Pública';
            else if (lowerText.includes('esgoto') || lowerText.includes('cheiro')) category = 'Saneamento';

            setNewDemandTitle(text.charAt(0).toUpperCase() + text.slice(1));
            setNewDemandCategory(category);

            // Extract location pattern (e.g., "no bairro X" or "na rua Y")
            const locationMatch = text.match(/(?:no bairro|na rua|em|perto de)\s+([a-zA-Z\s]+)/i);
            if (locationMatch) {
                setNewDemandLocal(locationMatch[1].trim());
            }

            setIsProcessingIA(false);
        }, 1500);
    };

    const handleCreateDemand = async (e: React.FormEvent) => {
        // ... (existing handleCreateDemand logic remains same or will be called from form)
        e.preventDefault();

        if (!tenant.id) {
            alert('Erro: ID do Gabinete não encontrado.');
            return;
        }

        const newDemand = {
            title: newDemandTitle,
            local: newDemandLocal,
            category: newDemandCategory,
            status: 'pending',
            priority: 'medium',
            description: '',
            tenant_id: tenant.id
        };

        const { data, error } = await supabase.from('demands').insert([newDemand]).select();
        if (error) {
            console.error('Error creating demand:', error);
            alert('Erro ao criar demanda');
        } else if (data) {
            setDemands([{ ...data[0], visits: [] }, ...demands]);
            setIsNewDemandModalOpen(false);
            setNewDemandTitle('');
            setNewDemandLocal('');
        }
    }


    const filteredDemands = demands.filter(d => {
        const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase()) || d.local.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesResponsible = filterResponsible === 'Todos' || d.visits.some((v: any) => v.responsible === filterResponsible);
        return matchesSearch && matchesResponsible;
    });

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;

        if (diffInHours < 24) return `há ${Math.floor(diffInHours)}h`;
        return `${Math.floor(diffInHours / 24)} dias atrás`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
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
                            <MapPin size={32} />
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Mapa de Demandas</h1>
                    </div>
                    <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', fontWeight: 500 }}>
                        Monitoramento geolocalizado e fiscalização ativa do mandato.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button
                        className="btn-gold"
                        onClick={() => setIsNewDemandModalOpen(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '14px', padding: '12px 20px' }}
                    >
                        <Plus size={20} /> Nova Demanda
                    </button>

                    <div style={{
                        display: 'flex',
                        background: 'var(--bg-color)',
                        padding: '6px',
                        borderRadius: '14px',
                        border: '1px solid var(--border)',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                    }}>
                        <button
                            onClick={() => setView('list')}
                            style={{
                                padding: '0.6rem 1.25rem',
                                borderRadius: '10px',
                                border: 'none',
                                background: view === 'list' ? 'var(--surface)' : 'transparent',
                                boxShadow: view === 'list' ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                color: view === 'list' ? 'var(--primary)' : 'var(--text-light)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        >
                            <List size={18} /> Lista
                        </button>
                        <button
                            onClick={() => setView('map')}
                            style={{
                                padding: '0.6rem 1.25rem',
                                borderRadius: '10px',
                                border: 'none',
                                background: view === 'map' ? 'var(--surface)' : 'transparent',
                                boxShadow: view === 'map' ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                color: view === 'map' ? 'var(--primary)' : 'var(--text-light)',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                        >
                            <MapIcon size={18} /> Mapa
                        </button>
                    </div>
                </div>
            </header>

            <div className="glass-card flex-col-mobile" style={{ marginBottom: '2.5rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center', padding: '1.5rem 2rem', border: '1px solid var(--border)' }}>
                <div style={{ flex: 1, minWidth: '300px', position: 'relative', width: '100%' }}>
                    <Search size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4, color: 'var(--text)' }} />
                    <input
                        type="text"
                        placeholder="Buscar por local ou descrição..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.875rem 1rem 0.875rem 3.2rem',
                            borderRadius: '12px',
                            border: '1px solid var(--border)',
                            background: 'var(--bg-color)',
                            color: 'var(--text)',
                            outline: 'none',
                            fontSize: '0.95rem'
                        }}
                    />
                </div>
                <div className="flex-col-mobile" style={{ display: 'flex', gap: '1rem', width: '100%', flex: 1.5 }}>
                    <select
                        value={filterResponsible}
                        onChange={(e) => setFilterResponsible(e.target.value)}
                        style={{
                            width: 'auto',
                            flex: 1,
                            minWidth: '200px',
                            background: 'var(--bg-color)',
                            color: 'var(--text)',
                            border: '1px solid var(--border)',
                            borderRadius: '12px',
                            padding: '0.875rem 1rem',
                            fontWeight: 600
                        }}
                    >
                        <option value="Todos">Por Responsável: Todos</option>
                        <option value="Vereador João">Vereador João</option>
                        <option value="Assessor Marcos">Assessor Marcos</option>
                        <option value="Assessora Sandra">Assessora Sandra</option>
                    </select>
                    <button className="btn-primary flex-center gap-1" style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', padding: '0 20px', minWidth: '160px' }}>
                        <Filter size={18} /> Filtrar
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: '5rem 3rem', textAlign: 'center', color: 'var(--text-light)' }}>
                        <Loader2 className="animate-spin" size={40} style={{ margin: '0 auto 1.5rem auto', color: 'var(--primary)' }} />
                        <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Sincronizando demandas territoriais...</p>
                    </motion.div>
                ) : view === 'list' ? (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        style={{ display: 'grid', gap: '1.25rem' }}
                    >
                        {filteredDemands.length === 0 ? (
                            <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-light)', background: 'var(--surface)', borderRadius: '20px', border: '2px dashed var(--border)' }}>
                                <AlertTriangle size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                                <p style={{ fontSize: '1.1rem', fontWeight: 500 }}>Nenhuma demanda encontrada para os filtros atuais.</p>
                            </div>
                        ) : (
                            filteredDemands.map((demand) => (
                                <motion.div
                                    key={demand.id}
                                    whileHover={{ y: -3, boxShadow: '0 12px 24px rgba(0,0,0,0.08)' }}
                                    className="glass-card flex-col-mobile"
                                    onClick={() => openDemandDetails(demand)}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        background: 'var(--surface)',
                                        cursor: 'pointer',
                                        gap: '1.5rem',
                                        padding: '1.5rem 2rem',
                                        borderRadius: '20px',
                                        borderLeft: `6px solid ${demand.status === 'resolved' ? '#38a169' : demand.priority === 'high' ? '#e53e3e' : '#ed8936'}`,
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flex: 1 }}>
                                        <div style={{
                                            padding: '12px',
                                            background: demand.status === 'resolved' ? 'rgba(56, 161, 105, 0.1)' : demand.priority === 'high' ? 'rgba(229, 62, 62, 0.1)' : 'rgba(237, 137, 54, 0.1)',
                                            borderRadius: '14px',
                                            color: demand.status === 'resolved' ? '#38a169' : demand.priority === 'high' ? '#e53e3e' : '#ed8936'
                                        }}>
                                            {demand.status === 'resolved' ? <CheckCircle size={30} /> : <AlertTriangle size={30} />}
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)' }}>{demand.title}</h3>
                                            <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.9rem', color: 'var(--text-light)', marginTop: '0.5rem', fontWeight: 500 }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} color="var(--primary)" /> {demand.local}</span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16} /> {formatTimeAgo(demand.created_at)}</span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <User size={16} /> {demand.visits.length > 0 ? `${demand.visits.length} visitas` : 'Sem fiscalização'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', width: '100%', justifyContent: 'space-between', maxWidth: '280px' }}>
                                        <span style={{
                                            padding: '8px 16px',
                                            borderRadius: '12px',
                                            fontSize: '0.8rem',
                                            fontWeight: 800,
                                            background: demand.status === 'resolved' ? 'rgba(56, 161, 105, 0.1)' : demand.status === 'in-progress' ? 'rgba(49, 130, 206, 0.1)' : 'rgba(237, 137, 54, 0.1)',
                                            color: demand.status === 'resolved' ? '#38a169' : demand.status === 'in-progress' ? '#3182ce' : '#ed8936',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>
                                            {demand.status === 'resolved' ? 'Resolvido' : demand.status === 'in-progress' ? 'Em campo' : 'Triagem'}
                                        </span>
                                        <div style={{ background: 'var(--bg-color)', padding: '8px', borderRadius: '50%', color: 'var(--text-light)' }}>
                                            <ChevronRight size={20} />
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="map"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        style={{
                            height: '600px',
                            background: '#f1f5f9',
                            borderRadius: '1rem',
                            overflow: 'hidden',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <div style={{
                            width: '100%',
                            height: '100%',
                            background: 'radial-gradient(circle at center, #cbd5e1 0%, #f1f5f9 100%)',
                            opacity: 0.5
                        }}>
                            <p style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#64748b' }}>
                                Integração com Google Maps API (Pendente de Chave)
                            </p>
                        </div>

                        {filteredDemands.map((d, i) => (
                            <motion.div
                                key={d.id}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => openDemandDetails(d)}
                                style={{
                                    position: 'absolute',
                                    top: `${20 + (i * 15)}%`, // Mock positioning for now
                                    left: `${30 + (i * 10)}%`,
                                    cursor: 'pointer',
                                    zIndex: 10
                                }}
                            >
                                <div style={{
                                    background: d.priority === 'high' ? '#e53e3e' : '#ed8936',
                                    color: 'white',
                                    padding: '8px',
                                    borderRadius: '50% 50% 50% 0',
                                    transform: 'rotate(-45deg)',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <div style={{ transform: 'rotate(45deg)' }}>
                                        {d.category === 'Saúde' ? 'H' : '!'}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Quick Create Demand Modal */}
            <Modal isOpen={isNewDemandModalOpen} onClose={() => setIsNewDemandModalOpen(false)} title="Nova Demanda Eleitoral">
                <form onSubmit={handleCreateDemand} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem 0.5rem' }}>

                    {/* AI Voice Input - Zap do Mandato Roadmap Implementation */}
                    <div style={{
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-accent) 100%)',
                        padding: '2rem',
                        borderRadius: '24px',
                        color: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1.5rem',
                        boxShadow: '0 12px 24px rgba(15,23,42,0.2)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '150px', height: '150px', background: 'var(--secondary)', opacity: 0.1, filter: 'blur(30px)', borderRadius: '50%' }}></div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Sparkles size={18} className="text-gold" />
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Agente de Captura IA</span>
                        </div>

                        {isProcessingIA ? (
                            <div style={{ height: '70px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {[1, 2, 3, 4, 5].map(i => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: [15, 40, 15] }}
                                        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                                        style={{ width: '6px', background: 'var(--secondary)', borderRadius: '10px' }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                    if (!('webkitSpeechRecognition' in window)) {
                                        alert('Navegador incompatível.');
                                        return;
                                    }
                                    const recognition = new (window as any).webkitSpeechRecognition();
                                    recognition.lang = 'pt-BR';
                                    recognition.start();
                                    setIsRecording(true);

                                    recognition.onresult = (event: any) => {
                                        const transcript = event.results[0][0].transcript;
                                        simulateIAExtraction(transcript);
                                        setIsRecording(false);
                                    };
                                    recognition.onend = () => setIsRecording(false);
                                }}
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    background: isRecording ? '#e53e3e' : 'white',
                                    color: isRecording ? 'white' : 'var(--primary)',
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    boxShadow: isRecording ? '0 0 30px rgba(229,62,62,0.4)' : '0 10px 20px rgba(0,0,0,0.2)'
                                }}
                            >
                                {isRecording ? (
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ repeat: Infinity, duration: 1 }}
                                        style={{ width: '20px', height: '20px', background: 'white', borderRadius: '4px' }}
                                    />
                                ) : <Mic size={36} />}
                            </motion.button>
                        )}

                        <p style={{ fontSize: '0.9rem', fontWeight: 600, textAlign: 'center' }}>
                            {isRecording ? 'Gravando demanda... Fale agora.' : isProcessingIA ? 'IA extraindo dados estruturados...' : 'Toque para cadastrar por voz'}
                        </p>
                    </div>


                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>Descrição da Demanda</label>
                            <input
                                type="text"
                                required
                                className="form-input"
                                placeholder="Ex: Reforma da Praça Central ou Buraco na Rua X"
                                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: 'var(--bg-color)', border: '1px solid var(--border)' }}
                                value={newDemandTitle}
                                onChange={(e) => setNewDemandTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>Local / Endereço</label>
                            <input
                                type="text"
                                required
                                className="form-input"
                                placeholder="Endereço, bairro ou ponto de referência"
                                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: 'var(--bg-color)', border: '1px solid var(--border)' }}
                                value={newDemandLocal}
                                onChange={(e) => setNewDemandLocal(e.target.value)}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>Classificação</label>
                            <select
                                className="form-input"
                                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: 'var(--bg-color)', border: '1px solid var(--border)', fontWeight: 600 }}
                                value={newDemandCategory}
                                onChange={(e) => setNewDemandCategory(e.target.value)}
                            >
                                <option>Infraestrutura</option>
                                <option>Saúde</option>
                                <option>Educação</option>
                                <option>Segurança</option>
                                <option>Saneamento</option>
                                <option>Iluminação Pública</option>
                                <option>Outros</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="btn-gold" style={{ marginTop: '0.5rem', padding: '14px', borderRadius: '14px', fontSize: '1rem', fontWeight: 800 }}>
                        Registrar Demanda de Campo
                    </button>
                </form>
            </Modal>

            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                title="Detalhes da Demanda"
            >
                {selectedDemand && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Header Section */}
                        <div style={{
                            padding: '2rem 1.5rem',
                            background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-accent) 100%)',
                            borderRadius: '24px',
                            color: 'white',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                position: 'absolute',
                                right: '1rem',
                                top: '1rem',
                                padding: '6px 14px',
                                borderRadius: '10px',
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                background: 'rgba(255,255,255,0.2)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                color: 'white'
                            }}>
                                ID: #{selectedDemand.id}
                            </div>

                            <span style={{
                                padding: '6px 12px',
                                borderRadius: '10px',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                background: 'var(--secondary)',
                                color: 'var(--primary)',
                                display: 'inline-block',
                                marginBottom: '1.25rem'
                            }}>
                                {selectedDemand.category}
                            </span>

                            <h2 style={{ fontSize: '1.75rem', margin: 0, fontWeight: 800, lineHeight: 1.2 }}>{selectedDemand.title}</h2>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', marginTop: '1.5rem', opacity: 0.9 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 600 }}>
                                    <MapPin size={18} />
                                    <span>{selectedDemand.local}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 600 }}>
                                    <Clock size={18} />
                                    <span>{new Date(selectedDemand.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Visit Log Section */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fiscalização e Visitas</h4>
                                <button
                                    onClick={() => setIsVisitModalOpen(true)}
                                    className="btn-gold"
                                    style={{ fontSize: '0.8rem', padding: '8px 16px', borderRadius: '10px' }}
                                >
                                    <Plus size={16} /> Nova Visita
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                {selectedDemand.visits.length === 0 ? (
                                    <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--bg-color)', borderRadius: '16px', border: '1px dashed var(--border)', color: 'var(--text-light)' }}>
                                        <Camera size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
                                        <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Nenhuma visita em campo ainda.</p>
                                    </div>
                                ) : (
                                    selectedDemand.visits.map((visit) => (
                                        <div key={visit.id} style={{
                                            background: 'var(--bg-color)',
                                            padding: '1.25rem',
                                            borderRadius: '16px',
                                            border: '1px solid var(--border)',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{
                                                        width: '36px',
                                                        height: '36px',
                                                        borderRadius: '10px',
                                                        background: 'var(--primary)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'white',
                                                        fontWeight: 800,
                                                        fontSize: '0.9rem'
                                                    }}>
                                                        {visit.responsible.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)' }}>{visit.responsible}</p>
                                                        <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-light)' }}>{new Date(visit.date).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                {visit.photo_url && (
                                                    <motion.div whileHover={{ scale: 1.05 }} style={{ width: '50px', height: '50px', borderRadius: '10px', overflow: 'hidden', border: '2px solid var(--border)', cursor: 'pointer' }}>
                                                        <img src={visit.photo_url} alt="Visit" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </motion.div>
                                                )}
                                            </div>
                                            <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text)', lineHeight: '1.6', fontWeight: 500 }}>{visit.notes}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Cabinet Actions */}
                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
                            <h4 style={{ marginBottom: '1.25rem', fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Desdobramentos do Mandato</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <button
                                    className="btn-primary"
                                    onClick={handleUpdateStatus}
                                    style={{ padding: '12px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 700, background: selectedDemand.status === 'resolved' ? 'var(--bg-color)' : 'var(--primary)', color: selectedDemand.status === 'resolved' ? 'var(--text)' : 'white', border: '1px solid var(--border)' }}
                                >
                                    {selectedDemand.status === 'resolved' ? 'Reabrir Fiscalização' : 'Concluir Demanda'}
                                </button>
                                <button
                                    className="btn-gold"
                                    onClick={handleCreateIndication}
                                    style={{ padding: '12px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 700 }}
                                >
                                    <List size={18} /> Criar Indicação
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Drawer>

            {/* Document Preview Modal - Roadmap Implementation #3 */}
            <Modal isOpen={isDocModalOpen} onClose={() => setIsDocModalOpen(false)} title="Gerador de Documento Oficial">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div ref={docRef} style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: '8px',
                        border: '1px solid #ccc',
                        color: 'black',
                        fontFamily: 'serif',
                        fontSize: '0.9rem'
                    }}>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ margin: 0 }}>CÂMARA MUNICIPAL</h3>
                            <p style={{ margin: 0, fontWeight: 700 }}>Gabinete do Vereador {tenant.name}</p>
                            <p style={{ margin: 0, fontSize: '0.8rem' }}>Rua Legislativa, 123 - Centro</p>
                        </div>

                        <div style={{ textAlign: 'right', marginBottom: '2rem' }}>
                            Cidade/UF, {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <strong>OFÍCIO Nº ____ / 2026</strong><br />
                            <strong>Assunto:</strong> Indicação de {selectedDemand?.category} - {selectedDemand?.title}
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            Excelentíssimo Senhor Prefeito,
                        </div>

                        <div style={{ textAlign: 'justify', marginBottom: '2rem' }}>
                            Venho, por meio deste, indicar ao Poder Executivo Municipal a necessidade de intervenção urgente em:
                            <strong> {selectedDemand?.local}</strong>.
                        </div>

                        <div style={{ textAlign: 'justify', marginBottom: '2rem' }}>
                            A demanda, classificada como {selectedDemand?.category}, refere-se a: "{selectedDemand?.title}".
                            Tal solicitação fundamenta-se na fiscalização realizada por este gabinete, onde constatamos o anseio da comunidade local por melhorias imediatas.
                        </div>

                        {selectedDemand?.visits && selectedDemand.visits.length > 0 && (
                            <div style={{ marginBottom: '2rem' }}>
                                <strong>Evidências da Fiscalização:</strong>
                                <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
                                    {selectedDemand.visits.slice(0, 2).map((v, idx) => (
                                        <li key={idx} style={{ marginBottom: '10px', fontSize: '0.8rem', borderLeft: '2px solid #ccc', paddingLeft: '10px' }}>
                                            <em>"{v.notes}"</em> - Visita em {new Date(v.date).toLocaleDateString()}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                            Atenciosamente,<br /><br />
                            <div style={{ borderTop: '1px solid black', display: 'inline-block', padding: '10px 40px' }}>
                                <strong>VEREADOR {tenant.name?.toUpperCase()}</strong><br />
                                Legislatura 2025-2028
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={handlePrintDoc} className="btn-gold" style={{ flex: 1, borderRadius: '12px' }}>
                            <Printer size={18} /> Imprimir / PDF
                        </button>
                        <button className="btn-primary" style={{ flex: 1, borderRadius: '12px', background: 'var(--bg-color)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                            <Download size={18} /> Enviar via Zap
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={isVisitModalOpen}
                onClose={() => setIsVisitModalOpen(false)}
                title="Registrar Visita em Campo"
            >
                <VisitForm onSubmit={handleRegisterVisit} onCancel={() => setIsVisitModalOpen(false)} />
            </Modal>
        </motion.div>
    );
};

const VisitForm = ({ onSubmit, onCancel }: any) => {
    const [responsible, setResponsible] = useState('Vereador João');
    const [notes, setNotes] = useState('');
    const [photo, setPhoto] = useState<string | null>(null);

    const simulatePhotoUpload = () => {
        setPhoto('https://images.unsplash.com/photo-1590086782957-93c06ef21604?auto=format&fit=crop&w=150&q=80');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
                <label>Responsável pela Visita</label>
                <select value={responsible} onChange={(e) => setResponsible(e.target.value)} className="form-input" style={{ width: '100%' }}>
                    <option>Vereador João</option>
                    <option>Assessor Marcos</option>
                    <option>Assessora Sandra</option>
                </select>
            </div>

            <div>
                <label>Fotos do Local</label>
                <div
                    onClick={simulatePhotoUpload}
                    style={{ width: '100%', height: '100px', border: '2px dashed #cbd5e1', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: photo ? '#f0fff4' : '#f8fafc' }}
                >
                    {photo ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src={photo} alt="Preview" style={{ width: '60px', height: '60px', borderRadius: '4px', objectFit: 'cover' }} />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '0.8rem', color: '#38a169', fontWeight: 700 }}>Foto anexada!</span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>(Clique para trocar)</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Camera size={24} style={{ marginBottom: '8px', color: 'var(--text-light)' }} />
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Clique para tirar ou enviar foto</span>
                        </>
                    )}
                </div>
            </div>

            <div>
                <label>Relátório da Visita (Notas)</label>
                <textarea
                    placeholder="O que foi observado? Qual providência foi tomada no momento?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="form-input"
                    style={{ width: '100%' }}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <button className="btn-primary" style={{ background: '#edf2f7', color: 'var(--text)' }} onClick={onCancel}>Cancelar</button>
                <button className="btn-primary" onClick={() => onSubmit({ responsible, notes, photo })}>Salvar Visita</button>
            </div>
        </div>
    );
};

export default DemandsPage;
