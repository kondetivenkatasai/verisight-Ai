import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/ui/Loader';
import { Search, Bell, History, ChevronDown } from 'lucide-react';

export default function DashboardLayout() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-white font-sans selection:bg-blue-600 selection:text-white">
      <Sidebar />

      <main className="ml-64 min-h-screen bg-[#090d16]">
        {/* Top Header Bar matching Image */}
        <header className="sticky top-0 z-30 bg-[#090d16]/90 backdrop-blur-md px-8 py-4 flex items-center justify-between border-b border-[#182035]">
          {/* Breadcrumb / Title */}
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-white tracking-tight">Verisight Dashboard</h1>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative w-64 sm:w-80">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5c6b8a]">
                <Search size={15} />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 bg-[#121929] rounded-xl border border-[#1e2942] text-xs text-white placeholder-[#5c6b8a] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Header Icon Buttons */}
            <button className="p-2 rounded-xl text-[#7b89a6] hover:text-white hover:bg-[#121929] border border-transparent hover:border-[#1e2942] transition-all">
              <History size={17} />
            </button>

            <button className="relative p-2 rounded-xl text-[#7b89a6] hover:text-white hover:bg-[#121929] border border-transparent hover:border-[#1e2942] transition-all">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-[#1d273f] cursor-pointer">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="text-xs font-semibold text-white">{user?.name || 'Super Admin'}</span>
                <ChevronDown size={13} className="text-[#5c6b8a]" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}



