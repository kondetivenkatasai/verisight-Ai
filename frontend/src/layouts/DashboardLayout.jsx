import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/ui/Loader';

export default function DashboardLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-surface-950 text-surface-900 dark:text-white transition-colors duration-200">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

