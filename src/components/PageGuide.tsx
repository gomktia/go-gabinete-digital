
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, ChevronRight, Lightbulb } from 'lucide-react';

interface GuideStep {
    title: string;
    description: string;
    icon?: any;
}

const guides: Record<string, GuideStep[]> = {
    '/': [ // Dashboard
        { title: 'Painel de Comando', description: 'Aqui você tem a visão geral do seu mandato. Acompanhe eleitores, metas e finanças em tempo real.', icon: Lightbulb },
        { title: 'Inteligência Artificial', description: 'Nossa IA analisa seus dados e sugere ações automáticas, como ligar para um eleitor esquecido.', icon: Lightbulb },
        { title: 'Menu Lateral', description: 'Navegue por todas as ferramentas aqui. Comece cadastrando seus eleitores no CRM.', icon: ChevronRight }
    ],
    '/voters': [
        { title: 'Base de Eleitores (CRM)', description: 'O coração do seu mandato. Cadastre cada pessoa, suas informações e segmentações.', icon: Lightbulb },
        { title: 'Filtros Poderosos', description: 'Use os filtros para encontrar "Mulheres do Bairro Centro" ou "Aniversariantes do Mês".', icon: Lightbulb }
    ],
    '/demands': [
        { title: 'Gestão de Demandas', description: 'Nunca mais perca um pedido. Registre buracos, podas, saúdes e acompanhe o status.', icon: Lightbulb },
        { title: 'Kanban', description: 'Arraste os cartões para mudar o status de "A Fazer" para "Concluído". O eleitor pode ser avisado automaticamente.', icon: Lightbulb }
    ],
    '/verbas': [
        { title: 'Radar de Verbas', description: 'Monitoramos Diários Oficiais para encontrar dinheiro para sua cidade.', icon: Lightbulb },
        { title: 'Filtros de Oportunidade', description: 'Busque por "Esporte", "Cultura" ou "Infraestrutura" para filtrar editais.', icon: Lightbulb }
    ],
    '/genealogy': [
        { title: 'Árvore de Votos', description: 'Veja quem indicou quem. Ideal para medir a fidelidade e produtividade da sua equipe.', icon: Lightbulb }
    ],
    '/finance': [
        { title: 'Blindagem Financeira', description: 'Lance receitas e despesas. O sistema avisa se você estiver chegando perto do teto do TSE.', icon: Lightbulb }
    ]
};

export const PageGuide = () => {
    const location = useLocation();
    const [isVisible, setIsVisible] = useState(false);
    const [minimized] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const currentGuide = guides[location.pathname];

    useEffect(() => {
        // Show automatically only once per session/page refresh for demo purposes
        // In prod, use localStorage to show only once ever
        if (currentGuide) {
            const hasSeen = localStorage.getItem(`guide_seen_${location.pathname}`);
            if (!hasSeen) {
                setIsVisible(true);
            }
        }
    }, [location.pathname]);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem(`guide_seen_${location.pathname}`, 'true');
    };

    const handleNext = () => {
        if (currentStep < (currentGuide?.length || 0) - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleDismiss();
        }
    };

    if (!currentGuide) return null;

    if (!isVisible && !minimized) return (
        <button
            onClick={() => setIsVisible(true)}
            className="mobile-hide"
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'var(--primary)',
                color: 'var(--secondary)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 9999
            }}
            title="Ajuda da Página"
        >
            <HelpCircle size={28} />
        </button>
    );

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    style={{
                        position: 'fixed',
                        bottom: '30px',
                        right: '30px',
                        width: '320px',
                        background: 'var(--surface)', // Use theme vars
                        backdropFilter: 'blur(10px)',
                        borderRadius: '20px',
                        border: '1px solid var(--secondary)',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                        zIndex: 10000,
                        overflow: 'hidden',
                        color: 'var(--text)'
                    }}
                >
                    <div style={{ background: 'var(--primary)', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 800, color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <HelpCircle size={18} /> Guia Rápido
                        </span>
                        <button onClick={handleDismiss} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                            <X size={18} />
                        </button>
                    </div>

                    <div style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', marginBottom: '15px' }}>
                            <div style={{ background: 'rgba(212,175,55,0.1)', padding: '10px', borderRadius: '12px', color: 'var(--secondary)' }}>
                                <Lightbulb size={24} />
                            </div>
                            <div>
                                <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem', fontWeight: 700 }}>{currentGuide[currentStep].title}</h4>
                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: '1.5' }}>
                                    {currentGuide[currentStep].description}
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                {currentGuide.map((_, i) => (
                                    <div key={i} style={{
                                        width: '8px', height: '8px', borderRadius: '50%',
                                        background: i === currentStep ? 'var(--secondary)' : 'var(--border)'
                                    }} />
                                ))}
                            </div>
                            <button
                                onClick={handleNext}
                                className="btn-gold"
                                style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '8px' }}
                            >
                                {currentStep === currentGuide.length - 1 ? 'Entendi' : 'Próximo'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
