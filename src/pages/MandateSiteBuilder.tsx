import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Globe, Type, Eye, Save, Smartphone,
    Monitor, Video, MessageCircle, AlertTriangle, RefreshCw
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTenant } from '../context/TenantContext';

const MandateSiteBuilder = () => {
    const { tenant } = useTenant();
    const [siteConfig, setSiteConfig] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPublishing, setIsPublishing] = useState(false);
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

    // Default configuration if nothing in DB
    const defaultConfig = {
        heroTitle: `Vereador ${tenant.name || 'Nome do Vereador'}`,
        heroSubtitle: 'Trabalhando por uma cidade melhor e mais justa.',
        vereadorNumber: '12.345',
        vereadorPhoto: null,
        whatsappNumber: '',
        customDomain: '',
        primaryColor: '#0f172a',
        textColor: '#ffffff',
        showBio: true,
        bioText: 'Nascido e criado nesta cidade, dedico minha vida ao serviço público...',
        showProjects: true,
        showVideo: true,
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        showGallery: true,
        galleryImages: [
            'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&q=80&w=1000',
            'https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&q=80&w=1000'
        ],
        showBlog: true,
        announcement: { active: false, title: '', text: '', bgColor: '#c53030', textColor: '#ffffff' },
        whatsappGroup: { active: false, url: '', title: 'Grupo de Apoio', description: 'Receba notícias exclusivas.', bgColor: '#25D366', textColor: '#ffffff' }
    };

    useEffect(() => {
        if (tenant.id) {
            fetchConfig();
        }
    }, [tenant.id]);

    const fetchConfig = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('tenants')
            .select('site_config')
            .eq('id', tenant.id)
            .single();

        if (error) {
            console.error('Error fetching site config:', error);
            setSiteConfig(defaultConfig);
        } else {
            setSiteConfig(data.site_config || defaultConfig);
        }
        setIsLoading(false);
    };

    const handlePublish = async () => {
        setIsPublishing(true);
        const { error } = await supabase
            .from('tenants')
            .update({ site_config: siteConfig })
            .eq('id', tenant.id);

        if (error) {
            console.error('Error publishing site:', error);
            alert('Erro ao publicar site');
        } else {
            alert("Site publicado com sucesso! Acesse em: seu-dominio.com.br");
        }
        setIsPublishing(false);
    };

    if (isLoading || !siteConfig) return <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}><RefreshCw className="spin" /></div>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '2rem', height: 'calc(100vh - 120px)' }}
            className="flex-col-mobile"
        >
            {/* Control Panel */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', overflowY: 'auto', padding: '1.5rem' }}>
                <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '4px', fontWeight: 800 }}>Construtor de Portal</h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 600 }}>Crie seu portal de mandato premium em segundos.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <section>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Type size={16} /> Identidade Visual
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                className="form-input"
                                value={siteConfig.heroTitle}
                                onChange={(e) => setSiteConfig({ ...siteConfig, heroTitle: e.target.value })}
                                placeholder="Título do Site"
                            />
                            <textarea
                                className="form-input"
                                value={siteConfig.heroSubtitle}
                                onChange={(e) => setSiteConfig({ ...siteConfig, heroSubtitle: e.target.value })}
                                placeholder="Subtítulo / Slogan"
                                rows={2}
                            />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.6 }}>COR PRINCIPAL</label>
                                    <input type="color" value={siteConfig.primaryColor} onChange={(e) => setSiteConfig({ ...siteConfig, primaryColor: e.target.value })} style={{ width: '100%', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer' }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.6 }}>COR TEXTO</label>
                                    <input type="color" value={siteConfig.textColor} onChange={(e) => setSiteConfig({ ...siteConfig, textColor: e.target.value })} style={{ width: '100%', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer' }} />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Globe size={16} /> Blocos de Conteúdo
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            {['showBio', 'showProjects', 'showVideo', 'showGallery', 'showBlog'].map((module: string) => (
                                <label key={module} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    padding: '8px 12px',
                                    background: 'var(--bg-color)',
                                    borderRadius: '10px',
                                    border: '1px solid var(--border)'
                                }}>
                                    <input type="checkbox" checked={siteConfig[module]} onChange={(e) => setSiteConfig({ ...siteConfig, [module]: e.target.checked })} />
                                    {module.replace('show', '')}
                                </label>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <AlertTriangle size={16} /> Alertas & Social
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                                <input type="checkbox" checked={siteConfig.announcement.active} onChange={(e) => setSiteConfig({ ...siteConfig, announcement: { ...siteConfig.announcement, active: e.target.checked } })} />
                                Ativar Comunicado Urgente
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                                <input type="checkbox" checked={siteConfig.whatsappGroup.active} onChange={(e) => setSiteConfig({ ...siteConfig, whatsappGroup: { ...siteConfig.whatsappGroup, active: e.target.checked } })} />
                                Ativar Link Grupo WhatsApp
                            </label>
                        </div>
                    </section>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button className="btn-gold" style={{ width: '100%', borderRadius: '14px' }} onClick={handlePublish} disabled={isPublishing}>
                        {isPublishing ? <RefreshCw className="spin" size={18} /> : <><Save size={18} /> Publicar Alterações</>}
                    </button>
                    <button className="btn-gold outline" style={{ width: '100%', borderRadius: '14px' }}>
                        <Eye size={18} /> Ver Página Pública
                    </button>
                </div>
            </div>

            {/* Preview Panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    <button
                        onClick={() => setPreviewMode('desktop')}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '30px',
                            border: 'none',
                            background: previewMode === 'desktop' ? 'var(--primary)' : 'var(--surface)',
                            color: previewMode === 'desktop' ? 'white' : 'var(--text)',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        <Monitor size={18} /> Desktop
                    </button>
                    <button
                        onClick={() => setPreviewMode('mobile')}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '30px',
                            border: 'none',
                            background: previewMode === 'mobile' ? 'var(--primary)' : 'var(--surface)',
                            color: previewMode === 'mobile' ? 'white' : 'var(--text)',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        <Smartphone size={18} /> Mobile
                    </button>
                </div>

                <div style={{
                    flex: 1,
                    background: '#e2e8f0',
                    borderRadius: '24px',
                    padding: previewMode === 'desktop' ? '1rem' : '1px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: previewMode === 'desktop' ? '100%' : '375px',
                        height: previewMode === 'desktop' ? '100%' : '667px',
                        background: 'white',
                        borderRadius: previewMode === 'desktop' ? '16px' : '40px',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)',
                        overflowY: 'auto',
                        position: 'relative',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}>
                        {/* THE SITE PREVIEW */}
                        <header style={{
                            background: siteConfig.primaryColor,
                            color: siteConfig.textColor,
                            padding: '4rem 2rem',
                            textAlign: 'center',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{ position: 'relative', zIndex: 2 }}>
                                <span style={{
                                    background: 'var(--secondary)',
                                    color: 'black',
                                    padding: '4px 20px',
                                    borderRadius: '50px',
                                    fontWeight: 900,
                                    fontSize: '1.5rem',
                                    marginBottom: '1rem',
                                    display: 'inline-block'
                                }}>{siteConfig.vereadorNumber}</span>
                                <h1 style={{ fontSize: '2.5rem', margin: '0.5rem 0', fontWeight: 800 }}>{siteConfig.heroTitle}</h1>
                                <p style={{ opacity: 0.8, fontSize: '1.2rem', maxWidth: '500px', margin: '0 auto' }}>{siteConfig.heroSubtitle}</p>
                            </div>
                        </header>

                        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '-2rem' }}>
                            {siteConfig.announcement.active && (
                                <div style={{ background: siteConfig.announcement.bgColor, color: siteConfig.announcement.textColor, padding: '1.5rem', borderRadius: '16px', textAlign: 'center' }}>
                                    <h4 style={{ margin: '0 0 5px 0' }}>{siteConfig.announcement.title}</h4>
                                    <p style={{ margin: 0, opacity: 0.9 }}>{siteConfig.announcement.text}</p>
                                </div>
                            )}

                            {siteConfig.showBio && (
                                <section>
                                    <h2 style={{ borderLeft: '4px solid var(--secondary)', paddingLeft: '1rem', marginBottom: '1rem' }}>Biografia</h2>
                                    <p style={{ color: '#4a5568', lineHeight: 1.6 }}>{siteConfig.bioText}</p>
                                </section>
                            )}

                            {siteConfig.showVideo && (
                                <section>
                                    <h2 style={{ borderLeft: '4px solid var(--secondary)', paddingLeft: '1rem', marginBottom: '1rem' }}>Destaque da Semana</h2>
                                    <div style={{ aspectRatio: '16/9', background: '#000', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                        <Video size={48} />
                                    </div>
                                </section>
                            )}

                            {siteConfig.whatsappGroup.active && (
                                <section style={{ background: siteConfig.whatsappGroup.bgColor, color: siteConfig.whatsappGroup.textColor, padding: '2rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h3 style={{ margin: 0 }}>{siteConfig.whatsappGroup.title}</h3>
                                        <p style={{ margin: 0, opacity: 0.8 }}>{siteConfig.whatsappGroup.description}</p>
                                    </div>
                                    <MessageCircle size={32} />
                                </section>
                            )}
                        </div>

                        <footer style={{ padding: '3rem 2rem', background: '#0f172a', color: 'white', textAlign: 'center', fontSize: '0.8rem' }}>
                            <p>© 2026 {siteConfig.heroTitle} | Cabinet Digital</p>
                        </footer>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default MandateSiteBuilder;
