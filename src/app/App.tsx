import * as React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store';
import { Shell } from './Shell';
import { DemoControlsDrawer } from './DemoControlsDrawer';
import { GuidedTour } from './GuidedTour';
import { PresentationMode } from '@/features/presentation/PresentationMode';

// Feature Pages
import { WelcomePage } from '@/features/welcome/WelcomePage';
import { BrowseTasksPage } from '@/features/tasks/BrowseTasksPage';
import { TaskDetailPage } from '@/features/tasks/TaskDetailPage';
import { PostTaskWizard } from '@/features/tasks/PostTaskWizard';
import { JobsListPage } from '@/features/jobs/JobsListPage';
import { JobRoomPage } from '@/features/jobs/JobRoomPage';
import { WalletPage } from '@/features/wallet/WalletPage';
import { WorkerDashboard } from '@/features/dashboard/WorkerDashboard';
import { CustomerDashboard } from '@/features/dashboard/CustomerDashboard';
import { CompanyWorkspacePage } from '@/features/company/CompanyWorkspacePage';
import { ProfilePage } from '@/features/profile/ProfilePage';
import { AdminConsolePage } from '@/features/admin/AdminConsolePage';
import { PartnerConsolePage } from '@/features/partner/PartnerConsolePage';
import { InvestorOverviewPage } from '@/features/investor/InvestorOverviewPage';
import { GoogleShowcasePage } from '@/features/google/GoogleShowcasePage';
import { ImpactMetricsPage } from '@/features/impact/ImpactMetricsPage';

export const App: React.FC = () => {
  const { refreshCurrentUser, theme } = useAppStore();

  React.useEffect(() => {
    // Initial fetch of current demo persona
    refreshCurrentUser();

    // Ensure theme class is aligned with store
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [refreshCurrentUser, theme]);

  return (
    <HashRouter>
      {/* Global Presenter & Walkthrough Overlays */}
      <PresentationMode />
      <DemoControlsDrawer />
      <GuidedTour />

      <Routes>
        <Route element={<Shell />}>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/tasks" element={<BrowseTasksPage />} />
          <Route path="/tasks/new" element={<PostTaskWizard />} />
          <Route path="/tasks/:id" element={<TaskDetailPage />} />
          <Route path="/jobs" element={<JobsListPage />} />
          <Route path="/jobs/:id" element={<JobRoomPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/dashboard/worker" element={<WorkerDashboard />} />
          <Route path="/dashboard/customer" element={<CustomerDashboard />} />
          <Route path="/company" element={<CompanyWorkspacePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminConsolePage />} />
          <Route path="/partner" element={<PartnerConsolePage />} />
          <Route path="/investor" element={<InvestorOverviewPage />} />
          <Route path="/google-showcase" element={<GoogleShowcasePage />} />
          <Route path="/impact-metrics" element={<ImpactMetricsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
