import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Map as MapIcon, Layers, Filter,
    Target, Users, AlertTriangle, Upload, X, Zap
} from 'lucide-react';
import { Modal } from '../components/UIComponents';
import { useTenant } from '../context/TenantContext';

interface ZoneStats {
    id: string;
    name: string;
    voters: number;
    demands: number;
    sentiment: number; // 0-100
    status: 'high' | 'medium' | 'low';
    coordinates: { top: string; left: string; width: string; height: string };
}

const VoterMap = () => {
    const { } = useTenant();
    const [selectedLayer, setSelectedLayer] = useState<'heat' | 'pins' | 'demands'>('heat');
    const [selectedZone, setSelectedZone] = useState<ZoneStats | null>(null);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Simulated data that would come from Supabase/PostGIS in a real implementation
    const zones: ZoneStats[] = [
        {
            id: '1',
            name: 'Bairro Centro',
            voters: 1250,
            demands: 45,
            sentiment: 82,
            status: 'high',
            coordinates: { top: '30%', left: '40%', width: '150px', height: '150px' }
        },
        {
            id: '2',
            name: 'Vila Norte',
            voters: 840,
            demands: 12,
            sentiment: 45,
            status: 'low',
            coordinates: { top: '10%', left: '20%', width: '120px', height: '120px' }
        },
        {
            id: '3',
            name: 'Jardim das Flores',
            voters: 2100,
            demands: 89,
            sentiment: 68,
            status: 'medium',
            coordinates: { top: '55%', left: '60%', width: '180px', height: '180px' }
        }
    ];

    const handleImportCSV = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulation of processing
        setTimeout(() => {
            setIsLoading(false);
            setIsImportModalOpen(false);
            alert("Dados do TRE importados com sucesso!\n\n+520 novos endereços geocodificados.");
        }, 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
            <header className="responsive-header" style={{ marginBottom: '1.5rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <div style={{
                            padding: '12px',
                            background: 'var(--primary)',
                            borderRadius: '16px',
                            color: 'var(--secondary)',
                            boxShadow: '0 8px 16px rgba(15,23,42,0.1)'
                        }}>
                            <MapIcon size={32} />
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Mapa da Mina (Geolocalização)</h1>
                    </div>
                    <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', fontWeight: 500 }}>
                        Visualização tática de votos, lideranças e demandas no território.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        className="btn-gold outline"
                        onClick={() => setIsImportModalOpen(true)}
                        style={{ borderRadius: '14px' }}
                    >
                        <Upload size={18} /> Importar Dados TRE
                    </button>
                    <button
                        className="btn-gold"
                        style={{ borderRadius: '14px' }}
                    >
                        <Filter size={18} /> Filtros Avançados
                    </button>
                </div>
            </header>

            {/* Map Container - Taking available space */}
            <div className="glass-card" style={{
                flex: 1,
                padding: 0,
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '600px'
            }}>
                {/* Map Controls */}
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    zIndex: 10,
                    background: 'rgba(15, 23, 42, 0.9)',
                    backdropFilter: 'blur(10px)',
                    padding: '8px',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                }}>
                    <button
                        onClick={() => setSelectedLayer('heat')}
                        style={{
                            padding: '10px',
                            borderRadius: '8px',
                            border: 'none',
                            background: selectedLayer === 'heat' ? 'var(--secondary)' : 'transparent',
                            color: selectedLayer === 'heat' ? 'var(--primary)' : 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontWeight: 700
                        }}
                    >
                        <Layers size={18} /> Mapa de Calor
                    </button>
                    <button
                        onClick={() => setSelectedLayer('pins')}
                        style={{
                            padding: '10px',
                            borderRadius: '8px',
                            border: 'none',
                            background: selectedLayer === 'pins' ? 'var(--secondary)' : 'transparent',
                            color: selectedLayer === 'pins' ? 'var(--primary)' : 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontWeight: 700
                        }}
                    >
                        <Target size={18} /> Lideranças
                    </button>
                    <button
                        onClick={() => setSelectedLayer('demands')}
                        style={{
                            padding: '10px',
                            borderRadius: '8px',
                            border: 'none',
                            background: selectedLayer === 'demands' ? 'var(--secondary)' : 'transparent',
                            color: selectedLayer === 'demands' ? 'var(--primary)' : 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontWeight: 700
                        }}
                    >
                        <AlertTriangle size={18} /> Demandas
                    </button>
                </div>

                {/* The "Map" - Simulated with CSS */}
                <div style={{
                    flex: 1,
                    background: '#0f172a',
                    backgroundImage: `
                        linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px',
                    position: 'relative',
                    cursor: 'grab'
                }}>
                    {/* Simulated River/Roads for realism */}
                    <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.3 }}>
                        <path d="M-10,300 Q150,250 400,400 T900,300 T1200,500" stroke="#3182ce" strokeWidth="20" fill="none" />
                        <path d="M200,800 Q400,600 600,600 T1000,400" stroke="rgba(255,255,255,0.1)" strokeWidth="10" fill="none" />
                        <path d="M50,-50 L300,300 L200,800" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                    </svg>

                    {/* Zones (Heatmap) */}
                    <AnimatePresence>
                        {zones.map((zone) => (
                            <motion.div
                                key={zone.id}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={() => setSelectedZone(zone)}
                                style={{
                                    position: 'absolute',
                                    top: zone.coordinates.top,
                                    left: zone.coordinates.left,
                                    width: zone.coordinates.width,
                                    height: zone.coordinates.height,
                                    borderRadius: '50%',
                                    background: zone.status === 'high'
                                        ? 'radial-gradient(circle, rgba(56, 161, 105, 0.6) 0%, rgba(56, 161, 105, 0) 70%)'
                                        : zone.status === 'low'
                                            ? 'radial-gradient(circle, rgba(229, 62, 62, 0.6) 0%, rgba(229, 62, 62, 0) 70%)'
                                            : 'radial-gradient(circle, rgba(237, 137, 54, 0.6) 0%, rgba(237, 137, 54, 0) 70%)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 5
                                }}
                                whileHover={{ scale: 1.1 }}
                            >
                                {selectedLayer === 'pins' && (
                                    <div style={{
                                        background: 'white',
                                        padding: '4px 8px',
                                        borderRadius: '8px',
                                        color: '#0f172a',
                                        fontWeight: 800,
                                        fontSize: '0.75rem',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        <Users size={12} /> {zone.voters}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Detail Panel Overlay */}
                <AnimatePresence>
                    {selectedZone && (
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 20 }}
                            style={{
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                bottom: 0,
                                width: '400px',
                                background: 'rgba(15, 23, 42, 0.95)',
                                backdropFilter: 'blur(20px)',
                                borderLeft: '1px solid var(--border)',
                                padding: '2rem',
                                zIndex: 20,
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>{selectedZone.name}</h2>
                                <button onClick={() => setSelectedZone(null)} className="close-btn" style={{ transform: 'none' }}>
                                    <X size={20} />
                                </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
                                    <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.6, fontWeight: 700 }}>ELEITORES</p>
                                    <p style={{ margin: '4px 0 0 0', fontSize: '1.5rem', fontWeight: 800 }}>{selectedZone.voters}</p>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
                                    <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.6, fontWeight: 700 }}>DEMANDAS</p>
                                    <p style={{ margin: '4px 0 0 0', fontSize: '1.5rem', fontWeight: 800 }}>{selectedZone.demands}</p>
                                </div>
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 700 }}>Clima Político</span>
                                    <span style={{ fontWeight: 800, color: selectedZone.sentiment > 70 ? '#38a169' : '#e53e3e' }}>
                                        {selectedZone.sentiment > 70 ? 'Favorável' : 'Crítico'} ({selectedZone.sentiment}%)
                                    </span>
                                </div>
                                <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${selectedZone.sentiment}%`,
                                        height: '100%',
                                        background: selectedZone.sentiment > 70 ? '#38a169' : '#e53e3e'
                                    }} />
                                </div>
                            </div>

                            <div style={{ marginTop: 'auto' }}>
                                <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Zap size={16} className="text-gold" /> Ações Recomendadas
                                </h4>
                                <button className="btn-gold" style={{ width: '100%', borderRadius: '12px', padding: '16px', marginBottom: '1rem' }}>
                                    Agendar Caminhada
                                </button>
                                <button className="btn-gold outline" style={{ width: '100%', borderRadius: '12px', padding: '16px' }}>
                                    Ver Lista de Lideranças
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Modal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} title="Importar Base do TRE">
                <div style={{ padding: '1rem' }}>
                    <div style={{
                        border: '2px dashed var(--border)',
                        borderRadius: '16px',
                        padding: '3rem',
                        textAlign: 'center',
                        marginBottom: '1.5rem',
                        cursor: 'pointer',
                        background: 'rgba(255,255,255,0.02)'
                    }}>
                        <Upload size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                        <p style={{ fontWeight: 700, margin: 0 }}>Arraste o arquivo .CSV aqui</p>
                        <p style={{ fontSize: '0.8rem', opacity: 0.5, margin: '8px 0 0 0' }}>Dados suportados: Nome, Endereço, Zona, Seção</p>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', fontSize: '0.8rem', opacity: 0.6, marginBottom: '2rem' }}>
                        <AlertTriangle size={16} color="orange" />
                        <span>Certifique-se que o arquivo esteja anonimizado conforme a LGPD caso contenha dados sensíveis.</span>
                    </div>

                    <button
                        onClick={handleImportCSV}
                        disabled={isLoading}
                        className="btn-gold"
                        style={{ width: '100%', padding: '16px', borderRadius: '14px', fontWeight: 800 }}
                    >
                        {isLoading ? 'Processando...' : 'Iniciar Importação e Geocodificação'}
                    </button>
                </div>
            </Modal>
        </motion.div>
    );
};

export default VoterMap;
