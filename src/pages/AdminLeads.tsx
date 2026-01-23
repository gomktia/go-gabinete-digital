
import { useState } from 'react';
import {
    Search, Mail, ArrowRight,
    MessageCircle, Star
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLeads = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const leads = [
        { id: 1, name: 'Dr. Augusto Freire', city: 'São Paulo/SP', status: 'Novo', quality: 'Alta', date: '2024-06-16', contact: 'WhatsApp' },
        { id: 2, name: 'Clara Vasconcelos', city: 'Curitiba/PR', status: 'Contactado', quality: 'Média', date: '2024-06-15', contact: 'Email' },
        { id: 3, name: 'Marcio Oliveira', city: 'Goiânia/GO', status: 'Trialing', quality: 'Alta', date: '2024-06-14', contact: 'Direct' },
        { id: 4, name: 'Helena Souza', city: 'Salvador/BA', status: 'Demo Agendada', quality: 'Alta', date: '2024-06-14', contact: 'WhatsApp' },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ paddingBottom: '3rem' }}>
            <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>🎯 Funil de <span className="text-gold">Leads & Expansão</span></h1>
                    <p style={{ color: 'var(--text-light)' }}>Gestão de prospecção e novos interessados na plataforma.</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div className="admin-card" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid var(--secondary)' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-light)' }}>CONVERSÃO ESTE MÊS</span>
                        <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--secondary)' }}>24.5%</span>
                    </div>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #667eea' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-light)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Novos Leads (24h)</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <h2 style={{ margin: 0, fontWeight: 800 }}>12</h2>
                        <span style={{ color: '#38a169', fontSize: '0.8rem', fontWeight: 700 }}>+15% vs ontem</span>
                    </div>
                </div>
                <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #d4af37' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-light)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Em Negociação</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <h2 style={{ margin: 0, fontWeight: 800 }}>45</h2>
                        <span style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>R$ 12.8k Potencial</span>
                    </div>
                </div>
                <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #38a169' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-light)', fontSize: '0.75rem', textTransform: 'uppercase' }}>Convertidos</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <h2 style={{ margin: 0, fontWeight: 800 }}>128</h2>
                        <span style={{ color: '#38a169', fontSize: '0.8rem', fontWeight: 700 }}>Recorde histórico!</span>
                    </div>
                </div>
            </div>

            <div className="glass-card" style={{ padding: 0 }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>Todos Leads</button>
                        <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem', background: 'transparent', border: '1px solid var(--border)' }}>Quentes</button>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                        <input
                            type="text"
                            placeholder="Buscar lead ou cidade..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{ padding: '8px 12px 8px 36px', borderRadius: '10px', width: '280px', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text)' }}
                        />
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'var(--bg-color)', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.7rem', color: 'var(--text-light)' }}>NOME CORRETO</th>
                                <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.7rem', color: 'var(--text-light)' }}>CIDADE/ESTADO</th>
                                <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.7rem', color: 'var(--text-light)' }}>QUALIDADE</th>
                                <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.7rem', color: 'var(--text-light)' }}>STATUS</th>
                                <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '0.7rem', color: 'var(--text-light)' }}>ORIGEM</th>
                                <th style={{ padding: '12px 20px', textAlign: 'right', fontSize: '0.7rem', color: 'var(--text-light)' }}>AÇÕES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.map(lead => (
                                <tr key={lead.id} style={{ borderBottom: '1px solid var(--border)' }} className="hover-row">
                                    <td style={{ padding: '16px 20px' }}>
                                        <div style={{ fontWeight: 800 }}>{lead.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>id: LD-00{lead.id}</div>
                                    </td>
                                    <td style={{ padding: '16px 20px', fontSize: '0.9rem' }}>{lead.city}</td>
                                    <td style={{ padding: '16px 20px' }}>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            {[1, 2, 3].map(s => <Star key={s} size={12} fill={lead.quality === 'Alta' ? '#d4af37' : s <= 2 ? '#d4af37' : 'transparent'} color="#d4af37" />)}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 20px' }}>
                                        <span style={{
                                            padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800,
                                            background: 'var(--bg-color)', color: 'var(--text)', border: '1px solid var(--border)'
                                        }}>
                                            {lead.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                                            {lead.contact === 'WhatsApp' ? <MessageCircle size={14} color="#25D366" /> : <Mail size={14} />}
                                            {lead.contact}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                        <button className="btn-gold" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                                            Atender <ArrowRight size={14} style={{ marginLeft: '4px' }} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminLeads;
