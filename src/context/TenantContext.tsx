
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
    plan: 'free' | 'starter' | 'pro' | 'enterprise';
    officeType: 'city_councilor' | 'mayor' | 'state_deputy' | 'governor' | 'federal_deputy' | 'senator';
    partyName?: string;
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
    checkAccess: (feature: 'docs' | 'ai' | 'radar' | 'genealogy' | 'map' | 'site_pro') => boolean;
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

    plan: 'free',
    officeType: 'city_councilor',
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

    // Helper to check Feature Flags based on Plan
    const checkAccess = (feature: 'docs' | 'ai' | 'radar' | 'genealogy' | 'map' | 'site_pro') => {
        const { plan } = tenant;

        // Super Admin has access to everything for debugging
        if (tenant.role === 'SUPER_ADMIN') return true;

        switch (feature) {
            case 'docs': // PDF Generation
                return plan === 'starter' || plan === 'pro' || plan === 'enterprise';
            case 'ai':   // Basic AI
                return plan === 'starter' || plan === 'pro' || plan === 'enterprise';
            case 'site_pro':
                return plan === 'starter' || plan === 'pro' || plan === 'enterprise';
            case 'genealogy':
                return plan === 'pro' || plan === 'enterprise';
            case 'radar': // Money features
                return plan === 'pro' || plan === 'enterprise'; // Actually sticking to Elite/Enterprise for Radar
            case 'map':
                return plan === 'enterprise';
            default:
                return false;
        }
    };

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
            console.log('[Auth] Checking existing session...');
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) throw error;

            if (session) {
                console.log('[Auth] Session found for user:', session.user.id);
                await fetchProfileAndTenant(session.user.id);
            } else {
                console.log('[Auth] No active session found.');
                setLoading(false);
            }
        } catch (error) {
            console.error('[Auth] Session check failed:', error);
            setLoading(false);
        }
    };

    const fetchProfileAndTenant = async (userId: string) => {
        const startTime = performance.now();
        setLoading(true);
        try {
            console.log('[Tenant] Fetching profile for:', userId);
            const { data: profileWithTenant, error: fetchError } = await supabase
                .from('profiles')
                .select('*, tenants(*)')
                .eq('id', userId)
                .single();

            if (fetchError) {
                if (fetchError.code === 'PGRST116') {
                    console.warn('[Tenant] Profile not found for this user. Clearing invalid session.');
                    await supabase.auth.signOut();
                    setTenant(defaultSettings);
                    return;
                }
                throw fetchError;
            }

            if (profileWithTenant && profileWithTenant.tenants) {
                const tenantData = profileWithTenant.tenants;
                console.log('[Tenant] Successfully loaded tenant:', tenantData.name);

                setTenant(prev => ({
                    ...prev,
                    id: tenantData.id,
                    slug: tenantData.slug,
                    name: tenantData.name || 'Gabinete Digital',
                    email: profileWithTenant.email || 'usuario@sistema.com',
                    role: (profileWithTenant.role?.toUpperCase() as any) || 'VEREADOR',
                    plan: tenantData.plan || 'free',
                    officeType: tenantData.office_type || 'city_councilor',
                    partyName: tenantData.party_name,
                    isLoggedIn: true,
                    userId: userId,
                    primaryColor: tenantData.settings?.primaryColor || prev.primaryColor,
                    secondaryColor: tenantData.settings?.secondaryColor || prev.secondaryColor,
                    photoUrl: profileWithTenant.avatar_url,
                    theme: tenantData.settings?.theme || prev.theme // Use saved theme if exists
                }));
            } else {
                console.warn('[Tenant] Incomplete profile data. Redirecting to setup...');
                // Fallback to minimal state so user isn't stuck
                setTenant(prev => ({ ...prev, userId, isLoggedIn: true }));
            }
            const endTime = performance.now();
            console.log(`[Performance] Profile/Tenant loaded in ${(endTime - startTime).toFixed(2)}ms`);
        } catch (error: any) {
            console.error('[Tenant] Error loading tenant data:', error.message);
            // If it's a critical error, we might want to logout
            if (error.status === 403 || error.status === 401) {
                await supabase.auth.signOut();
            }
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
            console.log('[Auth] Attempting login for:', email);
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password: pass,
            });

            if (error) throw error;

            if (data.user) {
                console.log('[Auth] Login successful, fetching data...');
                // We DON'T need to call fetchProfileAndTenant here if onAuthStateChange handles it,
                // but doing it explicitly ensures we wait and can return success/fail to the UI
                await fetchProfileAndTenant(data.user.id);
                return { success: true };
            }

            return { success: false, error: 'Usuário não encontrado.' };
        } catch (error: any) {
            console.error('[Auth] Login failed:', error.message);
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
        <TenantContext.Provider value={{ tenant, loading, updateTenant, toggleTheme, switchRole, login, signUp, logout, saveSettings, checkAccess }}>
            {children}
        </TenantContext.Provider>
    );
};

export const useTenant = () => {
    const context = useContext(TenantContext);
    if (!context) throw new Error('useTenant must be used within a TenantProvider');
    return context;
};
