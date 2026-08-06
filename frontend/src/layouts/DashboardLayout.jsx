import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/ui/Loader';
import { Search, Bell, ChevronDown } from 'lucide-react';

export default function DashboardLayout() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f5f8] flex items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f4f5f8] text-gray-900 font-sans">
      <Sidebar />

      <main className="ml-64 min-h-screen">
        {/* Top Header Bar matching Image 1 */}
        <header className="sticky top-0 z-30 bg-[#f4f5f8]/90 backdrop-blur-md px-8 py-4 flex items-center justify-between">
          {/* Search Input */}
          <div className="relative w-72">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-gray-100 text-xs sm:text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-500 transition-all"
            />
          </div>

          {/* User Profile & Notifications */}
          <div className="flex items-center gap-5">
            <button className="relative p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-white transition-colors shadow-sm bg-white border border-gray-100">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-600" />
            </button>

            <div className="flex items-center gap-3 cursor-pointer">
              <div className="h-9 w-9 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'E'}
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="text-xs font-bold text-gray-800">{user?.name || 'Emma Kwain'}</span>
                <ChevronDown size={14} className="text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Container */}
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}


