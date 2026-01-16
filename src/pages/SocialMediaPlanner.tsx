import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Upload, Sparkles, Calendar as CalendarIcon,
    Instagram, Facebook, Video, Clock, CheckCircle,
    Share2, Plus, Image as ImageIcon, Wand2
} from 'lucide-react';

const SocialMediaPlanner = () => {
    const [activeTab, setActiveTab] = useState('create'); // create | schedule
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedContent, setGeneratedContent] = useState<any[]>([]);

    // Mock Week Schedule
    const [weekSchedule] = useState<any[]>([
        { day: 'Seg', posts: 1 },
        { day: 'Ter', posts: 0 },
        { day: 'Qua', posts: 2 },
        { day: 'Qui', posts: 1 },
        { day: 'Sex', posts: 3 },
        { day: 'Sáb', posts: 1 },
        { day: 'Dom', posts: 0 },
    ]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const generateContent = () => {
        setIsGenerating(true);
        // Simulate AI delay
        setTimeout(() => {
            const newContent = [
                {
                    platform: 'Instagram',
                    icon: Instagram,
                    color: '#E1306C',
                    title: 'Fim de semana na comunidade!',
                    caption: 'Hoje estive presente no bairro Vila Nova ouvindo as demandas da população. O trabalho não para! 💪 #VereadorAtuante #Comunidade',
                    hashtags: '#Politica #VilaNova #Transparencia',
                    time: '18:00'
                },
                {
                    platform: 'Facebook',
                    icon: Facebook,
                    color: '#4267B2',
                    title: 'Relatório Semanal',
                    caption: 'Confira o resumo das atividades desta semana. Conseguimos aprovar 2 requerimentos importantes para a saúde. Saiba mais no link.',
                    hashtags: '#Saude #MandatoParticipativo',
                    time: '12:30'
                },
                {
                    platform: 'TikTok',
                    icon: Video,
                    color: '#000000',
                    title: 'Bastidores da Câmara 🎥',
                    caption: 'Você sabe como funciona uma votação? Vem comigo que eu te explico em 1 minuto! 🏛️',
                    hashtags: '#Curiosidades #CamaraMunicipal #Fy',
                    time: '19:00'
                }
            ];
            setGeneratedContent(newContent);
            setIsGenerating(false);
        }, 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ paddingBottom: '2rem' }}
        >
            <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <div style={{ padding: '0.5rem', background: 'var(--primary)', borderRadius: '0.5rem', color: 'var(--secondary)' }}>
                            <Share2 size={32} />
                        </div>
                        <h1>Agente Social Media</h1>
                    </div>
                    <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
                        Criação e agendamento automático de conteúdo com Inteligência Artificial.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        className={`btn-gold ${activeTab === 'create' ? '' : 'outline'}`}
                        onClick={() => setActiveTab('create')}
                        style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                    >
                        <Wand2 size={18} /> Criar Conteúdo
                    </button>
                    <button
                        className={`btn-gold ${activeTab === 'schedule' ? '' : 'outline'}`}
                        onClick={() => setActiveTab('schedule')}
                        style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                    >
                        <CalendarIcon size={18} /> Cronograma
                    </button>
                </div>
            </header>

            {activeTab === 'create' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>

                    {/* Input Section */}
                    <div className="glass-card">
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Upload size={20} /> Upload de Mídia
                        </h3>

                        <div
                            style={{
                                border: '2px dashed rgba(255,255,255,0.2)',
                                borderRadius: '1rem',
                                padding: '2rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                background: uploadedImage ? `url(${uploadedImage}) center/cover` : 'rgba(0,0,0,0.2)',
                                height: '250px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1.5rem',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <input
                                type="file"
                                onChange={handleImageUpload}
                                style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                            />
                            {!uploadedImage && (
                                <>
                                    <ImageIcon size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                                    <p>Arraste uma foto ou clique aqui</p>
                                    <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Suporta JPG, PNG</span>
                                </>
                            )}
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Contexto / Tópico</label>
                            <input
                                type="text"
                                placeholder="Ex: Visita ao bairro Santa Maria, Buraco na rua X..."
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                            />
                        </div>

                        <button
                            className="btn-gold"
                            style={{ width: '100%', justifyContent: 'center', gap: '0.5rem' }}
                            onClick={generateContent}
                            disabled={isGenerating}
                        >
                            {isGenerating ? <><Sparkles className="spin" size={20} /> Criando Mágica...</> : <><Sparkles size={20} /> Gerar Postagens</>}
                        </button>
                    </div>

                    {/* Output Section */}
                    <div>
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CheckCircle size={20} /> Sugestões da IA
                        </h3>

                        {generatedContent.length === 0 && !isGenerating && (
                            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-light)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}>
                                <Sparkles size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                <p>Faça o upload de uma foto para começar.</p>
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {generatedContent.map((post, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="glass-card"
                                    style={{ display: 'flex', gap: '1.5rem', position: 'relative', overflow: 'hidden' }}
                                >
                                    <div style={{ width: '6px', backgroundColor: post.color, position: 'absolute', left: 0, top: 0, bottom: 0 }}></div>

                                    <div style={{ minWidth: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}>
                                            <post.icon size={24} color={post.color} />
                                        </div>
                                        <span style={{ fontSize: '0.7rem' }}>{post.platform}</span>
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ marginBottom: '0.5rem' }}>{post.title}</h4>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '1rem', lineHeight: '1.5' }}>
                                            {post.caption} <br />
                                            <span style={{ color: 'var(--secondary)', fontSize: '0.8rem' }}>{post.hashtags}</span>
                                        </p>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-light)' }}>
                                                <Clock size={14} /> Sugestão: {post.time}
                                            </div>
                                            <button className="btn-gold outline" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>Agendar Post</button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'schedule' && (
                <div className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h3>Cronograma Semanal</h3>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><div style={{ width: '10px', height: '10px', background: '#E1306C', borderRadius: '50%' }}></div> Insta</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><div style={{ width: '10px', height: '10px', background: '#4267B2', borderRadius: '50%' }}></div> Face</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}><div style={{ width: '10px', height: '10px', background: '#000000', borderRadius: '50%' }}></div> Tik</span>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1rem' }}>
                        {weekSchedule.map((day, i) => (
                            <div key={i} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', padding: '1rem', minHeight: '300px' }}>
                                <div style={{ marginBottom: '1rem', textAlign: 'center', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <span style={{ fontWeight: 700 }}>{day.day}</span>
                                </div>
                                {Array.from({ length: day.posts }).map((_, p) => (
                                    <div key={p} style={{ background: 'var(--surface)', padding: '0.5rem', borderRadius: '0.5rem', marginBottom: '0.5rem', fontSize: '0.8rem', borderLeft: `3px solid ${p % 2 === 0 ? '#E1306C' : '#4267B2'}` }}>
                                        <p style={{ margin: 0, fontWeight: 600 }}>Post Campanha</p>
                                        <p style={{ margin: 0, opacity: 0.7, fontSize: '0.7rem' }}>1{4 + p}:00</p>
                                    </div>
                                ))}
                                <button style={{ width: '100%', marginTop: '0.5rem', background: 'none', border: '1px dashed rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '0.5rem', color: 'var(--text-light)', cursor: 'pointer' }}>
                                    <Plus size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default SocialMediaPlanner;
