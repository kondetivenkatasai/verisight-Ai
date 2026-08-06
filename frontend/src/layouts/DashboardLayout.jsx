import { useState, useRef, useEffect } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';
import { useSearch } from '@/context/SearchContext';
import { PageLoader } from '@/ui/Loader';
import { Search, Bell, History, ChevronDown, Settings, Lock, LogOut, X } from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const { theme } = useTheme();
  const { searchQuery, setSearchQuery } = useSearch();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isDark = theme === 'dark';


  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          {/* Title */}
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
                placeholder="Search cases, reports, findings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-8 py-2 rounded-xl text-xs transition-all ${
                  isDark
                    ? 'bg-[#121929] border border-[#1e2942] text-white placeholder-[#5c6b8a] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    : 'bg-gray-50 border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#9a55ff] focus:ring-2 focus:ring-[#9a55ff]/15'
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className={`absolute inset-y-0 right-0 pr-2.5 flex items-center cursor-pointer ${isDark ? 'text-[#5c6b8a] hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <X size={13} />
                </button>
              )}
            </div>


            {/* History Icon */}
            {isDark && (
              <button className="p-2 rounded-xl text-[#7b89a6] hover:text-white hover:bg-[#121929] border border-transparent hover:border-[#1e2942] transition-all">
                <History size={17} />
              </button>
            )}

            {/* Bell Icon */}
            <button className={`relative p-2 rounded-xl transition-colors ${
              isDark
                ? 'text-[#7b89a6] hover:text-white hover:bg-[#121929]'
                : 'text-gray-400 hover:text-[#9a55ff] hover:bg-purple-50'
            }`}>
              <Bell size={17} />
              <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${isDark ? 'bg-blue-500' : 'bg-[#9a55ff]'}`} />
            </button>

            {/* Interactive User Profile Dropdown Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className={`flex items-center gap-2.5 py-1 px-2 rounded-xl transition-all cursor-pointer ${
                  isDark ? 'hover:bg-[#121929]' : 'hover:bg-gray-100'
                }`}
              >
                <img
                  src={user?.avatar || '/default_avatar.png'}
                  alt={user?.name || 'User Profile'}
                  className="h-8 w-8 rounded-full object-cover border border-blue-500/40 shadow-sm shrink-0"
                />
                <div className="hidden sm:flex items-center gap-1.5">
                  <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {user?.name || 'User'}
                  </span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''} ${isDark ? 'text-[#5c6b8a]' : 'text-gray-400'}`} />
                </div>
              </button>

              {/* Dropdown Menu Popup */}
              {dropdownOpen && (
                <div className={`absolute right-0 mt-2 w-64 rounded-2xl p-2 shadow-2xl border backdrop-blur-xl z-50 transition-all ${
                  isDark
                    ? 'bg-[#111726] border-[#1e2942] text-white'
                    : 'bg-white border-gray-200 text-gray-800'
                }`}>
                  {/* User Profile Summary */}
                  <div className={`p-3 rounded-xl border mb-2 flex items-center gap-3 ${
                    isDark ? 'bg-[#151c2e] border-[#1e2942]' : 'bg-purple-50/50 border-purple-100'
                  }`}>
                    <img
                      src={user?.avatar || '/default_avatar.png'}
                      alt={user?.name}
                      className="h-10 w-10 rounded-full object-cover border border-blue-500/40 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {user?.name || 'User'}
                      </p>
                      <p className={`text-[10px] truncate ${isDark ? 'text-[#7b89a6]' : 'text-gray-500'}`}>
                        {user?.email || 'user@example.com'}
                      </p>
                      <span className={`text-[9px] font-bold uppercase tracking-wider block mt-0.5 ${isDark ? 'text-blue-400' : 'text-purple-600'}`}>
                        Decision Workspace
                      </span>
                    </div>
                  </div>

                  {/* Menu Action Links */}
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate('/settings');
                      }}
                      className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isDark ? 'text-[#8a99b5] hover:text-white hover:bg-[#1a243a]' : 'text-gray-600 hover:text-[#9a55ff] hover:bg-purple-50'
                      }`}
                    >
                      <Settings size={15} />
                      <span>Account Settings</span>
                    </button>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate('/settings#password');
                      }}
                      className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isDark ? 'text-[#8a99b5] hover:text-white hover:bg-[#1a243a]' : 'text-gray-600 hover:text-[#9a55ff] hover:bg-purple-50'
                      }`}
                    >
                      <Lock size={15} />
                      <span>Change Password</span>
                    </button>

                    <div className={`my-1 border-t ${isDark ? 'border-[#1e2942]' : 'border-gray-100'}`} />

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                        navigate('/login');
                      }}
                      className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isDark ? 'text-rose-400 hover:bg-rose-500/10' : 'text-rose-600 hover:bg-rose-50'
                      }`}
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
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






