import { useState } from 'react';
import { MessageSquare, QrCode, CheckCircle, AlertCircle, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const WhatsAppConfig = () => {
    const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
    const [showQR, setShowQR] = useState(false);

    const startConnection = () => {
        setStatus('connecting');
        setTimeout(() => {
            setShowQR(true);
        }, 1500);
    };

    const simulateSuccess = () => {
        setShowQR(false);
        setStatus('connected');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <header style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <div style={{ padding: '0.5rem', background: '#25D366', borderRadius: '0.5rem', color: 'white' }}>
                        <MessageSquare size={32} />
                    </div>
                    <h1>Conexão WhatsApp</h1>
                </div>
                <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>
                    Conecte o número do seu gabinete através da Evolution API para triagem automática.
                </p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                <div className="glass-card">
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Zap size={20} color="var(--secondary)" />
                            Status da Instância
                        </h3>
                        <div style={{
                            marginTop: '1.5rem',
                            padding: '1.5rem',
                            borderRadius: '1rem',
                            background: status === 'connected' ? 'rgba(56, 161, 105, 0.1)' : 'rgba(203, 213, 224, 0.1)',
                            border: `1px solid ${status === 'connected' ? '#38a169' : '#cbd5e0'}`,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {status === 'connected' ? (
                                    <CheckCircle size={32} color="#38a169" />
                                ) : (
                                    <AlertCircle size={32} color="#718096" />
                                )}
                                <div>
                                    <p style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem' }}>
                                        {status === 'connected' ? 'Instância Ativa' : status === 'connecting' ? 'Gerando QR Code...' : 'Desconectado'}
                                    </p>
                                    <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.7 }}>
                                        {status === 'connected' ? 'Número: +55 (55) 99876-5432' : 'Conecte seu WhatsApp para começar a receber demandas.'}
                                    </p>
                                </div>
                            </div>
                            {status === 'disconnected' && (
                                <button className="btn-primary" onClick={startConnection}>Conectar Agora</button>
                            )}
                            {status === 'connected' && (
                                <button
                                    style={{ background: '#fff5f5', color: '#e53e3e', border: '1px solid #e53e3e', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600 }}
                                    onClick={() => setStatus('disconnected')}
                                >
                                    Desconectar
                                </button>
                            )}
                        </div>
                    </div>

                    {showQR && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{ textAlign: 'center', padding: '2rem', border: '2px dashed #e2e8f0', borderRadius: '1rem' }}
                        >
                            <h4 style={{ marginBottom: '1.5rem' }}>Aponte seu celular e leia o QR Code</h4>
                            <div
                                onClick={simulateSuccess}
                                style={{
                                    width: '200px',
                                    height: '200px',
                                    margin: '0 auto',
                                    background: '#f8fafc',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    border: '1px solid #e2e8f0'
                                }}
                            >
                                <QrCode size={120} opacity={0.8} />
                                <div style={{ position: 'absolute', bottom: '10px', fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700 }}>Clique para simular leitura</div>
                            </div>
                            <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-light)' }}>
                                Ao conectar, nosso sistema criará uma instância dedicada na Evolution API v2.
                            </p>
                        </motion.div>
                    )}

                    <div style={{ marginTop: '2rem' }}>
                        <h4 style={{ marginBottom: '1rem' }}>Configurações de Webhook</h4>
                        <div style={{ background: 'var(--bg-color)', color: 'var(--text)', padding: '1rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontFamily: 'monospace', border: '1px solid var(--border)', wordBreak: 'break-all' }}>
                            https://api.gabinetedigital.com.br/v1/webhook/unique-id-tenant
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
                            Este é o endereço onde o servidor Evolution enviará as mensagens em tempo real.
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-card" style={{ background: 'var(--primary)', color: 'white' }}>
                        <h3 style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ShieldCheck size={20} color="var(--secondary)" />
                            Segurança e Custo
                        </h3>
                        <ul style={{ padding: '1rem 0 0 1.2rem', fontSize: '0.85rem', lineHeight: '1.8' }}>
                            <li>Encriptação ponta a ponta respeitada.</li>
                            <li>Sua conta não corre risco de ban (uso oficial).</li>
                            <li>Limite de 1000 mensagens/dia por instância.</li>
                            <li>Custo fixo por gabinete mensal.</li>
                        </ul>
                    </div>

                    <div className="glass-card">
                        <h3>Perguntas Frequentes</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                            <details style={{ fontSize: '0.9rem', cursor: 'pointer' }}>
                                <summary style={{ fontWeight: 600 }}>Posso usar meu número pessoal?</summary>
                                <p style={{ fontSize: '0.8rem', padding: '10px 0', color: 'var(--text-light)' }}>Sim, mas recomendamos um número dedicado para o Gabinete para evitar confusão entre mensagens pessoais e demandas.</p>
                            </details>
                            <details style={{ fontSize: '0.9rem', cursor: 'pointer' }}>
                                <summary style={{ fontWeight: 600 }}>O sistema lê grupos?</summary>
                                <p style={{ fontSize: '0.8rem', padding: '10px 0', color: 'var(--text-light)' }}>Sim, nossa IA consegue identificar quando o vereador é mencionado em grupos e extrair a demanda conforme as regras configuradas.</p>
                            </details>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default WhatsAppConfig;
