
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTenant } from '../context/TenantContext';
import { supabase } from '../lib/supabase';
import {
    Users, Building2, Flag, ArrowRight, LandPlot
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const officeTypes = [
    {
        id: 'city_councilor',
        title: 'Vereador',
        icon: Users,
        description: 'Legislativo Municipal. Foco em demandas, leis e fiscalização.',
        color: '#667eea'
    },
    {
        id: 'mayor',
        title: 'Prefeito / Executivo',
        icon: Building2,
        description: 'Gestão Municipal. Foco em obras, secretarias e entregas.',
        color: '#38a169'
    },
    {
        id: 'state_deputy',
        title: 'Deputado Estadual',
        icon: LandPlot,
        description: 'Legislativo Estadual. Foco em emendas e região.',
        color: '#d69e2e'
    },
    {
        id: 'federal_deputy',
        title: 'Deputado Federal',
        icon: Flag,
        description: 'Legislativo Federal. Foco em recursos e articulação macro.',
        color: '#3182ce'
    }
];

const OnboardingSetup = () => {
    const { tenant, updateTenant } = useTenant();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        state: '',
        city: '',
        party: ''
    });

    const handleNext = async () => {
        if (!selectedType) return;

        setLoading(true);
        try {
            // 1. Update Tenant Database
            const { error } = await supabase
                .from('tenants')
                .update({
                    name: formData.name || `Gabinete ${officeTypes.find(t => t.id === selectedType)?.title}`,
                    office_type: selectedType,
                    party_name: formData.party,
                    settings: {
                        ...tenant, // keep existing settings
                        onboarding_completed: true // Mark as done
                    }
                })
                .eq('id', tenant.id);

            if (error) throw error;

            // 2. Update Local Context
            updateTenant({
                name: formData.name,
                officeType: selectedType as any,
                partyName: formData.party
            });

            // 3. Navigate to Dashboard with new context
            navigate('/');

        } catch (error) {
            console.error('Error in onboarding:', error);
            alert('Erro ao salvar configurações.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--bg-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card"
                style={{
                    maxWidth: '900px',
                    width: '100%',
                    padding: '3rem',
                    background: 'var(--surface)',
                    border: '1px solid var(--border)'
                }}
            >
                {step === 1 && (
                    <>
                        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Bem-vindo ao Gabinete Digital</h1>
                            <p style={{ fontSize: '1.2rem', color: 'var(--text-light)' }}>
                                Vamos personalizar o sistema para o seu mandato. Qual é o seu cargo?
                            </p>
                        </header>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '1.5rem',
                            marginBottom: '3rem'
                        }}>
                            {officeTypes.map(type => (
                                <motion.div
                                    key={type.id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedType(type.id)}
                                    style={{
                                        cursor: 'pointer',
                                        padding: '1.5rem',
                                        borderRadius: '1rem',
                                        background: selectedType === type.id ? `${type.color}20` : 'var(--bg-color)',
                                        border: `2px solid ${selectedType === type.id ? type.color : 'transparent'}`,
                                        textAlign: 'center',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{
                                        width: '60px', height: '60px',
                                        borderRadius: '50%',
                                        background: type.color,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        margin: '0 auto 1rem',
                                        color: 'white'
                                    }}>
                                        <type.icon size={28} />
                                    </div>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{type.title}</h3>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{type.description}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <button
                                className="btn-primary"
                                disabled={!selectedType}
                                onClick={() => setStep(2)}
                                style={{
                                    opacity: selectedType ? 1 : 0.5,
                                    fontSize: '1.2rem',
                                    padding: '12px 32px'
                                }}
                            >
                                Continuar <ArrowRight size={20} style={{ marginLeft: '8px' }} />
                            </button>
                        </div>
                    </>
                )}

                {step === 2 && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Quase lá!</h1>
                            <p style={{ fontSize: '1.2rem', color: 'var(--text-light)' }}>
                                Configure os detalhes do seu gabinete.
                            </p>
                        </header>

                        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                            <div className="form-group">
                                <label>Nome do Parlamentar / Gabinete</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Ex: Gabinete Vereador João"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Estado (UF)</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="SP"
                                        maxLength={2}
                                        value={formData.state}
                                        onChange={e => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Cidade (Base)</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="São Paulo"
                                        value={formData.city}
                                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Partido (Opcional)</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Ex: PARTIDO X"
                                    value={formData.party}
                                    onChange={e => setFormData({ ...formData, party: e.target.value })}
                                />
                            </div>

                            <button
                                className="btn-gold"
                                onClick={handleNext}
                                disabled={loading || !formData.name}
                                style={{ width: '100%', marginTop: '2rem', padding: '16px', fontSize: '1.1rem' }}
                            >
                                {loading ? 'Configurando...' : 'Finalizar Configuração'}
                            </button>

                            <button
                                onClick={() => setStep(1)}
                                style={{
                                    background: 'none', border: 'none', color: 'var(--text-light)',
                                    width: '100%', marginTop: '1rem', cursor: 'pointer'
                                }}
                            >
                                Voltar
                            </button>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default OnboardingSetup;
