
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    CheckCircle, Shield, Zap, Users, Building2,
    ArrowRight
} from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ background: '#0f172a', minHeight: '100vh', color: 'white', overflowX: 'hidden' }}>

            {/* Hero Section */}
            <section style={{
                position: 'relative',
                minHeight: '90vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                background: 'radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)'
            }}>
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: 'radial-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    opacity: 0.3
                }}></div>

                <div className="container" style={{ maxWidth: '1200px', zIndex: 2, textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span style={{
                            display: 'inline-block',
                            padding: '8px 16px',
                            borderRadius: '50px',
                            background: 'rgba(212, 175, 55, 0.1)',
                            color: '#d4af37',
                            border: '1px solid rgba(212, 175, 55, 0.3)',
                            fontWeight: 600,
                            letterSpacing: '1px',
                            marginBottom: '1.5rem',
                            textTransform: 'uppercase',
                            fontSize: '0.9rem'
                        }}>
                            Plataforma de Inteligência Política
                        </span>

                        <h1 style={{
                            fontSize: 'clamp(3rem, 6vw, 5rem)',
                            fontWeight: 800,
                            lineHeight: 1.1,
                            marginBottom: '1.5rem',
                            background: 'linear-gradient(135deg, #fff 0%, #cbd5e1 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Transforme Votos em <br />
                            <span style={{ color: '#d4af37', WebkitTextFillColor: '#d4af37' }}>Poder Político Real</span>
                        </h1>

                        <p style={{
                            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                            color: '#94a3b8',
                            maxWidth: '800px',
                            margin: '0 auto 3rem',
                            lineHeight: 1.6
                        }}>
                            O primeiro sistema All-in-One do Brasil que une CRM Eleitoral, Inteligência Artificial de Discursos e Monitoramento de Verbas Federais.
                        </p>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => navigate('/login')}
                                style={{
                                    padding: '1.2rem 2.5rem',
                                    fontSize: '1.1rem',
                                    fontWeight: 700,
                                    borderRadius: '16px',
                                    background: '#d4af37',
                                    color: '#0f172a',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    boxShadow: '0 0 20px rgba(212, 175, 55, 0.3)'
                                }}
                            >
                                Começar Agora <ArrowRight size={20} />
                            </button>
                            <button
                                onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}
                                style={{
                                    padding: '1.2rem 2.5rem',
                                    fontSize: '1.1rem',
                                    fontWeight: 700,
                                    borderRadius: '16px',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    color: 'white',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    cursor: 'pointer',
                                    backdropFilter: 'blur(10px)'
                                }}
                            >
                                Ver Planos
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section style={{ padding: '6rem 2rem', background: '#0f172a' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>Sua Gestão em Outro Nível</h2>
                        <p style={{ fontSize: '1.2rem', color: '#94a3b8' }}>Esqueça planilhas. Tenha uma verdadeira máquina de guerra eleitoral.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                        {[
                            {
                                icon: Users, color: '#3182ce', title: 'CRM Preditivo',
                                desc: 'Não apenas guarde contatos. Saiba quem vai votar em você antes mesmo da campanha começar com segmentação inteligente.'
                            },
                            {
                                icon: Shield, color: '#d4af37', title: 'Radar de Verbas',
                                desc: 'Nosso robô monitora Diários Oficiais e avisa quando há verbas federais ou estaduais disponíveis para sua cidade.'
                            },
                            {
                                icon: Zap, color: '#e53e3e', title: 'IA Generativa',
                                desc: 'Deixe nossa Inteligência Artificial escrever seus discursos, ofícios e legendas para Instagram em segundos.'
                            },
                            {
                                icon: Building2, color: '#38a169', title: 'Dashboard de Obras',
                                desc: 'Para prefeitos: Mapas interativos de entregas e obras para prestar contas e garantir a reeleição.'
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                style={{
                                    padding: '2.5rem',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    borderRadius: '24px',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                }}
                                whileHover={{ y: -10 }}
                            >
                                <div style={{
                                    width: '60px', height: '60px', borderRadius: '16px',
                                    background: `${item.color}20`, color: item.color,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '1.5rem'
                                }}>
                                    <item.icon size={30} />
                                </div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>{item.title}</h3>
                                <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Plans */}
            <section id="plans" style={{ padding: '6rem 2rem', background: 'linear-gradient(to bottom, #0f172a, #1e293b)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>Planos para Vencedores</h2>
                        <p style={{ fontSize: '1.2rem', color: '#94a3b8' }}>Escolha a infraestrutura ideal para o tamanho do seu desafio.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'start' }}>
                        {/* ESSENTIAL */}
                        <div style={{
                            padding: '3rem 2rem',
                            background: 'rgba(255, 255, 255, 0.02)',
                            borderRadius: '24px',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                            <h3 style={{ color: '#94a3b8', fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>ESSENCIAL</h3>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', marginBottom: '2rem' }}>
                                <span style={{ fontSize: '3rem', fontWeight: 800 }}>197</span>
                                <span style={{ color: '#94a3b8' }}>/mês</span>
                            </div>
                            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Para vereadores de cidades pequenas ou iniciantes.</p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <li style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="#38a169" /> Até 2.000 Eleitores</li>
                                <li style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="#38a169" /> 2 Assessores</li>
                                <li style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="#38a169" /> Agenda Digital</li>
                                <li style={{ display: 'flex', gap: '10px', opacity: 0.5 }}><CheckCircle size={20} color="#64748b" /> Sem Radar de Verbas</li>
                            </ul>
                            <button onClick={() => navigate('/login')} style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Começar Grátis</button>
                        </div>

                        {/* PROFESSIONAL - HIGHLIGHTED */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            style={{
                                padding: '3rem 2rem',
                                background: 'rgba(20, 20, 30, 0.8)',
                                borderRadius: '24px',
                                border: '2px solid #d4af37',
                                position: 'relative',
                                boxShadow: '0 0 40px rgba(212, 175, 55, 0.2)'
                            }}
                        >
                            <div style={{
                                position: 'absolute', top: -15, left: '50%', transform: 'translateX(-50%)',
                                background: '#d4af37', color: 'black', padding: '5px 15px', borderRadius: '20px',
                                fontSize: '0.8rem', fontWeight: 800
                            }}>
                                MAIS POPULAR
                            </div>
                            <h3 style={{ color: '#d4af37', fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>PROFISSIONAL</h3>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', marginBottom: '2rem' }}>
                                <span style={{ fontSize: '3.5rem', fontWeight: 800 }}>497</span>
                                <span style={{ color: '#94a3b8' }}>/mês</span>
                            </div>
                            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Para gabinetes ativos que precisam de produtividade.</p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <li style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="#d4af37" /> Até 15.000 Eleitores</li>
                                <li style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="#d4af37" /> 10 Assessores</li>
                                <li style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="#d4af37" /> IA (Discursos e Legendas)</li>
                                <li style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="#d4af37" /> Gerador de Ofícios PDF</li>
                            </ul>
                            <button onClick={() => navigate('/login')} style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: '#d4af37', color: '#0f172a', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Assinar Agora</button>
                        </motion.div>

                        {/* ELITE */}
                        <div style={{
                            padding: '3rem 2rem',
                            background: 'rgba(255, 255, 255, 0.02)',
                            borderRadius: '24px',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                            <h3 style={{ color: '#94a3b8', fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>ELITE POWER</h3>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', marginBottom: '2rem' }}>
                                <span style={{ fontSize: '3rem', fontWeight: 800 }}>997</span>
                                <span style={{ color: '#94a3b8' }}>/mês</span>
                            </div>
                            <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Para quem joga para ganhar. Inteligência total.</p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <li style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="#38a169" /> CRM Ilimitado</li>
                                <li style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="#38a169" /> Radar de Verbas (Money)</li>
                                <li style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="#38a169" /> Árvore de Votos (Genealogia)</li>
                                <li style={{ display: 'flex', gap: '10px' }}><CheckCircle size={20} color="#38a169" /> Gerente de Contas Dedicado</li>
                            </ul>
                            <button onClick={() => navigate('/login')} style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Falar com Consultor</button>
                        </div>
                    </div>
                </div>
            </section>

            <footer style={{ padding: '3rem 2rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', color: '#64748b' }}>
                <p>&copy; 2026 Gabinete Digital Inteligência Política Ltda. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
