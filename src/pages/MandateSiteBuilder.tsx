import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout, Globe, Type, Eye, Save, Smartphone, Monitor, Video, Palette, ChevronLeft, ChevronRight, MessageCircle, AlertTriangle, Users, Link, Upload } from 'lucide-react';


const MandateSiteBuilder = () => {
    // Site Configuration State
    const [siteConfig, setSiteConfig] = useState({
        heroTitle: 'Vereador João Silva',
        heroSubtitle: 'Trabalhando por uma cidade melhor e mais justa.',
        vereadorNumber: '15.123',
        vereadorPhoto: null as string | null,
        whatsappNumber: '5511999999999',
        customDomain: '',
        systemUrl: 'vereadorjoao.app/site',

        primaryColor: '#1a365d',
        textColor: '#ffffff',

        // Modules Configuration
        showBio: true,
        bioConfig: { bgColor: '#ffffff', textColor: '#2d3748' },
        bioText: 'João Silva é nascido e criado no bairro Vila Nova. Atua há 10 anos em projetos sociais...',

        showProjects: true,
        projectsConfig: { bgColor: '#f7fafc', textColor: '#1a202c' },

        showContact: true,
        contactConfig: { bgColor: '#f7fafc', textColor: '#2d3748' },

        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        showVideo: true,

        galleryImages: [
            'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&q=80&w=1000',
            'https://images.unsplash.com/photo-1555848962-6e79363ec58f?auto=format&fit=crop&q=80&w=1000',
            'https://images.unsplash.com/photo-1540910419868-474947cebacb?auto=format&fit=crop&q=80&w=1000'
        ],
        showGallery: true,

        posts: [
            { id: 1, title: 'Inauguração da Creche Municipal', date: '15/05/2026', image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=500', excerpt: 'Hoje entregamos mais uma grande conquista para a comunidade...' },
            { id: 2, title: 'Fiscalização nas Obras do Centro', date: '10/05/2026', image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=500', excerpt: 'Estivemos conferindo o andamento da requalificação asfáltica...' }
        ],
        showBlog: true,

        // New Modules
        announcement: {
            active: false,
            title: 'Comunicado Importante',
            text: 'A votação foi adiada para o dia 25/08 devido ás chuvas.',
            bgColor: '#c53030',
            textColor: '#ffffff'
        },

        whatsappGroup: {
            active: true,
            url: 'https://chat.whatsapp.com/invite/example',
            title: 'Participe do nosso grupo VIP',
            description: 'Receba notícias do mandato em primeira mão.',
            bgColor: '#25D366',
            textColor: '#ffffff'
        },

        // Granular Styling Configs
        videoConfig: { bgColor: '#ffffff', textColor: '#2d3748' },
        galleryConfig: { bgColor: '#ffffff', textColor: '#2d3748' },
        blogConfig: { bgColor: '#ffffff', textColor: '#2d3748' },
        footerConfig: { bgColor: '#2d3748', textColor: '#ffffff' }
    });

    const [currentSlide, setCurrentSlide] = useState(0);

    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [isPublishing, setIsPublishing] = useState(false);

    // Simulated "Live" Data from the platform
    const recentProjects = [
        { id: 1, title: 'Revitalização da Praça Central', status: 'Aprovado' },
        { id: 2, title: 'Programa Escola Segura', status: 'Em Tramitação' },
        { id: 3, title: 'Mutirão da Saúde', status: 'Concluído' }
    ];

    const handlePublish = () => {
        setIsPublishing(true);
        setTimeout(() => {
            setIsPublishing(false);
            alert("Site atualizado com sucesso! Acesse: vereadorjoao.com.br");
        }, 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="site-builder-container"
            style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem', height: 'calc(100vh - 100px)' }}
        >
            {/* Left Panel: Editor / Configuration */}
            <div className="glass-card" style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
                <div style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Layout size={20} /> Construtor de Site
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                        Personalize seu portal de transparência e mandato.
                    </p>
                </div>

                {/* Section: Basic Info */}
                <div className="config-section">
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Type size={16} /> Informações Básicas
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <div>
                            <label style={{ fontSize: '0.8rem' }}>Título Principal</label>
                            <input
                                type="text"
                                value={siteConfig.heroTitle}
                                onChange={(e) => setSiteConfig({ ...siteConfig, heroTitle: e.target.value })}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text)' }}
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.8rem' }}>Número de Urna</label>
                                <input
                                    type="text"
                                    value={siteConfig.vereadorNumber}
                                    onChange={(e) => setSiteConfig({ ...siteConfig, vereadorNumber: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text)' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.8rem' }}>Foto de Perfil</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <button className="btn-secondary" style={{ padding: '0.4rem', fontSize: '0.8rem' }}><Upload size={14} /> Upload</button>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem' }}>Slogan / Subtítulo</label>
                            <textarea
                                value={siteConfig.heroSubtitle}
                                onChange={(e) => setSiteConfig({ ...siteConfig, heroSubtitle: e.target.value })}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text)', resize: 'vertical', minHeight: '60px' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Section: Domain & Contact */}
                <div className="config-section">
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Link size={16} /> Domínio e Contato
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <div>
                            <label style={{ fontSize: '0.8rem' }}>WhatsApp (para botão flutuante)</label>
                            <input
                                type="text"
                                value={siteConfig.whatsappNumber}
                                onChange={(e) => setSiteConfig({ ...siteConfig, whatsappNumber: e.target.value })}
                                placeholder="5511999999999"
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text)' }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem' }}>Domínio Personalizado</label>
                            <input
                                type="text"
                                value={siteConfig.customDomain}
                                onChange={(e) => setSiteConfig({ ...siteConfig, customDomain: e.target.value })}
                                placeholder="ex: vereadorjoao.com.br"
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text)' }}
                            />
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>URL do Sistema: {siteConfig.systemUrl}</p>
                        </div>
                    </div>
                </div>

                {/* Section: Active Modules */}
                {/* Section: Active Modules */}
                <div className="config-section">
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Globe size={16} /> Módulos Ativos
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                            <input type="checkbox" checked={siteConfig.showBio} onChange={(e) => setSiteConfig({ ...siteConfig, showBio: e.target.checked })} />
                            Biografia
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                            <input type="checkbox" checked={siteConfig.showProjects} onChange={(e) => setSiteConfig({ ...siteConfig, showProjects: e.target.checked })} />
                            Projetos
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                            <input type="checkbox" checked={siteConfig.showVideo} onChange={(e) => setSiteConfig({ ...siteConfig, showVideo: e.target.checked })} />
                            Vídeo Principal
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                            <input type="checkbox" checked={siteConfig.showGallery} onChange={(e) => setSiteConfig({ ...siteConfig, showGallery: e.target.checked })} />
                            Galeria Fotos
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                            <input type="checkbox" checked={siteConfig.showBlog} onChange={(e) => setSiteConfig({ ...siteConfig, showBlog: e.target.checked })} />
                            Notícias (Blog)
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                            <input type="checkbox" checked={siteConfig.showContact} onChange={(e) => setSiteConfig({ ...siteConfig, showContact: e.target.checked })} />
                            Contato
                        </label>
                    </div>
                </div>

                {/* Section: New Modules */}
                <div className="config-section">
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertTriangle size={16} /> Módulos Especiais
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Announcement */}
                        <div style={{ border: '1px solid var(--border)', padding: '0.8rem', borderRadius: '8px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600 }}>
                                <input type="checkbox" checked={siteConfig.announcement.active} onChange={(e) => setSiteConfig({ ...siteConfig, announcement: { ...siteConfig.announcement, active: e.target.checked } })} />
                                Comunicado Urgente
                            </label>
                            {siteConfig.announcement.active && (
                                <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <input type="text" value={siteConfig.announcement.title} onChange={(e) => setSiteConfig({ ...siteConfig, announcement: { ...siteConfig.announcement, title: e.target.value } })} placeholder="Título" style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--border)' }} />
                                    <textarea value={siteConfig.announcement.text} onChange={(e) => setSiteConfig({ ...siteConfig, announcement: { ...siteConfig.announcement, text: e.target.value } })} placeholder="Mensagem" style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--border)' }} />
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <input type="color" value={siteConfig.announcement.bgColor} onChange={(e) => setSiteConfig({ ...siteConfig, announcement: { ...siteConfig.announcement, bgColor: e.target.value } })} title="Fundo" />
                                        <input type="color" value={siteConfig.announcement.textColor} onChange={(e) => setSiteConfig({ ...siteConfig, announcement: { ...siteConfig.announcement, textColor: e.target.value } })} title="Texto" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* WhatsApp Group */}
                        <div style={{ border: '1px solid var(--border)', padding: '0.8rem', borderRadius: '8px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600 }}>
                                <input type="checkbox" checked={siteConfig.whatsappGroup.active} onChange={(e) => setSiteConfig({ ...siteConfig, whatsappGroup: { ...siteConfig.whatsappGroup, active: e.target.checked } })} />
                                Grupo WhatsApp
                            </label>
                            {siteConfig.whatsappGroup.active && (
                                <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <input type="text" value={siteConfig.whatsappGroup.url} onChange={(e) => setSiteConfig({ ...siteConfig, whatsappGroup: { ...siteConfig.whatsappGroup, url: e.target.value } })} placeholder="Link do Grupo" style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--border)' }} />
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <input type="color" value={siteConfig.whatsappGroup.bgColor} onChange={(e) => setSiteConfig({ ...siteConfig, whatsappGroup: { ...siteConfig.whatsappGroup, bgColor: e.target.value } })} title="Fundo" />
                                        <input type="color" value={siteConfig.whatsappGroup.textColor} onChange={(e) => setSiteConfig({ ...siteConfig, whatsappGroup: { ...siteConfig.whatsappGroup, textColor: e.target.value } })} title="Texto" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Section: Video & Media */}
                {siteConfig.showVideo && (
                    <div className="config-section">
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Video size={16} /> Destaque em Vídeo
                        </h3>
                        <div>
                            <label style={{ fontSize: '0.8rem' }}>Link (YouTube/Vimeo)</label>
                            <input
                                type="text"
                                value={siteConfig.videoUrl}
                                onChange={(e) => setSiteConfig({ ...siteConfig, videoUrl: e.target.value })}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--bg-color)', color: 'var(--text)' }}
                                placeholder="https://youtube.com/..."
                            />
                        </div>
                    </div>
                )}

                {/* Section: Appearance (Refined) */}
                <div className="config-section">
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Palette size={16} /> Cores e Estilo
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Header/Hero Coloring */}
                        <div>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Capa / Hero</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.7rem' }}>Fundo</label>
                                    <input type="color" value={siteConfig.primaryColor} onChange={(e) => setSiteConfig({ ...siteConfig, primaryColor: e.target.value })} style={{ width: '100%', height: '30px', border: 'none', padding: 0 }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.7rem' }}>Texto</label>
                                    <input type="color" value={siteConfig.textColor} onChange={(e) => setSiteConfig({ ...siteConfig, textColor: e.target.value })} style={{ width: '100%', height: '30px', border: 'none', padding: 0 }} />
                                </div>
                            </div>
                        </div>

                        {/* Bio Coloring */}
                        {siteConfig.showBio && (
                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Biografia</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '0.7rem' }}>Fundo</label>
                                        <input type="color" value={siteConfig.bioConfig.bgColor} onChange={(e) => setSiteConfig({ ...siteConfig, bioConfig: { ...siteConfig.bioConfig, bgColor: e.target.value } })} style={{ width: '100%', height: '30px', border: 'none', padding: 0 }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '0.7rem' }}>Texto</label>
                                        <input type="color" value={siteConfig.bioConfig.textColor} onChange={(e) => setSiteConfig({ ...siteConfig, bioConfig: { ...siteConfig.bioConfig, textColor: e.target.value } })} style={{ width: '100%', height: '30px', border: 'none', padding: 0 }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Projects Coloring */}
                        {siteConfig.showProjects && (
                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Projetos</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '0.7rem' }}>Fundo</label>
                                        <input type="color" value={siteConfig.projectsConfig.bgColor} onChange={(e) => setSiteConfig({ ...siteConfig, projectsConfig: { ...siteConfig.projectsConfig, bgColor: e.target.value } })} style={{ width: '100%', height: '30px', border: 'none', padding: 0 }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '0.7rem' }}>Texto</label>
                                        <input type="color" value={siteConfig.projectsConfig.textColor} onChange={(e) => setSiteConfig({ ...siteConfig, projectsConfig: { ...siteConfig.projectsConfig, textColor: e.target.value } })} style={{ width: '100%', height: '30px', border: 'none', padding: 0 }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Video Coloring */}
                        {siteConfig.showVideo && (
                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Vídeo</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '0.7rem' }}>Fundo</label>
                                        <input type="color" value={siteConfig.videoConfig.bgColor} onChange={(e) => setSiteConfig({ ...siteConfig, videoConfig: { ...siteConfig.videoConfig, bgColor: e.target.value } })} style={{ width: '100%', height: '30px', border: 'none', padding: 0 }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '0.7rem' }}>Texto</label>
                                        <input type="color" value={siteConfig.videoConfig.textColor} onChange={(e) => setSiteConfig({ ...siteConfig, videoConfig: { ...siteConfig.videoConfig, textColor: e.target.value } })} style={{ width: '100%', height: '30px', border: 'none', padding: 0 }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Blog Coloring */}
                        {siteConfig.showBlog && (
                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Notícias</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '0.7rem' }}>Fundo</label>
                                        <input type="color" value={siteConfig.blogConfig.bgColor} onChange={(e) => setSiteConfig({ ...siteConfig, blogConfig: { ...siteConfig.blogConfig, bgColor: e.target.value } })} style={{ width: '100%', height: '30px', border: 'none', padding: 0 }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '0.7rem' }}>Texto</label>
                                        <input type="color" value={siteConfig.blogConfig.textColor} onChange={(e) => setSiteConfig({ ...siteConfig, blogConfig: { ...siteConfig.blogConfig, textColor: e.target.value } })} style={{ width: '100%', height: '30px', border: 'none', padding: 0 }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Contact Coloring */}
                        {siteConfig.showContact && (
                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Contato</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '0.7rem' }}>Fundo</label>
                                        <input type="color" value={siteConfig.contactConfig.bgColor} onChange={(e) => setSiteConfig({ ...siteConfig, contactConfig: { ...siteConfig.contactConfig, bgColor: e.target.value } })} style={{ width: '100%', height: '30px', border: 'none', padding: 0 }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '0.7rem' }}>Texto</label>
                                        <input type="color" value={siteConfig.contactConfig.textColor} onChange={(e) => setSiteConfig({ ...siteConfig, contactConfig: { ...siteConfig.contactConfig, textColor: e.target.value } })} style={{ width: '100%', height: '30px', border: 'none', padding: 0 }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Footer Coloring */}
                        <div>
                            <label style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Rodapé</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.7rem' }}>Fundo</label>
                                    <input type="color" value={siteConfig.footerConfig.bgColor} onChange={(e) => setSiteConfig({ ...siteConfig, footerConfig: { ...siteConfig.footerConfig, bgColor: e.target.value } })} style={{ width: '100%', height: '30px', border: 'none', padding: 0 }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.7rem' }}>Texto</label>
                                    <input type="color" value={siteConfig.footerConfig.textColor} onChange={(e) => setSiteConfig({ ...siteConfig, footerConfig: { ...siteConfig.footerConfig, textColor: e.target.value } })} style={{ width: '100%', height: '30px', border: 'none', padding: 0 }} />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>



                <div style={{ marginTop: 'auto' }}>
                    <button
                        type="button"
                        className="btn-gold"
                        style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                        onClick={handlePublish}
                        disabled={isPublishing}
                    >
                        {isPublishing ? 'Publicando...' : <><Save size={18} /> Publicar Site</>}
                    </button>
                    <button className="btn-primary" style={{ width: '100%', marginTop: '0.5rem', background: 'transparent', border: '1px solid var(--border)' }}>
                        <Eye size={18} /> Ver Online
                    </button>
                </div>
            </div>

            {/* Right Panel: Live Preview */}
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', gap: '1rem' }}>
                    <button
                        onClick={() => setPreviewMode('desktop')}
                        style={{
                            background: previewMode === 'desktop' ? 'var(--primary)' : 'var(--surface)',
                            color: previewMode === 'desktop' ? 'white' : 'var(--text)',
                            border: 'none', padding: '0.5rem 1rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'
                        }}
                    >
                        <Monitor size={16} /> Desktop
                    </button>
                    <button
                        onClick={() => setPreviewMode('mobile')}
                        style={{
                            background: previewMode === 'mobile' ? 'var(--primary)' : 'var(--surface)',
                            color: previewMode === 'mobile' ? 'white' : 'var(--text)',
                            border: 'none', padding: '0.5rem 1rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'
                        }}
                    >
                        <Smartphone size={16} /> Mobile
                    </button>
                </div>

                <div className="preview-container" style={{
                    flex: 1,
                    background: '#e2e8f0',
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '2rem',
                    overflow: 'hidden'
                }}>
                    {/* The Simulated Site */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            width: previewMode === 'desktop' ? '100%' : '375px',
                            height: previewMode === 'desktop' ? '100%' : '667px',
                            background: 'white',
                            borderRadius: previewMode === 'desktop' ? '8px' : '20px',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                            overflowY: 'auto',
                            position: 'relative',
                            border: previewMode === 'mobile' ? '8px solid #2d3748' : 'none'
                        }}
                    >
                        {/* Mobile Notch */}
                        {previewMode === 'mobile' && <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '40%', height: '20px', background: '#2d3748', borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px', zIndex: 10 }}></div>}

                        {/* Site Header/Hero */}
                        {/* Site Header/Hero - Advanced */}
                        {/* Site Header/Hero - Advanced */}
                        <header style={{ backgroundColor: siteConfig.primaryColor, color: siteConfig.textColor, padding: '4rem 2rem 6rem 2rem', textAlign: 'center', transition: 'background 0.3s ease', position: 'relative', overflow: 'hidden' }}>
                            {/* Decorative background circle */}
                            <div style={{ position: 'absolute', top: '-50%', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '800px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', pointerEvents: 'none' }}></div>

                            <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#fff', padding: '4px', marginBottom: '1.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                                    <img
                                        src={siteConfig.vereadorPhoto || 'https://via.placeholder.com/150'}
                                        alt="Vereador"
                                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', background: '#e2e8f0' }}
                                    />
                                </div>

                                <span style={{ background: siteConfig.textColor, color: siteConfig.primaryColor, padding: '0.3rem 1rem', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '1rem', display: 'inline-block' }}>
                                    {siteConfig.vereadorNumber}
                                </span>

                                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 800 }}>{siteConfig.heroTitle}</h1>

                                <p style={{ opacity: 0.9, fontSize: '1.1rem', maxWidth: '600px', lineHeight: '1.6' }}>{siteConfig.heroSubtitle}</p>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                    <button style={{ padding: '0.8rem 2rem', background: '#D4AF37', border: 'none', borderRadius: '25px', color: '#1a202c', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                                        Participe
                                    </button>
                                    <button style={{ padding: '0.8rem 2rem', background: 'transparent', border: `2px solid ${siteConfig.textColor}`, borderRadius: '25px', color: siteConfig.textColor, fontWeight: 'bold', cursor: 'pointer' }}>
                                        Saiba Mais
                                    </button>
                                </div>
                            </div>
                        </header>

                        {/* Floating WhatsApp */}
                        {siteConfig.whatsappNumber && (
                            <a
                                href={`https://wa.me/${siteConfig.whatsappNumber}`}
                                target="_blank"
                                style={{
                                    position: 'absolute',
                                    bottom: '20px',
                                    right: '20px',
                                    background: '#25D366',
                                    color: 'white',
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                    zIndex: 100,
                                    cursor: 'pointer'
                                }}
                            >
                                <MessageCircle size={32} />
                            </a>
                        )}

                        {/* Site Content */}
                        <div style={{ padding: '0 1rem 4rem 1rem', marginTop: '-3rem', position: 'relative', zIndex: 5, display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                            {/* Announcement Section */}
                            {siteConfig.announcement.active && (
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    style={{ backgroundColor: siteConfig.announcement.bgColor, color: siteConfig.announcement.textColor, padding: '1.5rem', borderRadius: '12px', textAlign: 'center', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <AlertTriangle size={20} />
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: 0 }}>{siteConfig.announcement.title}</h3>
                                    </div>
                                    <p style={{ margin: 0 }}>{siteConfig.announcement.text}</p>
                                </motion.div>
                            )}

                            {/* WhatsApp Group Section */}
                            {siteConfig.whatsappGroup.active && (
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    style={{ backgroundColor: siteConfig.whatsappGroup.bgColor, color: siteConfig.whatsappGroup.textColor, padding: '2rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', flexWrap: 'wrap', gap: '1rem' }}
                                >
                                    <div>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '0 0 0.2rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Users size={20} /> {siteConfig.whatsappGroup.title}
                                        </h3>
                                        <p style={{ margin: 0, opacity: 0.9 }}>{siteConfig.whatsappGroup.description}</p>
                                    </div>
                                    <button style={{ background: 'white', color: siteConfig.whatsappGroup.bgColor, border: 'none', padding: '0.8rem 1.5rem', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer' }}>
                                        Entrar no Grupo
                                    </button>
                                </motion.div>
                            )}

                            {/* Video Section */}
                            {siteConfig.showVideo && siteConfig.videoUrl && (
                                <section style={{ backgroundColor: siteConfig.videoConfig.bgColor, padding: '1.5rem', borderRadius: '12px', color: siteConfig.videoConfig.textColor }}>
                                    <h2 style={{ fontSize: '1.5rem', color: siteConfig.videoConfig.textColor, borderBottom: '2px solid #D4AF37', display: 'inline-block', marginBottom: '1.5rem' }}>Destaque</h2>
                                    <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                                        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                                            <iframe
                                                src={siteConfig.videoUrl.replace('watch?v=', 'embed/')}
                                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                                                title="Video Destaque"
                                                allowFullScreen
                                            />
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* Gallery Carousel */}
                            {siteConfig.showGallery && (
                                <section style={{ backgroundColor: siteConfig.galleryConfig.bgColor, padding: '1.5rem', borderRadius: '12px', color: siteConfig.galleryConfig.textColor }}>
                                    <h2 style={{ fontSize: '1.5rem', color: siteConfig.galleryConfig.textColor, borderBottom: '2px solid #D4AF37', display: 'inline-block', marginBottom: '1.5rem' }}>Galeria</h2>
                                    <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', height: previewMode === 'mobile' ? '200px' : '300px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                                        <motion.img
                                            key={currentSlide}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            src={siteConfig.galleryImages[currentSlide]}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        <button
                                            onClick={() => setCurrentSlide((prev) => (prev === 0 ? siteConfig.galleryImages.length - 1 : prev - 1))}
                                            style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button
                                            onClick={() => setCurrentSlide((prev) => (prev === siteConfig.galleryImages.length - 1 ? 0 : prev + 1))}
                                            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </section>
                            )}

                            {/* Bio Section */}
                            {siteConfig.showBio && (
                                <section style={{ backgroundColor: siteConfig.bioConfig.bgColor, padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                    <h2 style={{ fontSize: '1.5rem', color: siteConfig.bioConfig.textColor, borderBottom: '2px solid #D4AF37', display: 'inline-block', marginBottom: '1rem' }}>Quem sou eu</h2>
                                    <p style={{ lineHeight: '1.6', color: siteConfig.bioConfig.textColor, opacity: 0.9 }}>
                                        {siteConfig.bioText}
                                    </p>
                                </section>
                            )}

                            {/* Blog / News Section */}
                            {siteConfig.showBlog && (
                                <section style={{ backgroundColor: siteConfig.blogConfig.bgColor, padding: '1.5rem', borderRadius: '12px', color: siteConfig.blogConfig.textColor }}>
                                    <h2 style={{ fontSize: '1.5rem', color: siteConfig.blogConfig.textColor, borderBottom: '2px solid #D4AF37', display: 'inline-block', marginBottom: '1.5rem' }}>Notícias</h2>
                                    <div style={{ display: 'grid', gridTemplateColumns: previewMode === 'mobile' ? '1fr' : '1fr 1fr', gap: '1.5rem' }}>
                                        {siteConfig.posts.map(post => (
                                            <div key={post.id} style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                                                <div style={{ height: '140px', overflow: 'hidden' }}>
                                                    <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                </div>
                                                <div style={{ padding: '1rem' }}>
                                                    <span style={{ fontSize: '0.75rem', color: '#718096' }}>{post.date}</span>
                                                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#2d3748', margin: '0.5rem 0' }}>{post.title}</h3>
                                                    <p style={{ fontSize: '0.85rem', color: '#4a5568', lineHeight: '1.5' }}>{post.excerpt}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Projects Section - Dynamic Integration */}
                            {siteConfig.showProjects && (
                                <section style={{ backgroundColor: siteConfig.projectsConfig.bgColor, padding: '1.5rem', borderRadius: '12px', color: siteConfig.projectsConfig.textColor }}>
                                    <h2 style={{ fontSize: '1.5rem', color: siteConfig.projectsConfig.textColor, borderBottom: '2px solid #D4AF37', display: 'inline-block', marginBottom: '1.5rem' }}>Atuação Parlamentar</h2>
                                    <div style={{ display: 'grid', gridTemplateColumns: previewMode === 'mobile' ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                        {recentProjects.map(proj => (
                                            <div key={proj.id} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f7fafc' }}>
                                                <h4 style={{ margin: '0 0 0.5rem 0', color: '#2d3748' }}>{proj.title}</h4>
                                                <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px', background: '#bee3f8', color: '#2c5282' }}>{proj.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: siteConfig.projectsConfig.textColor, marginTop: '0.5rem', fontStyle: 'italic', opacity: 0.8 }}>*Dados sincronizados com o Gabinete Digital.</p>
                                </section>
                            )}

                            {/* Contact Section */}
                            {siteConfig.showContact && (
                                <section style={{ backgroundColor: siteConfig.contactConfig.bgColor, padding: '1.5rem', borderRadius: '8px', color: siteConfig.contactConfig.textColor }}>
                                    <h2 style={{ fontSize: '1.5rem', color: siteConfig.contactConfig.textColor, marginBottom: '1rem' }}>Fale com o Vereador</h2>
                                    <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <input type="text" placeholder="Seu Nome" style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #cbd5e0' }} />
                                        <input type="email" placeholder="Seu Email" style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #cbd5e0' }} />
                                        <textarea placeholder="Sua Mensagem" style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #cbd5e0', minHeight: '80px' }}></textarea>
                                        <button style={{ padding: '0.8rem', background: siteConfig.primaryColor, color: siteConfig.textColor, border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Enviar Mensagem</button>
                                    </form>
                                </section>
                            )}

                        </div>

                        <footer style={{ backgroundColor: siteConfig.footerConfig.bgColor, color: siteConfig.footerConfig.textColor, padding: '2rem', textAlign: 'center', fontSize: '0.9rem' }}>
                            <p>&copy; 2026 Gabinete Digital - Todos os direitos reservados.</p>
                            <p style={{ opacity: 0.6, fontSize: '0.8rem', marginTop: '0.5rem' }}>Site gerado automaticamente pela plataforma.</p>
                        </footer>

                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default MandateSiteBuilder;
