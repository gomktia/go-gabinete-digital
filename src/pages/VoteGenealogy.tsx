
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ChevronRight, ChevronDown, User, Star } from 'lucide-react';
import { useTenant } from '../context/TenantContext';
import { supabase } from '../lib/supabase';

interface TreeNode {
    id: string;
    name: string;
    status: string;
    children: TreeNode[];
    totalDescendants: number;
    directDescendants: number;
}

const VoteGenealogy = () => {
    const { tenant } = useTenant();
    const [treeData, setTreeData] = useState<TreeNode[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (tenant.id) {
            fetchGenealogy();
        }
    }, [tenant.id]);

    const fetchGenealogy = async () => {
        setLoading(true);
        const { data: voters, error } = await supabase
            .from('voters')
            .select('id, name, status, referrer_id')
            .eq('tenant_id', tenant.id);

        if (error) {
            console.error(error);
            setLoading(false);
            return;
        }

        // Build Tree
        const nodeMap = new Map<string, TreeNode>();

        // 1. Initialize nodes
        voters?.forEach(v => {
            nodeMap.set(v.id, {
                id: v.id,
                name: v.name,
                status: v.status,
                children: [],
                totalDescendants: 0,
                directDescendants: 0
            });
        });

        const roots: TreeNode[] = [];

        // 2. Build Hierarchy
        voters?.forEach(v => {
            const node = nodeMap.get(v.id)!;
            if (v.referrer_id && nodeMap.has(v.referrer_id)) {
                const parent = nodeMap.get(v.referrer_id)!;
                parent.children.push(node);
                parent.directDescendants++;
            } else {
                roots.push(node);
            }
        });

        // 3. Calculate Totals (Recursive)
        const calculateTotals = (node: TreeNode): number => {
            let count = 0;
            node.children.forEach(child => {
                count += 1 + calculateTotals(child);
            });
            node.totalDescendants = count;
            return count;
        };

        roots.forEach(root => calculateTotals(root));

        // Sort roots by influence
        roots.sort((a, b) => b.totalDescendants - a.totalDescendants);

        setTreeData(roots);
        setLoading(false);
    };

    const NodeComponent = ({ node, level = 0 }: { node: TreeNode, level?: number }) => {
        const [isOpen, setIsOpen] = useState(true);
        const hasChildren = node.children.length > 0;

        // Color based on status
        const getStatusColor = (s: string) => {
            if (s === 'ganho') return '#38a169';
            if (s === 'indeciso') return '#d69e2e';
            if (s === 'perdido') return '#e53e3e';
            return '#718096';
        };

        return (
            <div style={{ marginLeft: level > 0 ? '24px' : '0', position: 'relative' }}>
                {/* Connection Line (Vertical) - simplified logic */}
                {level > 0 && (
                    <div style={{
                        position: 'absolute',
                        left: '-12px',
                        top: '-10px',
                        bottom: '50%',
                        width: '2px',
                        background: 'var(--border)'
                    }}></div>
                )}
                {level > 0 && (
                    <div style={{
                        position: 'absolute',
                        left: '-12px',
                        top: '24px',
                        width: '12px',
                        height: '2px',
                        background: 'var(--border)'
                    }}></div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px',
                        marginBottom: '8px',
                        background: 'var(--bg-color)',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        width: 'fit-content',
                        minWidth: '250px'
                    }}
                >
                    {hasChildren && (
                        <div
                            onClick={() => setIsOpen(!isOpen)}
                            style={{
                                cursor: 'pointer',
                                padding: '4px',
                                borderRadius: '4px',
                                display: 'flex', alignItems: 'center'
                            }}
                        >
                            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </div>
                    )}
                    {!hasChildren && <div style={{ width: '22px' }}></div>}

                    <div style={{
                        width: '32px', height: '32px',
                        borderRadius: '50%',
                        background: getStatusColor(node.status),
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: 800, fontSize: '0.8rem'
                    }}>
                        {node.name.charAt(0)}
                    </div>

                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{node.name}</div>
                        <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                            {node.totalDescendants} votos trazidos
                        </div>
                    </div>

                    {node.totalDescendants > 5 && (
                        <Star size={14} fill="#d4af37" color="#d4af37" />
                    )}
                </motion.div>

                <AnimatePresence>
                    {isOpen && hasChildren && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            style={{ overflow: 'hidden' }}
                        >
                            <div style={{ position: 'relative', paddingLeft: '0' }}>
                                {/* Vertical line for children group */}
                                <div style={{
                                    position: 'absolute',
                                    left: '11px',
                                    top: '0',
                                    bottom: '10px',
                                    width: '2px',
                                    background: 'var(--border)'
                                }}></div>

                                {node.children.sort((a, b) => b.totalDescendants - a.totalDescendants).map(child => (
                                    <NodeComponent key={child.id} node={child} level={level + 1} />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ padding: '0 0 4rem 0' }}
        >
            <header className="responsive-header">
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <div style={{
                            padding: '12px',
                            background: 'var(--primary)',
                            borderRadius: '16px',
                            color: 'var(--secondary)',
                        }}>
                            <Users size={32} />
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Árvore do Voto</h1>
                    </div>
                    <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', fontWeight: 500 }}>
                        Visualize a influência dos seus cabos eleitorais e a genealogia da sua base.
                    </p>
                </div>
            </header>

            <div className="glass-card" style={{ minHeight: '60vh', overflowX: 'auto', padding: '2rem' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>Carregando genealogia...</div>
                ) : treeData.length === 0 ? (
                    <div style={{ textAlign: 'center', opacity: 0.6 }}>Nenhum voto cadastrado ou sem relações de indicação.</div>
                ) : (
                    <div>
                        <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(212,175,55,0.1)', borderRadius: '12px', color: 'var(--secondary)', display: 'inline-flex', gap: '10px', alignItems: 'center' }}>
                            <User size={20} />
                            <span style={{ fontWeight: 800 }}>Candidato (Você)</span>
                        </div>
                        {treeData.map(root => (
                            <NodeComponent key={root.id} node={root} level={1} />
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default VoteGenealogy;
