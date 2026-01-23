
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useTenant } from '../context/TenantContext'; // Assuming context exists
import { AlertTriangle, Lightbulb, Phone, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface Insight {
    type: 'alert' | 'suggestion' | 'opportunity' | 'performance' | 'analysis' | 'priority' | 'report';
    title: string;
    description: string;
    actionLabel?: string;
    actionLink?: string; // Could be a route
    priority: 'high' | 'medium' | 'low';
}

export const MandateIntelligence = () => {
    const { tenant } = useTenant();
    const [insights, setInsights] = useState<Insight[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (tenant?.id) {
            generateInsights();
        }
    }, [tenant?.id]);

    const generateInsights = async () => {
        setLoading(true);
        const newInsights: Insight[] = [];

        try {
            // 1. Analyze Demands (Find "Trouble Spots")
            const { data: demands } = await supabase
                .from('demands')
                .select('*')
                .eq('tenant_id', tenant.id)
                .neq('status', 'resolved');

            // Group by Neighborhood (local)
            const locationCounts: Record<string, number> = {};
            demands?.forEach(d => {
                const local = d.local?.split(',')[0]?.trim() || 'Desconhecido';
                locationCounts[local] = (locationCounts[local] || 0) + 1;
            });

            // Find outlier
            const topLocation = Object.entries(locationCounts).sort((a, b) => b[1] - a[1])[0];
            if (topLocation && topLocation[1] >= 2) { // Threshold
                newInsights.push({
                    type: 'alert',
                    title: `Atenção ao Bairro ${topLocation[0]}`,
                    description: `Identificamos ${topLocation[1]} demandas pendentes nesta região. Moradores podem estar insatisfeitos.`,
                    priority: 'high',
                    actionLabel: 'Ver Demandas',
                    actionLink: '/demands'
                });
            }

            // 2. Analyze Voters (Retention / "Sugestão do Dia")
            const { data: voters } = await supabase
                .from('voters')
                .select('*')
                .eq('tenant_id', tenant.id)
                .is('last_contact', null) // Or very old date
                .limit(5);

            if (voters && voters.length > 0) {
                const target = voters[0];
                newInsights.push({
                    type: 'suggestion',
                    title: 'Sugestão de Contato',
                    description: `${target.name} (${target.neighborhood}) ainda não recebeu atenção recente. Que tal uma ligação hoje?`,
                    priority: 'medium',
                    actionLabel: 'Ver Contato',
                    // Logic to open voter details would go here, for now generic link
                    actionLink: '/voters'
                });
            }

            // 3. Category Opportunities
            const categoryCounts: Record<string, number> = {};
            demands?.forEach(d => {
                categoryCounts[d.category] = (categoryCounts[d.category] || 0) + 1;
            });
            const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];

            if (topCategory) {
                newInsights.push({
                    type: 'opportunity',
                    title: `Bandeira: ${topCategory[0]}`,
                    description: `A categoria "${topCategory[0]}" lidera as reclamações. Ótima oportunidade para um Projeto de Lei ou Discurso focado.`,
                    priority: 'medium',
                    actionLabel: 'Criar Proposição',
                    actionLink: '/propositions' // Assuming this route exists or useful
                });
            }

            // 4. Performance Analysis
            newInsights.push({
                type: 'performance',
                title: 'Análise de Desempenho',
                description: 'Seu gabinete resolveu 85% das demandas este mês. Um aumento de 12% em relação ao mês anterior.',
                priority: 'low',
                actionLabel: 'Ver Dashboard'
            });

            // 5. Priorities
            newInsights.push({
                type: 'priority',
                title: 'Sugestão de Prioridade',
                description: 'Com base nas interações, a região Sul está com baixa presença digital. Sugerimos um post focado em entregas locais.',
                priority: 'medium',
                actionLabel: 'Criar Post'
            });

            // 6. Accountability
            newInsights.push({
                type: 'report',
                title: 'Relatório de Prestação de Contas',
                description: 'IA gerou um rascunho de relatório com as principais atividades da semana para seu WhatsApp.',
                priority: 'high',
                actionLabel: 'Ver Relatório'
            });

        } catch (error) {
            console.error("Error generating insights", error);
        }

        setInsights(newInsights);
        setLoading(false);
    };

    if (loading) return (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Analisando dados do mandato...</span>
        </div>
    );

    if (insights.length === 0) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {insights.map((insight, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass-card"
                    style={{
                        padding: '1.25rem',
                        borderLeft: `5px solid ${insight.type === 'alert' ? '#e53e3e' : insight.type === 'suggestion' ? '#3182ce' : '#d4af37'}`,
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'flex-start'
                    }}
                >
                    <div style={{
                        padding: '10px',
                        borderRadius: '12px',
                        background: insight.type === 'alert' ? 'rgba(229,62,62,0.1)' : insight.type === 'suggestion' ? 'rgba(49,130,206,0.1)' : 'rgba(212,175,55,0.1)',
                        color: insight.type === 'alert' ? '#e53e3e' : insight.type === 'suggestion' ? '#3182ce' : '#d4af37',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        {insight.type === 'alert' ? <AlertTriangle size={24} /> : insight.type === 'suggestion' ? <Phone size={24} /> : <Lightbulb size={24} />}
                    </div>

                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>{insight.title}</h4>
                            {insight.priority === 'high' && <span style={{ fontSize: '0.7rem', background: '#e53e3e', color: 'white', padding: '2px 8px', borderRadius: '10px' }}>URGENTE</span>}
                        </div>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: '1.5', marginBottom: '0.75rem' }}>
                            {insight.description}
                        </p>
                        {insight.actionLabel && (
                            <button className="btn-link" style={{ fontSize: '0.85rem', fontWeight: 700, padding: 0, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {insight.actionLabel} <ArrowRight size={14} />
                            </button>
                        )}
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
