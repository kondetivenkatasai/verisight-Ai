import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/ui/Loader';

export default function ProtectedRoute() {
  const { isAuthenticated, loading, token } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  if (!token || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
