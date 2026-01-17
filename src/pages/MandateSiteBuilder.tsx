import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Save, MessageCircle, RefreshCw,
    Palette, Video, Image as ImageIcon, Newspaper, Plus, Trash2, ExternalLink
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTenant } from '../context/TenantContext';

const MandateSiteBuilder = () => {
    const { tenant } = useTenant();
    const [siteConfig, setSiteConfig] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPublishing, setIsPublishing] = useState(false);
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [activeTab, setActiveTab] = useState<'content' | 'style'>('content');

    // Default configuration with Full Features
    const defaultConfig = {
        meta: {
            title: `Vereador ${tenant.name || 'Nome'}`,
            description: 'Trabalhando por uma cidade melhor.'
        },
        theme: {
            primary: '#0f172a',
            secondary: '#d4af37',
            background: '#f8fafc',
            text: '#1e293b',
            font: 'Inter'
        },
        sections: {
            hero: {
                enabled: true,
                title: `Vereador ${tenant.name || 'Nome'}`,
                subtitle: 'Trabalhando por uma cidade melhor e mais justa.',
                number: '12.345',
                bgImage: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&q=80&w=2000',
                overlayOpacity: 0.7,
                bgColor: '#0f172a',
                textColor: '#ffffff'
            },
            bio: {
                enabled: true,
                title: 'Quem Sou',
                content: 'Nascido e criado nesta cidade, dedico minha vida ao serviço público...',
                bgColor: '#ffffff',
                textColor: '#1e293b'
            },
            projects: {
                enabled: true,
                title: 'Projetos de Lei',
                items: [
                    { title: 'Lei da Transparência', status: 'Aprovado', desc: 'Garante acesso total aos gastos públicos.' },
                    { title: 'Programa Bairro Seguro', status: 'Em Tramitação', desc: 'Instalação de câmeras inteligentes.' }
                ],
                bgColor: '#f1f5f9',
                textColor: '#1e293b'
            },
            video: {
                enabled: true,
                title: 'Destaque da Semana',
                url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Default embed URL
                bgColor: '#f1f5f9',
                textColor: '#1e293b'
            },
            gallery: {
                enabled: true,
                title: 'Nossas Ações',
                images: [
                    'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&q=80&w=800',
                    'https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&q=80&w=800'
                ],
                bgColor: '#ffffff',
                textColor: '#1e293b'
            },
            news: {
                enabled: true,
                title: 'Últimas Notícias',
                posts: [
                    { title: 'Aprovado Projeto de Lei 123', date: '12/10/2026', snippet: 'Grande vitória para a educação municipal.' },
                    { title: 'Visita ao Bairro Centro', date: '05/10/2026', snippet: 'Ouvindo as demandas da população.' }
                ],
                bgColor: '#f8fafc',
                textColor: '#1e293b'
            },
            whatsapp: {
                enabled: true,
                title: 'Participe do Mandato',
                description: 'Entre no nosso grupo exclusivo e receba atualizações.',
                link: 'https://wa.me/',
                bgColor: '#25D366',
                textColor: '#ffffff',
                showFloating: true
            }
        }
    };

    useEffect(() => {
        if (tenant.id) {
            fetchConfig();
        }
    }, [tenant.id]);

    const fetchConfig = async () => {
        setIsLoading(true);
        // Fetch from 'settings' column instead of 'site_config' column to avoid 400 error if migration missing
        const { data, error } = await supabase
            .from('tenants')
            .select('settings')
            .eq('id', tenant.id)
            .single();

        if (error || !data?.settings?.site_config) {
            setSiteConfig(defaultConfig);
        } else {
            const loadedConfig = data.settings.site_config;
            // Merge deeper to ensure new sections exist
            const merged = { ...defaultConfig, ...loadedConfig };
            merged.sections = { ...defaultConfig.sections, ...loadedConfig.sections };
            // Ensure nested arrays exist
            if (!merged.sections.news?.posts) merged.sections.news.posts = defaultConfig.sections.news.posts;
            if (!merged.sections.gallery?.images) merged.sections.gallery.images = defaultConfig.sections.gallery.images;

            setSiteConfig(merged);
        }
        setIsLoading(false);
    };

    const handlePublish = async () => {
        setIsPublishing(true);
        try {
            // First fetch latest settings to preserve other keys (like primaryColor, plan, etc)
            const { data: current, error: fetchError } = await supabase
                .from('tenants')
                .select('settings')
                .eq('id', tenant.id)
                .single();

            if (fetchError) throw fetchError;

            const newSettings = {
                ...(current?.settings || {}),
                site_config: siteConfig
            };

            const { error: updateError } = await supabase
                .from('tenants')
                .update({ settings: newSettings })
                .eq('id', tenant.id);

            if (updateError) throw updateError;

            alert("Site atualizado com sucesso!");
        } catch (error) {
            console.error(error);
            alert('Erro ao publicar site. Tente novamente.');
        }
        setIsPublishing(false);
    };

    const addNewsPost = () => {
        const newPost = { title: 'Nova Notícia', date: new Date().toLocaleDateString('pt-BR'), snippet: 'Resumo da notícia...' };
        const updatedPosts = [...siteConfig.sections.news.posts, newPost];
        setSiteConfig({ ...siteConfig, sections: { ...siteConfig.sections, news: { ...siteConfig.sections.news, posts: updatedPosts } } });
    };

    const removeNewsPost = (index: number) => {
        const updatedPosts = siteConfig.sections.news.posts.filter((_: any, i: number) => i !== index);
        setSiteConfig({ ...siteConfig, sections: { ...siteConfig.sections, news: { ...siteConfig.sections.news, posts: updatedPosts } } });
    };

    if (isLoading || !siteConfig) return <div className="flex-center p-5"><RefreshCw className="spin" /></div>;

    const ColorPicker = ({ label, value, onChange }: any) => (
        <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.7, textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>{label}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-color)', padding: '6px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    style={{ width: '30px', height: '30px', border: 'none', borderRadius: '4px', cursor: 'pointer', background: 'none' }}
                />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    style={{ border: 'none', background: 'transparent', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', width: '100%' }}
                />
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'grid', gridTemplateColumns: '450px 1fr', gap: '2rem', height: 'calc(100vh - 120px)' }}
            className="flex-col-mobile"
        >
            {/* EDITOR PANEL */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
                {/* Editor Header */}
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Construtor de Portal</h2>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button
                            onClick={() => setActiveTab('content')}
                            style={{
                                flex: 1, padding: '8px', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer',
                                background: activeTab === 'content' ? 'var(--primary)' : 'transparent',
                                color: activeTab === 'content' ? 'white' : 'var(--text-light)'
                            }}
                        >
                            Conteúdo
                        </button>
                        <button
                            onClick={() => setActiveTab('style')}
                            style={{
                                flex: 1, padding: '8px', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer',
                                background: activeTab === 'style' ? 'var(--primary)' : 'transparent',
                                color: activeTab === 'style' ? 'white' : 'var(--text-light)'
                            }}
                        >
                            <Palette size={16} style={{ display: 'inline', marginRight: '5px' }} /> Estilo
                        </button>
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {activeTab === 'style' && (
                        <div className="animate-fade-in">
                            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem' }}>Identidade Global</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <ColorPicker label="Cor Primária" value={siteConfig.theme.primary} onChange={(v: string) => setSiteConfig({ ...siteConfig, theme: { ...siteConfig.theme, primary: v } })} />
                                <ColorPicker label="Cor Secundária" value={siteConfig.theme.secondary} onChange={(v: string) => setSiteConfig({ ...siteConfig, theme: { ...siteConfig.theme, secondary: v } })} />
                                <ColorPicker label="Fundo Geral" value={siteConfig.theme.background} onChange={(v: string) => setSiteConfig({ ...siteConfig, theme: { ...siteConfig.theme, background: v } })} />
                                <ColorPicker label="Texto Geral" value={siteConfig.theme.text} onChange={(v: string) => setSiteConfig({ ...siteConfig, theme: { ...siteConfig.theme, text: v } })} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'content' && (
                        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {/* Hero Config */}
                            <section style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <h4 style={{ margin: 0, fontWeight: 800 }}>Topo (Hero)</h4>
                                    <input type="checkbox" checked={siteConfig.sections.hero.enabled} onChange={e => setSiteConfig({ ...siteConfig, sections: { ...siteConfig.sections, hero: { ...siteConfig.sections.hero, enabled: e.target.checked } } })} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <input className="form-input" placeholder="Título" value={siteConfig.sections.hero.title} onChange={e => setSiteConfig({ ...siteConfig, sections: { ...siteConfig.sections, hero: { ...siteConfig.sections.hero, title: e.target.value } } })} />
                                    <input className="form-input" placeholder="Subtítulo" value={siteConfig.sections.hero.subtitle} onChange={e => setSiteConfig({ ...siteConfig, sections: { ...siteConfig.sections, hero: { ...siteConfig.sections.hero, subtitle: e.target.value } } })} />
                                    <input className="form-input" placeholder="Número de Urna" value={siteConfig.sections.hero.number} onChange={e => setSiteConfig({ ...siteConfig, sections: { ...siteConfig.sections, hero: { ...siteConfig.sections.hero, number: e.target.value } } })} />
                                    <ColorPicker label="Fundo da Seção" value={siteConfig.sections.hero.bgColor} onChange={(v: string) => setSiteConfig({ ...siteConfig, sections: { ...siteConfig.sections, hero: { ...siteConfig.sections.hero, bgColor: v } } })} />
                                </div>
                            </section>

                            {/* Bio Config */}
                            <section style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <h4 style={{ margin: 0, fontWeight: 800 }}>Sobre / Biografia</h4>
                                    <input type="checkbox" checked={siteConfig.sections.bio.enabled} onChange={e => setSiteConfig({ ...siteConfig, sections: { ...siteConfig.sections, bio: { ...siteConfig.sections.bio, enabled: e.target.checked } } })} />
                                </div>
                                <textarea className="form-input" rows={4} value={siteConfig.sections.bio.content} onChange={e => setSiteConfig({ ...siteConfig, sections: { ...siteConfig.sections, bio: { ...siteConfig.sections.bio, content: e.target.value } } })} />
                                <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <ColorPicker label="Fundo" value={siteConfig.sections.bio.bgColor} onChange={(v: string) => setSiteConfig({ ...siteConfig, sections: { ...siteConfig.sections, bio: { ...siteConfig.sections.bio, bgColor: v } } })} />
                                </div>
                            </section>

                            {/* Video Config */}
                            <section style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Video size={16} />
                                        <h4 style={{ margin: 0, fontWeight: 800 }}>Vídeo</h4>
                                    </div>
                                    <input type="checkbox" checked={siteConfig.sections.video.enabled} onChange={e => setSiteConfig({ ...siteConfig, sections: { ...siteConfig.sections, video: { ...siteConfig.sections.video, enabled: e.target.checked } } })} />
                                </div>
                                <input className="form-input mb-2" placeholder="Título da Seção" value={siteConfig.sections.video.title} onChange={e => setSiteConfig({ ...siteConfig, sections: { ...siteConfig.sections, video: { ...siteConfig.sections.video, title: e.target.value } } })} />
                                <input className="form-input" placeholder="Link Embed (YouTube/Vimeo)" value={siteConfig.sections.video.url} onChange={e => setSiteConfig({ ...siteConfig, sections: { ...siteConfig.sections, video: { ...siteConfig.sections.video, url: e.target.value } } })} />
                                <div className="mt-2">
                                    <ColorPicker label="Fundo" value={siteConfig.sections.video.bgColor} onChange={(v: string) => setSiteConfig({ ...siteConfig, sections: { ...siteConfig.sections, video: { ...siteConfig.sections.video, bgColor: v } } })} />
                                </div>
                            </section>

                            {/* Gallery Config */}
                            <section style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <ImageIcon size={16} />
                                        <h4 style={{ margin: 0, fontWeight: 800 }}>Galeria de Fotos</h4>
                                    </div>
                                    <input type="checkbox" checked={siteConfig.sections.gallery.enabled} onChange={e => setSiteConfig({ ...siteConfig, sections: { ...siteConfig.sections, gallery: { ...siteConfig.sections, gallery: { ...siteConfig.sections.gallery, enabled: e.target.checked } } } })} />
                                </div>
                                <input className="form-input mb-2" placeholder="Título da Galeria" value={siteConfig.sections.gallery.title} onChange={e => setSiteConfig({ ...siteConfig, sections: { ...siteConfig.sections, gallery: { ...siteConfig.sections.gallery, title: e.target.value } } })} />
                                <div className="mt-2">
                                    <ColorPicker label="Fundo" value={siteConfig.sections.gallery.bgColor} onChange={(v: string) => setSiteConfig({ ...siteConfig, sections: { ...siteConfig.sections, gallery: { ...siteConfig.sections.gallery, bgColor: v } } })} />
                                </div>
                            </section>

                            {/* News Config */}
                            <section style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Newspaper size={16} />
                                        <h4 style={{ margin: 0, fontWeight: 800 }}>Notícias</h4>
                                    </div>
                                    <input type="checkbox" checked={siteConfig.sections.news.enabled} onChange={e => setSiteConfig({ ...siteConfig, sections: { ...siteConfig.sections, news: { ...siteConfig.sections.news, enabled: e.target.checked } } })} />
                                </div>
                                <input className="form-input mb-2" placeholder="Título da Seção de Notícias" value={siteConfig.sections.news.title} onChange={e => setSiteConfig({ ...siteConfig, sections: { ...siteConfig.sections, news: { ...siteConfig.sections.news, title: e.target.value } } })} />

                                <div className="flex flex-col gap-2 mt-4">
                                    <label className="text-xs font-bold opacity-70">POSTAGENS</label>
                                    {siteConfig.sections.news.posts.map((post: any, index: number) => (
                                        <div key={index} className="p-3 bg-white/5 border border-white/10 rounded-lg flex flex-col gap-2">
                                            <input
                                                className="form-input text-sm p-2"
                                                value={post.title}
                                                onChange={(e) => {
                                                    const updated = [...siteConfig.sections.news.posts];
                                                    updated[index].title = e.target.value;
                                                    setSiteConfig({ ...siteConfig, sections: { ...siteConfig.sections, news: { ...siteConfig.sections.news, posts: updated } } });
                                                }}
                                                placeholder="Título da Notícia"
                                            />
                                            <textarea
                                                className="form-input text-sm p-2"
                                                value={post.snippet}
                                                rows={2}
                                                onChange={(e) => {
                                                    const updated = [...siteConfig.sections.news.posts];
                                                    updated[index].snippet = e.target.value;
                                                    setSiteConfig({ ...siteConfig, sections: { ...siteConfig.sections, news: { ...siteConfig.sections.news, posts: updated } } });
                                                }}
                                                placeholder="Resumo..."
                                            />
                                            <div className="flex justify-end">
                                                <button onClick={() => removeNewsPost(index)} className="text-red-400 text-xs flex items-center gap-1 hover:text-red-300">
                                                    <Trash2 size={12} /> Remover
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={addNewsPost} className="btn-ghost text-sm w-full py-2 flex items-center justify-center gap-2 border-dashed border border-white/20">
                                        <Plus size={14} /> Adicionar Postagem
                                    </button>
                                </div>

                                <div className="mt-4">
                                    <ColorPicker label="Fundo" value={siteConfig.sections.news.bgColor} onChange={(v: string) => setSiteConfig({ ...siteConfig, sections: { ...siteConfig.sections, news: { ...siteConfig.sections.news, bgColor: v } } })} />
                                </div>
                            </section>

                            {/* Whatsapp Config */}
                            <section style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <h4 style={{ margin: 0, fontWeight: 800 }}>Banner WhatsApp</h4>
                                    <input type="checkbox" checked={siteConfig.sections.whatsapp.enabled} onChange={e => setSiteConfig({ ...siteConfig, sections: { ...siteConfig.sections, whatsapp: { ...siteConfig.sections.whatsapp, enabled: e.target.checked } } })} />
                                </div>
                                <input className="form-input mb-2" placeholder="Título" value={siteConfig.sections.whatsapp.title} onChange={e => setSiteConfig({ ...siteConfig, sections: { ...siteConfig.sections, whatsapp: { ...siteConfig.sections.whatsapp, title: e.target.value } } })} />
                                <ColorPicker label="Cor do Banner" value={siteConfig.sections.whatsapp.bgColor} onChange={(v: string) => setSiteConfig({ ...siteConfig, sections: { ...siteConfig.sections, whatsapp: { ...siteConfig.sections.whatsapp, bgColor: v } } })} />

                                <div className="mt-2 pt-2 border-t border-white/5">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={siteConfig.sections.whatsapp.showFloating}
                                            onChange={(e) => setSiteConfig({ ...siteConfig, sections: { ...siteConfig.sections, whatsapp: { ...siteConfig.sections.whatsapp, showFloating: e.target.checked } } })}
                                        />
                                        Mostrar Ícone Flutuante (Canto Inferior)
                                    </label>
                                </div>
                            </section>
                        </div>
                    )}
                </div>

                <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
                    <button className="btn-gold" style={{ width: '100%', borderRadius: '12px', padding: '14px', fontWeight: 800 }} onClick={handlePublish} disabled={isPublishing}>
                        {isPublishing ? <RefreshCw className="spin" size={18} /> : <span><Save size={18} style={{ marginRight: '8px' }} /> Publicar Site</span>}
                    </button>
                    <a href={`http://${tenant.slug || 'mandato'}.gabinete.app`} target="_blank" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', color: 'var(--text-light)', fontSize: '0.85rem', textDecoration: 'none' }}>
                        Ver online: {tenant.slug}.gabinete.app
                    </a>
                </div>
            </div>

            {/* PREVIEW PANEL */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    <button onClick={() => setPreviewMode('desktop')} className={`btn-ghost ${previewMode === 'desktop' ? 'active-pill' : ''}`} style={{ borderRadius: '20px', padding: '8px 16px', fontWeight: 600 }}>Desktop</button>
                    <button onClick={() => setPreviewMode('mobile')} className={`btn-ghost ${previewMode === 'mobile' ? 'active-pill' : ''}`} style={{ borderRadius: '20px', padding: '8px 16px', fontWeight: 600 }}>Mobile</button>
                </div>

                <div style={{
                    flex: 1,
                    background: '#e2e8f0',
                    borderRadius: '24px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: previewMode === 'desktop' ? '2rem' : '0',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: previewMode === 'desktop' ? '100%' : '375px',
                        height: previewMode === 'desktop' ? '100%' : '667px',
                        background: siteConfig.theme.background,
                        borderRadius: previewMode === 'desktop' ? '12px' : '40px',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                        overflowY: 'auto',
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        border: previewMode === 'mobile' ? '12px solid #1a202c' : 'none'
                    }}>
                        {/* HERO */}
                        {siteConfig.sections.hero.enabled && (
                            <div style={{
                                position: 'relative',
                                background: siteConfig.sections.hero.bgColor,
                                color: siteConfig.sections.hero.textColor,
                                padding: previewMode === 'mobile' ? '4rem 1.5rem' : '6rem 4rem',
                                textAlign: 'center',
                                overflow: 'hidden'
                            }}>
                                <div style={{ // BG Image
                                    position: 'absolute', inset: 0,
                                    backgroundImage: `url(${siteConfig.sections.hero.bgImage})`,
                                    backgroundSize: 'cover', backgroundPosition: 'center',
                                    opacity: 0.2
                                }}></div>
                                <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                    <span style={{
                                        background: siteConfig.theme.secondary,
                                        color: '#000',
                                        padding: '0.5rem 1.5rem',
                                        borderRadius: '50px',
                                        fontWeight: 800,
                                        fontSize: '1.25rem',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                                    }}>
                                        {siteConfig.sections.hero.number}
                                    </span>
                                    <h1 style={{ fontSize: previewMode === 'mobile' ? '2.5rem' : '4rem', fontWeight: 900, lineHeight: 1.1, margin: 0 }}>
                                        {siteConfig.sections.hero.title}
                                    </h1>
                                    <p style={{ fontSize: previewMode === 'mobile' ? '1.1rem' : '1.5rem', opacity: 0.9, fontWeight: 500, maxWidth: '600px' }}>
                                        {siteConfig.sections.hero.subtitle}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div style={{
                            padding: previewMode === 'mobile' ? '1.5rem' : '3rem 4rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '3rem' // BREATHING ROOM
                        }}>

                            {/* STATUS CARDS - Simulated Dynamic Content */}
                            <div style={{ display: 'grid', gridTemplateColumns: previewMode === 'mobile' ? '1fr' : 'repeat(3, 1fr)', gap: '1.5rem' }}>
                                {[1, 2, 3].map(i => (
                                    <div key={i} style={{
                                        background: 'white',
                                        borderRadius: '16px',
                                        padding: '1.5rem',
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
                                        borderTop: `4px solid ${siteConfig.theme.primary}`
                                    }}>
                                        <h4 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: siteConfig.theme.primary }}>Conquista {i}</h4>
                                        <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Pavimentação concluída no bairro das Flores graças à nossa indicação.</p>
                                    </div>
                                ))}
                            </div>

                            {/* VIDEO SECTION */}
                            {siteConfig.sections.video.enabled && (
                                <section style={{
                                    background: siteConfig.sections.video.bgColor,
                                    color: siteConfig.sections.video.textColor,
                                    padding: '2rem',
                                    borderRadius: '24px'
                                }}>
                                    <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center', color: siteConfig.theme.secondary }}>{siteConfig.sections.video.title}</h2>
                                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '16px', background: '#000' }}>
                                        <iframe
                                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                            src={siteConfig.sections.video.url}
                                            title="YouTube video player"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                </section>
                            )}

                            {/* GALLERY SECTION (Carousel Simulation) */}
                            {siteConfig.sections.gallery.enabled && (
                                <section style={{
                                    background: siteConfig.sections.gallery.bgColor,
                                    color: siteConfig.sections.gallery.textColor,
                                    padding: '2rem',
                                    borderRadius: '24px'
                                }}>
                                    <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center', color: siteConfig.theme.secondary }}>{siteConfig.sections.gallery.title}</h2>
                                    <div style={{
                                        display: 'flex',
                                        gap: '1rem',
                                        overflowX: 'auto',
                                        paddingBottom: '1rem',
                                        scrollbarWidth: 'none',
                                    }}>
                                        {siteConfig.sections.gallery.images.map((img: string, i: number) => (
                                            <img key={i} src={img} style={{
                                                height: '250px',
                                                aspectRatio: '3/4',
                                                borderRadius: '12px',
                                                objectFit: 'cover',
                                                flexShrink: 0,
                                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                            }} />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* NEWS SECTION */}
                            {siteConfig.sections.news.enabled && (
                                <section style={{
                                    background: siteConfig.sections.news.bgColor,
                                    color: siteConfig.sections.news.textColor,
                                    padding: '2rem',
                                    borderRadius: '24px'
                                }}>
                                    <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center', color: siteConfig.theme.primary }}>{siteConfig.sections.news.title}</h2>
                                    <div style={{ display: 'grid', gridTemplateColumns: previewMode === 'mobile' ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                                        {siteConfig.sections.news.posts.map((post: any, i: number) => (
                                            <div key={i} style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderLeft: `4px solid ${siteConfig.theme.secondary}` }}>
                                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8' }}>{post.date}</span>
                                                <h3 style={{ margin: '0.5rem 0', fontSize: '1.2rem', fontWeight: 800, color: siteConfig.theme.primary }}>{post.title}</h3>
                                                <p style={{ margin: 0, opacity: 0.8, fontSize: '0.95rem' }}>{post.snippet}</p>
                                                <a href="#" style={{ display: 'inline-flex', alignItems: 'center', marginTop: '1rem', fontSize: '0.9rem', fontWeight: 700, color: siteConfig.theme.primary, textDecoration: 'none' }}>
                                                    Ler mais <ExternalLink size={14} style={{ marginLeft: '4px' }} />
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* BIO SECTION */}
                            {siteConfig.sections.bio.enabled && (
                                <section style={{
                                    background: siteConfig.sections.bio.bgColor,
                                    color: siteConfig.sections.bio.textColor,
                                    padding: '2rem',
                                    borderRadius: '24px',
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                                }}>
                                    <div style={{ display: 'flex', flexDirection: previewMode === 'mobile' ? 'column' : 'row', gap: '2rem', alignItems: 'center' }}>
                                        <div style={{ flex: 1 }}>
                                            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: siteConfig.theme.secondary }}>{siteConfig.sections.bio.title}</h2>
                                            <p style={{ lineHeight: 1.8, fontSize: '1.1rem' }}>{siteConfig.sections.bio.content}</p>
                                            <button style={{ marginTop: '1.5rem', padding: '12px 24px', background: siteConfig.theme.primary, color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>
                                                Conheça Minha História
                                            </button>
                                        </div>
                                        <div style={{ width: previewMode === 'mobile' ? '100%' : '300px', height: '300px', background: '#cbd5e1', borderRadius: '20px', overflow: 'hidden' }}>
                                            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1000" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* WHATSAPP CTA */}
                            {siteConfig.sections.whatsapp.enabled && (
                                <section style={{
                                    background: siteConfig.sections.whatsapp.bgColor,
                                    color: siteConfig.sections.whatsapp.textColor,
                                    padding: '3rem',
                                    borderRadius: '24px',
                                    textAlign: 'center',
                                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
                                }}>
                                    <MessageCircle size={48} style={{ marginBottom: '1rem' }} />
                                    <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>{siteConfig.sections.whatsapp.title}</h2>
                                    <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '2rem' }}>{siteConfig.sections.whatsapp.description}</p>
                                    <button style={{
                                        padding: '16px 32px',
                                        background: 'white',
                                        color: siteConfig.sections.whatsapp.bgColor,
                                        border: 'none',
                                        borderRadius: '50px',
                                        fontWeight: 800,
                                        fontSize: '1.1rem',
                                        cursor: 'pointer',
                                        boxShadow: '0 10px 15px rgba(0,0,0,0.1)'
                                    }}>
                                        ENTRAR NO GRUPO VIP
                                    </button>
                                </section>
                            )}

                        </div>

                        {/* FOOTER */}
                        <footer style={{ background: siteConfig.theme.primary, color: 'white', padding: '3rem', textAlign: 'center' }}>
                            <h3 style={{ fontWeight: 900, marginBottom: '1rem' }}>VEREADOR {tenant.name?.toUpperCase()}</h3>
                            <p style={{ opacity: 0.6 }}>Política feita com transparência e tecnologia.</p>
                            <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.8rem', opacity: 0.4 }}>
                                © 2026 Gabinete Digital
                            </div>
                        </footer>

                        {/* FLOATING WHATSAPP */}
                        {siteConfig.sections.whatsapp.enabled && siteConfig.sections.whatsapp.showFloating && (
                            <div style={{
                                position: 'absolute',
                                bottom: '20px',
                                right: '20px',
                                width: '60px',
                                height: '60px',
                                background: '#25D366',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 10px rgba(37, 211, 102, 0.4)',
                                cursor: 'pointer',
                                zIndex: 100
                            }}>
                                <MessageCircle color="white" size={32} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default MandateSiteBuilder;
