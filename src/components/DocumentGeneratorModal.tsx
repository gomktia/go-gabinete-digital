
import React, { useState, useEffect, useRef } from 'react';
import { Modal } from './UIComponents';
import { jsPDF } from 'jspdf';
import { Download } from 'lucide-react';
import { useTenant } from '../context/TenantContext';

interface DocumentGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    demand: any; // Using any for simplicity as per existing code, ideally Demand interface
}

type TemplateType = 'oficio' | 'requerimento' | 'mocao' | 'memorando';

export const DocumentGeneratorModal: React.FC<DocumentGeneratorModalProps> = ({ isOpen, onClose, demand }) => {
    const { tenant } = useTenant();
    const docRef = useRef<HTMLDivElement>(null);
    const [template, setTemplate] = useState<TemplateType>('oficio');

    // Editable Content State
    const [docData, setDocData] = useState({
        number: '',
        year: new Date().getFullYear().toString(),
        addressee: 'Excelentíssimo Senhor Prefeito',
        subject: '',
        body: '',
        conclusion: 'Sendo o que tínhamos para o momento, renovamos protestos de elevada estima e consideração.'
    });

    // Reset/Init when demand changes or modal opens
    useEffect(() => {
        if (isOpen && demand) {
            const today = new Date();
            // Default content based on demand
            setDocData({
                number: '___',
                year: today.getFullYear().toString(),
                addressee: template === 'mocao' ? 'A quem interessar possa' : 'Excelentíssimo Senhor Prefeito',
                subject: demand ? `Solicitação de ${demand.category} - ${demand.title}` : '',
                body: generateBodyPreview(template, demand),
                conclusion: template === 'mocao' ?
                    'Dê-se ciência aos homenageados.' :
                    'Certos do atendimento do pleito, antecipamos agradecimentos.'
            });
        }
    }, [isOpen, demand, template]);

    const generateBodyPreview = (type: TemplateType, d: any) => {
        if (!d) return '';

        switch (type) {
            case 'oficio':
                return `Venho, por meio deste, solicitar a Vossa Excelência que determine ao setor competente a realização de vistoria e execução de serviços de melhoria em: ${d.local}.\n\nA referida demanda trata-se de ${d.title}, sendo uma reivindicação urgente dos moradores locais que sofrem com a situação atual.`;
            case 'requerimento':
                return `REQUER à Mesa Diretora, ouvido o Soberano Plenário, que seja oficiado ao Poder Executivo Municipal, solicitando INFORMAÇÕES sobre a previsão de atendimento da demanda de ${d.category} localizada em ${d.local}.`;
            case 'mocao':
                return `A CÂMARA MUNICIPAL, por iniciativa do Vereador ${tenant.name}, manifesta MOÇÃO DE APLAUSO aos envolvidos na resolução da demanda ${d.title}, demonstrando compromisso com a comunidade de ${d.local}.`;
            case 'memorando':
                return `Comunico a necessidade de priorização da demanda #${d.id} referente a ${d.title}, localizada em ${d.local}. Solicito providências imediatas.`;
            default:
                return '';
        }
    };

    const handlePrint = () => {
        const doc = new jsPDF();

        // Configuration
        const margin = 20;
        const pageWidth = 210;
        const contentWidth = pageWidth - (margin * 2);

        doc.setFont("times", "roman");

        // Header (Brasão simplificado ou texto)
        doc.setFontSize(14);
        doc.setFont("times", "bold");
        doc.text("CÂMARA MUNICIPAL", pageWidth / 2, 20, { align: "center" });
        doc.setFontSize(12);
        doc.text(`Gabinete do Vereador ${tenant.name}`, pageWidth / 2, 26, { align: "center" });

        doc.setFont("times", "normal");
        doc.setFontSize(10);
        doc.text("Rua Legislativa, 123 - Centro - Cidade/UF", pageWidth / 2, 32, { align: "center" });

        doc.line(margin, 35, pageWidth - margin, 35);

        // Date
        const dateStr = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
        doc.setFontSize(11);
        doc.text(`Cidade, ${dateStr}`, pageWidth - margin, 50, { align: "right" });

        // Title/Number
        doc.setFont("times", "bold");
        doc.setFontSize(12);

        let titleText = '';
        if (template === 'oficio') titleText = `OFÍCIO Nº ${docData.number}/${docData.year}`;
        if (template === 'requerimento') titleText = `REQUERIMENTO Nº ${docData.number}/${docData.year}`;
        if (template === 'mocao') titleText = `MOÇÃO DE APLAUSO`;
        if (template === 'memorando') titleText = `MEMORANDO Nº ${docData.number}/${docData.year}`;

        doc.text(titleText, margin, 70);

        // Subject aligned
        if (docData.subject) {
            doc.text(`Assunto: ${docData.subject}`, margin, 76);
        }

        // Addressee
        doc.setFont("times", "normal");
        doc.text(docData.addressee + ",", margin, 90);

        // Body with text wrapping
        const splitBody = doc.splitTextToSize(docData.body, contentWidth);
        doc.text(splitBody, margin, 100);

        // Calculate Y position after body
        let currentY = 100 + (splitBody.length * 5) + 10;

        // Evidence/Visits if checked (Optional feature for future: checkbox)

        // Conclusion
        const splitConclusion = doc.splitTextToSize(docData.conclusion, contentWidth);
        doc.text(splitConclusion, margin, currentY);
        currentY += (splitConclusion.length * 5) + 30;

        // Signature
        doc.text("Atenciosamente,", pageWidth / 2, currentY, { align: "center" });
        currentY += 25;
        doc.line(pageWidth / 2 - 40, currentY, pageWidth / 2 + 40, currentY);
        currentY += 5;
        doc.setFont("times", "bold");
        doc.text(`VEREADOR ${tenant.name?.toUpperCase()}`, pageWidth / 2, currentY, { align: "center" });
        currentY += 5;
        doc.setFont("times", "normal");
        doc.text("Legislatura 2025-2028", pageWidth / 2, currentY, { align: "center" });

        doc.save(`${template}_${demand?.id || 'doc'}.pdf`);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Gerador de Documentos Legislativos">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', minHeight: '500px' }}>

                {/* Left Panel: Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Tipo de Documento</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                            {(['oficio', 'requerimento', 'mocao', 'memorando'] as TemplateType[]).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTemplate(t)}
                                    style={{
                                        padding: '0.5rem',
                                        borderRadius: '8px',
                                        border: template === t ? '2px solid var(--primary)' : '1px solid #cbd5e1',
                                        background: template === t ? 'var(--bg-color)' : 'white',
                                        color: template === t ? 'var(--primary)' : '#64748b',
                                        fontWeight: 600,
                                        textTransform: 'capitalize',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="form-label">Destinatário</label>
                        <input
                            type="text"
                            className="form-input"
                            value={docData.addressee}
                            onChange={(e) => setDocData({ ...docData, addressee: e.target.value })}
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div>
                        <label className="form-label">Assunto</label>
                        <input
                            type="text"
                            className="form-input"
                            value={docData.subject}
                            onChange={(e) => setDocData({ ...docData, subject: e.target.value })}
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div style={{ flex: 1 }}>
                        <label className="form-label">Corpo do Texto</label>
                        <textarea
                            className="form-input"
                            value={docData.body}
                            onChange={(e) => setDocData({ ...docData, body: e.target.value })}
                            style={{ width: '100%', height: '200px', resize: 'vertical' }}
                        />
                    </div>
                </div>

                {/* Right Panel: Live Preview */}
                <div style={{ background: '#525659', padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'center', overflow: 'auto' }}>
                    <div
                        ref={docRef}
                        style={{
                            width: '210mm',
                            minHeight: '297mm',
                            background: 'white',
                            padding: '20mm',
                            boxShadow: '0 0 20px rgba(0,0,0,0.5)',
                            fontSize: '11pt',
                            fontFamily: '"Times New Roman", Times, serif',
                            color: 'black',
                            transform: 'scale(0.65)',
                            transformOrigin: 'top center'
                        }}
                    >
                        {/* A4 Paper Simulation */}
                        <div style={{ textAlign: 'center', marginBottom: '10mm' }}>
                            <h3 style={{ margin: 0, textTransform: 'uppercase', fontSize: '14pt' }}>Câmara Municipal</h3>
                            <p style={{ margin: '5px 0', fontWeight: 'bold' }}>Gabinete do Vereador {tenant.name}</p>
                            <p style={{ margin: 0, fontSize: '9pt' }}>Rua Legislativa, 123 - Centro</p>
                            <div style={{ width: '100%', height: '1px', background: 'black', margin: '15px 0' }}></div>
                        </div>

                        <div style={{ textAlign: 'right', marginBottom: '15mm' }}>
                            Cidade/UF, {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>

                        <div style={{ marginBottom: '10mm' }}>
                            <strong>{template === 'oficio' ? 'OFÍCIO' : template === 'requerimento' ? 'REQUERIMENTO' : template === 'memorando' ? 'MEMORANDO' : 'MOÇÃO'} Nº {docData.number}/{docData.year}</strong><br />
                            <strong>Assunto:</strong> {docData.subject}
                        </div>

                        <div style={{ marginBottom: '10mm' }}>
                            {docData.addressee},
                        </div>

                        <div style={{ textAlign: 'justify', lineHeight: '1.5', whiteSpace: 'pre-wrap', marginBottom: '10mm' }}>
                            {docData.body}
                        </div>

                        <div style={{ textAlign: 'justify', lineHeight: '1.5', marginBottom: '30mm' }}>
                            {docData.conclusion}
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <p>Atenciosamente,</p>
                            <div style={{ marginTop: '20mm', borderTop: '1px solid black', display: 'inline-block', width: '60%', paddingTop: '5px' }}>
                                <strong>VEREADOR {tenant.name?.toUpperCase()}</strong><br />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                <button onClick={onClose} style={{ padding: '0.75rem 1.5rem', borderRadius: '10px', border: 'none', background: '#f1f5f9', color: '#64748b', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' }}>
                    Cancelar
                </button>
                <button onClick={handlePrint} className="btn-gold" style={{ padding: '0.75rem 1.5rem', borderRadius: '10px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Download size={18} /> Baixar PDF Oficial
                </button>
            </div>
        </Modal>
    );
};
