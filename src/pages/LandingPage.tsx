
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    CheckCircle, Users, Building2,
    ArrowRight, Map, Radar, Brain, DollarSign,
    Target, Layout, Star, Menu, X
} from 'lucide-react';
import { useRef, useState } from 'react';

const LandingPage = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

    const features = [
        {
            icon: Users,
            title: "CRM Estratégico",
            desc: "Base de dados segmentada por bairro, interesse e nível de fidelidade.",
        },
        {
            icon: Radar,
            title: "Radar de Verbas",
            desc: "Motor de busca que varre editais em busca de recursos federais.",
        },
        {
            icon: Brain,
            title: "Assessoria por I.A.",
            desc: "Redação de discursos e conteúdo político treinado especificamente.",
        },
        {
            icon: Map,
            title: "Mapa de Calor",
            desc: "Visualize onde está sua força e onde precisa intensificar presença.",
        }
    ];

    const modules = [
        {
            title: "Comando Central",
            icon: Layout,
            details: "Visão 360º do mandato. Gráficos de desempenho e alertas de urgência.",
            color: "#d4af37"
        },
        {
            title: "Demandas",
            icon: Target,
            details: "Centralize pedidos e indicações com rastreabilidade total.",
            color: "#3182ce"
        },
        {
            title: "Financeiro",
            icon: DollarSign,
            details: "Controle de gastos rigoroso com alertas de limites do TSE.",
            color: "#38a169"
        },
        {
            title: "Genealogia",
            icon: Star,
            details: "Entenda a ramificação do seu poder e a eficiência da sua equipe.",
            color: "#805ad5"
        }
    ];

    return (
        <div style={{ background: '#ffffff', minHeight: '100vh', color: '#1e293b', overflowX: 'hidden', fontFamily: "'Outfit', 'Inter', sans-serif" }}>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
                
                :root {
                    --primary: #0f172a;
                    --secondary: #d4af37;
                    --text: #1e293b;
                    --text-light: #64748b;
                    --surface: #f8fafc;
                    --border: rgba(15, 23, 42, 0.08);
                }

                .glass-nav {
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid var(--border);
                }

                .gold-text {
                    background: linear-gradient(135deg, #b8860b 0%, #d4af37 50%, #854d0e 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .hero-gradient {
                    background: radial-gradient(circle at top right, rgba(212, 175, 55, 0.08) 0%, transparent 40%),
                                radial-gradient(circle at bottom left, rgba(49, 130, 206, 0.05) 0%, transparent 40%);
                }

                .feature-card {
                    background: white;
                    border: 1px solid var(--border);
                    transition: all 0.3s ease;
                }

                .feature-card:hover {
                    border-color: var(--secondary);
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px rgba(15, 23, 42, 0.05);
                }

                .gold-button {
                    background: var(--primary);
                    color: white;
                    transition: all 0.3s ease;
                }

                .gold-button:hover {
                    transform: translateY(-2px);
                    background: #1e293b;
                    box-shadow: 0 10px 20px rgba(15, 23, 42, 0.1);
                }

                .nav-link {
                    color: var(--text-light);
                    font-weight: 600;
                    text-decoration: none;
                    font-size: 0.9rem;
                    transition: color 0.2s;
                }

                .nav-link:hover {
                    color: var(--primary);
                }

                @media (max-width: 768px) {
                    .mobile-hide { display: none !important; }
                    .mobile-show { display: flex !important; }
                    .grid-mobile-1 { grid-template-columns: 1fr !important; }
                    .hero-text { font-size: 2.8rem !important; }
                    .section-padding { padding: 60px 20px !important; }
                }

                .mobile-menu {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: white;
                    z-index: 2000;
                    display: flex;
                    flex-direction: column;
                    padding: 40px;
                    gap: 2rem;
                }
            `}</style>

            {/* Navigation */}
            <nav className="glass-nav" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, padding: '0.8rem 1.5rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            width: '36px', height: '36px', background: 'var(--primary)',
                            borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Building2 color="#d4af37" size={20} />
                        </div>
                        <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.5px', color: 'var(--primary)' }}>
                            Gabinete<span className="gold-text">Digital</span>
                        </span>
                    </div>

                    <div className="mobile-hide" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <a href="#solucao" className="nav-link">Solução</a>
                        <a href="#modulos" className="nav-link">Módulos</a>
                        <a href="#precos" className="nav-link">Planos</a>
                        <button
                            onClick={() => navigate('/login')}
                            className="gold-button"
                            style={{
                                padding: '0.6rem 1.2rem', borderRadius: '10px', border: 'none',
                                fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem'
                            }}
                        >
                            Área do Cliente
                        </button>
                    </div>

                    <button
                        className="mobile-show"
                        style={{ display: 'none', background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}
                        onClick={() => setIsMenuOpen(true)}
                    >
                        <Menu size={28} />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className="mobile-menu"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={() => setIsMenuOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--primary)' }}>
                                <X size={32} />
                            </button>
                        </div>
                        <a href="#solucao" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '2rem', fontWeight: 800, textDecoration: 'none', color: 'var(--primary)' }}>Solução</a>
                        <a href="#modulos" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '2rem', fontWeight: 800, textDecoration: 'none', color: 'var(--primary)' }}>Módulos</a>
                        <a href="#precos" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '2rem', fontWeight: 800, textDecoration: 'none', color: 'var(--primary)' }}>Planos</a>
                        <button
                            onClick={() => navigate('/login')}
                            className="gold-button"
                            style={{ padding: '1.2rem', borderRadius: '14px', fontSize: '1.2rem', fontWeight: 800 }}
                        >
                            Entrar no Sistema
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <section ref={targetRef} className="hero-gradient section-padding" style={{
                padding: '140px 20px 80px',
                textAlign: 'center'
            }}>
                <motion.div style={{ opacity, scale }}>
                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                display: 'inline-block',
                                marginBottom: '1.5rem',
                                padding: '6px 14px',
                                borderRadius: '30px',
                                background: 'white',
                                color: '#d4af37',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                letterSpacing: '1.5px',
                                textTransform: 'uppercase',
                                border: '1px solid var(--border)',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.03)'
                            }}
                        >
                            🏛️ Líder em Inteligência Política
                        </motion.span>

                        <h1 className="hero-text" style={{
                            fontSize: 'clamp(2.8rem, 8vw, 5rem)',
                            fontWeight: 800,
                            lineHeight: 1.1,
                            marginBottom: '1.5rem',
                            letterSpacing: '-1.5px',
                            color: 'var(--primary)'
                        }}>
                            Governe com a Força da<br />
                            <span className="gold-text">Tecnologia de Ponta.</span>
                        </h1>

                        <p style={{
                            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                            color: 'var(--text-light)',
                            lineHeight: 1.6,
                            marginBottom: '3rem',
                            maxWidth: '850px',
                            margin: '0 auto 3rem'
                        }}>
                            A plataforma definitiva para digitalizar seu gabinete, transformar apoiadores em votos fiéis e captar recursos de forma estratégica.
                        </p>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => navigate('/login')}
                                className="gold-button"
                                style={{
                                    padding: '1.2rem 2.8rem', fontSize: '1.1rem', fontWeight: 800,
                                    borderRadius: '16px', border: 'none', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '10px'
                                }}
                            >
                                Começar Trial Grátis <ArrowRight size={20} />
                            </button>
                            <button
                                onClick={() => document.getElementById('precos')?.scrollIntoView({ behavior: 'smooth' })}
                                style={{
                                    padding: '1.2rem 2.8rem', fontSize: '1.1rem', fontWeight: 800,
                                    borderRadius: '16px', border: '1px solid var(--border)',
                                    background: 'white', color: 'var(--primary)', cursor: 'pointer',
                                    boxShadow: '0 10px 20px rgba(0,0,0,0.03)'
                                }}
                            >
                                Ver Planos
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Simplified System Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    style={{
                        marginTop: '60px',
                        maxWidth: '1100px',
                        margin: '60px auto 0',
                        position: 'relative',
                        padding: '0 10px'
                    }}
                >
                    <img
                        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200"
                        alt="Interface do Sistema"
                        style={{
                            width: '100%',
                            borderRadius: '20px',
                            boxShadow: '0 40px 80px rgba(15, 23, 42, 0.08)',
                            border: '1px solid var(--border)',
                            display: 'block'
                        }}
                    />
                </motion.div>
            </section>

            {/* Features (Grid Responsive) */}
            <section id="solucao" className="section-padding" style={{ padding: '100px 20px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div className="grid-mobile-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--primary)' }}>
                                Gestão Profissional para Mandatos Modernos.
                            </h2>
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-light)', lineHeight: 1.7, marginBottom: '2rem' }}>
                                O Gabinete Digital centraliza toda a operação em um único lugar, permitindo que você foque no que realmente importa: o eleitor.
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                                {["CRM Inteligente de Eleitores", "Controle de Demandas e Ofícios", "Radar de Emendas e Verbas", "Analytics de Reeleição"].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', fontWeight: 600 }}>
                                        <CheckCircle size={18} color="#d4af37" /> {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid-mobile-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {features.map((f, i) => (
                                <div key={i} className="feature-card" style={{ padding: '1.8rem', borderRadius: '18px' }}>
                                    <div style={{ color: '#d4af37', marginBottom: '1rem' }}>
                                        <f.icon size={28} />
                                    </div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--primary)' }}>{f.title}</h3>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', lineHeight: 1.5 }}>{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Modules (Grid Responsive) */}
            <section id="modulos" className="section-padding" style={{ padding: '80px 20px', background: 'var(--surface)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: 800, color: 'var(--primary)' }}>Centro de Comando Completo</h2>
                    </div>

                    <div className="grid-mobile-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                        {modules.map((m, i) => (
                            <div key={i} style={{
                                padding: '2.5rem 1.5rem',
                                background: 'white',
                                borderRadius: '24px',
                                border: '1px solid var(--border)',
                                textAlign: 'center'
                            }}>
                                <div style={{
                                    width: '60px', height: '60px', borderRadius: '16px',
                                    background: `${m.color}08`, color: m.color,
                                    margin: '0 auto 1.5rem',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <m.icon size={30} />
                                </div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--primary)' }}>{m.title}</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: 1.6 }}>{m.details}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing (Grid Responsive) */}
            <section id="precos" className="section-padding" style={{ padding: '100px 20px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: 800, color: 'var(--primary)' }}>Simples e Transparente</h2>
                    </div>

                    <div className="grid-mobile-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', alignItems: 'flex-start' }}>

                        {/* BASIC */}
                        <div style={{ padding: '3rem 2rem', background: 'white', borderRadius: '24px', border: '1px solid var(--border)' }}>
                            <span style={{ fontWeight: 800, color: 'var(--text-light)', fontSize: '0.8rem', letterSpacing: '1px' }}>ESSENCIAL</span>
                            <h4 style={{ fontSize: '2.8rem', fontWeight: 800, margin: '1rem 0' }}>R$ 197<span style={{ fontSize: '1rem', color: 'var(--text-light)' }}>/mês</span></h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                                <div style={{ display: 'flex', gap: '8px', fontSize: '0.9rem' }}><CheckCircle size={18} color="#d4af37" /> <span>Até 2.000 Contatos</span></div>
                                <div style={{ display: 'flex', gap: '8px', fontSize: '0.9rem' }}><CheckCircle size={18} color="#d4af37" /> <span>2 Assessores</span></div>
                                <div style={{ display: 'flex', gap: '8px', fontSize: '0.9rem', color: '#cbd5e1' }}><X size={18} /> <span>Sem I.A.</span></div>
                            </div>
                            <button onClick={() => navigate('/login')} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'white', fontWeight: 700, cursor: 'pointer' }}>Assinar Essencial</button>
                        </div>

                        {/* PRO - FOCUS */}
                        <div style={{
                            padding: '3.5rem 2.5rem',
                            background: 'var(--primary)',
                            color: 'white',
                            borderRadius: '24px',
                            transform: 'scale(1.05)',
                            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)',
                            position: 'relative'
                        }}>
                            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: '#d4af37', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 800 }}>POPULAR</div>
                            <span style={{ fontWeight: 800, color: '#94a3b8', fontSize: '0.8rem', letterSpacing: '1px' }}>PROFISSIONAL</span>
                            <h4 style={{ fontSize: '3.2rem', fontWeight: 800, margin: '1rem 0' }}>R$ 497<span style={{ fontSize: '1rem', color: '#94a3b8' }}>/mês</span></h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                                <div style={{ display: 'flex', gap: '8px', fontSize: '0.9rem' }}><CheckCircle size={18} color="#d4af37" /> <span>Até 15.000 Contatos</span></div>
                                <div style={{ display: 'flex', gap: '8px', fontSize: '0.9rem' }}><CheckCircle size={18} color="#d4af37" /> <span>10 Assessores</span></div>
                                <div style={{ display: 'flex', gap: '8px', fontSize: '0.9rem' }}><CheckCircle size={18} color="#d4af37" /> <span>Assistente I.A.</span></div>
                            </div>
                            <button onClick={() => navigate('/login')} className="gold-button" style={{ width: '100%', padding: '1.2rem', borderRadius: '14px', border: 'none', background: '#d4af37', fontWeight: 800, cursor: 'pointer' }}>Assinar Profissional</button>
                        </div>

                        {/* ELITE */}
                        <div style={{ padding: '3rem 2rem', background: 'white', borderRadius: '24px', border: '1px solid var(--border)' }}>
                            <span style={{ fontWeight: 800, color: 'var(--text-light)', fontSize: '0.8rem', letterSpacing: '1px' }}>POWER ELITE</span>
                            <h4 style={{ fontSize: '2.8rem', fontWeight: 800, margin: '1rem 0' }}>R$ 997<span style={{ fontSize: '1rem', color: 'var(--text-light)' }}>/mês</span></h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                                <div style={{ display: 'flex', gap: '8px', fontSize: '0.9rem' }}><CheckCircle size={18} color="#d4af37" /> <span>Contatos Ilimitados</span></div>
                                <div style={{ display: 'flex', gap: '8px', fontSize: '0.9rem' }}><CheckCircle size={18} color="#d4af37" /> <span>Radar de Verbas VIP</span></div>
                                <div style={{ display: 'flex', gap: '8px', fontSize: '0.9rem' }}><CheckCircle size={18} color="#d4af37" /> <span>BI de Reeleição</span></div>
                            </div>
                            <button onClick={() => navigate('/login')} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'white', fontWeight: 700, cursor: 'pointer' }}>Assinar Elite</button>
                        </div>

                    </div>
                </div>
            </section>

            <footer style={{ padding: '4rem 20px', background: 'var(--primary)', color: 'white', textAlign: 'center' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '2rem' }}>O momento da sua vitória começa aqui.</h2>
                    <button
                        onClick={() => navigate('/login')}
                        style={{ padding: '1.4rem 3.5rem', fontSize: '1.2rem', fontWeight: 800, borderRadius: '16px', background: 'white', color: 'var(--primary)', border: 'none', cursor: 'pointer' }}
                    >
                        Criar Conta do Mandato
                    </button>
                    <p style={{ marginTop: '3rem', opacity: 0.5, fontSize: '0.8rem' }}>
                        &copy; 2026 Gabinete Digital Inteligência Política. Todos os direitos reservados.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
