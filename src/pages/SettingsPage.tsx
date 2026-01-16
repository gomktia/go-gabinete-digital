import { useTenant } from '../context/TenantContext';
import { Palette, Shield, Building, Hash, FileText, Mail, Moon, Sun, User, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

const SettingsPage = () => {
    const { tenant, updateTenant, toggleTheme } = useTenant();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <header style={{ marginBottom: '2.5rem' }}>
                <h1>Configurações do Gabinete</h1>
                <p style={{ color: 'var(--text-light)' }}>Personalize a identidade visual e os dados do seu mandato.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                <div className="glass-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
                        <User size={20} style={{ color: 'var(--primary)' }} />
                        <h3 style={{ margin: 0 }}>Perfil do Usuário</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                border: '4px solid var(--primary)',
                                background: '#f1f5f9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {tenant.photoUrl ? (
                                    <img src={tenant.photoUrl} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <User size={64} style={{ opacity: 0.2 }} />
                                )}
                            </div>
                            <label htmlFor="photo-upload" style={{
                                position: 'absolute',
                                bottom: '0',
                                right: '0',
                                background: 'var(--secondary)',
                                color: 'var(--primary)',
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}>
                                <Upload size={18} />
                            </label>
                            <input
                                id="photo-upload"
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            updateTenant({ photoUrl: reader.result as string });
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{tenant.name}</h4>
                            <span style={{
                                background: 'var(--primary)',
                                color: 'var(--secondary)',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '1rem',
                                fontSize: '0.8rem',
                                fontWeight: 600
                            }}>
                                {tenant.role}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="glass-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
                        <Palette size={20} style={{ color: 'var(--primary)' }} />
                        <h3 style={{ margin: 0 }}>Identidade Visual</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ margin: 0, marginBottom: '0.5rem' }}>Tema do Sistema</label>
                            <button
                                onClick={toggleTheme}
                                className="flex-center gap-2"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    border: '1px solid #e2e8f0',
                                    background: 'var(--surface)',
                                    color: 'var(--text)',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                }}
                            >
                                {tenant.theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                                Alternar para Modo {tenant.theme === 'light' ? 'Escuro' : 'Claro'}
                            </button>
                        </div>

                        <div>
                            <label style={{ margin: 0, marginBottom: '0.5rem' }}>Cor Primária (Partido)</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    type="color"
                                    value={tenant.primaryColor}
                                    onChange={(e) => updateTenant({ primaryColor: e.target.value })}
                                    style={{ width: '50px', height: '42px', padding: '2px', cursor: 'pointer', marginTop: 0 }}
                                />
                                <input
                                    type="text"
                                    value={tenant.primaryColor}
                                    onChange={(e) => updateTenant({ primaryColor: e.target.value })}
                                    style={{ marginTop: 0 }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ margin: 0, marginBottom: '0.5rem' }}>Cor Secundária (Destaque)</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    type="color"
                                    value={tenant.secondaryColor}
                                    onChange={(e) => updateTenant({ secondaryColor: e.target.value })}
                                    style={{ width: '50px', height: '42px', padding: '2px', cursor: 'pointer', marginTop: 0 }}
                                />
                                <input
                                    type="text"
                                    value={tenant.secondaryColor}
                                    onChange={(e) => updateTenant({ secondaryColor: e.target.value })}
                                    style={{ marginTop: 0 }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
                        <Building size={20} style={{ color: 'var(--primary)' }} />
                        <h3 style={{ margin: 0 }}>Dados do Mandato</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ margin: 0 }}>Nome do Gabinete</label>
                            <div style={{ position: 'relative' }}>
                                <Building size={16} style={{ position: 'absolute', left: '12px', top: '1.4rem', opacity: 0.4 }} />
                                <input
                                    type="text"
                                    value={tenant.name}
                                    onChange={(e) => updateTenant({ name: e.target.value })}
                                    style={{ padding: '0.75rem 0.75rem 0.75rem 2.5rem', width: '100%', background: 'var(--bg-color)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '0.5rem' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ margin: 0 }}>E-mail de Login</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4, color: 'var(--text)' }} />
                                <input
                                    type="email"
                                    value={tenant.email}
                                    onChange={(e) => updateTenant({ email: e.target.value })}
                                    style={{ padding: '0.75rem 0.75rem 0.75rem 2.5rem', width: '100%', background: 'var(--bg-color)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '0.5rem' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem' }}>
                            <div>
                                <label style={{ margin: 0 }}>Nº Candidato</label>
                                <div style={{ position: 'relative' }}>
                                    <Hash size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4, color: 'var(--text)' }} />
                                    <input
                                        type="text"
                                        value={tenant.candidateNumber}
                                        onChange={(e) => updateTenant({ candidateNumber: e.target.value })}
                                        style={{ padding: '0.75rem 0.75rem 0.75rem 2.5rem', width: '100%', background: 'var(--bg-color)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '0.5rem' }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ margin: 0 }}>CNPJ do Gabinete</label>
                                <div style={{ position: 'relative' }}>
                                    <FileText size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4, color: 'var(--text)' }} />
                                    <input
                                        type="text"
                                        value={tenant.cnpj}
                                        onChange={(e) => updateTenant({ cnpj: e.target.value })}
                                        style={{ padding: '0.75rem 0.75rem 0.75rem 2.5rem', width: '100%', background: 'var(--bg-color)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '0.5rem' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-card" style={{ gridColumn: '1 / -1', background: 'rgba(56, 161, 105, 0.1)', border: '1px solid #38a169' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                        <Shield size={20} color="#38a169" />
                        <h3 style={{ margin: 0, color: '#38a169' }}>Segurança Multi-Tenant</h3>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#2f855a' }}>
                        Seus dados são isolados. As cores e informações configuradas aqui são exclusivas para o seu Gabinete Digital e não afetam outros usuários do sistema.
                    </p>
                </div>
                {/* Sentry Test Button */}
                <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
                    <button
                        className="btn-primary"
                        style={{ background: '#e53e3e', color: 'white' }}
                        onClick={() => {
                            throw new Error("This is a Sentry Test Error from SettingsPage");
                        }}
                    >
                        Testar Sentry (Gerar Erro)
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default SettingsPage;
