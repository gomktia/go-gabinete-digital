import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    MessageCircle, Video, Image as ImageIcon, ExternalLink, RefreshCw
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const PublicMandateSite = () => {
    const { slug } = useParams();
    const [siteConfig, setSiteConfig] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [tenantName, setTenantName] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        if (slug) fetchSiteData();
    }, [slug]);

    const fetchSiteData = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('tenants')
                .select('name, settings')
                .eq('slug', slug)
                .single();

            if (error || !data) throw error;

            setTenantName(data.name);
            // Default config structure to fallback safely
            const defaultConfig = {
                meta: { title: `Vereador ${data.name}`, description: '' },
                theme: {
                    primary: '#0f172a', secondary: '#d4af37', background: '#f8fafc',
                    text: '#1e293b', font: 'Inter'
                },
                sections: {
                    hero: { enabled: true, title: `Vereador ${data.name}`, subtitle: '', number: '', bgColor: '#0f172a', textColor: '#ffffff' },
                    bio: { enabled: true },
                    projects: { enabled: true },
                    video: { enabled: false },
                    gallery: { enabled: false },
                    news: { enabled: false },
                    whatsapp: { enabled: true, title: 'Participe', bgColor: '#25D366', textColor: '#ffffff' }
                }
            };

            const loadedConfig = data.settings?.site_config || {};
            // Deep merge to ensure at least default structure matches
            const merged = { ...defaultConfig, ...loadedConfig };
            merged.sections = { ...defaultConfig.sections, ...loadedConfig.sections };

            setSiteConfig(merged);
        } catch (err) {
            console.error(err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><RefreshCw className="spin" /></div>;
    if (error || !siteConfig) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Site não encontrado.</div>;

    // Helper to format style
    const theme = siteConfig.theme;

    return (
        <div style={{
            fontFamily: theme.font || 'Inter, sans-serif',
            background: theme.background,
            color: theme.text,
            minHeight: '100vh',
            overflowX: 'hidden'
        }}>
            {/* HERO */}
            {siteConfig.sections.hero.enabled && (
                <div style={{
                    position: 'relative',
                    background: siteConfig.sections.hero.bgColor,
                    color: siteConfig.sections.hero.textColor,
                    padding: '6rem 2rem',
                    textAlign: 'center',
                    overflow: 'hidden'
                }}>
                    <div style={{ // BG Image
                        position: 'absolute', inset: 0,
                        backgroundImage: `url(${siteConfig.sections.hero.bgImage})`,
                        backgroundSize: 'cover', backgroundPosition: 'center',
                        opacity: 0.2
                    }}></div>
                    <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
                        {siteConfig.sections.hero.number && (
                            <span style={{
                                background: theme.secondary, color: '#000',
                                padding: '0.5rem 1.5rem', borderRadius: '50px',
                                fontWeight: 800, fontSize: '1.5rem',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                            }}>
                                {siteConfig.sections.hero.number}
                            </span>
                        )}
                        <h1 style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1.1, margin: 0 }}>
                            {siteConfig.sections.hero.title}
                        </h1>
                        <p style={{ fontSize: '1.25rem', opacity: 0.9, fontWeight: 500, maxWidth: '700px' }}>
                            {siteConfig.sections.hero.subtitle}
                        </p>
                    </div>
                </div>
            )}

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '4rem' }}>

                {/* STATUS CARDS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{
                            background: 'white', borderRadius: '16px', padding: '2rem',
                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
                            borderTop: `4px solid ${theme.primary}`
                        }}>
                            <h4 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: theme.primary, fontWeight: 700 }}>Conquista Recente {i}</h4>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '1rem' }}>Esta é uma conquista simulada do mandato para demonstração.</p>
                        </div>
                    ))}
                </div>

                {/* VIDEO SECTION */}
                {siteConfig.sections.video?.enabled && (
                    <section style={{ background: siteConfig.sections.video.bgColor, color: siteConfig.sections.video.textColor, padding: '3rem', borderRadius: '24px' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', textAlign: 'center', color: theme.secondary }}>{siteConfig.sections.video.title}</h2>
                        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '16px', background: '#000', maxWidth: '900px', margin: '0 auto' }}>
                            <iframe
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                src={siteConfig.sections.video.url}
                                title="Video Player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </section>
                )}

                {/* GALLERY SECTION */}
                {siteConfig.sections.gallery?.enabled && siteConfig.sections.gallery.images && (
                    <section style={{ background: siteConfig.sections.gallery.bgColor, color: siteConfig.sections.gallery.textColor, padding: '3rem', borderRadius: '24px' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', textAlign: 'center', color: theme.secondary }}>{siteConfig.sections.gallery.title}</h2>
                        <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1.5rem', scrollbarWidth: 'none' }}>
                            {siteConfig.sections.gallery.images.map((img: string, i: number) => (
                                <img key={i} src={img} style={{ height: '350px', aspectRatio: '3/4', borderRadius: '16px', objectFit: 'cover', flexShrink: 0, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
                            ))}
                        </div>
                    </section>
                )}

                {/* NEWS SECTION */}
                {siteConfig.sections.news?.enabled && siteConfig.sections.news.posts && (
                    <section style={{ background: siteConfig.sections.news.bgColor, color: siteConfig.sections.news.textColor, padding: '3rem', borderRadius: '24px' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', textAlign: 'center', color: theme.primary }}>{siteConfig.sections.news.title}</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                            {siteConfig.sections.news.posts.map((post: any, i: number) => (
                                <div key={i} style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderLeft: `4px solid ${theme.secondary}` }}>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#94a3b8' }}>{post.date}</span>
                                    <h3 style={{ margin: '0.5rem 0', fontSize: '1.4rem', fontWeight: 800, color: theme.primary }}>{post.title}</h3>
                                    <p style={{ margin: 0, opacity: 0.8, fontSize: '1rem', lineHeight: 1.6 }}>{post.snippet}</p>
                                    <a href="#" style={{ display: 'inline-flex', alignItems: 'center', marginTop: '1.5rem', fontSize: '1rem', fontWeight: 700, color: theme.primary, textDecoration: 'none' }}>
                                        Ler mais <ExternalLink size={16} style={{ marginLeft: '4px' }} />
                                    </a>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* BIO SECTION */}
                {siteConfig.sections.bio.enabled && (
                    <section style={{ background: siteConfig.sections.bio.bgColor, color: siteConfig.sections.bio.textColor, padding: '3rem', borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '4rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: '300px' }}>
                                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem', color: theme.secondary }}>{siteConfig.sections.bio.title}</h2>
                                <p style={{ lineHeight: 1.8, fontSize: '1.2rem' }}>{siteConfig.sections.bio.content}</p>
                            </div>
                            <div style={{ width: '400px', height: '400px', background: '#cbd5e1', borderRadius: '30px', overflow: 'hidden', flexShrink: 0 }}>
                                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1000" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        </div>
                    </section>
                )}

                {/* PROJECT/DEMANDS SECTION (Placeholder for now based on 'projects' key) */}
                {siteConfig.sections.projects?.enabled && (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: theme.primary }}>Nossos Projetos</h2>
                        <p style={{ color: theme.text, opacity: 0.7 }}>Acompanhe em breve aqui todos os projetos de lei e demandas do nosso mandato.</p>
                    </div>
                )}

                {/* WHATSAPP CTA */}
                {siteConfig.sections.whatsapp.enabled && (
                    <section style={{ background: siteConfig.sections.whatsapp.bgColor, color: siteConfig.sections.whatsapp.textColor, padding: '4rem 2rem', borderRadius: '24px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <MessageCircle size={64} style={{ marginBottom: '1.5rem' }} />
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>{siteConfig.sections.whatsapp.title}</h2>
                        <p style={{ fontSize: '1.4rem', opacity: 0.9, marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>{siteConfig.sections.whatsapp.description}</p>
                        <a href={siteConfig.sections.whatsapp.link} target="_blank" rel="noreferrer" style={{
                            textDecoration: 'none', display: 'inline-block',
                            padding: '18px 40px', background: 'white', color: siteConfig.sections.whatsapp.bgColor,
                            border: 'none', borderRadius: '50px', fontWeight: 800, fontSize: '1.2rem',
                            boxShadow: '0 10px 15px rgba(0,0,0,0.1)'
                        }}>
                            ENTRAR NO GRUPO VIP
                        </a>
                    </section>
                )}
            </div>

            {/* FOOTER */}
            <footer style={{ background: theme.primary, color: 'white', padding: '4rem 2rem', textAlign: 'center', marginTop: '4rem' }}>
                <h3 style={{ fontWeight: 900, marginBottom: '1rem', fontSize: '1.5rem' }}>VEREADOR {tenantName?.toUpperCase()}</h3>
                <p style={{ opacity: 0.6 }}>Política feita com transparência e tecnologia.</p>
                <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '0.9rem', opacity: 0.4 }}>
                    © 2026 Gabinete Digital
                </div>
            </footer>

            {/* FLOATING WHATSAPP */}
            {siteConfig.sections.whatsapp.enabled && siteConfig.sections.whatsapp.showFloating && (
                <a href={siteConfig.sections.whatsapp.link} target="_blank" rel="noreferrer" style={{
                    position: 'fixed', bottom: '30px', right: '30px',
                    width: '70px', height: '70px',
                    background: '#25D366', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(37, 211, 102, 0.5)',
                    cursor: 'pointer', zIndex: 1000,
                    transition: 'transform 0.2s'
                }}>
                    <MessageCircle color="white" size={36} />
                </a>
            )}
        </div>
    );
};

export default PublicMandateSite;
