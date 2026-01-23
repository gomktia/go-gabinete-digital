
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    CheckCircle, Building2, ArrowRight, DollarSign,
    Target, Menu, X, ShieldCheck,
    ChevronRight,
    Sparkles, Globe, Map, Brain,
    Layout, Star, Search,
    Scale, Shield
} from 'lucide-react';
import { useState, useEffect } from 'react';

// Detailed data for the Modal/Drawer
interface SystemTourItem {
    id: string;
    title: string;
    icon: any;
    desc: string;
    color: string;
    details: string[];
    benefit: string;
}

const systemTours: SystemTourItem[] = [
    {
        id: 'dashboard',
        title: "Painel de Comando (Dashboard)",
        icon: Layout,
        desc: "Visão 360º do mandato com métricas de votos, quociente eleitoral e alertas urgentes.",
        color: "#d4af37",
        details: [
            "Monitoramento de Quociente Eleitoral em tempo real.",
            "Consolidação de gastos de campanha automáticos.",
            "Alertas de demandas críticas em atraso.",
            "Ranking de produtividade da equipe de gabinete."
        ],
        benefit: "Permite ao político tomar decisões baseadas em números reais, não em intuição, garantindo foco onde os votos estão."
    },
    {
        id: 'radar',
        title: "Radar de Verbas Públicas",
        icon: Search,
        desc: "Robô que varre diários oficiais e editais federais para captar recursos para sua cidade.",
        color: "#1e293b",
        details: [
            "Varredura diária no Diário Oficial da União (DOU).",
            "Filtros inteligentes por área (Saúde, Educação, Obras).",
            "Notificações instantâneas de novos Editais de Convênio.",
            "Repositório de modelos de planos de trabalho para propostas."
        ],
        benefit: "Transforma o parlamentar em um captador de recursos eficiente, trazendo melhorias concretas para o município."
    },
    {
        id: 'crm',
        title: "CRM Eleitoral Georreferenciado",
        icon: Map,
        desc: "Mapa de calor de votos e base de eleitores segmentada por rua, bairro e interesse.",
        color: "#3182ce",
        details: [
            "Geolocalização automática por CEP e endereço.",
            "Histórico completo de atendimentos e solicitações por eleitor.",
            "Gestão de aniversariantes com integração para mensagens.",
            "Segmentação por lideranças de bairro e grupos de interesse."
        ],
        benefit: "Mapeia onde está sua força eleitoral e onde você precisa intensificar sua presença para conquistar novos votos."
    },
    {
        id: 'ia',
        title: "Assessor com I.A. 24h",
        icon: Brain,
        desc: "Inteligência Artificial que redige discursos, projetos de lei e legendas de redes sociais.",
        color: "#805ad5",
        details: [
            "Treinamento específico para linguagem política e jurídica.",
            "Redação de Projetos de Lei e Indicações em segundos.",
            "Criação de calendários de conteúdo para Instagram e Facebook.",
            "Análise de processos legislativos complexos."
        ],
        benefit: "Garante agilidade brutal no gabinete, permitindo que uma equipe pequena produza como uma equipe gigante."
    },
    {
        id: 'demandas',
        title: "Gestão de Demandas (Ouvidoria)",
        icon: Target,
        desc: "Controle total de pedidos de eleitores com fotos, responsáveis e status de conclusão.",
        color: "#38a169",
        details: [
            "Fluxo de trabalho estilo Kanban (A Fazer, Fazendo, Feito).",
            "Registro fotográfico de visitas e conclusões de obra.",
            "Impressão automática de ofícios para secretarias.",
            "Acompanhamento de prazos de resposta da prefeitura."
        ],
        benefit: "Acaba com o 'pedi e não fui atendido'. Gera fidelidade do eleitor através de uma resposta transparente e rápida."
    },
    {
        id: 'genealogia',
        title: "Árvore de Votos (Genealogia)",
        icon: Star,
        desc: "Entenda exatamente quem indicou cada voto e mapeie sua rede de influência real.",
        color: "#e53e3e",
        details: [
            "Mapeamento de relações entre coordenadores e eleitores.",
            "Cálculo de 'Royalty' de influência para premiação de equipe.",
            "Identificação de desertores e novos apoiadores em potencial.",
            "Visualização gráfica da ramificação de crescimento da base."
        ],
        benefit: "Identifica seus verdadeiros generais de campo e protege sua base de invasões de adversários."
    },
    {
        id: 'financeiro',
        title: "Financeiro & Prestação",
        icon: DollarSign,
        desc: "Controle de caixa de campanha com alertas para evitar multas e impugnações do TSE.",
        color: "#1e293b",
        details: [
            "Lançamento simplificado de receitas e despesas.",
            "Alertas de teto de gastos conforme regras da última eleição.",
            "Geração de relatórios mensais de transparência.",
            "Controle de doações por CPF com verificação simplificada."
        ],
        benefit: "Preveni a cassação de mandato por erros administrativos banais na prestação de contas eleitoral."
    },
    {
        id: 'site',
        title: "Criador de Site do Mandato",
        icon: Globe,
        desc: "Um site público profissional automático para prestar contas e atrair novos apoiadores.",
        color: "#d4af37",
        details: [
            "Layouts responsivos e otimizados para busca no Google.",
            "Página de 'Minhas Realizações' alimentada pelo sistema.",
            "Formulário de captura de leads e novos apoiadores integrado.",
            "Blog de notícias e galeria de fotos do mandato."
        ],
        benefit: "Cria uma vitrine digital 24h que comunica suas entregas sem que você precise contratar web designers."
    }
];

const LandingPage = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedFeature, setSelectedFeature] = useState<SystemTourItem | null>(null);
    const [cookieConsent, setCookieConsent] = useState<boolean | null>(null);

    // Initial check for cookies
    useEffect(() => {
        const consent = localStorage.getItem('lgpd_consent');
        if (consent) {
            setCookieConsent(true);
        } else {
            setCookieConsent(false);
        }
    }, []);

    const handleAcceptCookies = () => {
        localStorage.setItem('lgpd_consent', JSON.stringify({
            accepted: true,
            timestamp: new Date().toISOString(),
            version: '1.0'
        }));
        setCookieConsent(true);
    };

    return (
        <div style={{ background: '#ffffff', minHeight: '100vh', width: '100%', color: '#1e293b', overflowX: 'hidden', fontFamily: "'Outfit', 'Inter', sans-serif" }}>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
                
                :root {
                    --gold: #d4af37;
                    --slate: #0f172a;
                    --light-slate: #64748b;
                    --off-white: #f8fafc;
                }

                .glass-nav {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    border-bottom: 1px solid rgba(0,0,0,0.05);
                    width: 100%;
                }

                .gold-text {
                    background: linear-gradient(135deg, #b8860b 0%, #d4af37 50%, #854d0e 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .feature-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 20px;
                }

                .card-premium {
                    background: white;
                    border: 1px solid rgba(0,0,0,0.06);
                    padding: 30px;
                    border-radius: 24px;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    height: 100%;
                }

                .card-premium:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 30px rgba(0,0,0,0.05);
                    border-color: var(--gold);
                }

                .btn-arrow {
                    margin-top: 15px;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    color: var(--gold);
                    font-weight: 800;
                    font-size: 0.85rem;
                }

                .btn-primary {
                    background: var(--slate);
                    color: white;
                    padding: 16px 32px;
                    border-radius: 14px;
                    font-weight: 800;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    transition: all 0.2s ease;
                    text-decoration: none;
                }

                .btn-primary:hover {
                    transform: scale(1.02);
                    background: #1e293b;
                }

                .cookie-banner {
                    position: fixed;
                    bottom: 20px;
                    left: 20px;
                    right: 20px;
                    background: white;
                    padding: 20px;
                    border-radius: 20px;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.15);
                    z-index: 5000;
                    border: 1px solid #e2e8f0;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                @media (max-width: 1024px) {
                    .desktop-only { display: none !important; }
                    .mobile-only { display: flex !important; }
                    .hero-title { font-size: 2.8rem !important; }
                }

                @media (min-width: 1025px) {
                    .mobile-only { display: none !important; }
                }

                section {
                    width: 100%;
                    max-width: 100vw;
                    padding: 80px 20px;
                    box-sizing: border-box;
                }

                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.4);
                    backdrop-filter: blur(8px);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }

                .modal-content {
                    background: white;
                    width: 100%;
                    max-width: 800px;
                    border-radius: 30px;
                    overflow-y: auto;
                    max-height: 90vh;
                    box-shadow: 0 50px 100px rgba(0,0,0,0.2);
                    display: flex;
                    flex-direction: column;
                }

                .mobile-menu-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: white;
                    z-index: 2000;
                    padding: 40px 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 30px;
                }
            `}</style>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className="mobile-menu-overlay"
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={() => setIsMenuOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--slate)' }}>
                                <X size={40} />
                            </button>
                        </div>
                        <a href="#tour" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '2rem', fontWeight: 800, textDecoration: 'none', color: 'var(--slate)' }}>Recursos</a>
                        <a href="#planos" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '2rem', fontWeight: 800, textDecoration: 'none', color: 'var(--slate)' }}>Planos</a>
                        <button onClick={() => navigate('/login')} className="btn-primary" style={{ padding: '20px', fontSize: '1.2rem', marginTop: 'auto' }}>Acessar Gabinete</button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* LGPD Cookie Banner */}
            <AnimatePresence>
                {!cookieConsent && (
                    <motion.div
                        className="cookie-banner"
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                    >
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flex: 1 }}>
                            <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '12px' }}>
                                <Shield size={24} color="#38a169" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem', fontWeight: 800 }}>Privacidade e LGPD</h4>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--light-slate)', lineHeight: '1.4' }}>
                                    Utilizamos cookies e tecnologias similares para melhorar sua experiência e a segurança dos dados em nosso sistema em plena conformidade com a Lei Geral de Proteção de Dados (LGPD).
                                </p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={handleAcceptCookies} className="btn-primary" style={{ padding: '12px 24px', fontSize: '0.85rem' }}>Aceitar e Continuar</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Feature Modal / Drawer */}
            <AnimatePresence>
                {selectedFeature && (
                    <div className="modal-overlay" onClick={() => setSelectedFeature(null)}>
                        <motion.div
                            className="modal-content"
                            initial={{ y: '100%', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: '100%', opacity: 0 }}
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        >
                            <div style={{ padding: '30px', background: 'var(--slate)', color: 'white', position: 'relative' }}>
                                <button onClick={() => setSelectedFeature(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <X size={24} />
                                </button>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                                    <div style={{ padding: '15px', background: 'rgba(255,255,255,0.1)', borderRadius: '16px' }}>
                                        <selectedFeature.icon size={32} color="var(--gold)" />
                                    </div>
                                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>{selectedFeature.title}</h2>
                                </div>
                                <p style={{ fontSize: '1.1rem', opacity: 0.8, lineHeight: 1.5 }}>{selectedFeature.desc}</p>
                            </div>

                            <div style={{ padding: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                                <div>
                                    <h4 style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--gold)', marginBottom: '20px' }}>Funcionalidades em Destaque</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        {selectedFeature.details.map((detail, idx) => (
                                            <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                                <div style={{ marginTop: '5px' }}><CheckCircle size={18} color="#38a169" /></div>
                                                <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--slate)' }}>{detail}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--gold)', marginBottom: '20px' }}>Impacto Político</h4>
                                    <div style={{ background: 'var(--off-white)', padding: '25px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                                        <div style={{ color: 'var(--gold)', marginBottom: '15px' }}><Sparkles size={24} /></div>
                                        <p style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.6, color: 'var(--slate)', margin: 0 }}>
                                            "{selectedFeature.benefit}"
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="btn-primary"
                                        style={{ width: '100%', marginTop: '30px' }}
                                    >
                                        Quero isso no meu Gabinete <ArrowRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Navigation */}
            <nav className="glass-nav" style={{ position: 'fixed', top: 0, left: 0, zIndex: 1000 }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ padding: '8px', background: 'var(--slate)', borderRadius: '10px' }}>
                            <Building2 color="var(--gold)" size={24} />
                        </div>
                        <span style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--slate)' }}>Gabinete<span className="gold-text">Digital</span></span>
                    </div>

                    <div className="desktop-only" style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                        <a href="#tour" style={{ fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none', color: 'var(--light-slate)' }}>Recursos</a>
                        <a href="#planos" style={{ fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none', color: 'var(--light-slate)' }}>Planos</a>
                        <button onClick={() => navigate('/login')} className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>Acessar Gabinete</button>
                    </div>

                    <button className="mobile-only" style={{ background: 'none', border: 'none', color: 'var(--slate)', cursor: 'pointer' }} onClick={() => setIsMenuOpen(true)}>
                        <Menu size={30} />
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section style={{ paddingTop: '160px', textAlign: 'center', background: 'radial-gradient(circle at center, #fbfbfb 0%, #f1f5f9 100%)' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{ display: 'inline-flex', padding: '8px 16px', borderRadius: '50px', background: 'rgba(212,175,55,0.1)', color: '#b8860b', fontWeight: 800, fontSize: '0.75rem', marginBottom: '25px', letterSpacing: '1px' }}>
                        💎 A PLATAFORMA QUE ESTÁ MODERNIZANDO O BRASIL
                    </div>

                    <h1 className="hero-title" style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontWeight: 800, color: 'var(--slate)', lineHeight: 1.1, marginBottom: '25px', letterSpacing: '-2px' }}>
                        A Estrutura que o seu<br />
                        <span className="gold-text">Mandato Merece.</span>
                    </h1>

                    <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--light-slate)', maxWidth: '800px', margin: '0 auto 40px', lineHeight: 1.6 }}>
                        Centralize votos, verbas e inteligência em um único lugar. O ecossistema definitivo para Vereadores, Prefeitos e Deputados de alta performance.
                    </p>

                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button onClick={() => navigate('/login')} className="btn-primary" style={{ fontSize: '1.2rem', padding: '18px 40px' }}>
                            Testar Agora <ArrowRight size={22} />
                        </button>
                        <button onClick={() => document.getElementById('tour')?.scrollIntoView({ behavior: 'smooth' })} style={{ padding: '18px 40px', fontSize: '1.2rem', fontWeight: 800, borderRadius: '14px', border: '1px solid #e2e8f0', background: 'white', color: 'var(--slate)', cursor: 'pointer' }}>
                            Ver Tours das Páginas
                        </button>
                    </div>
                </div>

                <div style={{ marginTop: '80px', maxWidth: '1100px', margin: '80px auto 0', padding: '0 20px' }}>
                    <img
                        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200"
                        alt="Preview do Sistema"
                        style={{ width: '100%', borderRadius: '24px 24px 0 0', boxShadow: '0 -20px 50px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}
                    />
                </div>
            </section>

            {/* Tour Completo das Páginas */}
            <section id="tour" style={{ background: 'white' }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--slate)' }}>O que tem no Gabinete Digital?</h2>
                        <p style={{ color: 'var(--light-slate)', fontSize: '1.2rem' }}>Cada card abaixo representa uma página real do seu novo sistema. Clique para ver detalhes.</p>
                    </div>

                    <div className="feature-grid">
                        {systemTours.map((tour, i) => (
                            <div key={i} className="card-premium" onClick={() => setSelectedFeature(tour)}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ width: '50px', height: '50px', background: `${tour.color}10`, color: tour.color, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                                        <tour.icon size={28} />
                                    </div>
                                    <ChevronRight size={20} color="var(--gold)" />
                                </div>
                                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '10px' }}>{tour.title}</h3>
                                <p style={{ fontSize: '0.95rem', color: 'var(--light-slate)', lineHeight: 1.6 }}>{tour.desc}</p>
                                <div className="btn-arrow">
                                    Ver Detalhes <ArrowRight size={14} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* LGPD Compliance Section */}
            <section style={{ background: 'var(--off-white)', padding: '100px 20px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '50px', alignItems: 'center' }}>
                    <div>
                        <div style={{ display: 'inline-flex', padding: '8px 16px', borderRadius: '50px', background: '#38a16915', color: '#38a169', fontWeight: 800, fontSize: '0.7rem', marginBottom: '20px' }}>
                            🛡️ SEGURANÇA JURÍDICA TOTAL
                        </div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '20px' }}>Seguimos a LGPD à risca.</h2>
                        <p style={{ fontSize: '1.1rem', color: 'var(--light-slate)', lineHeight: 1.7 }}>
                            Na política, o vazamento de dados de eleitores pode gerar multas pesadas e processos. Nossa plataforma armazena tudo em servidores blindados, com logs de acesso e permissões granulares por assessor.
                        </p>
                        <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><ShieldCheck color="#38a169" /> <span>Criptografia de ponta a ponta</span></div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><ShieldCheck color="#38a169" /> <span>Logs de auditoria por usuário</span></div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}><ShieldCheck color="#38a169" /> <span>Hospedagem em nuvem de alta segurança</span></div>
                        </div>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            background: 'white', padding: '40px', borderRadius: '30px', border: '1px solid #e2e8f0',
                            boxShadow: '0 30px 60px rgba(0,0,0,0.05)'
                        }}>
                            <div style={{ color: 'var(--gold)', marginBottom: '20px' }}><Scale size={48} /></div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '15px' }}>Por que isso importa?</h3>
                            <p style={{ color: 'var(--light-slate)', lineHeight: 1.6 }}>
                                Ter uma base de eleitores em planilhas ou cadernetas é um risco jurídico enorme. O Gabinete Digital oficializa seu banco de dados e protege sua carreira política contra investigações sobre vazamento de informações sensíveis.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Planos de Assinatura Detalhados */}
            <section id="planos">
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '3rem', fontWeight: 800 }}>Inicie sua Transformação</h2>
                        <p style={{ color: 'var(--light-slate)' }}>Planos escaláveis que acompanham o crescimento da sua rede de influência.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
                        {/* ESSENCIAL */}
                        <div style={{ padding: '40px', borderRadius: '30px', border: '1px solid #e2e8f0', background: 'white' }}>
                            <span style={{ fontWeight: 800, color: 'var(--light-slate)', fontSize: '0.8rem', letterSpacing: '1px' }}>ESSENCIAL (PARA VEREADORES)</span>
                            <h4 style={{ fontSize: '3.5rem', fontWeight: 800, margin: '20px 0' }}>R$ 197<span style={{ fontSize: '1rem', color: 'var(--light-slate)' }}>/mês</span></h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: '30px 0', display: 'grid', gap: '15px' }}>
                                <li style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="var(--gold)" /> <b>2.000 Eleitores</b></li>
                                <li style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="var(--gold)" /> <b>2 Assessores</b></li>
                                <li style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="var(--gold)" /> Gestão de Demandas</li>
                            </ul>
                            <button onClick={() => navigate('/login')} style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'transparent', fontWeight: 800, cursor: 'pointer' }}>Iniciar como Essencial</button>
                        </div>

                        {/* PROFISSIONAL */}
                        <div style={{ padding: '50px 40px', borderRadius: '30px', background: 'var(--slate)', color: 'white', transform: 'scale(1.05)', boxShadow: '0 25px 50px rgba(0,0,0,0.1)', zIndex: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 800, color: 'var(--gold)', fontSize: '0.8rem' }}>PROFISSIONAL (PARA PREFEITOS)</span>
                                <span style={{ background: 'var(--gold)', color: 'black', fontSize: '0.65rem', padding: '4px 8px', borderRadius: '50px', fontWeight: 900 }}>TOP VENDAS</span>
                            </div>
                            <h4 style={{ fontSize: '4rem', fontWeight: 900, margin: '20px 0' }}>R$ 497<span style={{ fontSize: '1rem', color: '#94a3b8' }}>/mês</span></h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: '30px 0', display: 'grid', gap: '15px' }}>
                                <li style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="var(--gold)" /> <b>15.000 Eleitores</b></li>
                                <li style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="var(--gold)" /> <b>10 Assessores</b></li>
                                <li style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="var(--gold)" /> <b>Assessor Virtual com I.A.</b></li>
                            </ul>
                            <button onClick={() => navigate('/login')} className="btn-primary" style={{ width: '100%', background: 'var(--gold)', color: 'black', border: 'none' }}>Assinar Plano Profissional</button>
                        </div>

                        {/* ELITE */}
                        <div style={{ padding: '40px', borderRadius: '30px', border: '1px solid #e2e8f0', background: 'white' }}>
                            <span style={{ fontWeight: 800, color: 'var(--light-slate)', fontSize: '0.8rem', letterSpacing: '1px' }}>POWER ELITE (ESTRATÉGICO)</span>
                            <h4 style={{ fontSize: '3.5rem', fontWeight: 800, margin: '20px 0' }}>R$ 997<span style={{ fontSize: '1rem', color: 'var(--light-slate)' }}>/mês</span></h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: '30px 0', display: 'grid', gap: '15px' }}>
                                <li style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="var(--gold)" /> <b>Cadastros Ilimitados</b></li>
                                <li style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="var(--gold)" /> <b>Radar de Verbas VIP</b></li>
                                <li style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="var(--gold)" /> Mapa de Calor & BI</li>
                            </ul>
                            <button onClick={() => navigate('/login')} style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'transparent', fontWeight: 800, cursor: 'pointer' }}>Falar com Consultor</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ background: 'var(--slate)', color: 'white', padding: '100px 20px', textAlign: 'center' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <ShieldCheck size={60} color="var(--gold)" style={{ margin: '0 auto 30px' }} />
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '20px' }}>Sua reeleição estratégica começa agora.</h2>
                    <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginBottom: '40px' }}>Não deixe dados e recursos para trás. Profissionalize sua gestão pública com quem entende de poder.</p>
                    <button onClick={() => navigate('/login')} style={{ background: 'white', color: 'var(--slate)', padding: '20px 50px', borderRadius: '16px', fontSize: '1.4rem', fontWeight: 900, border: 'none', cursor: 'pointer' }}>
                        Criar Conta do Mandato
                    </button>
                    <div style={{ marginTop: '50px', opacity: 0.5, fontSize: '0.8rem' }}>
                        &copy; 2026 Gabinete Digital Inteligência Política. Tecnologia para o Bem Público.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
