
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Shield } from 'lucide-react';
// import { useTenant } from '../context/TenantContext';

const SubscriptionPage = () => {
    // const { tenant } = useTenant(); // Keeping context available but commented out to pass build check
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

    const plans = [
        {
            id: 'starter',
            name: 'Vereador Digital',
            price: billingPeriod === 'monthly' ? 297 : 2970,
            features: [
                'Até 5.000 eleitores',
                'IA Básica (Sugestão de Pauta)',
                '1 Site de Mandato',
                'Gestão de Equipe (5 usuários)',
                'Suporte por email'
            ],
            recommended: false
        },
        {
            id: 'pro',
            name: 'Gabinete Pro',
            price: billingPeriod === 'monthly' ? 597 : 5970,
            features: [
                'Eleitores ilimitados',
                'IA Avançada (Radar de Verbas + Genealogia)',
                'Multi-sites e Landing Pages',
                'Disparos de WhatsApp (Integração)',
                'Gestão Financeira de Campanha',
                'Suporte Prioritário VIP',
                'Consultoria Mensal (30min)'
            ],
            recommended: true
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ paddingBottom: '4rem' }}
        >
            <header className="responsive-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Invista no seu Mandato</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-light)', maxWidth: '600px', margin: '0 auto' }}>
                    Desbloqueie todo o poder da Inteligência Artificial e garanta sua reeleição com as ferramentas certas.
                </p>

                <div style={{
                    display: 'inline-flex',
                    background: 'var(--surface)',
                    padding: '4px',
                    borderRadius: '100px',
                    marginTop: '2rem',
                    border: '1px solid var(--border)'
                }}>
                    <button
                        onClick={() => setBillingPeriod('monthly')}
                        style={{
                            padding: '8px 24px',
                            borderRadius: '100px',
                            border: 'none',
                            background: billingPeriod === 'monthly' ? 'var(--primary)' : 'transparent',
                            color: billingPeriod === 'monthly' ? 'var(--secondary)' : 'var(--text-light)',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                        }}
                    >
                        Mensal
                    </button>
                    <button
                        onClick={() => setBillingPeriod('yearly')}
                        style={{
                            padding: '8px 24px',
                            borderRadius: '100px',
                            border: 'none',
                            background: billingPeriod === 'yearly' ? 'var(--primary)' : 'transparent',
                            color: billingPeriod === 'yearly' ? 'var(--secondary)' : 'var(--text-light)',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            display: 'flex', alignItems: 'center', gap: '6px'
                        }}
                    >
                        Anual <span style={{ fontSize: '0.7rem', background: '#38a169', color: 'white', padding: '1px 6px', borderRadius: '10px' }}>-20%</span>
                    </button>
                </div>
            </header>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                maxWidth: '900px',
                margin: '0 auto 4rem'
            }}>
                {plans.map(plan => (
                    <div
                        key={plan.id}
                        className="glass-card"
                        style={{
                            padding: '2rem',
                            border: plan.recommended ? '2px solid var(--secondary)' : '1px solid var(--border)',
                            position: 'relative',
                            transform: plan.recommended ? 'scale(1.05)' : 'none',
                            zIndex: plan.recommended ? 2 : 1,
                            background: plan.recommended ? 'linear-gradient(180deg, rgba(212,175,55,0.05) 0%, var(--surface) 100%)' : 'var(--surface)'
                        }}
                    >
                        {plan.recommended && (
                            <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--secondary)', color: 'var(--primary)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 800 }}>
                                MAIS POPULAR
                            </div>
                        )}

                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{plan.name}</h3>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '2rem' }}>
                            <span style={{ fontSize: '1rem', color: 'var(--text-light)' }}>R$</span>
                            <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text)' }}>{plan.price}</span>
                            <span style={{ fontSize: '1rem', color: 'var(--text-light)' }}>/{billingPeriod === 'monthly' ? 'mês' : 'ano'}</span>
                        </div>

                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {plan.features.map((feat, idx) => (
                                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', color: 'var(--text)' }}>
                                    <CheckCircle size={18} color={plan.recommended ? 'var(--secondary)' : '#38a169'} />
                                    {feat}
                                </li>
                            ))}
                        </ul>

                        <button
                            className="btn-gold"
                            style={{
                                width: '100%',
                                padding: '16px',
                                fontSize: '1rem',
                                fontWeight: 800,
                                background: plan.recommended ? 'linear-gradient(135deg, #d4af37 0%, #aa8c2c 100%)' : 'var(--bg-color)',
                                color: plan.recommended ? '#fff' : 'var(--text)',
                                border: plan.recommended ? 'none' : '1px solid var(--border)'
                            }}
                            onClick={() => window.open('https://link.com/checkout/demo', '_blank')}
                        >
                            Assinar Agora
                        </button>
                    </div>
                ))}
            </div>

            {/* Integration Badges */}
            <div style={{ textAlign: 'center', opacity: 0.6 }}>
                <p style={{ marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 600 }}>PAGAMENTO SEGURO VIA</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', alignItems: 'center', filter: 'grayscale(100%)' }}>
                    {/* Primitives for logos */}
                    <span style={{ fontWeight: 800, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Shield size={18} /> Stripe</span>
                    <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>Kiwify</span>
                    <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>Asaas</span>
                </div>
            </div>

        </motion.div>
    );
};

export default SubscriptionPage;
