import { useState } from 'react';
import { Mail, Lock, LogIn, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTenant } from '../context/TenantContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useTenant();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const success = login(email, password);
        if (!success) {
            setError('E-mail ou senha incorretos.');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at 50% 10%, #2a4365 0%, #1a202c 40%, #000000 100%)', // Deep premium night sky
            padding: '20px',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Decor */}
            <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '300px', height: '300px', background: 'var(--primary)', filter: 'blur(150px)', opacity: 0.15, borderRadius: '50%' }}></div>
            <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '400px', height: '400px', background: 'var(--secondary)', filter: 'blur(150px)', opacity: 0.1, borderRadius: '50%' }}></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="glass-card"
                style={{
                    maxWidth: '420px',
                    width: '100%',
                    padding: '2.5rem',
                    background: 'rgba(255, 255, 255, 0.03)', // Ultra thin glass
                    backdropFilter: 'blur(20px)', // Heavy blur
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    zIndex: 10
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>

                    <h1 style={{ color: 'white', fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.75rem', letterSpacing: '-0.5px' }}>Gabinete Digital</h1>
                    <p style={{ color: '#a0aec0', fontSize: '0.95rem', lineHeight: '1.5' }}>Plataforma integrada de gestão parlamentar.</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Mail size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#718096', zIndex: 1 }} />
                        <input
                            type="email"
                            placeholder="Seu e-mail profissional"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '1rem 1rem 1rem 3rem',
                                background: 'rgba(0, 0, 0, 0.2)', // Darker input
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '0.75rem',
                                color: 'white',
                                outline: 'none',
                                transition: 'all 0.2s',
                                fontSize: '0.95rem'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = 'var(--secondary)';
                                e.target.style.background = 'rgba(0, 0, 0, 0.3)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                e.target.style.background = 'rgba(0, 0, 0, 0.2)';
                            }}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#718096', zIndex: 1 }} />
                        <input
                            type="password"
                            placeholder="Sua senha segura"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '1rem 1rem 1rem 3rem',
                                background: 'rgba(0, 0, 0, 0.2)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '0.75rem',
                                color: 'white',
                                outline: 'none',
                                transition: 'all 0.2s',
                                fontSize: '0.95rem'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = 'var(--secondary)';
                                e.target.style.background = 'rgba(0, 0, 0, 0.3)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                e.target.style.background = 'rgba(0, 0, 0, 0.2)';
                            }}
                        />
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            style={{ background: 'rgba(229, 62, 62, 0.15)', border: '1px solid #e53e3e', borderRadius: '0.5rem', padding: '0.75rem', color: '#fc8181', fontSize: '0.85rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        >
                            <span style={{ width: '6px', height: '6px', background: '#fc8181', borderRadius: '50%' }}></span>
                            {error}
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        className="btn-gold"
                        style={{
                            padding: '1rem',
                            borderRadius: '0.75rem',
                            fontSize: '1rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            border: 'none',
                            cursor: 'pointer',
                            width: '100%',
                            marginTop: '0.5rem',
                            boxShadow: '0 4px 15px rgba(212, 175, 55, 0.25)',
                            transition: 'transform 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <LogIn size={20} /> Entrar no Sistema
                    </button>
                </form>

                <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                        <Sparkles size={12} />
                        Powered by Gabinete AI
                    </div>
                </div>

                {/* Improved Demo Credentials */}

            </motion.div>
        </div>
    );
};

export default LoginPage;
