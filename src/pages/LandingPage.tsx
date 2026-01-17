
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    CheckCircle, Building2,
    ArrowRight, DollarSign,
    Target, Menu, X,
    Send,
    ShieldCheck,
    Smartphone, Database,
    Bot, Users2, ChevronRight,
    Gavel, Sparkles, Globe
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

    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

    const allFeatures = [
        {
            category: "Inteligência & IA",
            icon: Bot,
            color: "#805ad5",
            items: [
                { title: "Assessor Virtual I.A.", desc: "Redação automática de discursos, projetos de lei e indicações parlamentares em segundos.", page: "VirtualAdvisor" },
                { title: "Radar de Verbas", desc: "Monitoramento em tempo real de editais federais e estaduais para captação de recursos.", page: "VerbasRadar" },
                { title: "Sentiment Analysis", desc: "Entenda o que as pessoas estão falando nas redes sobre suas ações (Em breve)." }
            ]
        },
        {
            category: "Gestão Eleitoral (CRM)",
            icon: Users2,
            color: "#d4af37",
            items: [
                { title: "CRM Georreferenciado", desc: "Base de eleitores com mapa de calor. Saiba onde estão seus votos com precisão cirúrgica.", page: "VoterMap" },
                { title: "Genealogia do Voto", desc: "Mapeie quem indicou quem. Enxergue a ramificação real da sua influência política.", page: "VoteGenealogy" },
                { title: "Filtros Avançados", desc: "Segmente por bairro, interesse, data de nascimento e tags personalizadas.", page: "VoterCrm" }
            ]
        },
        {
            category: "Legislativo & Gabinete",
            icon: Building2,
            color: "#3182ce",
            items: [
                { title: "Gestão de Demandas", desc: "Ouvidoria completa com status de tramitação e fotos de visitas em campo.", page: "DemandsPage" },
                { title: "Controle de Ofícios", desc: "Emissão e rastreio de documentos oficiais e propostas legislativas.", page: "DocumentTracking" },
                { title: "Agenda Estratégica", desc: "Gestão de compromissos oficiais e reuniões com lideranças.", page: "CalendarPage" }
            ]
        },
        {
            category: "Comunicação & Web",
            icon: Send,
            color: "#38a169",
            items: [
                { title: "Site do Mandato", desc: "Criador de sites integrado para prestação de contas pública automática.", page: "MandateSiteBuilder" },
                { title: "WhatsApp Marketing", desc: "Envio de mensagens automatizadas para manter o eleitor engajado.", page: "WhatsAppIntegration" },
                { title: "Planner de Redes Sociais", desc: "Cronograma de postagens estratégico para manter autoridade digital.", page: "SocialMediaPlanner" }
            ]
        },
        {
            category: "Transparência & Finanças",
            icon: DollarSign,
            color: "#e53e3e",
            items: [
                { title: "Caixa de Campanha", desc: "Controle rigoroso de entradas e saídas conforme normas do TSE.", page: "CampaignFinance" },
                { title: "Gestão de Equipe", desc: "Controle de assessores, produtividade e metas de campo.", page: "TeamManagement" },
                { title: "Relatórios de Prestação", desc: "Geração de PDFs automáticos para prestação de contas no gabinete." }
            ]
        }
    ];

    const targetAudiences = [
        { title: "Vereadores", icon: Gavel, desc: "Gestão de bairro a bairro e controle de indicações." },
        { title: "Prefeitos", icon: Building2, desc: "Monitoramento de obras e captação de recursos via Radar." },
        { title: "Deputados", icon: Globe, desc: "Escalabilidade para bases regionais e mandatos complexos." },
        { title: "Candidatos", icon: Target, desc: "Mobilização de base e planejamento estratégico de votos." }
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
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid var(--border);
                }

                .gold-text {
                    background: linear-gradient(135deg, #b8860b 0%, #d4af37 50%, #854d0e 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .hero-gradient {
                    background: radial-gradient(circle at 70% 20%, rgba(212, 175, 55, 0.12) 0%, transparent 50%),
                                radial-gradient(circle at 20% 80%, rgba(49, 130, 206, 0.08) 0%, transparent 50%);
                }

                .feature-card {
                    background: white;
                    border: 1px solid var(--border);
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                .feature-card:hover {
                    border-color: var(--secondary);
                    transform: translateY(-5px);
                    box-shadow: 0 15px 30px rgba(15, 23, 42, 0.06);
                }

                .gold-button {
                    background: var(--primary);
                    color: white;
                    transition: all 0.3s ease;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }

                .gold-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 24px rgba(15, 23, 42, 0.15);
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
                    .hero-text { font-size: 2.6rem !important; }
                    .section-padding { padding: 60px 20px !important; }
                    .plan-card.featured { transform: scale(1) !important; margin: 20px 0; }
                }

                .mobile-menu {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: white; z-index: 3000; display: flex;
                    flex-direction: column; padding: 30px; gap: 2rem;
                }

                .category-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    background: var(--surface);
                    border-radius: 50px;
                    font-weight: 800;
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .plan-card {
                    padding: 3rem 2rem;
                    border-radius: 32px;
                    border: 1px solid var(--border);
                    background: white;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    height: 100%;
                }

                .plan-card.featured {
                    border: 2px solid var(--secondary);
                    box-shadow: 0 30px 60px rgba(15, 23, 42, 0.08);
                    transform: scale(1.05);
                    z-index: 5;
                    background: #0f172a;
                    color: white;
                }
            `}</style>

            {/* Navigation */}
            <nav className="glass-nav" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, padding: '0.8rem 1.5rem' }}>
                <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            width: '40px', height: '40px', background: 'var(--primary)',
                            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Building2 color="#d4af37" size={24} />
                        </div>
                        <span style={{ fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-0.5px', color: 'var(--primary)' }}>
                            Gabinete<span className="gold-text">Digital</span>
                        </span>
                    </div>

                    <div className="mobile-hide" style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
                        <a href="#funcionalidades" className="nav-link">O que oferecemos</a>
                        <a href="#publico" className="nav-link">Para quem é?</a>
                        <a href="#precos" className="nav-link">Assinaturas</a>
                        <button
                            onClick={() => navigate('/login')}
                            className="gold-button"
                            style={{ padding: '0.7rem 1.5rem', borderRadius: '12px', fontWeight: 800 }}
                        >
                            Área do Mandato
                        </button>
                    </div>

                    <button
                        className="mobile-show"
                        style={{ display: 'none', background: 'none', border: 'none', color: 'var(--primary)' }}
                        onClick={() => setIsMenuOpen(true)}
                    >
                        <Menu size={32} />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className="mobile-menu"
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={() => setIsMenuOpen(false)} style={{ background: 'none', border: 'none' }}><X size={36} /></button>
                        </div>
                        <a href="#funcionalidades" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '1.8rem', fontWeight: 800, textDecoration: 'none', color: 'var(--primary)' }}>O que oferecemos</a>
                        <a href="#publico" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '1.8rem', fontWeight: 800, textDecoration: 'none', color: 'var(--primary)' }}>Para quem é?</a>
                        <a href="#precos" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '1.8rem', fontWeight: 800, textDecoration: 'none', color: 'var(--primary)' }}>Assinaturas</a>
                        <button
                            onClick={() => navigate('/login')}
                            className="gold-button"
                            style={{ padding: '1.5rem', borderRadius: '16px', fontSize: '1.2rem', marginTop: 'auto' }}
                        >
                            Acessar Plataforma
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <section ref={targetRef} className="hero-gradient" style={{ padding: '160px 20px 100px', textAlign: 'center' }}>
                <motion.div style={{ opacity, scale }}>
                    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                        <div className="category-badge" style={{ marginBottom: '2rem' }}>
                            <Sparkles size={16} color="#d4af37" /> <span>Plataforma Líder no Brasil em 2026</span>
                        </div>

                        <h1 className="hero-text" style={{
                            fontSize: 'clamp(3rem, 7vw, 5.5rem)',
                            fontWeight: 800, lineHeight: 1, marginBottom: '2rem',
                            letterSpacing: '-2px', color: 'var(--primary)'
                        }}>
                            Não Apenas um Software. <br />
                            <span className="gold-text">Uma Infraestrutura de Poder.</span>
                        </h1>

                        <p style={{
                            fontSize: 'clamp(1.2rem, 2.2vw, 1.5rem)',
                            color: 'var(--text-light)', lineHeight: 1.6, marginBottom: '4rem',
                            maxWidth: '900px', margin: '0 auto 4rem'
                        }}>
                            Centralize **votos, verbas e gabinete** em um único lugar. A tecnologia que vereadores, prefeitos e deputados usam para garantir a reeleição e o legado.
                        </p>

                        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button onClick={() => navigate('/login')} className="gold-button" style={{ padding: '1.5rem 3.5rem', fontSize: '1.3rem', fontWeight: 800, borderRadius: '20px' }}>
                                Começar Agora <ArrowRight size={24} />
                            </button>
                            <button onClick={() => document.getElementById('precos')?.scrollIntoView({ behavior: 'smooth' })} style={{ padding: '1.5rem 3.5rem', fontSize: '1.3rem', fontWeight: 800, borderRadius: '20px', border: '2px solid var(--border)', background: 'white' }}>
                                Ver Planos
                            </button>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Target Audience Section */}
            <section id="publico" style={{ padding: '100px 20px', background: 'var(--surface)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: 'var(--primary)' }}>Para quem foi construído?</h2>
                    </div>
                    <div className="grid-mobile-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
                        {targetAudiences.map((aud, i) => (
                            <div key={i} style={{ padding: '2rem', background: 'white', borderRadius: '24px', textAlign: 'center', border: '1px solid var(--border)' }}>
                                <div style={{ color: '#d4af37', marginBottom: '1.5rem' }}><aud.icon size={40} /></div>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.75rem' }}>{aud.title}</h3>
                                <p style={{ fontSize: '0.95rem', color: 'var(--text-light)', lineHeight: 1.6 }}>{aud.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Mega Tour */}
            <section id="funcionalidades" style={{ padding: '100px 20px' }}>
                <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                        <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', fontWeight: 800, color: 'var(--primary)' }}>Tudo o que você precisa em um só lugar.</h2>
                        <p style={{ color: 'var(--text-light)', fontSize: '1.2rem', marginTop: '1rem' }}>Não falta nada. É o sistema político mais completo do mercado.</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
                        {allFeatures.map((cat, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '3rem' }}>
                                    <div style={{ padding: '12px', background: `${cat.color}15`, borderRadius: '14px', color: cat.color }}>
                                        <cat.icon size={32} />
                                    </div>
                                    <h3 style={{ fontSize: '2rem', fontWeight: 800 }}>{cat.category}</h3>
                                </div>
                                <div className="grid-mobile-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                                    {cat.items.map((item, j) => (
                                        <div key={j} className="feature-card" style={{ padding: '2.5rem', borderRadius: '24px' }}>
                                            <h4 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                {item.title}
                                                <ChevronRight size={18} color="#d4af37" />
                                            </h4>
                                            <p style={{ color: 'var(--text-light)', fontSize: '1rem', lineHeight: 1.6 }}>{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Matrix (Detailing everything) */}
            <section id="precos" style={{ padding: '120px 20px', background: 'var(--primary)' }}>
                <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', color: 'white', marginBottom: '6rem' }}>
                        <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 3.5rem)', fontWeight: 800 }}>Escolha sua Infraestrutura</h2>
                        <p style={{ fontSize: '1.2rem', opacity: 0.7, marginTop: '1rem' }}>Todos os planos incluem suporte técnico e atualizações semanais.</p>
                    </div>

                    <div className="grid-mobile-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3rem', alignItems: 'stretch' }}>

                        {/* ESSENTIAL */}
                        <div className="plan-card">
                            <div>
                                <span style={{ fontWeight: 800, color: 'var(--text-light)', fontSize: '0.8rem', letterSpacing: '2px' }}>ESSENCIAL</span>
                                <h4 style={{ fontSize: '3.5rem', fontWeight: 800, margin: '1.5rem 0' }}>R$ 197<span style={{ fontSize: '1rem', color: 'var(--text-light)' }}>/mês</span></h4>
                                <p style={{ color: 'var(--text-light)', marginBottom: '3rem' }}>Focado em organização inicial de base.</p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                    <div style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="#d4af37" /> <span>Até **2.000 eleitores** cadastrados</span></div>
                                    <div style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="#d4af37" /> <span>**2 assessores** inclusos</span></div>
                                    <div style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="#d4af37" /> <span>Gestão de Demandas (Kanban)</span></div>
                                    <div style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="#d4af37" /> <span>Agenda Parlamentar</span></div>
                                    <div style={{ display: 'flex', gap: '10px', color: '#cbd5e1' }}><X size={20} /> <span>Sem Inteligência Artificial</span></div>
                                    <div style={{ display: 'flex', gap: '10px', color: '#cbd5e1' }}><X size={20} /> <span>Sem Radar de Verbas</span></div>
                                </div>
                            </div>
                            <button onClick={() => navigate('/login')} style={{ width: '100%', padding: '1.2rem', borderRadius: '16px', background: 'var(--surface)', border: '1px solid var(--border)', fontWeight: 800, cursor: 'pointer', marginTop: '4rem' }}>Começar Agora</button>
                        </div>

                        {/* PROFESSIONAL */}
                        <div className="plan-card featured">
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 800, color: '#d4af37', fontSize: '0.8rem', letterSpacing: '2px' }}>PROFISSIONAL</span>
                                    <span style={{ background: '#d4af37', color: '#0f172a', padding: '4px 12px', borderRadius: '50px', fontSize: '0.65rem', fontWeight: 900 }}>RECOMENDADO</span>
                                </div>
                                <h4 style={{ fontSize: '4.5rem', fontWeight: 900, margin: '1.5rem 0' }}>R$ 497<span style={{ fontSize: '1.2rem', color: '#94a3b8' }}>/mês</span></h4>
                                <p style={{ color: '#94a3b8', marginBottom: '3rem' }}>Aceleração de mandato com Inteligência Artificial.</p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                    <div style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="#d4af37" /> <span>Até **15.000 eleitores** cadastrados</span></div>
                                    <div style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="#d4af37" /> <span>**10 assessores** inclusos</span></div>
                                    <div style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="#d4af37" /> <span>**Assessor Virtual I.A.** Ilimitado</span></div>
                                    <div style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="#d4af37" /> <span>WhatsApp Marketing Integrado</span></div>
                                    <div style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="#d4af37" /> <span>Site do Mandato (Prestação de Contas)</span></div>
                                    <div style={{ display: 'flex', gap: '10px', color: 'rgba(255,255,255,0.3)' }}><X size={20} /> <span>Sem Radar de Verbas VIP</span></div>
                                </div>
                            </div>
                            <button onClick={() => navigate('/login')} className="gold-button" style={{ background: '#d4af37', color: '#0f172a', padding: '1.5rem', borderRadius: '20px', fontSize: '1.3rem', fontWeight: 900, marginTop: '4rem' }}>Assinar Agora</button>
                        </div>

                        {/* POWER ELITE */}
                        <div className="plan-card">
                            <div>
                                <span style={{ fontWeight: 800, color: '#38a169', fontSize: '0.8rem', letterSpacing: '2px' }}>POWER ELITE</span>
                                <h4 style={{ fontSize: '3.5rem', fontWeight: 800, margin: '1.5rem 0' }}>R$ 997<span style={{ fontSize: '1rem', color: 'var(--text-light)' }}>/mês</span></h4>
                                <p style={{ color: 'var(--text-light)', marginBottom: '3rem' }}>O Domínio Total. Para campanhas vitoriosas.</p>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                    <div style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="#38a169" /> <span>**Votos ILIMITADOS** (Base total)</span></div>
                                    <div style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="#38a169" /> <span>**Equipe ILIMITADA**</span></div>
                                    <div style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="#38a169" /> <span>**Radar de Verbas VIP** (Monitoramento)</span></div>
                                    <div style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="#38a169" /> <span>Mapa de Calor Georreferenciado</span></div>
                                    <div style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="#38a169" /> <span>Genealogia Completa do Voto</span></div>
                                    <div style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="#38a169" /> <span>Suporte VIP 24h via WhatsApp</span></div>
                                </div>
                            </div>
                            <button onClick={() => navigate('/login')} style={{ width: '100%', padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(56, 161, 105, 0.4)', background: 'rgba(56, 161, 105, 0.05)', fontWeight: 800, cursor: 'pointer', marginTop: '4rem' }}>Falar com Consultor</button>
                        </div>

                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section style={{ padding: '120px 20px', textAlign: 'center' }}>
                <div style={{ maxWidth: '850px', margin: '0 auto' }}>
                    <div style={{ marginBottom: '3rem' }}>
                        <ShieldCheck size={60} color="#38a169" style={{ margin: '0 auto' }} />
                    </div>
                    <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '2rem' }}>Pronto para liderar de verdade?</h2>
                    <p style={{ fontSize: '1.3rem', color: 'var(--text-light)', marginBottom: '4rem' }}>
                        Pare de perder votos por falta de organização. Transforme seu gabinete no centro de inteligência que o seu mandato merece.
                    </p>
                    <button onClick={() => navigate('/login')} className="gold-button" style={{ padding: '1.8rem 5rem', borderRadius: '25px', fontSize: '1.5rem', fontWeight: 900, margin: '0 auto' }}>
                        Solicitar Acesso Imediato
                    </button>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginTop: '3rem', color: 'var(--text-light)', fontWeight: 600 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Database size={18} /> Dados Blindados (LGPD)</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Smartphone size={18} /> App Mobile Incluso</span>
                    </div>
                </div>
            </section>

            <footer style={{ padding: '4rem 20px', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '2rem', opacity: 0.7 }}>
                    <Building2 size={24} color="var(--primary)" />
                    <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>Gabinete Digital</span>
                </div>
                <p>&copy; 2026 Tecnologia Política Inteligente. Todos os direitos reservados.</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem', fontSize: '0.85rem' }}>
                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Política de Privacidade</a>
                    <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Compromisso do Candidato</a>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
