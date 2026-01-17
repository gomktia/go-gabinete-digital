
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import {
    Radar, Search, ExternalLink, ArrowRight,
    DollarSign
} from 'lucide-react';

interface Opportunity {
    id: string;
    title: string;
    source: string; // e.g., 'Diário Oficial da União', 'Governo do Estado'
    type: 'edital' | 'verba' | 'emenda';
    date: string;
    description: string;
    amount?: string;
    status: 'new' | 'analyzed' | 'archived';
    tags: string[];
}

const VerbasRadar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [loading, setLoading] = useState(true);
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

    useEffect(() => {
        fetchOpportunities();
    }, []);

    const fetchOpportunities = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('funding_opportunities')
                .select('*')
                .order('date', { ascending: false });

            if (error) throw error;

            // Map DB fields to Interface if needed (but we matched them in migration)
            setOpportunities(data as any || []);
        } catch (err) {
            console.error('Error fetching radar:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredOpps = opportunities.filter(opp => {
        const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            opp.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || opp.type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
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
                            <Radar size={32} />
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Radar de Verbas</h1>
                    </div>
                    <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', fontWeight: 500 }}>
                        Monitoramento automático de editais, emendas e diários oficiais.
                    </p>
                </div>
            </header>

            {/* Controls */}
            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ flex: 1, position: 'relative', minWidth: '300px' }}>
                    <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                    <input
                        type="text"
                        placeholder="Buscar por pavimentação, saúde, cultura..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '1rem 1rem 1rem 3rem',
                            borderRadius: '12px',
                            border: '1px solid var(--border)',
                            background: 'var(--bg-color)',
                            fontSize: '1rem'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['all', 'edital', 'verba', 'emenda'].map(type => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            style={{
                                padding: '0.75rem 1.5rem',
                                borderRadius: '12px',
                                border: '1px solid',
                                borderColor: filterType === type ? 'var(--primary)' : 'var(--border)',
                                background: filterType === type ? 'var(--primary)' : 'transparent',
                                color: filterType === type ? 'var(--secondary)' : 'var(--text-light)',
                                fontWeight: 700,
                                textTransform: 'capitalize',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {type === 'all' ? 'Todos' : type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Grid */}
            {loading ? (
                <div style={{ padding: '4rem', textAlign: 'center' }}>
                    <div style={{ display: 'inline-block', padding: '2rem', background: 'rgba(212,175,55,0.05)', borderRadius: '50%', marginBottom: '1rem' }}>
                        <Radar id="radar-spin" size={48} className="text-gold" />
                    </div>
                    <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Escaneando Diários Oficiais...</p>
                    <style>{`
                        #radar-spin { animation: spin 2s linear infinite; }
                        @keyframes spin { 100% { transform: rotate(360deg); } }
                    `}</style>
                </div>
            ) : filteredOpps.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.6 }}>
                    <p>Nenhuma oportunidade encontrada com esses filtros.</p>
                </div>
            ) : (
                <div className="responsive-grid">
                    {filteredOpps.map(opp => (
                        <motion.div
                            key={opp.id}
                            whileHover={{ y: -5 }}
                            className="glass-card"
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                borderLeft: opp.type === 'edital' ? '4px solid #3182ce' : opp.type === 'verba' ? '4px solid #38a169' : '4px solid #d4af37'
                            }}
                        >
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 800,
                                        textTransform: 'uppercase',
                                        padding: '4px 8px',
                                        borderRadius: '6px',
                                        background: 'var(--bg-color)',
                                        border: '1px solid var(--border)'
                                    }}>
                                        {opp.source}
                                    </span>
                                    {opp.status === 'new' && (
                                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Radar size={12} /> NOVO
                                        </span>
                                    )}
                                </div>

                                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 700 }}>{opp.title}</h3>

                                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                                    {opp.description}
                                </p>

                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                                    {opp.tags.map(tag => (
                                        <span key={tag} style={{ fontSize: '0.75rem', padding: '2px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 800, color: '#38a169' }}>
                                    <DollarSign size={20} />
                                    {opp.amount}
                                </div>

                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                                        <ExternalLink size={16} /> Ver Edital
                                    </button>
                                    <button className="btn-gold outline" style={{ padding: '0.75rem' }}>
                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default VerbasRadar;
