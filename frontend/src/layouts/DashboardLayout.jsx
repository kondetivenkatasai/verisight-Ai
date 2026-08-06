import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/ui/Loader';
import { Search, Bell, ChevronDown, Power } from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f2edf3] flex items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f2edf3] text-gray-800 font-sans selection:bg-[#9a55ff] selection:text-white">
      <Sidebar />

      <main className="ml-64 min-h-screen bg-[#f2edf3]">
        {/* Top Header Bar matching Image */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md px-8 py-3.5 flex items-center justify-between border-b border-gray-150 shadow-sm">
          {/* Search Input */}
          <div className="relative w-64 sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search size={15} />
            </div>
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#9a55ff] focus:ring-2 focus:ring-[#9a55ff]/15 transition-all"
            />
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 cursor-pointer">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#9a55ff] to-[#da8cff] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'D'}
              </div>
              <div className="hidden sm:flex items-center gap-1">
                <span className="text-xs font-bold text-gray-800">{user?.name || 'David Greymaaz'}</span>
                <ChevronDown size={14} className="text-gray-400" />
              </div>
            </div>

            <button className="relative p-2 rounded-xl text-gray-400 hover:text-[#9a55ff] hover:bg-purple-50 transition-colors">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#9a55ff]" />
            </button>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <Power size={17} />
            </button>
          </div>
        </header>

        {/* Content Container */}
        <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}




