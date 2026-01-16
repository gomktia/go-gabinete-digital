import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import CampaignFinance from './pages/CampaignFinance';
import DocumentTracking from './pages/DocumentTracking';
import VoterCrm from './pages/VoterCrm';
import TeamManagement from './pages/TeamManagement';
import { TenantProvider, useTenant } from './context/TenantContext';

function AppContent() {
  const { tenant, loading } = useTenant();

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: 'white' }}>
        Carregando Sistema...
      </div>
    );
  }

  if (!tenant.isLoggedIn) {
    return <LoginPage />;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/documents" element={<DocumentTracking />} />
          <Route path="/demands" element={<DemandsPage />} />
          <Route path="/proposals" element={<Propositions />} />
          <Route path="/advisor" element={<VirtualAdvisor />} />
          <Route path="/site-builder" element={<MandateSiteBuilder />} />
          <Route path="/social-media" element={<SocialMediaPlanner />} />
          <Route path="/finance" element={<CampaignFinance />} />
          <Route path="/team" element={<TeamManagement />} />
          <Route path="/voters" element={<VoterCrm />} />
          <Route path="/messages" element={<WhatsAppIntegration />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/wa-config" element={<WhatsAppConfig />} />
          <Route path="/super-admin" element={<SuperAdmin />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
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
