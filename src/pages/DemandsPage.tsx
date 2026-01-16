import { MapPin, Filter, Search, Clock, CheckCircle, AlertTriangle, List, Map as MapIcon, ChevronRight, Camera, User, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Drawer, Modal } from '../components/UIComponents';

const initialDemands = [
    { id: 1, title: 'Buraco Crítico na Via Principal', local: 'Vila Nova - Rua A, 450', category: 'Infraestrutura', status: 'pending', time: 'há 2h', priority: 'high', description: 'Moradores relatam que o buraco está causando acidentes leves e danos aos veículos.', visits: [] },
    {
        id: 2, title: 'Iluminação Pública Queimada', local: 'Centro - Praça Getúlio Vargas', category: 'Urbanismo', status: 'in-progress', time: 'há 5h', priority: 'medium', description: 'Cinco postes sem luz na praça central, gerando insegurança no período noturno.', visits: [
            { id: 101, date: '2024-01-14', responsible: 'Assessor Marcos', notes: 'Fui ao local e confirmei os 5 postes apagados. Solicitei reparo à prefeitura.', photo: 'https://via.placeholder.com/150' }
        ]
    },
    { id: 3, title: 'Falta de Medicamento Básico', local: 'Bairro Rural - UBS Rural', category: 'Saúde', status: 'pending', time: 'Ontem', priority: 'high', description: 'Falta de dipirona e outros insumos básicos na unidade de saúde.', visits: [] },
    {
        id: 4, title: 'Limpeza de Terreno Baldio', local: 'São José - Rua das Flores', category: 'Saneamento', status: 'resolved', time: 'há 3 dias', priority: 'low', description: 'Acúmulo de lixo e mato alto gerando focos de dengue.', visits: [
            { id: 102, date: '2024-01-12', responsible: 'Vereador João', notes: 'Limpeza concluída pela equipe de mutirão.', photo: 'https://via.placeholder.com/150' }
        ]
    },
];

const DemandsPage = () => {
    const [view, setView] = useState<'list' | 'map'>('list');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
    const [selectedDemand, setSelectedDemand] = useState<any>(null);
    const [demands, setDemands] = useState(initialDemands);
    const [filterResponsible, setFilterResponsible] = useState('Todos');
    const [searchTerm, setSearchTerm] = useState('');

    const openDemandDetails = (demand: any) => {
        setSelectedDemand(demand);
        setIsDrawerOpen(true);
    };

    const handleUpdateStatus = () => {
        const newStatus = selectedDemand?.status === 'resolved' ? 'in-progress' : 'resolved';

        // Update local state for immediate feedback
        const updatedDemands = demands.map(d =>
            d.id === selectedDemand.id ? { ...d, status: newStatus } : d
        );
        setDemands(updatedDemands);
        setSelectedDemand({ ...selectedDemand, status: newStatus });

        alert(`Status atualizado para: ${newStatus === 'resolved' ? 'Resolvido' : 'Em Andamento'}`);
    };

    const handleCreateIndication = () => {
        alert("Criando Minuta de Indicação...\n\nO sistema irá gerar um documento oficial baseado nos dados desta demanda.");
    };

    const handleRegisterVisit = (visit: any) => {
        const updatedDemands = demands.map(d => {
            if (d.id === selectedDemand.id) {
                return { ...d, visits: [visit, ...d.visits] };
            }
            return d;
        });
        setDemands(updatedDemands);
        // Update selectedDemand as well to show in drawer
        const updatedSelected = { ...selectedDemand, visits: [visit, ...(selectedDemand.visits || [])] };
        setSelectedDemand(updatedSelected);
        setIsVisitModalOpen(false);
    };

    const filteredDemands = demands.filter(d => {
        const matchesSearch = d.title.toLowerCase().includes(searchTerm.toLowerCase()) || d.local.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesResponsible = filterResponsible === 'Todos' || d.visits.some((v: any) => v.responsible === filterResponsible);
        return matchesSearch && matchesResponsible;
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <header className="responsive-header">
                <div>
                    <h1>Mapa de Demandas</h1>
                    <p style={{ color: 'var(--text-light)' }}>Gestão geolocalizada e acompanhamento de visitas em campo.</p>
                </div>
                <div style={{ display: 'flex', background: 'var(--bg-color)', padding: '4px', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                    <button
                        onClick={() => setView('list')}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            background: view === 'list' ? 'var(--surface)' : 'transparent',
                            boxShadow: view === 'list' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontWeight: 600,
                            color: view === 'list' ? 'var(--primary)' : 'var(--text-light)',
                            transition: 'all 0.2s'
                        }}
                    >
                        <List size={18} /> Lista
                    </button>
                    <button
                        onClick={() => setView('map')}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            background: view === 'map' ? 'var(--surface)' : 'transparent',
                            boxShadow: view === 'map' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontWeight: 600,
                            color: view === 'map' ? 'var(--primary)' : 'var(--text-light)',
                            transition: 'all 0.2s'
                        }}
                    >
                        <MapIcon size={18} /> Mapa
                    </button>
                </div>
            </header>

            <div className="glass-card flex-col-mobile" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ flex: 1, minWidth: '250px', position: 'relative', width: '100%' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                    <input
                        type="text"
                        placeholder="Buscar por local ou descrição..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text)', outline: 'none', marginTop: 0 }}
                    />
                </div>
                <div className="flex-col-mobile" style={{ display: 'flex', gap: '1rem', width: '100%', flex: 1 }}>
                    <select
                        value={filterResponsible}
                        onChange={(e) => setFilterResponsible(e.target.value)}
                        style={{ width: 'auto', flex: 1, minWidth: '180px', marginTop: 0, background: 'var(--bg-color)', color: 'var(--text)', border: '1px solid var(--border)' }}
                    >
                        <option value="Todos">Por Responsável: Todos</option>
                        <option value="Vereador João">Vereador João</option>
                        <option value="Assessor Marcos">Assessor Marcos</option>
                        <option value="Assessora Sandra">Assessora Sandra</option>
                    </select>
                    <button className="btn-primary flex-center gap-1" style={{ background: 'var(--bg-color)', color: 'var(--primary)', border: '1px solid var(--border)', width: 'auto' }}>
                        <Filter size={18} /> Filtros Avançados
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {view === 'list' ? (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        style={{ display: 'grid', gap: '1rem' }}
                    >
                        {filteredDemands.map((demand) => (
                            <div
                                key={demand.id}
                                className="glass-card flex-col-mobile"
                                onClick={() => openDemandDetails(demand)}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: 'var(--surface)',
                                    cursor: 'pointer',
                                    gap: '1rem',
                                    borderLeft: `4px solid ${demand.status === 'resolved' ? '#38a169' : demand.priority === 'high' ? '#e53e3e' : '#ed8936'}`
                                }}
                            >
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                    <div style={{
                                        padding: '0.75rem',
                                        background: demand.status === 'resolved' ? 'rgba(56, 161, 105, 0.1)' : demand.priority === 'high' ? 'rgba(229, 62, 62, 0.1)' : 'rgba(237, 137, 54, 0.1)',
                                        borderRadius: '0.5rem',
                                        color: demand.status === 'resolved' ? '#38a169' : demand.priority === 'high' ? '#e53e3e' : '#ed8936'
                                    }}>
                                        {demand.status === 'resolved' ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text)' }}>{demand.title}</h3>
                                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {demand.local}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> {demand.visits.length > 0 ? `${demand.visits.length} visitas` : 'Sem visitas'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', justifyContent: 'space-between' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '1rem',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        background: demand.status === 'resolved' ? 'rgba(56, 161, 105, 0.1)' : demand.status === 'in-progress' ? 'rgba(49, 130, 206, 0.1)' : 'rgba(237, 137, 54, 0.1)',
                                        color: demand.status === 'resolved' ? '#38a169' : demand.status === 'in-progress' ? '#3182ce' : '#ed8936',
                                        border: '1px solid transparent'
                                    }}>
                                        {demand.status === 'resolved' ? 'Resolvido' : demand.status === 'in-progress' ? 'Em Andamento' : 'Pendente'}
                                    </span>
                                    <ChevronRight size={20} color="var(--text-light)" />
                                </div>
                            </div>
                        ))}
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
                        }}></div>

                        {filteredDemands.map((d, i) => (
                            <motion.div
                                key={d.id}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => openDemandDetails(d)}
                                style={{
                                    position: 'absolute',
                                    top: `${20 + (i * 15)}%`,
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

            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                title="Detalhes da Demanda"
            >
                {selectedDemand && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <span style={{
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                background: selectedDemand.priority === 'high' ? '#fff5f5' : '#fffaf0',
                                color: selectedDemand.priority === 'high' ? '#e53e3e' : '#ed8936',
                                border: '1px solid currentColor'
                            }}>
                                {selectedDemand.category}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>ID: #{selectedDemand.id}2026</span>
                        </div>

                        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{selectedDemand.title}</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <MapPin size={18} style={{ color: 'var(--primary)' }} />
                                <span style={{ fontWeight: 600 }}>{selectedDemand.local}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Clock size={18} style={{ color: 'var(--primary)' }} />
                                <span>Registrado em: {selectedDemand.time}</span>
                            </div>
                        </div>

                        <div style={{ marginTop: '1rem', borderTop: '1px solid #edf2f7', paddingTop: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h4 style={{ margin: 0 }}>Monitoramento em Campo</h4>
                                <button
                                    onClick={() => setIsVisitModalOpen(true)}
                                    style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', background: 'var(--secondary)', border: 'none', padding: '6px 12px', borderRadius: '6px', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
                                >
                                    <Plus size={14} /> Registrar Visita
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {selectedDemand.visits.length === 0 ? (
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontStyle: 'italic' }}>Nenhuma visita registrada para esta demanda.</p>
                                ) : (
                                    selectedDemand.visits.map((visit: any) => (
                                        <div key={visit.id} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <User size={14} color="white" />
                                                    </div>
                                                    <div>
                                                        <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700 }}>{visit.responsible}</p>
                                                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-light)' }}>{visit.date}</p>
                                                    </div>
                                                </div>
                                                {visit.photo && (
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', border: '1px solid #cbd5e0' }}>
                                                        <img src={visit.photo} alt="Visit" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </div>
                                                )}
                                            </div>
                                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text)', lineHeight: '1.4' }}>{visit.notes}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <h4>Ações de Gabinete</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <button className="btn-primary" onClick={handleUpdateStatus}>
                                    {selectedDemand.status === 'resolved' ? 'Reabrir Demanda' : 'Marcar como Resolvido'}
                                </button>
                                <button className="btn-gold" onClick={handleCreateIndication}>Criar Indicação</button>
                            </div>
                        </div>
                    </div>
                )}
            </Drawer>

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
                <select value={responsible} onChange={(e) => setResponsible(e.target.value)}>
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
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <button className="btn-primary" style={{ background: '#edf2f7', color: 'var(--text)' }} onClick={onCancel}>Cancelar</button>
                <button className="btn-primary" onClick={() => onSubmit({ id: Date.now(), responsible, notes, date: 'Hoje', photo })}>Salvar Visita</button>
            </div>
        </div>
    );
};

export default DemandsPage;
