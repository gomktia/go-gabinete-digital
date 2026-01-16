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
import CampaignFinance from './pages/CampaignFinance';
import VoterCrm from './pages/VoterCrm';
import ElectionDay from './pages/ElectionDay';
import { TenantProvider, useTenant } from './context/TenantContext';

function AppContent() {
  const { tenant } = useTenant();

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
          <Route path="/demands" element={<DemandsPage />} />
          <Route path="/proposals" element={<Propositions />} />
          <Route path="/advisor" element={<VirtualAdvisor />} />
          <Route path="/social-media" element={<SocialMediaPlanner />} />
          <Route path="/finance" element={<CampaignFinance />} />
          <Route path="/voters" element={<VoterCrm />} />
          <Route path="/election-day" element={<ElectionDay />} />
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
