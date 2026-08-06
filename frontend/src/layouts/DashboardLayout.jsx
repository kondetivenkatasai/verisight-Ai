import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';
import { PageLoader } from '@/ui/Loader';
import { Search, Bell, History, ChevronDown, Power } from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#090d16]' : 'bg-[#f2edf3]'}`}>
        <PageLoader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={`min-h-screen font-sans transition-colors duration-200 ${
      isDark
        ? 'bg-[#090d16] text-white selection:bg-blue-600 selection:text-white'
        : 'bg-[#f2edf3] text-gray-800 selection:bg-[#9a55ff] selection:text-white'
    }`}>
      <Sidebar />

      <main className="ml-64 min-h-screen">
        {/* Top Header Bar */}
        <header className={`sticky top-0 z-30 backdrop-blur-md px-8 py-3.5 flex items-center justify-between border-b transition-colors duration-200 ${
          isDark
            ? 'bg-[#090d16]/90 border-[#182035] text-white'
            : 'bg-white/90 border-gray-150 text-gray-800 shadow-sm'
        }`}>
          {/* Breadcrumb / Title or Search */}
          <div className="flex items-center gap-4">
            <h1 className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Verisight AI Dashboard
            </h1>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative w-64 sm:w-80">
              <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none ${isDark ? 'text-[#5c6b8a]' : 'text-gray-400'}`}>
                <Search size={15} />
              </div>
              <input
                type="text"
                placeholder={isDark ? "Search..." : "Search projects..."}
                className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs transition-all ${
                  isDark
                    ? 'bg-[#121929] border border-[#1e2942] text-white placeholder-[#5c6b8a] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    : 'bg-gray-50 border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#9a55ff] focus:ring-2 focus:ring-[#9a55ff]/15'
                }`}
              />
            </div>

            {/* Icons */}
            {isDark && (
              <button className="p-2 rounded-xl text-[#7b89a6] hover:text-white hover:bg-[#121929] border border-transparent hover:border-[#1e2942] transition-all">
                <History size={17} />
              </button>
            )}

            <button className={`relative p-2 rounded-xl transition-colors ${
              isDark
                ? 'text-[#7b89a6] hover:text-white hover:bg-[#121929]'
                : 'text-gray-400 hover:text-[#9a55ff] hover:bg-purple-50'
            }`}>
              <Bell size={17} />
              <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${isDark ? 'bg-blue-500' : 'bg-[#9a55ff]'}`} />
            </button>

            {/* User Profile */}
            <div className={`flex items-center gap-2.5 cursor-pointer ${isDark ? 'pl-2 border-l border-[#1d273f]' : ''}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm ${
                isDark ? 'bg-blue-600' : 'bg-gradient-to-tr from-[#9a55ff] to-[#da8cff]'
              }`}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="hidden sm:flex items-center gap-1">
                <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>{user?.name || 'Verisight User'}</span>
                <ChevronDown size={14} className={isDark ? 'text-[#5c6b8a]' : 'text-gray-400'} />
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className={`p-2 rounded-xl transition-colors ${
                isDark ? 'text-[#7b89a6] hover:text-rose-400' : 'text-gray-400 hover:text-rose-600 hover:bg-rose-50'
              }`}
            >
              <Power size={17} />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}





