import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import AppNavigation from '../routes/AppNavigation';

export default function RootLayout() {
  return (
    <DashboardLayout
      title="My App"
      // defaultSidebarCollapsed
      sidebarExpandedWidth={180}
    >
      <AppNavigation />
    </DashboardLayout>
  );
}