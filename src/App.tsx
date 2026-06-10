import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import AppShell from './components/layout/AppShell';
import CommandCenter from './pages/CommandCenter';
import AgentDetailPage from './pages/AgentDetailPage';
import ExplorerPage from './pages/ExplorerPage';
import IntegrationsPage from './pages/IntegrationsPage';
import DemoPage from './pages/DemoPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/demo" element={<DemoPage />} />
      <Route path="/app" element={<AppShell />}>
        <Route index element={<Navigate to="/app/agents" replace />} />
        <Route path="agents" element={<CommandCenter />} />
        <Route path="agents/:id" element={<AgentDetailPage />} />
        <Route path="explorer" element={<ExplorerPage />} />
        <Route path="integrations" element={<IntegrationsPage />} />
      </Route>
    </Routes>
  );
}