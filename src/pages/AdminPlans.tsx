
import { useState } from 'react';
import {
    Package, Check, Edit, Plus,
    Trash2, ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminPlans = () => {
    const [plans] = useState([
        {
            id: 'starter', name: 'Gabinete Starter', price: 297, interval: 'mês',
            active: true, users: 3, features: ['WhatsApp CRM', 'Gestão de Demandas', 'Site do Mandato'], color: '#3182ce'
        },
        {
            id: 'pro', name: 'Gabinete Pro', price: 597, interval: 'mês',
            active: true, users: 10, features: ['Tudo do Starter', 'Inteligência Artificial', 'Mapa de Votação', 'Radar de Verbas'], color: '#667eea', recommended: true
        },
        {
            id: 'enterprise', name: 'Enterprise Master', price: 1297, interval: 'mês',
            active: true, users: 50, features: ['Tudo do Pro', 'Suporte VIP 24/7', 'API Aberta', 'Personalização White-label'], color: '#d4af37'
        },
    ]);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ paddingBottom: '3rem' }}>
            <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>📦 Gestão de <span className="text-gold">Planos & Tiers</span></h1>
                    <p style={{ color: 'var(--text-light)' }}>Configure os limites, preços e funcionalidades de cada oferta SaaS.</p>
                </div>
                <button className="btn-gold">
                    <Plus size={20} /> Novo Plano
                </button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                {plans.map((plan, idx) => (
                    <div key={idx} className="glass-card" style={{
                        padding: '2rem',
                        position: 'relative',
                        border: plan.recommended ? `2px solid ${plan.color}` : '1px solid var(--border)',
                        boxShadow: plan.recommended ? `0 10px 30px ${plan.color}20` : 'var(--shadow-sm)'
                    }}>
                        {plan.recommended && (
                            <div style={{
                                position: 'absolute', top: '-12px', right: '20px',
                                background: plan.color, color: 'white', padding: '4px 12px',
                                borderRadius: '20px', fontSize: '0.7rem', fontWeight: 800
                            }}>
                                RECOMENDADO
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <div style={{ background: `${plan.color}15`, padding: '10px', borderRadius: '12px', color: plan.color }}>
                                <Package size={24} />
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button style={{ padding: '6px', background: 'var(--bg-color)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', color: 'var(--text)' }}><Edit size={16} /></button>
                                <button style={{ padding: '6px', background: 'var(--bg-color)', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', color: '#e53e3e' }}><Trash2 size={16} /></button>
                            </div>
                        </div>

                        <h3 style={{ margin: '0 0 5px 0', fontSize: '1.4rem', fontWeight: 800 }}>{plan.name}</h3>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', marginBottom: '2rem' }}>
                            <span style={{ fontSize: '2rem', fontWeight: 800 }}>R$ {plan.price}</span>
                            <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>/{plan.interval}</span>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <p style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '1rem' }}>Limites & Entregas</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ background: '#38a16920', padding: '4px', borderRadius: '4px' }}><Check size={14} color="#38a169" /></div>
                                    <span style={{ fontSize: '0.9rem' }}>Até <b>{plan.users} usuários</b> inclusos</span>
                                </div>
                                {plan.features.map((f, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ background: '#38a16920', padding: '4px', borderRadius: '4px' }}><Check size={14} color="#38a169" /></div>
                                        <span style={{ fontSize: '0.9rem' }}>{f}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-light)', fontWeight: 700 }}>CLIENTES ATIVOS</p>
                                <h4 style={{ margin: 0, fontWeight: 800 }}>{idx === 0 ? 42 : idx === 1 ? 84 : 15} Gabinetes</h4>
                            </div>
                            <ArrowUpRight size={20} color="var(--text-light)" />
                        </div>
                    </div>
                ))}

                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', padding: '2rem', border: '2px dashed var(--border)',
                    background: 'transparent', cursor: 'pointer', transition: 'all 0.2s'
                }} className="glass-card hover-lift">
                    <Plus size={48} color="var(--text-light)" style={{ marginBottom: '1rem' }} />
                    <h3 style={{ margin: 0, color: 'var(--text-light)' }}>Criar Promoção / Cupom</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', textAlign: 'center' }}>Clique aqui para configurar descontos sazonais.</p>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminPlans;
