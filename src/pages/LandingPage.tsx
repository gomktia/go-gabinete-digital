
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    CheckCircle, Shield, Users, Building2,
    ArrowRight, Map, Radar, Brain, DollarSign,
    Target, LineChart, Globe, Layout, ChevronDown,
    Lock, Star, Award
} from 'lucide-react';
import { useRef } from 'react';

const LandingPage = () => {
    const navigate = useNavigate();
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

    const features = [
        {
            icon: Users,
            title: "CRM Estratégico de Eleitores",
            desc: "Mais que uma lista de nomes, uma base de dados segmentada por bairro, interesse e nível de fidelidade. Saiba quem são seus líderes de opinião.",
            page: "Controle de Votos"
        },
        {
            icon: Radar,
            title: "Radar de Verbas Públicas",
            desc: "Nosso motor de busca varre editais e diários oficiais em busca de recursos federais e estaduais para o seu município automaticamente.",
            page: "Captação de Recursos"
        },
        {
            icon: Brain,
            title: "Assessoria por I.A.",
            desc: "Redação de discursos, análise de tendências e criação de conteúdo para redes sociais treinado especificamente para o tom político.",
            page: "Inteligência Artificial"
        },
        {
            icon: Map,
            title: "Geolocalização de Apoios",
            desc: "Visualize em um mapa de calor onde está sua força e onde você precisa intensificar sua presença. Tome decisões baseadas em mapas, não em achismo.",
            page: "Cartografia Eleitoral"
        }
    ];

    const modules = [
        {
            title: "Dashboard de Comando",
            icon: Layout,
            details: "Visão 360º do mandato. Gráficos de desempenho, quociente eleitoral e alertas de urgência em uma única tela.",
            color: "#d4af37"
        },
        {
            title: "Gestão de Demandas",
            icon: Target,
            details: "Centralize pedidos de eleitores, ofícios e indicações. Rastreabilidade total para que nada 'caia no esquecimento'.",
            color: "#3182ce"
        },
        {
            title: "Financeiro Compliance",
            icon: DollarSign,
            details: "Controle de gastos de campanha rigoroso com alertas de limites do TSE para evitar impugnações e problemas jurídicos.",
            color: "#38a169"
        },
        {
            title: "Genealogia do Voto",
            icon: Star,
            details: "Mapeie quem indicou quem e entenda a ramificação do seu poder político e a eficiência de cada assessor em campo.",
            color: "#805ad5"
        }
    ];

    return (
        <div style={{ background: '#020617', minHeight: '100vh', color: '#f8fafc', overflowX: 'hidden', fontFamily: "'Outfit', 'Inter', sans-serif" }}>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
                
                .glass-nav {
                    background: rgba(2, 6, 23, 0.7);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }

                .gold-text {
                    background: linear-gradient(135deg, #fef08a 0%, #d4af37 50%, #854d0e 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .hero-gradient {
                    background: radial-gradient(circle at top right, rgba(212, 175, 55, 0.15) 0%, transparent 50%),
                                radial-gradient(circle at bottom left, rgba(49, 130, 206, 0.1) 0%, transparent 50%);
                }

                .feature-card {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                .feature-card:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(212, 175, 55, 0.3);
                    transform: translateY(-12px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                }

                .gold-button {
                    background: linear-gradient(135deg, #fef08a 0%, #d4af37 100%);
                    color: #020617;
                    box-shadow: 0 10px 20px rgba(212, 175, 55, 0.2);
                    transition: all 0.3s ease;
                }

                .gold-button:hover {
                    transform: scale(1.05);
                    box-shadow: 0 15px 30px rgba(212, 175, 55, 0.4);
                }

                .price-card.featured {
                    background: linear-gradient(180deg, rgba(212, 175, 55, 0.1) 0%, rgba(2, 6, 23, 0.4) 100%);
                    border: 2px solid #d4af37;
                }

                .scroll-indicator {
                    animation: bounce 2s infinite;
                }

                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
                    40% {transform: translateY(-10px);}
                    60% {transform: translateY(-5px);}
                }
            `}</style>

            {/* Navigation */}
            <nav className="glass-nav" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, padding: '1rem 2rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '40px', height: '40px', background: 'var(--primary)',
                            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Building2 color="var(--secondary)" size={24} />
                        </div>
                        <span style={{ fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-1px' }}>
                            Gabinete<span className="gold-text">Digital</span>
                        </span>
                    </div>
                    <div className="mobile-hide" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <a href="#solucao" style={{ color: '#94a3b8', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>Solução</a>
                        <a href="#modulos" style={{ color: '#94a3b8', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>Módulos</a>
                        <a href="#precos" style={{ color: '#94a3b8', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>Planos</a>
                        <button
                            onClick={() => navigate('/login')}
                            className="gold-button"
                            style={{
                                padding: '0.6rem 1.5rem', borderRadius: '12px', border: 'none',
                                fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem'
                            }}
                        >
                            Área Restrita
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section ref={targetRef} className="hero-gradient" style={{
                padding: '160px 20px 100px',
                position: 'relative',
                overflow: 'hidden',
                textAlign: 'center'
            }}>
                <motion.div style={{ opacity, scale }}>
                    <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                display: 'inline-block',
                                marginBottom: '1.5rem',
                                padding: '6px 16px',
                                borderRadius: '30px',
                                background: 'rgba(212, 175, 55, 0.1)',
                                color: '#d4af37',
                                fontSize: '0.8rem',
                                fontWeight: 800,
                                letterSpacing: '2px',
                                textTransform: 'uppercase',
                                border: '1px solid rgba(212, 175, 55, 0.2)'
                            }}
                        >
                            💎 O Futuro da Gestão Política
                        </motion.span>

                        <h1 style={{
                            fontSize: 'clamp(3rem, 7vw, 5.5rem)',
                            fontWeight: 800,
                            lineHeight: 1,
                            marginBottom: '2rem',
                            letterSpacing: '-2px'
                        }}>
                            Não Apenas Gerencie.<br />
                            <span className="gold-text">Domine o Jogo Político.</span>
                        </h1>

                        <p style={{
                            fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
                            color: '#94a3b8',
                            lineHeight: 1.6,
                            marginBottom: '3.5rem',
                            maxWidth: '800px',
                            margin: '0 auto 3.5rem'
                        }}>
                            O ecossistema definitivo para transformar dados em votos, centralizar seu gabinete e captar recursos de forma estratégica.
                        </p>

                        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => navigate('/login')}
                                className="gold-button"
                                style={{
                                    padding: '1.4rem 3rem', fontSize: '1.2rem', fontWeight: 800,
                                    borderRadius: '18px', border: 'none', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: '12px'
                                }}
                            >
                                Iniciar Transformação <ArrowRight size={22} />
                            </button>
                            <button
                                onClick={() => document.getElementById('precos')?.scrollIntoView({ behavior: 'smooth' })}
                                style={{
                                    padding: '1.4rem 3rem', fontSize: '1.2rem', fontWeight: 800,
                                    borderRadius: '18px', border: '1px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(255,255,255,0.03)', color: 'white', cursor: 'pointer',
                                    backdropFilter: 'blur(10px)'
                                }}
                            >
                                Ver Demonstração
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Dashboard Preview Overlay */}
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    style={{
                        marginTop: '80px',
                        maxWidth: '1200px',
                        margin: '80px auto 0',
                        position: 'relative'
                    }}
                >
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'radial-gradient(ellipse at center, transparent 0%, #020617 100%)',
                        zIndex: 5
                    }}></div>
                    <img
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1600"
                        alt="Painel do Sistema"
                        style={{
                            width: '100%',
                            borderRadius: '30px 30px 0 0',
                            boxShadow: '0 -50px 100px rgba(212, 175, 55, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            display: 'block'
                        }}
                    />
                </motion.div>

                <div className="scroll-indicator" style={{ marginTop: '50px', color: '#64748b' }}>
                    <ChevronDown size={32} />
                </div>
            </section>

            {/* Why section */}
            <section id="solucao" style={{ padding: '100px 20px', position: 'relative' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        <div>
                            <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '2rem', lineHeight: 1.1 }}>
                                Planilhas não <br /> Elegem Ninguém.
                            </h2>
                            <p style={{ fontSize: '1.2rem', color: '#94a3b8', lineHeight: 1.7, marginBottom: '2rem' }}>
                                A política moderna é feita de **dados**. O Gabinete Digital substitui o caos de papéis e planilhas por um cérebro digital que trabalha 24h por você.
                            </p>
                            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[
                                    "Centralização absoluta de informações",
                                    "Blindagem jurídica contra erros de gastos",
                                    "Aumento comprovado na velocidade de resposta ao eleitor",
                                    "Captação proativa de recursos através da I.A."
                                ].map((item, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#cbd5e1', fontWeight: 600 }}>
                                        <CheckCircle size={20} color="#d4af37" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            {features.map((f, i) => (
                                <div key={i} className="feature-card" style={{ padding: '2rem', borderRadius: '24px' }}>
                                    <div style={{ color: '#d4af37', marginBottom: '1.5rem' }}>
                                        <f.icon size={32} />
                                    </div>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>{f.title}</h3>
                                    <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6 }}>{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Module Showcase (Detailed System Explanation) */}
            <section id="modulos" style={{ padding: '100px 20px', background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <h2 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Por dentro do Centro de Comando</h2>
                        <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '700px', margin: '0 auto' }}>
                            Cada ferramenta foi desenhada para uma dor específica da vida pública brasileira.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        {modules.map((m, i) => (
                            <div key={i} style={{
                                padding: '3rem 2rem',
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.005) 100%)',
                                borderRadius: '30px',
                                border: '1px solid rgba(255,255,255,0.05)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center'
                            }}>
                                <div style={{
                                    padding: '20px',
                                    borderRadius: '20px',
                                    background: `${m.color}15`,
                                    color: m.color,
                                    marginBottom: '2rem',
                                    boxShadow: `0 10px 30px ${m.color}10`
                                }}>
                                    <m.icon size={40} />
                                </div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>{m.title}</h3>
                                <p style={{ color: '#94a3b8', lineHeight: 1.7 }}>{m.details}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="precos" style={{ padding: '120px 20px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <h2 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Investimento Estratégico</h2>
                        <p style={{ fontSize: '1.2rem', color: '#94a3b8' }}>Escolha o nível de blindagem e inteligência que seu gabinete exige.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'flex-start' }}>

                        {/* ESSENTIAL */}
                        <div className="price-card" style={{ padding: '4rem 3rem', background: '#0f172a', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
                                <Award size={20} color="#64748b" />
                                <span style={{ fontWeight: 800, color: '#64748b', letterSpacing: '2px' }}>ESSENCIAL</span>
                            </div>
                            <h4 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1rem' }}>R$ 197<span style={{ fontSize: '1.2rem', color: '#64748b' }}>/mês</span></h4>
                            <p style={{ color: '#94a3b8', marginBottom: '3rem' }}>Ideal para vereadores em início de jornada ou cidades pequenas.</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '4rem' }}>
                                <div style={{ display: 'flex', gap: '12px' }}><CheckCircle size={18} color="#d4af37" /> <span>Até 2.000 Contatos</span></div>
                                <div style={{ display: 'flex', gap: '12px' }}><CheckCircle size={18} color="#d4af37" /> <span>2 Assessores</span></div>
                                <div style={{ display: 'flex', gap: '12px' }}><CheckCircle size={18} color="#d4af37" /> <span>Gestão de Demandas</span></div>
                                <div style={{ display: 'flex', gap: '12px', opacity: 0.3 }}><Lock size={18} /> <span>Sem Inteligência Artificial</span></div>
                                <div style={{ display: 'flex', gap: '12px', opacity: 0.3 }}><Lock size={18} /> <span>Sem Radar de Verbas</span></div>
                            </div>

                            <button onClick={() => navigate('/login')} style={{ width: '100%', padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'white', fontWeight: 800, cursor: 'pointer' }}>
                                Começar Trial
                            </button>
                        </div>

                        {/* PROFESSIONAL */}
                        <div className="price-card featured" style={{ padding: '5rem 3rem', background: '#020617', borderRadius: '32px', position: 'relative', transform: 'scale(1.05)', zIndex: 10 }}>
                            <div style={{ position: 'absolute', top: '24px', right: '24px', background: '#d4af37', color: '#020617', padding: '6px 16px', borderRadius: '30px', fontSize: '0.7rem', fontWeight: 900 }}>RECOMENDADO</div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
                                <Star size={20} color="#d4af37" />
                                <span style={{ fontWeight: 800, color: '#d4af37', letterSpacing: '2px' }}>PROFISSIONAL</span>
                            </div>
                            <h4 style={{ fontSize: '4rem', fontWeight: 900, marginBottom: '1rem' }}>R$ 497<span style={{ fontSize: '1.2rem', color: '#94a3b8' }}>/mês</span></h4>
                            <p style={{ color: '#94a3b8', marginBottom: '3rem' }}>Para quem precisa de alta produtividade e conteúdo com I.A.</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '4rem' }}>
                                <div style={{ display: 'flex', gap: '12px' }}><CheckCircle size={18} color="#d4af37" /> <span>Até 15.000 Contatos</span></div>
                                <div style={{ display: 'flex', gap: '12px' }}><CheckCircle size={18} color="#d4af37" /> <span>10 Assessores</span></div>
                                <div style={{ display: 'flex', gap: '12px' }}><CheckCircle size={18} color="#d4af37" /> <span>I.A. Assistente Política</span></div>
                                <div style={{ display: 'flex', gap: '12px' }}><CheckCircle size={18} color="#d4af37" /> <span>WhatsApp Integrado</span></div>
                                <div style={{ display: 'flex', gap: '12px', opacity: 0.3 }}><Lock size={18} /> <span>Sem Radar de Verbas VIP</span></div>
                            </div>

                            <button onClick={() => navigate('/login')} className="gold-button" style={{ width: '100%', padding: '1.4rem', borderRadius: '16px', border: 'none', fontWeight: 900, cursor: 'pointer', fontSize: '1.1rem' }}>
                                Assinar Agora
                            </button>
                        </div>

                        {/* ELITE */}
                        <div className="price-card" style={{ padding: '4rem 3rem', background: '#0f172a', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
                                <Brain size={20} color="#38a169" />
                                <span style={{ fontWeight: 800, color: '#38a169', letterSpacing: '2px' }}>POWER ELITE</span>
                            </div>
                            <h4 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1rem' }}>R$ 997<span style={{ fontSize: '1.2rem', color: '#64748b' }}>/mês</span></h4>
                            <p style={{ color: '#94a3b8', marginBottom: '3rem' }}>A arma definitiva. Monitoramento de verbas e BI avançado.</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '4rem' }}>
                                <div style={{ display: 'flex', gap: '12px' }}><CheckCircle size={18} color="#38a169" /> <span>Contatos ILIMITADOS</span></div>
                                <div style={{ display: 'flex', gap: '12px' }}><CheckCircle size={18} color="#38a169" /> <span>Radar de Verbas VIP</span></div>
                                <div style={{ display: 'flex', gap: '12px' }}><CheckCircle size={18} color="#38a169" /> <span>BI de Reeleição</span></div>
                                <div style={{ display: 'flex', gap: '12px' }}><CheckCircle size={18} color="#38a169" /> <span>Mapa de Calor GIS</span></div>
                                <div style={{ display: 'flex', gap: '12px' }}><CheckCircle size={18} color="#38a169" /> <span>Suporte 24h Prioritário</span></div>
                            </div>

                            <button onClick={() => navigate('/login')} style={{ width: '100%', padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(56, 161, 105, 0.3)', background: 'rgba(56, 161, 105, 0.05)', color: 'white', fontWeight: 800, cursor: 'pointer' }}>
                                Falar com Diretor
                            </button>
                        </div>

                    </div>
                </div>
            </section>

            {/* Trusted by Section */}
            <section style={{ padding: '80px 20px', textAlign: 'center', opacity: 0.6 }}>
                <p style={{ letterSpacing: '3px', fontWeight: 800, fontSize: '0.8rem', color: '#64748b', marginBottom: '3rem' }}>DOMÍNIO TECNOLÓGICO EM TODAS AS ESFERAS</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap', filter: 'grayscale(100%)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: 700 }}><Building2 size={24} /> Câmaras Municipais</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: 700 }}><Globe size={24} /> Assembleias Legislativas</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: 700 }}><Shield size={24} /> Prefeituras Ativas</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: 700 }}><LineChart size={24} /> Campanhas Estratégicas</div>
                </div>
            </section>

            {/* Footer CTA */}
            <section style={{
                padding: '120px 20px',
                background: 'linear-gradient(to top, rgba(212, 175, 55, 0.1) 0%, transparent 100%)',
                textAlign: 'center'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '2rem' }}>O momento da reeleição começa agora.</h2>
                    <p style={{ fontSize: '1.3rem', color: '#94a3b8', marginBottom: '3.5rem' }}>
                        Não deixe sua carreira política ao acaso. Entre para a elite da tecnologia pública brasileira.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="gold-button"
                        style={{ padding: '1.6rem 4rem', fontSize: '1.4rem', fontWeight: 900, borderRadius: '20px', border: 'none', cursor: 'pointer' }}
                    >
                        Criar Conta do Mandato
                    </button>
                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '2rem', color: '#64748b', fontWeight: 600 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={16} /> Trial de 7 dias grátis</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={16} /> Sem contrato de fidelidade</span>
                    </div>
                </div>
            </section>

            <footer style={{ padding: '4rem 2rem', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', color: '#475569' }}>
                <div style={{ marginBottom: '2rem', opacity: 0.5 }}>
                    <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>Gabinete Digital</span>
                </div>
                <p>&copy; 2026 Inteligência Política LTDA. Tecnologia aplicada ao setor público.</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem', fontSize: '0.8rem' }}>
                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Termos de Uso</a>
                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>LGPD Compliance</a>
                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Suporte</a>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
