import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Flag, MapPin, Truck, ShieldCheck, AlertOctagon,
    Phone
} from 'lucide-react';
import { Modal } from '../components/UIComponents';

const ElectionDay = () => {
    const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

    const issues = [
        { id: 1, type: 'Urna', location: 'Escola Maria Silva - Seção 102', status: 'pending', time: '10:30', description: 'Urna travando constantemente.' },
        { id: 2, type: 'Legal', location: 'Colégio Estadual', status: 'resolved', time: '09:15', description: 'Boca de urna detectada próxima ao local.' },
        { id: 3, type: 'Logística', location: 'Bairro Santa Rita', status: 'pending', time: '11:00', description: 'Motorista não compareceu para buscar fiscais.' },
    ];

    const stats = [
        { label: 'Fiscais Alocados', value: '142 / 150', icon: ShieldCheck, color: '#38a169' },
        { label: 'Carros em Rota', value: '18', icon: Truck, color: '#3182ce' },
        { label: 'Ocorrências Ativas', value: '2', icon: AlertOctagon, color: '#e53e3e' },
        { label: 'Bairros Cobertos', value: '100%', icon: MapPin, color: '#d4af37' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <div style={{ padding: '0.5rem', background: 'var(--primary)', borderRadius: '0.5rem', color: 'var(--secondary)' }}>
                            <Flag size={32} />
                        </div>
                        <h1>Operação Dia D</h1>
                    </div>
                    <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
                        Centro de comando para o dia da eleição. Monitoramento em tempo real.
                    </p>
                </div>
                <button
                    className="btn-gold"
                    onClick={() => setIsIssueModalOpen(true)}
                    style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: '#e53e3e', borderColor: '#e53e3e', color: 'white' }}
                >
                    <AlertOctagon size={18} /> Reportar Ocorrência
                </button>
            </header>

            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {stats.map((stat, i) => (
                    <div key={i} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
                        <div style={{ padding: '0.75rem', background: `${stat.color} 15`, borderRadius: '50%', color: stat.color }}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{stat.value}</h3>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-light)' }}>{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div className="glass-card">
                    <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                        {['Monitoramento', 'Escolas/Seções', 'Equipe'].map(tab => (
                            <button
                                key={tab}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'white',
                                    fontWeight: 600,
                                    opacity: 0.8,
                                    cursor: 'pointer',
                                    paddingBottom: '0.5rem'
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <h3 style={{ marginBottom: '1rem' }}>Ocorrências Recentes</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {issues.map((issue) => (
                            <div key={issue.id} style={{
                                display: 'flex',
                                gap: '1rem',
                                padding: '1rem',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '0.5rem',
                                borderLeft: `4px solid ${issue.status === 'resolved' ? '#38a169' : '#e53e3e'} `
                            }}>
                                <div style={{ minWidth: '60px', textAlign: 'center' }}>
                                    <span style={{ display: 'block', fontWeight: 700, fontSize: '0.9rem' }}>{issue.time}</span>
                                    <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>Hoje</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                        <h4 style={{ margin: 0 }}>{issue.type}</h4>
                                        <span style={{
                                            fontSize: '0.7rem',
                                            background: issue.status === 'resolved' ? '#38a169' : '#e53e3e',
                                            padding: '2px 6px',
                                            borderRadius: '4px'
                                        }}>
                                            {issue.status === 'resolved' ? 'Resolvido' : 'Pendente'}
                                        </span>
                                    </div>
                                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', opacity: 0.8 }}>{issue.description}</p>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.8rem', opacity: 0.6 }}>
                                        <MapPin size={14} /> {issue.location}
                                    </div>
                                </div>
                                <button className="icon-btn" title="Ver Detalhes">
                                    <Phone size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-card" style={{ background: '#2d3748' }}>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Truck size={20} /> Logística de Transporte
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                <span>Zona Norte (Kombis)</span>
                                <span style={{ color: '#38a169' }}>Em rota</span>
                            </div>
                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                                <div style={{ width: '80%', height: '100%', background: '#38a169', borderRadius: '3px' }}></div>
                            </div>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                <span>Centro (Vans)</span>
                                <span style={{ color: '#d69e2e' }}>Aguardando</span>
                            </div>
                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                                <div style={{ width: '40%', height: '100%', background: '#d69e2e', borderRadius: '3px' }}></div>
                            </div>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                <span>Rural (Carros Particul.)</span>
                                <span style={{ color: '#3182ce' }}>Finalizado (Manhã)</span>
                            </div>
                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                                <div style={{ width: '100%', height: '100%', background: '#3182ce', borderRadius: '3px' }}></div>
                            </div>
                        </div>

                        <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem' }}>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#fc8181', display: 'flex', gap: '0.5rem' }}>
                                <AlertOctagon size={16} /> Alerta: Van 04 (Placa ABC-1234) parada na Zona Sul por problema mecânico.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={isIssueModalOpen} onClose={() => setIsIssueModalOpen(false)} title="Reportar Ocorrência Urgente">
                <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Tipo de Problema</label>
                        <select className="form-input" style={{ width: '100%' }}>
                            <option>Urna com Defeito</option>
                            <option>Fiscal Impedido</option>
                            <option>Boca de Urna (Adversário)</option>
                            <option>Transporte/Logística</option>
                            <option>Alimentação da Equipe</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Local (Escola/Seção)</label>
                        <input type="text" className="form-input" placeholder="Ex: Escola Estadual..." style={{ width: '100%' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Descrição</label>
                        <textarea className="form-input" style={{ width: '100%', minHeight: '100px', resize: 'none' }} placeholder="Descreva o que está acontecendo..."></textarea>
                    </div>

                    <button className="btn-gold" style={{ marginTop: '1rem', background: '#e53e3e', borderColor: '#e53e3e', color: 'white' }} onClick={() => setIsIssueModalOpen(false)}>
                        <AlertOctagon size={18} style={{ marginRight: '0.5rem' }} /> Enviar Alerta Máximo
                    </button>
                </form>
            </Modal>
        </motion.div>
    );
};

export default ElectionDay;
