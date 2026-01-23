import { useState } from 'react';
import { Mail, Lock, LogIn, Sparkles, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTenant } from '../context/TenantContext';


const LoginPage = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Sign Up Fields
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState('vereador'); // Default

    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login, signUp } = useTenant();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const { success, error } = await login(email, password);
        if (!success) {
            setError(error || 'E-mail ou senha incorretos.');
        }
        setIsLoading(false);
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setIsLoading(true);

        const { success, error } = await signUp(email, password, fullName, role);
        if (!success) {
            setError(error || 'Erro ao criar conta.');
        } else {
            setSuccessMsg('Conta criada com sucesso! Verifique seu e-mail ou faça login (se o email confirm estiver desativado).');
            setIsLoginView(true); // Switch back to login
        }
        setIsLoading(false);
    };

    const fillDemo = (roleType: string) => {
        const demoCreds: any = {
            'vereador': { email: 'vereador@teste.com', pass: '123456' },
            'assessor': { email: 'assessor@teste.com', pass: '123456' },
            'admin': { email: 'admin@teste.com', pass: '123456' }
        };
        setEmail(demoCreds[roleType].email);
        setPassword(demoCreds[roleType].pass);
        setError('');
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
                    maxWidth: '450px',
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
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ color: 'white', fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.75rem', letterSpacing: '-0.5px' }}>
                        {isLoginView ? 'Gabinete Digital' : 'Criar Nova Conta'}
                    </h1>
                    <p style={{ color: '#a0aec0', fontSize: '0.95rem', lineHeight: '1.5' }}>
                        {isLoginView ? 'Plataforma integrada de gestão parlamentar.' : 'Cadastre-se para iniciar seu gabinete.'}
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {isLoginView ? (
                        <motion.form
                            key="login"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onSubmit={handleLogin}
                            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                        >
                            <div style={{ position: 'relative' }}>
                                <Mail size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#718096', zIndex: 1 }} />
                                <input
                                    type="email"
                                    placeholder="Seu e-mail profissional"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="login-input"
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
                                    className="login-input"
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
                                />
                            </div>

                            {error && (
                                <div style={{ background: 'rgba(229, 62, 62, 0.15)', border: '1px solid #e53e3e', borderRadius: '0.5rem', padding: '0.75rem', color: '#fc8181', fontSize: '0.85rem', textAlign: 'center' }}>
                                    {error}
                                </div>
                            )}

                            {successMsg && (
                                <div style={{ background: 'rgba(56, 161, 105, 0.15)', border: '1px solid #38a169', borderRadius: '0.5rem', padding: '0.75rem', color: '#68d391', fontSize: '0.85rem', textAlign: 'center' }}>
                                    {successMsg}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn-gold"
                                disabled={isLoading}
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
                                    opacity: isLoading ? 0.7 : 1
                                }}
                            >
                                <LogIn size={20} /> {isLoading ? 'Entrando...' : 'Entrar no Sistema'}
                            </button>

                            <div style={{ marginTop: '1rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                                <p style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginBottom: '1rem' }}>Acesso Rápido (Preencher Demo)</p>
                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                    <button type="button" onClick={() => fillDemo('vereador')} style={{ padding: '0.5rem', fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '0.5rem', color: 'white', cursor: 'pointer' }}>Vereador</button>
                                    <button type="button" onClick={() => fillDemo('assessor')} style={{ padding: '0.5rem', fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '0.5rem', color: 'white', cursor: 'pointer' }}>Assessor</button>
                                    <button type="button" onClick={() => fillDemo('admin')} style={{ padding: '0.5rem', fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '0.5rem', color: 'white', cursor: 'pointer' }}>Admin</button>
                                </div>
                                <p style={{ fontSize: '0.7rem', color: '#718096', marginTop: '0.5rem' }}>*Requer conta criada com estes dados</p>
                            </div>

                            <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#a0aec0', marginTop: '0.5rem', cursor: 'pointer' }} onClick={() => setIsLoginView(false)}>
                                Não tem uma conta? <span style={{ color: 'var(--secondary)', fontWeight: 600 }}>Cadastre-se</span>
                            </p>
                        </motion.form>
                    ) : (
                        <motion.form
                            key="signup"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={handleSignUp}
                            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
                        >
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    placeholder="Nome Completo"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        background: 'rgba(0, 0, 0, 0.2)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '0.75rem',
                                        color: 'white',
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            <div style={{ position: 'relative' }}>
                                <input
                                    type="email"
                                    placeholder="E-mail"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        background: 'rgba(0, 0, 0, 0.2)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '0.75rem',
                                        color: 'white',
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            <div style={{ position: 'relative' }}>
                                <input
                                    type="password"
                                    placeholder="Senha"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        background: 'rgba(0, 0, 0, 0.2)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '0.75rem',
                                        color: 'white',
                                        outline: 'none'
                                    }}
                                />
                            </div>

                            <div style={{ position: 'relative' }}>
                                <label style={{ display: 'block', color: 'var(--text-light)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Tipo de Conta</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        background: 'rgba(0, 0, 0, 0.2)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '0.75rem',
                                        color: 'white',
                                        outline: 'none'
                                    }}
                                >
                                    <option value="vereador">Vereador</option>
                                    <option value="assessor">Assessor</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>

                            {error && (
                                <div style={{ background: 'rgba(229, 62, 62, 0.15)', border: '1px solid #e53e3e', borderRadius: '0.5rem', padding: '0.75rem', color: '#fc8181', fontSize: '0.85rem', textAlign: 'center' }}>
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn-gold"
                                disabled={isLoading}
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
                                    opacity: isLoading ? 0.7 : 1
                                }}
                            >
                                <UserPlus size={20} /> {isLoading ? 'Criando...' : 'Criar Conta'}
                            </button>

                            <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#a0aec0', marginTop: '0.5rem', cursor: 'pointer' }} onClick={() => setIsLoginView(true)}>
                                Já tem uma conta? <span style={{ color: 'var(--secondary)', fontWeight: 600 }}>Entrar</span>
                            </p>
                        </motion.form>
                    )}
                </AnimatePresence>

                <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                        <Sparkles size={12} />
                        Powered by Gabinete AI
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
