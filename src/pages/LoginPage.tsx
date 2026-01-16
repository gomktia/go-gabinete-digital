import { useState } from 'react';
import { Shield, Mail, Lock, LogIn, Sparkles } from 'lucide-react';
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at top left, #1a365d 0%, #0a192f 100%)',
            padding: '20px'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card"
                style={{
                    maxWidth: '450px',
                    width: '100%',
                    padding: '2rem',
                    /* Force dark translucent background for login card */
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '70px',
                        height: '70px',
                        background: 'var(--secondary)',
                        borderRadius: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        boxShadow: '0 0 30px rgba(212, 175, 55, 0.4)'
                    }}>
                        <Shield size={35} color="#1a365d" />
                    </div>
                    <h1 style={{ color: 'white', fontSize: '1.75rem', marginBottom: '0.5rem' }}>Gabinete Digital</h1>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Acesse sua plataforma de gestão legislativa.</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', zIndex: 1 }} />
                        <input
                            type="email"
                            placeholder="E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '1.1rem 1.1rem 1.1rem 3rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '1rem',
                                color: 'white',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                boxSizing: 'border-box' /* Ensure padding doesn't overflow width */
                            }}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', zIndex: 1 }} />
                        <input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '1.1rem 1.1rem 1.1rem 3rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '1rem',
                                color: 'white',
                                outline: 'none',
                                boxSizing: 'border-box' /* Ensure padding doesn't overflow width */
                            }}
                        />
                    </div>

                    {error && (
                        <p style={{ color: '#ff6b6b', fontSize: '0.85rem', textAlign: 'center', margin: 0 }}>{error}</p>
                    )}

                    <button
                        type="submit"
                        className="btn-gold"
                        style={{
                            padding: '1.1rem',
                            borderRadius: '1rem',
                            fontSize: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            border: 'none',
                            cursor: 'pointer',
                            width: '100%'
                        }}
                    >
                        <LogIn size={20} /> Entrar no Gabinete
                    </button>
                </form>

                <div style={{ marginTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--secondary)', fontSize: '0.8rem', fontWeight: 600 }}>
                        <Sparkles size={14} />
                        Powered by Gabinete AI v2.0
                    </div>
                </div>

                {/* Demo Credentials Hint */}
                <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                    <p style={{ margin: '0 0 5px' }}><b>Logins de Demonstração:</b></p>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: '1.5' }}>
                        <li>superadmin@sistema.com / admin123</li>
                        <li>vereador@exemplo.com / vereador123</li>
                        <li>assessor@equipe.com / assessor123</li>
                    </ul>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
