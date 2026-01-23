import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload, Sparkles, Calendar as CalendarIcon,
    Instagram, Facebook, Clock, CheckCircle,
    Share2, Image as ImageIcon, Wand2,
    RefreshCw, Trash2, Send, Check
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTenant } from '../context/TenantContext';

interface Post {
    id: string;
    title: string;
    platform: string;
    scheduled_for: string;
    status: string;
    content: string;
    image_url: string | null;
}

const SocialMediaPlanner = () => {
    const { tenant } = useTenant();
    const [activeTab, setActiveTab] = useState('create');
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedOptions, setGeneratedOptions] = useState<any[]>([]);

    // Form for generation
    const [context, setContext] = useState('');

    useEffect(() => {
        if (tenant.id) {
            fetchPosts();
        }
    }, [tenant.id]);

    const fetchPosts = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('social_posts')
            .select('*')
            .eq('tenant_id', tenant.id)
            .order('scheduled_for', { ascending: true });

        if (error) console.error('Error fetching posts:', error);
        else setPosts(data || []);
        setIsLoading(false);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setUploadedImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const generateWithAI = () => {
        setIsGenerating(true);
        // Simulate AI Content Generation
        setTimeout(() => {
            const options = [
                {
                    platform: 'Instagram',
                    icon: Instagram,
                    color: '#E1306C',
                    content: `Impacto real! 🚀 Hoje visitei as obras da nova creche. Como seu vereador, meu compromisso é com o futuro das nossas crianças. #Educação #Transparência`,
                },
                {
                    platform: 'Facebook',
                    icon: Facebook,
                    color: '#1877F2',
                    content: `Boa tarde, amigos! Estivemos acompanhando a zeladoria urbana no Setor Norte. Contem com meu gabinete para fiscalizar cada centavo do seu imposto. #TrabalhoSério`,
                }
            ];
            setGeneratedOptions(options);
            setIsGenerating(false);
        }, 1500);
    };

    const schedulePost = async (option: any) => {
        if (!tenant.id) return;

        const newPost = {
            tenant_id: tenant.id,
            title: `Post ${option.platform} - ${new Date().toLocaleDateString()}`,
            platform: option.platform,
            content: option.content,
            status: 'scheduled',
            scheduled_for: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        };

        const { data, error } = await supabase.from('social_posts').insert([newPost]).select();

        if (error) alert('Erro ao agendar');
        else {
            if (data && data.length > 0) {
                setPosts([...posts, data[0]]);
                alert('Post agendado para amanhã!');
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
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
                            <Share2 size={32} />
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Comunicação & IA</h1>
                    </div>
                    <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', fontWeight: 500 }}>
                        Agente de conteúdo estratégico para redes sociais e discursos.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }} className="flex-col-mobile">
                    <button
                        className={`btn-gold ${activeTab === 'create' ? '' : 'outline'}`}
                        onClick={() => setActiveTab('create')}
                        style={{ borderRadius: '14px', border: '1px solid var(--secondary)', background: activeTab === 'create' ? 'var(--primary)' : 'rgba(212,175,55,0.05)', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Sparkles size={18} /> Social Media IA
                    </button>
                    <button
                        className={`btn-gold ${activeTab === 'schedule' ? '' : 'outline'}`}
                        onClick={() => setActiveTab('schedule')}
                        style={{ borderRadius: '14px' }}
                    >
                        <CalendarIcon size={18} /> Agenda de Ações
                    </button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
                <button className="ai-action-card" onClick={generateWithAI}>
                    <Wand2 size={24} />
                    <span>Sugestão de Postagem</span>
                </button>
                <button className="ai-action-card">
                    <ImageIcon size={24} />
                    <span>Criar Reel (Script/Legenda)</span>
                </button>
                <button className="ai-action-card">
                    <Upload size={24} />
                    <span>Legenda Carrossel</span>
                </button>
                <button className="ai-action-card">
                    <Send size={24} />
                    <span>Gerar Discurso</span>
                </button>
            </div>

            <style>{`
                .ai-action-card {
                    background: var(--surface);
                    border: 1px solid var(--border);
                    padding: 1.5rem;
                    border-radius: 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                    cursor: pointer;
                    transition: all 0.3s;
                    color: var(--text);
                }
                .ai-action-card:hover {
                    border-color: var(--secondary);
                    background: rgba(212,175,55,0.05);
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.05);
                }
                .ai-action-card span {
                    font-size: 0.85rem;
                    font-weight: 700;
                    text-align: center;
                }
                .ai-action-card svg {
                    color: var(--secondary);
                }
            `}</style>

            <AnimatePresence mode="wait">
                {activeTab === 'create' ? (
                    <motion.div
                        key="create"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2.5rem' }}
                        className="grid-2-1"
                    >
                        {/* Editor Side */}
                        <div className="glass-card">
                            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <ImageIcon size={20} className="text-gold" /> Mídia & Contexto
                            </h3>

                            <div style={{
                                height: '300px',
                                background: uploadedImage ? `url(${uploadedImage}) center/cover` : 'rgba(15,23,42,0.05)',
                                border: '2px dashed var(--border)',
                                borderRadius: '24px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                position: 'relative',
                                marginBottom: '2rem',
                                transition: 'all 0.3s'
                            }}>
                                <input type="file" onChange={handleImageUpload} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                                {!uploadedImage && (
                                    <>
                                        <Upload size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                                        <p style={{ fontWeight: 700, opacity: 0.5 }}>Carregar Foto ou Vídeo</p>
                                    </>
                                )}
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.6 }}>O que aconteceu?</label>
                                <textarea
                                    className="form-input"
                                    rows={4}
                                    placeholder="Dê um contexto para a IA... (ex: Visitei a UBS do Centro e conversei com os médicos)"
                                    value={context}
                                    onChange={(e) => setContext(e.target.value)}
                                    style={{ width: '100%', borderRadius: '16px' }}
                                />
                            </div>

                            <button className="btn-gold" style={{ width: '100%', padding: '18px', borderRadius: '16px', fontSize: '1.1rem' }} onClick={generateWithAI} disabled={isGenerating}>
                                {isGenerating ? <RefreshCw className="spin" /> : <><Sparkles size={22} /> Gerar Legendas com IA</>}
                            </button>
                        </div>

                        {/* Results Side */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <CheckCircle size={20} className="text-gold" /> Sugestões Criadas
                            </h3>
                            {generatedOptions.length === 0 && !isGenerating ? (
                                <div className="glass-card" style={{ textAlign: 'center', padding: '5rem', opacity: 0.5 }}>
                                    <Sparkles size={48} style={{ marginBottom: '1rem' }} />
                                    <p>Aguardando upload e contexto...</p>
                                </div>
                            ) : (
                                generatedOptions.map((opt, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="glass-card"
                                        style={{ borderLeft: `6px solid ${opt.color}` }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <opt.icon size={20} color={opt.color} />
                                                <span style={{ fontWeight: 800 }}>{opt.platform}</span>
                                            </div>
                                            <button className="close-btn" style={{ transform: 'none' }} title="Copiar"><Share2 size={14} /></button>
                                        </div>
                                        <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text)' }}>{opt.content}</p>
                                        <div style={{ display: 'flex', gap: '8px', marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                                            <button className="btn-gold outline" style={{ flex: 1, fontSize: '0.8rem' }} onClick={() => schedulePost(opt)}>
                                                <Clock size={16} /> Agendar
                                            </button>
                                            <button className="btn-gold" style={{ flex: 1, fontSize: '0.8rem' }}>
                                                <Send size={16} /> Postar Agora
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="schedule"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        <div className="glass-card">
                            <h3 style={{ marginBottom: '2rem' }}>Postagens Agendadas</h3>
                            {isLoading ? <RefreshCw className="spin" /> : posts.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '5rem', opacity: 0.5 }}>Nenhum post agendado.</div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                    {posts.map(post => (
                                        <div key={post.id} className="glass-card" style={{ background: 'rgba(15,23,42,0.02)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                                <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--secondary)' }}>{post.platform}</span>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                                                    <Clock size={14} /> {new Date(post.scheduled_for).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>{post.content.substring(0, 100)}...</p>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                                <button className="close-btn" style={{ transform: 'none' }}><Trash2 size={14} /></button>
                                                <button className="close-btn" style={{ transform: 'none', color: '#38a169', borderColor: '#38a169' }}><Check size={14} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default SocialMediaPlanner;
