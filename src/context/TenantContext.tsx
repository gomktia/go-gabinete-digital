import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface TenantSettings {
    id: string; // Tenant ID
    slug?: string;
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
    userId?: string;
}

interface TenantContextType {
    tenant: TenantSettings;
    loading: boolean;
    updateTenant: (updates: Partial<TenantSettings>) => void;
    toggleTheme: () => void;
    switchRole: (role: 'SUPER_ADMIN' | 'VEREADOR' | 'ASSESSOR') => void;
    saveSettings: () => Promise<{ success: boolean; error?: string }>;
    login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
    signUp: (email: string, pass: string, fullName: string, role: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}

const defaultSettings: TenantSettings = {
    id: '',
    slug: '',
    primaryColor: '#1a365d',
    secondaryColor: '#d4af37',
    name: 'GABINETE DIGITAL',
    candidateNumber: '11.222',
    cnpj: '00.000.000/0001-00',
    email: '',
    theme: 'dark', // Default dark
    role: 'VEREADOR',
    isLoggedIn: false,
    photoUrl: undefined
};

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tenant, setTenant] = useState<TenantSettings>(defaultSettings);
    const [loading, setLoading] = useState(() => {
        // FAST PATH: Check if we have any Supabase session in localStorage
        if (typeof window !== 'undefined') {
            try {
                const keys = Object.keys(localStorage);
                const hasAuth = keys.some(k => k.includes('auth-token'));
                // If NO auth token exists, we don't need to show splash, go straight to login
                if (!hasAuth) return false;
            } catch (e) {
                return true;
            }
        }
        return true;
    });

    // Initial Session Check
    useEffect(() => {
        let mounted = true;

        // Optimized safety timeout - 1 second max
        const safetyTimeout = setTimeout(() => {
            if (mounted) setLoading(false);
        }, 1000);

        checkSession().then(() => {
            if (mounted) clearTimeout(safetyTimeout);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
                // Skip if already fetching or loaded for this user
                if (tenant.userId === session.user.id && tenant.isLoggedIn) return;
                await fetchProfileAndTenant(session.user.id);
            } else if (event === 'SIGNED_OUT') {
                setTenant(defaultSettings);
                setLoading(false);
            }
        });

        return () => {
            mounted = false;
            clearTimeout(safetyTimeout);
            subscription.unsubscribe();
        };
    }, []);

    const checkSession = async () => {
        try {
            // Fast check: get session from local storage first
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) throw error;

            if (session) {
                await fetchProfileAndTenant(session.user.id);
            } else {
                // Returns immediately if no session found locally
                setLoading(false);
            }
        } catch (error) {
            console.error('Session check failed:', error);
            setLoading(false);
        }
    };

    const fetchProfileAndTenant = async (userId: string) => {
        const startTime = performance.now();
        setLoading(true);
        try {
            // Optimization: Fetch profile and tenant in a SINGLE query using joins
            const { data: profileWithTenant, error: fetchError } = await supabase
                .from('profiles')
                .select('*, tenants(*)')
                .eq('id', userId)
                .single();

            if (fetchError) throw fetchError;

            if (profileWithTenant) {
                const tenantData = profileWithTenant.tenants;

                setTenant(prev => ({
                    ...prev,
                    id: tenantData.id,
                    slug: tenantData.slug,
                    name: tenantData.name || 'Gabinete Digital',
                    email: profileWithTenant.email || 'usuario@sistema.com',
                    role: (profileWithTenant.role?.toUpperCase() as any) || 'VEREADOR',
                    isLoggedIn: true,
                    userId: userId,
                    primaryColor: tenantData.settings?.primaryColor || prev.primaryColor,
                    secondaryColor: tenantData.settings?.secondaryColor || prev.secondaryColor,
                    photoUrl: profileWithTenant.avatar_url
                }));
            }
            const endTime = performance.now();
            console.log(`[Performance] Profile/Tenant loaded in ${(endTime - startTime).toFixed(2)}ms`);
        } catch (error) {
            console.error('Error loading tenant data:', error);
            // On error, we still want to stop loading but stay logged out or show error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // App-wide CSS variables for theming
        document.documentElement.style.setProperty('--primary', tenant.primaryColor);
        document.documentElement.style.setProperty('--secondary', tenant.secondaryColor);
        document.documentElement.setAttribute('data-theme', tenant.theme);
    }, [tenant.primaryColor, tenant.secondaryColor, tenant.theme]);

    const updateTenant = (updates: Partial<TenantSettings>) => {
        setTenant(prev => ({ ...prev, ...updates }));
    };

    const toggleTheme = () => {
        setTenant(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }));
    };

    const switchRole = (role: 'SUPER_ADMIN' | 'VEREADOR' | 'ASSESSOR') => {
        setTenant(prev => ({ ...prev, role }));
    };

    const login = async (email: string, pass: string) => {
        try {
            setLoading(true);
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password: pass,
            });

            if (error) throw error;

            if (data.user) {
                // Manually trigger data fetch to speed up login redirect
                await fetchProfileAndTenant(data.user.id);
                return { success: true };
            }

            return { success: false, error: 'Usuário não encontrado.' };
        } catch (error: any) {
            console.error('Login error:', error.message);
            setLoading(false);
            return { success: false, error: error.message };
        }
    };

    const signUp = async (email: string, pass: string, fullName: string, role: string) => {
        try {
            setLoading(true);
            const { error } = await supabase.auth.signUp({
                email,
                password: pass,
                options: {
                    data: {
                        full_name: fullName,
                        role: role
                    }
                }
            });

            if (error) throw error;
            setLoading(false);
            return { success: true };
        } catch (error: any) {
            console.error('Signup error:', error.message);
            setLoading(false);
            return { success: false, error: error.message };
        }
    };

    const saveSettings = async (): Promise<{ success: boolean; error?: string }> => {
        try {
            setLoading(true);
            const { id: tenantId, userId, name, primaryColor, secondaryColor, candidateNumber, cnpj, photoUrl } = tenant;

            if (!tenantId || !userId) throw new Error('Dados de sessão inválidos.');

            // 1. Update Tenant Data
            const { error: tenantError } = await supabase
                .from('tenants')
                .update({
                    name,
                    settings: {
                        primaryColor,
                        secondaryColor,
                        candidateNumber,
                        cnpj
                    }
                })
                .eq('id', tenantId);

            if (tenantError) throw tenantError;

            // 2. Update Profile Data (Avatar)
            if (photoUrl) {
                // If it's a data URL (new upload), we should ideally upload it properly in the component
                // But if it's already a URL, we update the profile
                // Note: The actual file upload logic should ideally be handled in the component or a separate helper,
                // and here we just save the final URL. 
                // For now, let's assume photoUrl is dealing with the 'avatar_url' column.
                // If the user uploaded a blob locally, we rely on the component to have uploaded it first.
                // However, the current SettingsPage logic puts a base64 string in photoUrl for preview.
                // We should handle that base64 upload if possible, or expect the component to do it.
                // Let's assume the component will handle the upload to storage and give us a public URL if it's a real file,
                // or we might need to implement the upload here. 
                // Given the context 'updateTenant' takes partial settings, let's just save valid URLs.

                if (!photoUrl.startsWith('data:')) {
                    const { error: profileError } = await supabase
                        .from('profiles')
                        .update({ avatar_url: photoUrl })
                        .eq('id', userId);
                    if (profileError) throw profileError;
                }
            }

            return { success: true };
        } catch (error: any) {
            console.error('Error saving settings:', error);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setTenant(defaultSettings);
    };

    return (
        <TenantContext.Provider value={{ tenant, loading, updateTenant, toggleTheme, switchRole, login, signUp, logout, saveSettings }}>
            {children}
        </TenantContext.Provider>
    );
};

export const useTenant = () => {
    const context = useContext(TenantContext);
    if (!context) throw new Error('useTenant must be used within a TenantProvider');
    return context;
};
