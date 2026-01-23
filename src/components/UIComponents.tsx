import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="modal-overlay" onClick={onClose}>
                    <motion.div
                        className="modal-content"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h3 style={{ margin: 0 }}>{title}</h3>
                            <button className="close-btn" onClick={onClose}>
                                <X size={18} />
                            </button>
                        </div>
                        {children}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export const Drawer: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="drawer-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="drawer-content"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    >
                        <div className="drawer-header">
                            <h3 style={{ margin: 0 }}>{title}</h3>
                            <button className="close-btn" onClick={onClose}>
                                <X size={18} />
                            </button>
                        </div>
                        {children}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
