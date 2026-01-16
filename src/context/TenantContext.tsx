import React, { createContext, useContext, useState, useEffect } from 'react';

export interface TenantSettings {
    primaryColor: string;
    secondaryColor: string;
    name: string;
    candidateNumber: string;
    cnpj: string;
    email: string;
    theme: 'light' | 'dark';
    role: 'SUPER_ADMIN' | 'VEREADOR' | 'ASSESSOR';
    isLoggedIn: boolean;
    photoUrl?: string;
}

interface TenantContextType {
    tenant: TenantSettings;
    updateTenant: (updates: Partial<TenantSettings>) => void;
    toggleTheme: () => void;
    switchRole: (role: 'SUPER_ADMIN' | 'VEREADOR' | 'ASSESSOR') => void;
    login: (email: string, pass: string) => boolean;
    logout: () => void;
}

const defaultSettings: TenantSettings = {
    primaryColor: '#1a365d',
    secondaryColor: '#d4af37',
    name: 'GABINETE DIGITAL',
    candidateNumber: '11.222',
    cnpj: '00.000.000/0001-00',
    email: 'vereador@exemplo.com.br',
    theme: 'dark',
    role: 'VEREADOR',
    isLoggedIn: false,
    photoUrl: undefined
};

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tenant, setTenant] = useState<TenantSettings>(() => {
        const saved = localStorage.getItem('tenant_settings');
        return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    });

    useEffect(() => {
        localStorage.setItem('tenant_settings', JSON.stringify(tenant));
        document.documentElement.style.setProperty('--primary', tenant.primaryColor);
        document.documentElement.style.setProperty('--secondary', tenant.secondaryColor);
        document.documentElement.setAttribute('data-theme', tenant.theme);
    }, [tenant]);

    const updateTenant = (updates: Partial<TenantSettings>) => {
        setTenant(prev => ({ ...prev, ...updates }));
    };

    const toggleTheme = () => {
        setTenant(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }));
    };

    const switchRole = (role: 'SUPER_ADMIN' | 'VEREADOR' | 'ASSESSOR') => {
        setTenant(prev => ({ ...prev, role }));
    };

    const login = (email: string, pass: string): boolean => {
        const users = [
            { email: 'superadmin@sistema.com', pass: 'admin123', role: 'SUPER_ADMIN' as const, name: 'Admin Global' },
            { email: 'vereador@exemplo.com', pass: 'vereador123', role: 'VEREADOR' as const, name: 'Vereador João Silva' },
            { email: 'assessor@equipe.com', pass: 'assessor123', role: 'ASSESSOR' as const, name: 'Assessor Marcos' },
        ];

        const user = users.find(u => u.email === email && u.pass === pass);
        if (user) {
            setTenant(prev => ({
                ...prev,
                email: user.email,
                role: user.role,
                name: user.name,
                isLoggedIn: true
            }));
            return true;
        }
        return false;
    };

    const logout = () => {
        setTenant(prev => ({ ...prev, isLoggedIn: false }));
    };

    return (
        <TenantContext.Provider value={{ tenant, updateTenant, toggleTheme, switchRole, login, logout }}>
            {children}
        </TenantContext.Provider>
    );
};

export const useTenant = () => {
    const context = useContext(TenantContext);
    if (!context) throw new Error('useTenant must be used within a TenantProvider');
    return context;
};
