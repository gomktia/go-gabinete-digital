import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FileText, Calendar, AlertTriangle, Filter, Plus,
    Download, Bell, Upload, PenTool, Check, RefreshCw
} from 'lucide-react';
import { Modal } from '../components/UIComponents';
import { supabase } from '../lib/supabase';
import { useTenant } from '../context/TenantContext';

interface Document {
    id: string;
    type: string;
    code: string;
    subject: string;
    status: string;
    deadline: string;
    department: string;
    signed: boolean;
    file_url: string | null;
}

const DocumentTracking = () => {
    const { tenant } = useTenant();
    const [docs, setDocs] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGovModalOpen, setIsGovModalOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
    const [isSigning, setIsSigning] = useState(false);

    // Form states
    const [type, setType] = useState('Ofício');
    const [code, setCode] = useState('');
    const [subject, setSubject] = useState('');
    const [department, setDepartment] = useState('');
    const [deadline, setDeadline] = useState('');

    useEffect(() => {
        if (tenant.id) {
            fetchDocs();
        }
    }, [tenant.id]);

    const fetchDocs = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('documents')
            .select('*')
            .eq('tenant_id', tenant.id)
            .order('deadline', { ascending: true });

        if (error) {
            console.error('Error fetching docs:', error);
        } else {
            setDocs(data || []);
        }
        setIsLoading(false);
    };

    const handleAddDoc = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tenant.id) return;

        const newDoc = {
            tenant_id: tenant.id,
            type,
            code,
            subject,
            department,
            deadline,
            status: 'pending'
        };

        const { data, error } = await supabase
            .from('documents')
            .insert([newDoc])
            .select();

        if (error) {
            console.error('Error adding doc:', error);
            alert('Erro ao salvar documento');
        } else if (data) {
            setDocs([...docs, data[0]]);
            setIsModalOpen(false);
            // Clear form
            setCode('');
            setSubject('');
            setDepartment('');
            setDeadline('');
        }
    };

    const confirmSignature = async () => {
        if (!selectedDoc) return;
        setIsSigning(true);

        // Simulate Gov.br backend delay
        await new Promise(r => setTimeout(r, 2000));

        const { error } = await supabase
            .from('documents')
            .update({ signed: true })
            .eq('id', selectedDoc.id);

        if (error) {
            console.error('Error signing doc:', error);
            alert('Erro na assinatura');
        } else {
            setDocs(docs.map(d => d.id === selectedDoc.id ? { ...d, signed: true } : d));
            setIsSigning(false);
            setIsGovModalOpen(false);
            alert("Documento assinado digitalmente com sucesso via Gov.br!");
        }
    };

    const getDaysRemaining = (deadlineDate: string) => {
        const today = new Date().setHours(0, 0, 0, 0);
        const due = new Date(deadlineDate).getTime();
        return Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    };

    const getStatusColor = (doc: Document) => {
        if (doc.status === 'completed') return '#38a169';
        const days = getDaysRemaining(doc.deadline);
        if (days < 0) return '#e53e3e';
        if (days <= 3) return '#ed8936';
        return '#3182ce';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <header className="responsive-header">
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <div style={{
                            padding: '12px',
                            background: 'var(--primary)',
                            borderRadius: '16px',
                            color: 'var(--secondary)',
                            boxShadow: '0 8px 16px rgba(15,23,42,0.1)'
                        }}>
                            <FileText size={32} />
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Gestão de Documentos</h1>
                    </div>
                    <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', fontWeight: 500 }}>
                        Acompanhamento de ofícios, requerimentos e protocolos.
                    </p>
                </div>
                <button
                    className="btn-gold"
                    onClick={() => setIsModalOpen(true)}
                    style={{ borderRadius: '14px' }}
                >
                    <Plus size={18} /> Novo Documento
                </button>
            </header>

            {/* Stats Summary */}
            <div className="responsive-grid" style={{ marginBottom: '2.5rem' }}>
                <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid #ed8936' }}>
                    <div style={{ padding: '15px', background: 'rgba(237, 137, 54, 0.1)', borderRadius: '12px', color: '#ed8936' }}>
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-light)', fontWeight: 600 }}>Urgentes</p>
                        <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{docs.filter(d => getDaysRemaining(d.deadline) <= 3 && getDaysRemaining(d.deadline) >= 0).length}</h3>
                    </div>
                </div>
                <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid #e53e3e' }}>
                    <div style={{ padding: '15px', background: 'rgba(229, 62, 62, 0.1)', borderRadius: '12px', color: '#e53e3e' }}>
                        <Clock size={24} />
                    </div>
                    <div>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-light)', fontWeight: 600 }}>Vencidos</p>
                        <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{docs.filter(d => getDaysRemaining(d.deadline) < 0).length}</h3>
                    </div>
                </div>
                <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid #38a169' }}>
                    <div style={{ padding: '15px', background: 'rgba(56, 161, 105, 0.1)', borderRadius: '12px', color: '#38a169' }}>
                        <PenTool size={24} />
                    </div>
                    <div>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-light)', fontWeight: 600 }}>Aguardando Assinatura</p>
                        <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{docs.filter(d => !d.signed).length}</h3>
                    </div>
                </div>
            </div>

            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cronograma de Tramitação</h3>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="close-btn" style={{ transform: 'none', width: 'auto', padding: '0 15px', fontSize: '0.8rem', fontWeight: 700 }}><Filter size={14} /> Filtros</button>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className="responsive-table">
                        <thead>
                            <tr>
                                <th>CÓDIGO / TIPO</th>
                                <th>ASSUNTO / DESTINATÁRIO</th>
                                <th>PRAZO / STATUS</th>
                                <th style={{ textAlign: 'right' }}>AÇÕES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '3rem' }}><RefreshCw className="spin" /></td></tr>
                            ) : docs.length === 0 ? (
                                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>Sem documentos registrados.</td></tr>
                            ) : (
                                docs.map((doc) => {
                                    const days = getDaysRemaining(doc.deadline);
                                    const isLate = days < 0;
                                    const color = getStatusColor(doc);

                                    return (
                                        <tr key={doc.id} className="hover-bg">
                                            <td style={{ verticalAlign: 'top' }}>
                                                <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{doc.code}</div>
                                                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-light)', textTransform: 'uppercase', marginTop: '4px' }}>{doc.type}</div>
                                                {doc.signed && (
                                                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: '#38a169', fontWeight: 800 }}>
                                                        <Check size={12} /> ASSINADO GOV.BR
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                <div style={{ fontWeight: 700, marginBottom: '4px' }}>{doc.subject}</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600 }}>
                                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--secondary)' }}></div>
                                                    {doc.department}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: isLate ? '#e53e3e' : 'inherit' }}>
                                                    <Calendar size={14} /> {new Date(doc.deadline).toLocaleDateString('pt-BR')}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', marginTop: '6px' }}>
                                                    <span style={{
                                                        padding: '2px 8px',
                                                        borderRadius: '6px',
                                                        background: `${color}15`,
                                                        color: color,
                                                        fontWeight: 800,
                                                        fontSize: '0.65rem',
                                                        textTransform: 'uppercase'
                                                    }}>
                                                        {isLate ? 'ATRASADO' : days <= 3 ? 'URGENTE' : 'EM DIA'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                                    {!doc.signed && (
                                                        <button
                                                            className="close-btn"
                                                            onClick={() => { setSelectedDoc(doc); setIsGovModalOpen(true); }}
                                                            title="Assinar Digitalmente"
                                                            style={{ transform: 'none', color: 'var(--secondary)', borderColor: 'var(--secondary)' }}
                                                        >
                                                            <PenTool size={16} />
                                                        </button>
                                                    )}
                                                    <button className="close-btn" style={{ transform: 'none' }} title="Baixar Arquivo">
                                                        <Download size={16} />
                                                    </button>
                                                    <button className="close-btn" style={{ transform: 'none' }} title="Configurar Alerta">
                                                        <Bell size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* New Doc Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Documento / Ofício">
                <form onSubmit={handleAddDoc} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem 0.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>Tipo</label>
                            <select
                                className="form-input"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                style={{ width: '100%' }}
                            >
                                <option>Ofício</option>
                                <option>Requerimento</option>
                                <option>Protocolo</option>
                                <option>Memorando</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>Código / Número</label>
                            <input
                                type="text"
                                required
                                placeholder="Ex: OF-123/2026"
                                className="form-input"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                style={{ width: '100%' }}
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>Assunto</label>
                        <input
                            type="text"
                            required
                            placeholder="Resumo da solicitação"
                            className="form-input"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>Destino / Depto</label>
                            <input
                                type="text"
                                required
                                placeholder="Ex: Secretaria de Obras"
                                className="form-input"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                style={{ width: '100%' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>Data Limite</label>
                            <input
                                type="date"
                                required
                                className="form-input"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                style={{ width: '100%' }}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn-gold" style={{ padding: '16px', borderRadius: '14px', fontSize: '1rem', fontWeight: 800 }}>
                        <Check size={20} /> Registrar no Gabinete
                    </button>
                </form>
            </Modal>

            {/* Gov.br Modal */}
            <Modal isOpen={isGovModalOpen} onClose={() => setIsGovModalOpen(false)} title="Assinatura Digital Gov.br">
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                    <div style={{ background: '#071D41', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem' }}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Logotipo_do_Governo_Federal_do_Brasil_%282003%E2%80%932010%29.svg" alt="Gov.br" style={{ height: '30px', filter: 'brightness(0) invert(1)' }} />
                    </div>

                    {isSigning ? (
                        <div style={{ padding: '2rem' }}>
                            <RefreshCw className="spin" size={40} style={{ color: '#1351B4', marginBottom: '1rem' }} />
                            <p style={{ fontWeight: 700, color: '#1351B4' }}>Validando certificado digital...</p>
                        </div>
                    ) : (
                        <>
                            <p style={{ color: 'var(--text-light)', fontWeight: 500, lineHeight: 1.6, marginBottom: '2rem' }}>
                                Você está assinando o documento <br /><strong style={{ color: 'var(--text)' }}>{selectedDoc?.code}</strong><br />
                                como autoridade legislativa via plataforma Gov.br.
                            </p>
                            <button
                                className="btn-primary"
                                onClick={confirmSignature}
                                style={{ background: '#1351B4', color: 'white', width: '100%', padding: '18px', borderRadius: '40px', fontWeight: 800 }}
                            >
                                <PenTool size={20} /> Assinar agora
                            </button>
                        </>
                    )}
                </div>
            </Modal>
        </motion.div>
    );
};

export default DocumentTracking;
