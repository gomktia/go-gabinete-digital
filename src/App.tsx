import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import Sidebar from './components/Sidebar';
import AIAssistant from './components/AIAssistant';
import Dashboard from './pages/Dashboard';
import Propositions from './pages/Propositions';
import VirtualAdvisor from './pages/VirtualAdvisor';
import WhatsAppIntegration from './pages/WhatsAppIntegration';
import SettingsPage from './pages/SettingsPage';
import CalendarPage from './pages/CalendarPage';
import DemandsPage from './pages/DemandsPage';
import WhatsAppConfig from './pages/WhatsAppConfig';
import SuperAdmin from './pages/SuperAdmin';
import LoginPage from './pages/LoginPage';
import SocialMediaPlanner from './pages/SocialMediaPlanner';
import MandateSiteBuilder from './pages/MandateSiteBuilder';
import PublicMandateSite from './pages/PublicMandateSite';
import CampaignFinance from './pages/CampaignFinance';
import DocumentTracking from './pages/DocumentTracking';
import VoterCrm from './pages/VoterCrm';
import TeamManagement from './pages/TeamManagement';
import VoterMap from './pages/VoterMap';
import VoteGenealogy from './pages/VoteGenealogy';
import VerbasRadar from './pages/VerbasRadar';
import SubscriptionPage from './pages/SubscriptionPage';
import OnboardingSetup from './components/OnboardingSetup';
import LandingPage from './pages/LandingPage';
import AdminFinance from './pages/AdminFinance';
import AdminLeads from './pages/AdminLeads';
import AdminPlans from './pages/AdminPlans';
import AdminIntegrations from './pages/AdminIntegrations';
import VotesPage from './pages/VotesPage';
import { PageGuide } from './components/PageGuide';
import { TenantProvider, useTenant } from './context/TenantContext';

function AppContent() {
  const { tenant, loading } = useTenant();
  const location = useLocation();

  // Allow public access to site pages
  if (location.pathname.startsWith('/s/')) {
    return (
      <Routes>
        <Route path="/s/:slug" element={<PublicMandateSite />} />
      </Routes>
    );
  }

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 50%, #1a365d 0%, #0f172a 100%)',
        color: 'white',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Animated Background Elements */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            background: 'var(--primary)',
            filter: 'blur(100px)',
            borderRadius: '50%',
            zIndex: 0
          }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}
        >
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            borderRadius: '20px',
            margin: '0 auto 1.5rem auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            position: 'relative'
          }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '20px',
                border: '2px solid rgba(255,255,255,0.1)',
                borderTop: '2px solid white'
              }}
            />
            <LogIn size={32} color="white" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>Gabinete Digital</h2>
          <motion.p
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}
          >
            Iniciando ambiente seguro...
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4 }}
            style={{ marginTop: '2rem' }}
          >
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.4)',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.7rem',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              Problemas para entrar? Limpar Sistema
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Check if it's a public route that should render full page (no sidebar)
  const isPublicRoute = ['/login', '/register', '/'].includes(location.pathname) && !tenant.isLoggedIn;

  if (isPublicRoute) {
    if (location.pathname === '/') return <LandingPage />;
    if (location.pathname === '/login') return <LoginPage />;
    // if (location.pathname === '/register') return <RegisterPage />; // RegisterPage not imported yet
    return <LandingPage />;
  }

  // If not public route and not logged in, redirect to login (PROTECTED ROUTES)
  if (!tenant.isLoggedIn) {
    // Small check to avoid loop if they are already on a public route handled above, 
    // but 'isPublicRoute' logic covers it. 
    // This block is for deep links like /dashboard when not logged in.
    return <Navigate to="/login" />;
  }

  // LOGGED IN APP LAYOUT
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={tenant.role === 'SUPER_ADMIN' ? <SuperAdmin /> : <Dashboard />} />
          {/* Public routes redirect to home if logged in */}
          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="/register" element={<Navigate to="/" />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/documents" element={<DocumentTracking />} />
          <Route path="/demands" element={<DemandsPage />} />
          <Route path="/proposals" element={<Propositions />} />
          <Route path="/advisor" element={<VirtualAdvisor />} />
          <Route path="/site-builder" element={<MandateSiteBuilder />} />
          <Route path="/social-media" element={<SocialMediaPlanner />} />
          <Route path="/finance" element={<CampaignFinance />} />
          <Route path="/team" element={<TeamManagement />} />
          <Route path="/radar" element={<VerbasRadar />} />
          <Route path="/voters" element={<VoterCrm />} />
          <Route path="/votes" element={<VotesPage />} />
          <Route path="/genealogy" element={<VoteGenealogy />} />
          <Route path="/map" element={<VoterMap />} />
          <Route path="/messages" element={<WhatsAppIntegration />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/wa-config" element={<WhatsAppConfig />} />
          <Route path="/wa-config" element={<WhatsAppConfig />} />
          <Route path="/super-admin" element={<SuperAdmin />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/setup" element={<OnboardingSetup />} />

          {/* New Super Admin Modules */}
          <Route path="/admin/finance" element={<AdminFinance />} />
          <Route path="/admin/leads" element={<AdminLeads />} />
          <Route path="/admin/plans" element={<AdminPlans />} />
          <Route path="/admin/integrations" element={<AdminIntegrations />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <PageGuide />
      <AIAssistant />
    </div>
  );
}

function App() {
  return (
    <TenantProvider>
      <Router>
        <AppContent />
      </Router>
    </TenantProvider>
  );
}

export default App;
