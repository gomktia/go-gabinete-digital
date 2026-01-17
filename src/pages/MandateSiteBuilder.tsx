import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Globe, Type, Eye, Save, Smartphone,
    Monitor, Video, MessageCircle, AlertTriangle, RefreshCw,
    Layout, Image as ImageIcon, Plus, Trash2, Palette, Check
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

    // Default configuration with Granular Control
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
            whatsapp: {
                enabled: true,
                title: 'Participe do Mandato',
                description: 'Entre no nosso grupo exclusivo e receba atualizações.',
                link: 'https://wa.me/',
                bgColor: '#25D366',
                textColor: '#ffffff'
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
        const { data, error } = await supabase
            .from('tenants')
            .select('site_config')
            .eq('id', tenant.id)
            .single();

        if (error || !data.site_config) {
            setSiteConfig(defaultConfig);
        } else {
            // Merge deeper to avoid missing keys on legacy configs
            setSiteConfig({ ...defaultConfig, ...data.site_config, sections: { ...defaultConfig.sections, ...data.site_config.sections } });
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
            alert('Erro ao publicar site');
        } else {
            alert("Site atualizado com sucesso!");
        }
        setIsPublishing(false);
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
                                    <ColorPicker label="Texto" value={siteConfig.sections.bio.textColor} onChange={(v: string) => setSiteConfig({ ...siteConfig, sections: { ...siteConfig.sections, bio: { ...siteConfig.sections.bio, textColor: v } } })} />
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
                            padding: previewMode === 'mobile' ? '2rem 1.5rem' : '3rem 4rem',
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
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default MandateSiteBuilder;
