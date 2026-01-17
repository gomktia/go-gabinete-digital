import { useState, useEffect } from 'react';
import { Bot, Sparkles, TrendingUp, Map as MapIcon, Users, MessageSquare, ChevronRight, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '../components/UIComponents';
import { supabase } from '../lib/supabase';
import { useTenant } from '../context/TenantContext';

const VirtualAdvisor = () => {
    const { tenant } = useTenant();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRec, setSelectedRec] = useState<any>(null);
    const [stats, setStats] = useState({ demands: 0, voters: 0, sentiment: 74 });

    // Election Simulator State
    const [calcState, setCalcState] = useState({
        totalVoters: 50000,
        validVotesPercent: 90,
        seats: 15,
        partyVotes: 3500,
        candidateVotes: 1200
    });
    const [calcResult, setCalcResult] = useState<any>(null);

    const calculateQuotient = () => {
        const validVotes = calcState.totalVoters * (calcState.validVotesPercent / 100);
        const quotient = Math.floor(validVotes / calcState.seats);
        const partySeats = Math.floor(calcState.partyVotes / quotient);
        const surplus = calcState.partyVotes % quotient;
        const neededForNext = quotient - surplus;
        const isElected = calcState.candidateVotes >= (quotient * 0.1); // 10% barrier rule roughly

        setCalcResult({ validVotes, quotient, partySeats, neededForNext, isElected });
    };

    useEffect(() => {
        if (tenant.id) {
            fetchStats();
        }
    }, [tenant.id]);

    const fetchStats = async () => {
        const [demandsRes, votersRes] = await Promise.all([
            supabase.from('demands').select('id', { count: 'exact' }).eq('tenant_id', tenant.id),
            supabase.from('voters').select('id', { count: 'exact' }).eq('tenant_id', tenant.id)
        ]);

        setStats({
            demands: demandsRes.count || 0,
            voters: votersRes.count || 0,
            sentiment: 70 + Math.floor(Math.random() * 15) // Simulation of AI sentiment
        });
    };

    const recommendations = [
        {
            category: 'Saúde',
            title: 'Mutirão de Oftalmologia no Bairro Central',
            reason: `Detectamos ${Math.floor(stats.demands * 0.3)} demandas de saúde pendentes na região central, a maioria relacionada a exames especializados.`,
            impact: 'Aumento de 12% na aprovação do bairro',
            complexity: 'Média'
        },
        {
            category: 'Infraestrutura',
            title: 'Iluminação LED na Avenida Principal',
            reason: 'O cruzamento de dados de segurança e reclamações de moradores aponta falta de luz como fator crítico.',
            impact: 'Redução de 15% nas reclamações de segurança',
            complexity: 'Baixa'
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
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
                            <Bot size={32} />
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Cérebro da Equipe (IA)</h1>
                    </div>
                    <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', fontWeight: 500 }}>
                        Inteligência Artificial analisando tendências e sugerindo as melhores jogadas políticas.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button
                        className="btn-gold outline"
                        style={{ borderRadius: '14px', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
                        onClick={() => {
                            alert("IA está processando o Relatório Estratégico Mensal...\n\nSincronizando dados de voters, demands e redes sociais para gerar insights de campanha.");
                        }}
                    >
                        <TrendingUp size={18} /> Relatório de Estratégia
                    </button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem', marginBottom: '3rem' }} className="flex-col-mobile">
                {/* Heatmap Simulation */}
                <div className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <MapIcon size={20} className="text-gold" /> Mapa de Calor da Satisfação
                        </h3>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <span style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', background: '#38a169', borderRadius: '50%' }}></div> FAVORÁVEL</span>
                            <span style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', background: '#e53e3e', borderRadius: '50%' }}></div> CRÍTICO</span>
                        </div>
                    </div>

                    <div style={{ height: '350px', background: '#f1f5f9', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, background: 'url(https://www.transparenttextures.com/patterns/cubes.png)' }}></div>

                        {/* Simulated Heat Zones */}
                        <div style={{ position: 'absolute', top: '20%', left: '30%', width: '100px', height: '100px', background: 'rgba(56, 161, 105, 0.4)', filter: 'blur(30px)', borderRadius: '50%' }}></div>
                        <div style={{ position: 'absolute', top: '50%', left: '60%', width: '120px', height: '120px', background: 'rgba(229, 62, 62, 0.4)', filter: 'blur(40px)', borderRadius: '50%' }}></div>

                        <div style={{ position: 'absolute', top: '25%', left: '35%', background: 'white', padding: '8px 16px', borderRadius: '50px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', cursor: 'pointer' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.75rem' }}>Vila Verde (Forte)</span>
                        </div>
                        <div style={{ position: 'absolute', bottom: '30%', left: '50%', background: 'white', padding: '8px 16px', borderRadius: '50px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', cursor: 'pointer' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.75rem', color: '#e53e3e' }}>Centro (Crítico)</span>
                        </div>
                    </div>
                    <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-light)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={14} className="text-gold" /> Análise baseada em {stats.demands} demandas e interações do WhatsApp.
                    </p>
                </div>

                {/* Scorecards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-card" style={{ background: 'var(--primary)', color: 'white', padding: '2.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.8rem', opacity: 0.8, textTransform: 'uppercase' }}>Popularidade Estimada</span>
                            <TrendingUp size={24} className="text-gold" />
                        </div>
                        <h2 style={{ fontSize: '4rem', margin: '0', fontWeight: 900, color: 'var(--secondary)' }}>{stats.sentiment}%</h2>
                        <p style={{ margin: '10px 0 0 0', opacity: 0.7, fontWeight: 600 }}>Crescimento de 4.2% esta semana</p>
                    </div>

                    <div className="glass-card" style={{ padding: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Impacto de Mandato</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ padding: '10px', background: 'rgba(56, 161, 105, 0.1)', borderRadius: '12px', color: '#38a169' }}>
                                    <Users size={20} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{stats.voters} Eleitores</span>
                                        <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>72% Engajados</span>
                                    </div>
                                    <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '10px', marginTop: '8px' }}>
                                        <div style={{ width: '72%', height: '100%', background: '#38a169', borderRadius: '10px' }}></div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ padding: '10px', background: 'rgba(212, 175, 55, 0.1)', borderRadius: '12px', color: 'var(--secondary)' }}>
                                    <MessageSquare size={20} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Atendimento</span>
                                        <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>98% Eficiência</span>
                                    </div>
                                    <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '10px', marginTop: '8px' }}>
                                        <div style={{ width: '98%', height: '100%', background: 'var(--secondary)', borderRadius: '10px' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                {/* Election Math Simulator - Roadmap Item #4 (Scale National) */}
                <div className="glass-card" style={{ marginBottom: '3rem', borderLeft: '4px solid var(--primary)' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '10px', background: 'var(--primary)', borderRadius: '12px', color: 'white' }}>
                            <Calculator size={24} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0 }}>Termômetro da Reeleição</h3>
                            <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '0.9rem' }}>Simulador de Quociente Eleitoral e Sobras (Matemática Pura)</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Total de Eleitores Aptos</label>
                            <input
                                type="number"
                                className="form-input w-full"
                                value={calcState.totalVoters}
                                onChange={e => setCalcState({ ...calcState, totalVoters: Number(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">% Votos Válidos (Est.)</label>
                            <input
                                type="number"
                                className="form-input w-full"
                                value={calcState.validVotesPercent}
                                onChange={e => setCalcState({ ...calcState, validVotesPercent: Number(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Cadeiras em Disputa</label>
                            <input
                                type="number"
                                className="form-input w-full"
                                value={calcState.seats}
                                onChange={e => setCalcState({ ...calcState, seats: Number(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Votos do Partido</label>
                            <input
                                type="number"
                                className="form-input w-full"
                                value={calcState.partyVotes}
                                onChange={e => setCalcState({ ...calcState, partyVotes: Number(e.target.value) })}
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <button onClick={calculateQuotient} className="btn-gold" style={{ borderRadius: '10px' }}>
                            Simular Resultado
                        </button>
                    </div>

                    <AnimatePresence>
                        {calcResult && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                style={{
                                    marginTop: '2rem',
                                    padding: '1.5rem',
                                    background: 'var(--bg-color)',
                                    borderRadius: '16px',
                                    border: '1px solid var(--border)'
                                }}
                            >
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', textAlign: 'center' }}>
                                    <div>
                                        <div className="text-xs font-bold opacity-60 uppercase">Quociente Eleitoral</div>
                                        <div className="text-2xl font-black text-gray-700">{Math.floor(calcResult.quotient).toLocaleString()}</div>
                                        <div className="text-xs">votos para 1 vaga direta</div>
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold opacity-60 uppercase">Cadeiras do Partido</div>
                                        <div className="text-2xl font-black text-primary">{calcResult.partySeats}</div>
                                        <div className="text-xs">vagas garantidas</div>
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold opacity-60 uppercase">Sobra de Votos</div>
                                        <div className="text-2xl font-black text-secondary">{Math.floor(calcResult.neededForNext).toLocaleString()}</div>
                                        <div className="text-xs">para +1 vaga (aprox.)</div>
                                    </div>
                                </div>
                                <div style={{ marginTop: '1.5rem', padding: '1rem', background: calcResult.partySeats > 0 ? 'rgba(56, 161, 105, 0.1)' : 'rgba(229, 62, 62, 0.1)', borderRadius: '10px', textAlign: 'center' }}>
                                    <h4 style={{ margin: 0, color: calcResult.partySeats > 0 ? '#38a169' : '#e53e3e', fontWeight: 800 }}>
                                        {calcResult.partySeats > 0 ? 'PARTIDO FAZ CADEIRA!' : 'PARTIDO AINDA NÃO ATINGIU O QUOCIENTE'}
                                    </h4>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Sparkles className="text-gold" /> Próximas Jogadas Sugeridas
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginTop: '1.5rem' }} className="flex-col-mobile">
                    {recommendations.map((rec, i) => (
                        <div key={i} className="glass-card" style={{ borderTop: `4px solid ${i === 0 ? 'var(--secondary)' : '#3182ce'}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <span style={{ padding: '4px 12px', borderRadius: '6px', background: 'var(--bg-color)', fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-light)', border: '1px solid var(--border)' }}>{rec.category}</span>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3182ce' }}>PRIORIDADE ALTA</span>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{rec.title}</h3>
                            <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                                <strong>RACIONAL IA:</strong> {rec.reason}
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                                <div>
                                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: '#38a169' }}>IMPACTO ESTIMADO</p>
                                    <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600 }}>{rec.impact}</p>
                                </div>
                                <button className="btn-gold outline" style={{ borderRadius: '10px', fontSize: '0.85rem' }} onClick={() => { setSelectedRec(rec); setIsModalOpen(true); }}>
                                    Analisar Viabilidade <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Análise Profunda de Viabilidade">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {selectedRec && (
                        <>
                            <div className="glass-card" style={{ background: 'rgba(15,23,42,0.02)', border: '1px dashed var(--border)' }}>
                                <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Bot size={18} className="text-gold" /> Conclusão do Agente IA</h4>
                                <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>"Este projeto tem alta probabilidade de conversão de apoio neutro em votos consolidados se anunciado via tráfego pago geolocalizado nos bairros afetados."</p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div>
                                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 800, opacity: 0.6 }}>CUSTO POLÍTICO</p>
                                    <h4 style={{ margin: '5px 0 0 0', color: '#38a169' }}>Extremamente Baixo</h4>
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 800, opacity: 0.6 }}>TEMPO EXECUÇÃO</p>
                                    <h4 style={{ margin: '5px 0 0 0', color: 'var(--secondary)' }}>Imediata (Indicação)</h4>
                                </div>
                            </div>

                            <button className="btn-gold" style={{ padding: '18px', borderRadius: '16px', fontWeight: 800 }} onClick={() => setIsModalOpen(false)}>
                                Converter em Projeto / Indicação
                            </button>
                        </>
                    )}
                </div>
            </Modal>
        </motion.div>
    );
};

export default VirtualAdvisor;
