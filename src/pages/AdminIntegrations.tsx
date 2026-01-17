
import { useState } from 'react';
import {
    Zap, Globe, Shield, MessageSquare, Database,
    Settings, CheckCircle, AlertTriangle, RefreshCw,
    ExternalLink, Code
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminIntegrations = () => {
    const [integrations, setIntegrations] = useState([
        { id: 'wa-gateway', name: 'WhatsApp Gateway (Baileys/Evo)', status: 'online', latency: '120ms', icon: MessageSquare, color: '#25D366' },
        { id: 'stripe', name: 'Stripe Payments', status: 'online', latency: '45ms', icon: Shield, color: '#635bff' },
        { id: 'openai', name: 'OpenAI GPT-4o', status: 'online', latency: '1.2s', icon: Zap, color: '#10a37f' },
        { id: 'supabase', name: 'Supabase DB & Storage', status: 'online', latency: '30ms', icon: Database, color: '#3ecf8e' },
        { id: 'maps', name: 'Google Maps API', status: 'offline', latency: '-', icon: Globe, color: '#4285F4' },
    ]);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ paddingBottom: '3rem' }}>
            <header style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>⚙️ Portal de <span className="text-gold">Integrações Master</span></h1>
                <p style={{ color: 'var(--text-light)' }}>Monitoramento técnico e configuração das APIs críticas do ecossistema.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {integrations.map(integ => (
                    <div key={integ.id} className="glass-card" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: integ.color }}></div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <div style={{ background: `${integ.color}15`, padding: '10px', borderRadius: '12px', color: integ.color }}>
                                    <integ.icon size={22} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>{integ.name}</h3>
                                    <span style={{ fontSize: '0.75rem', color: integ.status === 'online' ? '#38a169' : '#e53e3e', fontWeight: 700 }}>
                                        {integ.status === 'online' ? 'OPERACIONAL' : 'INSTÁVEL'}
                                    </span>
                                </div>
                            </div>
                            <button style={{ background: 'transparent', border: 'none', color: 'var(--text-light)', cursor: 'pointer' }}>
                                <Settings size={18} />
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--bg-color)', padding: '12px', borderRadius: '12px' }}>
                            <div>
                                <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 800 }}>Latência</p>
                                <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem' }}>{integ.latency}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-light)', textTransform: 'uppercase', fontWeight: 800 }}>Uptime</p>
                                <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#38a169' }}>99.9%</p>
                            </div>
                        </div>

                        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '10px' }}>
                            <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem', flex: 1 }}>
                                <RefreshCw size={14} style={{ marginRight: '6px' }} /> Testar Link
                            </button>
                            <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem', flex: 1, border: '1px solid var(--border)', background: 'transparent' }}>
                                <Code size={14} style={{ marginRight: '6px' }} /> Logs
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                    <Settings size={22} className="text-gold" />
                    <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>Configuração de Webhooks Global</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {[
                        { label: 'Notificação de Assinatura (Stripe)', url: 'https://api.gabinetedigital.com/v1/webhooks/stripe' },
                        { label: 'Recebimento de Mensagens (Zap)', url: 'https://api.gabinetedigital.com/v1/webhooks/whatsapp' },
                    ].map((w, i) => (
                        <div key={i} className="form-group" style={{ margin: 0 }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-light)' }}>{w.label}</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    type="text"
                                    value={w.url}
                                    readOnly
                                    style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'var(--bg-color)', border: '1px solid var(--border)', color: 'var(--text)', fontSize: '0.9rem' }}
                                />
                                <button className="btn-gold" style={{ padding: '8px 15px' }}>Copiar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default AdminIntegrations;
