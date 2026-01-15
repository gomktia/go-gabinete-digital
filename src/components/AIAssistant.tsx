import { useState } from 'react';
import { Bot, X, Send, Sparkles, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Olá! Sou seu Assessor IA. Como posso ajudar com o seu mandato hoje?' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { role: 'user', text: input }];
        setMessages(newMessages);
        setInput('');

        // Simulate AI response
        setTimeout(() => {
            let response = "Interessante! Posso analisar as demandas do WhatsApp e gerar uma minuta sobre isso. Quer que eu comece?";
            if (input.toLowerCase().includes('bairro')) {
                response = "No momento, o Bairro Centro está com o maior volume de demandas pendentes (3), principalmente sobre Saúde.";
            } else if (input.toLowerCase().includes('agenda')) {
                response = "Sua próxima reunião é às 14:00 na Câmara Municipal para a Sessão Ordinária.";
            }
            setMessages([...newMessages, { role: 'assistant', text: response }]);
        }, 1000);
    };

    return (
        <>
            {/* Floating Button */}
            <motion.button
                className="btn-gold flex-center"
                onClick={() => setIsOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    boxShadow: '0 8px 30px rgba(212, 175, 55, 0.4)',
                    zIndex: 1000,
                    border: 'none',
                    cursor: 'pointer'
                }}
            >
                <Bot size={28} />
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 50, x: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 50, x: 50 }}
                        style={{
                            position: 'fixed',
                            bottom: '5.5rem',
                            right: '2rem',
                            width: '350px',
                            height: '500px',
                            background: 'white',
                            borderRadius: '1.5rem',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                            zIndex: 1001,
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            border: '1px solid #edf2f7'
                        }}
                    >
                        {/* Header */}
                        <div style={{ background: 'var(--primary)', color: 'white', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ padding: '6px', background: 'rgba(212, 175, 55, 0.2)', borderRadius: '8px', color: 'var(--secondary)' }}>
                                    <Sparkles size={18} />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '1rem', color: 'white' }}>Assessor Estratégico</h4>
                                    <p style={{ margin: 0, fontSize: '0.65rem', opacity: 0.8 }}>IA conectada ao seu mandato</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {messages.map((msg, i) => (
                                <div key={i} style={{
                                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '85%',
                                    padding: '0.75rem 1rem',
                                    borderRadius: msg.role === 'user' ? '1rem 1rem 0 1rem' : '1rem 1rem 1rem 0',
                                    background: msg.role === 'user' ? 'var(--primary)' : '#f1f5f9',
                                    color: msg.role === 'user' ? 'white' : 'var(--text)',
                                    fontSize: '0.85rem',
                                    lineHeight: '1.5'
                                }}>
                                    {msg.text}
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <div style={{ padding: '1.25rem', borderTop: '1px solid #edf2f7' }}>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Pergunte sobre demandas ou leis..."
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 3rem 0.75rem 1rem',
                                        borderRadius: '1rem',
                                        border: '1px solid #e2e8f0',
                                        outline: 'none',
                                        fontSize: '0.85rem'
                                    }}
                                />
                                <button
                                    onClick={handleSend}
                                    style={{
                                        position: 'absolute',
                                        right: '8px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'var(--primary)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '32px',
                                        height: '32px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AIAssistant;
