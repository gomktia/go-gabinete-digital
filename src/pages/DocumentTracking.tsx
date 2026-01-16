import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, Clock, AlertTriangle, Search, Filter, Plus, Eye, Download, CheckCircle, Bell, Upload, PenTool, Check } from 'lucide-react';
import { Modal } from '../components/UIComponents';

const initialDocs = [
    { id: 1, type: 'Ofício', code: 'OF-023/2026', subject: 'Solicitação de Reparo na Iluminação - Praça Central', status: 'pending', deadline: '2026-03-25', department: 'Secretaria de Obras', alertSet: true, signed: false, file: 'oficio_023.pdf' },
    { id: 2, type: 'Requerimento', code: 'REQ-102/2026', subject: 'Informações sobre Gastos da Saúde', status: 'late', deadline: '2026-03-10', department: 'Gabinete do Prefeito', alertSet: true, signed: true, file: 'req_102_signed.pdf' },
    { id: 3, type: 'Protocolo', code: 'PROT-551/2026', subject: 'Inscrição no Programa Minha Casa Minha Vida (Sr. José)', status: 'completed', deadline: '2026-03-15', department: 'Habitação', alertSet: false, signed: false, file: 'prot_551.pdf' },
    { id: 4, type: 'Licença', code: 'LIC-001/2026', subject: 'Licença para Evento no Parque', status: 'pending', deadline: '2026-03-30', department: 'Meio Ambiente', alertSet: true, signed: false, file: null },
];

const DocumentTracking = () => {
    const [docs, setDocs] = useState(initialDocs);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGovModalOpen, setIsGovModalOpen] = useState(false);
    const [selectedDocId, setSelectedDocId] = useState<number | null>(null);
    const [isSigning, setIsSigning] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');

    const handleSignDocument = (id: number) => {
        setSelectedDocId(id);
        setIsGovModalOpen(true);
    };

    const confirmSignature = () => {
        setIsSigning(true);
        setTimeout(() => {
            setDocs(docs.map(d => d.id === selectedDocId ? { ...d, signed: true, file: d.file ? d.file.replace('.pdf', '_signed.pdf') : 'document_signed.pdf' } : d));
            setIsSigning(false);
            setIsGovModalOpen(false);
            alert("Documento assinado digitalmente com sucesso via Gov.br!");
        }, 2000);
    };

    const handleDownload = (filename: string | null) => {
        if (!filename) return alert("Este documento ainda não possui arquivo anexado.");
        alert(`Iniciando download de: ${filename}`);
    };

    // Helper to calc days remaining
    const getDaysRemaining = (deadline: string) => {
        const today = new Date('2026-03-16').getTime(); // Simulated 'today'
        const due = new Date(deadline).getTime();
        const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
        return diff;
    };

    const getStatusColor = (doc: any) => {
        const days = getDaysRemaining(doc.deadline);
        if (doc.status === 'completed') return '#38a169'; // Green
        if (days < 0) return '#e53e3e'; // Red (Expired)
        if (days <= 3) return '#ed8936'; // Orange (Urgent)
        return '#3182ce'; // Blue (Normal)
    };

    const handleReminderToggle = (id: number) => {
        setDocs(docs.map(d => d.id === id ? { ...d, alertSet: !d.alertSet } : d));
        alert(docs.find(d => d.id === id)?.alertSet ? "Notificação desativada." : "Lembrete configurado para 3 dias antes do vencimento.");
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
            <header className="responsive-header">
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <div style={{ padding: '0.5rem', background: 'var(--primary)', borderRadius: '0.5rem', color: 'var(--secondary)' }}>
                            <FileText size={32} />
                        </div>
                        <h1>Tramitação de Documentos</h1>
                    </div>
                    <p style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>Controle de prazos, ofícios e protocolos.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }} className="flex-col-mobile">
                    <button className="btn-gold outline" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <Filter size={18} /> Filtrar
                    </button>
                    <button
                        className="btn-gold"
                        onClick={() => setIsModalOpen(true)}
                        style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                    >
                        <Plus size={18} /> Novo Documento
                    </button>
                </div>
            </header>

            {/* Notifications Alert Banner (Simulated) */}
            <div className="glass-card" style={{ marginBottom: '2rem', border: '1px solid #ed8936', background: 'rgba(237, 137, 54, 0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <AlertTriangle size={24} color="#ed8936" />
                <div>
                    <h3 style={{ margin: 0, fontSize: '1rem', color: '#ed8936' }}>Atenção aos Prazos</h3>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text)' }}>
                        Existem <b>{docs.filter(d => getDaysRemaining(d.deadline) < 0 && d.status !== 'completed').length}</b> documentos vencidos e <b>{docs.filter(d => getDaysRemaining(d.deadline) <= 3 && getDaysRemaining(d.deadline) >= 0 && d.status !== 'completed').length}</b> vencendo em breve.
                    </p>
                </div>
            </div>

            <div className="glass-card">
                <div style={{ overflowX: 'auto' }}>
                    <table className="responsive-table" style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text)' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '1rem', textAlign: 'left', opacity: 0.8, fontSize: '0.8rem' }}>Código / Tipo</th>
                                <th style={{ padding: '1rem', textAlign: 'left', opacity: 0.8, fontSize: '0.8rem' }}>Assunto / Destino</th>
                                <th style={{ padding: '1rem', textAlign: 'left', opacity: 0.8, fontSize: '0.8rem' }}>Prazo Limite</th>
                                <th style={{ padding: '1rem', textAlign: 'center', opacity: 0.8, fontSize: '0.8rem' }}>Status</th>
                                <th style={{ padding: '1rem', textAlign: 'right', opacity: 0.8, fontSize: '0.8rem' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {docs.map((doc) => {
                                const days = getDaysRemaining(doc.deadline);
                                const isLate = days < 0 && doc.status !== 'completed';

                                return (
                                    <tr key={doc.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1rem' }} data-label="Documento">
                                            <div style={{ fontWeight: 700 }}>{doc.code}</div>
                                            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{doc.type}</div>
                                            {doc.signed && (
                                                <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#38a169', fontWeight: 600 }}>
                                                    <PenTool size={10} /> Assinado Gov.br
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem' }} data-label="Assunto">
                                            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{doc.subject}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', opacity: 0.8, marginTop: '4px' }}>
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-light)' }}></div>
                                                {doc.department}
                                            </div>
                                            {doc.file && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--primary)', marginTop: '4px', cursor: 'pointer' }} onClick={() => handleDownload(doc.file)}>
                                                    <FileText size={10} /> {doc.file}
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem' }} data-label="Vencimento">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isLate ? '#e53e3e' : 'inherit' }}>
                                                <Calendar size={14} />
                                                <span>{new Date(doc.deadline).toLocaleDateString('pt-BR')}</span>
                                            </div>
                                            {doc.status !== 'completed' && (
                                                <div style={{ fontSize: '0.75rem', color: isLate ? '#e53e3e' : days <= 3 ? '#ed8936' : 'var(--text-light)', marginTop: '4px', fontWeight: 600 }}>
                                                    {isLate ? `Vencido há ${Math.abs(days)} dias` : `${days} dias restantes`}
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }} data-label="Status">
                                            <span style={{
                                                padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700,
                                                background: `${getStatusColor(doc)}20`,
                                                color: getStatusColor(doc),
                                                border: `1px solid ${getStatusColor(doc)}`
                                            }}>
                                                {doc.status === 'completed' ? 'Concluído' : isLate ? 'Atrasado' : 'Em Andamento'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }} data-label="Ações">
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                {!doc.signed && (
                                                    <button
                                                        onClick={() => handleSignDocument(doc.id)}
                                                        className="icon-btn"
                                                        title="Assinar com Gov.br"
                                                        style={{ color: 'var(--primary)' }}
                                                    >
                                                        <PenTool size={18} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDownload(doc.file)}
                                                    className="icon-btn"
                                                    title="Baixar Arquivo"
                                                    style={{ opacity: doc.file ? 1 : 0.3, cursor: doc.file ? 'pointer' : 'not-allowed' }}
                                                >
                                                    <Download size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleReminderToggle(doc.id)}
                                                    className="icon-btn"
                                                    title={doc.alertSet ? "Lembrete Ativo" : "Ativar Lembrete"}
                                                    style={{ color: doc.alertSet ? 'var(--secondary)' : 'var(--text-light)' }}
                                                >
                                                    <Bell size={18} fill={doc.alertSet ? "currentColor" : "none"} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Documento / Ofício">
                <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>Tipo</label>
                            <select>
                                <option>Ofício</option>
                                <option>Requerimento</option>
                                <option>Protocolo</option>
                                <option>Memorando</option>
                            </select>
                        </div>
                        <div>
                            <label>Código/Número</label>
                            <input type="text" placeholder="Ex: OF-123/2026" />
                        </div>
                    </div>
                    <div>
                        <label>Assunto</label>
                        <input type="text" placeholder="Resumo do documento" />
                    </div>
                    <div>
                        <label>Departamento de Destino</label>
                        <input type="text" placeholder="Ex: Secretaria de Saúde" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label>Data Vencimento</label>
                            <input type="date" />
                        </div>
                        <div>
                            <label>Lembrete Automático</label>
                            <select>
                                <option>1 semana antes</option>
                                <option>3 dias antes</option>
                                <option>1 dia antes</option>
                                <option>No dia</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label>Anexar Arquivo (PDF, DOCX)</label>
                        <div style={{ border: '2px dashed var(--border)', borderRadius: '0.5rem', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)', cursor: 'pointer', background: 'var(--bg-color)' }}>
                            <Upload size={24} style={{ marginBottom: '0.5rem' }} />
                            <span style={{ fontSize: '0.8rem' }}>Clique ou arraste para enviar</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button className="btn-gold" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)}>Registrar Documento</button>
                        <button className="btn-primary" style={{ flex: 1, background: '#edf2f7', color: 'black' }} onClick={() => setIsModalOpen(false)}>Cancelar</button>
                    </div>
                </form>
            </Modal>

            {/* Gov.br Signature Simulation Modal */}
            {isGovModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={{ background: 'white', padding: '0', borderRadius: '8px', maxWidth: '400px', width: '90%', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                    >
                        <div style={{ background: '#071D41', padding: '1.5rem', textAlign: 'center' }}>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Logotipo_do_Governo_Federal_do_Brasil_%282003%E2%80%932010%29.svg" alt="Gov.br" style={{ height: '30px', filter: 'brightness(0) invert(1)' }} />
                            <h3 style={{ color: 'white', margin: '1rem 0 0 0', fontSize: '1.1rem' }}>Assinatura Eletrônica</h3>
                        </div>
                        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem' }}>
                            {isSigning ? (
                                <>
                                    <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #1351B4', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                    <p style={{ color: '#1351B4', fontWeight: 600 }}>Processando assinatura...</p>
                                </>
                            ) : (
                                <>
                                    <p style={{ color: '#555', lineHeight: '1.5' }}>
                                        Você está prestes a assinar o documento <b>REQ-102/2026</b> utilizando sua identidade digital <b>GOV.BR</b>.
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                                        <button
                                            onClick={confirmSignature}
                                            style={{ background: '#1351B4', color: 'white', border: 'none', padding: '0.8rem', borderRadius: '25px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                                        >
                                            <Check size={18} /> Assinar Digitalmente
                                        </button>
                                        <button
                                            onClick={() => setIsGovModalOpen(false)}
                                            style={{ background: 'transparent', color: '#666', border: 'none', padding: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </motion.div>
    );
};

export default DocumentTracking;
