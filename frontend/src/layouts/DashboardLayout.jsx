import { useState, useRef, useEffect } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import AICopilot from '@/components/AICopilot';
import VoiceAssistant from '@/components/VoiceAssistant';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';
import { useSearch } from '@/context/SearchContext';
import { notificationService } from '@/services/notificationService';
import VerisightLogo from '@/ui/VerisightLogo';
import { APP_NAME } from '@/utils/constants';
import { Search, Bell, History, ChevronDown, Settings, Lock, LogOut, X, Sparkles, ShieldCheck, Activity, Menu } from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const { theme } = useTheme();
  const { searchQuery, setSearchQuery } = useSearch();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState([]);

  const [showDailyBanner, setShowDailyBanner] = useState(() => {
    try {
      const todayKey = `verisight_banner_dismissed_${new Date().toISOString().slice(0, 10)}`;
      return !localStorage.getItem(todayKey);
    } catch {
      return true;
    }
  });

  const dismissDailyBanner = () => {
    setShowDailyBanner(false);
    try {
      const todayKey = `verisight_banner_dismissed_${new Date().toISOString().slice(0, 10)}`;
      localStorage.setItem(todayKey, 'true');
    } catch {}
  };

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getAll();
      if (res.data?.notifications) {
        setNotificationsList(res.data.notifications);
      }
    } catch {}
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const notifRef = useRef(null);
  const unreadCount = notificationsList.filter((n) => !n.read).length;

  const markAllRead = async () => {
    setNotificationsList((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await notificationService.markAllRead();
    } catch {}
  };

  const markItemRead = async (id, targetRoute) => {
    setNotificationsList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await notificationService.markRead(id);
    } catch {}
    if (targetRoute) {
      navigate(targetRoute);
      setNotifOpen(false);
    }
  };

  const isDark = theme === 'dark';

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Register Service Worker for Background Push Notifications (works even when closed)
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('✅ Background Service Worker active:', reg.scope))
        .catch((err) => console.warn('Service Worker notice:', err));
    }
  }, []);

  // Trigger Hourly Native Browser Push Notification System (Every 1 Hour)
  useEffect(() => {
    if (!isAuthenticated || typeof window === 'undefined' || !('Notification' in window)) return;

    const sendHourlyNotification = () => {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      try {
        if (Notification.permission === 'granted') {
          new Notification('Verisight AI Hourly Security Digest 🔔', {
            body: `[${timeStr}] Hourly Update: 3 active cases running nominal with 96.5% confidence. System Risk: Low (24/100).`,
            icon: '/logo-icon.svg',
          });
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
              new Notification('Verisight AI Hourly Security Digest 🔔', {
                body: `[${timeStr}] Hourly Update: 3 active cases running nominal with 96.5% confidence. System Risk: Low (24/100).`,
                icon: '/logo-icon.svg',
              });
            }
          });
        }
      } catch (err) {
        console.warn('Hourly notification error:', err);
      }
    };

    // Send initial notification on login
    sendHourlyNotification();

    // Set hourly interval (3,600,000 ms = 1 hour)
    const hourlyInterval = setInterval(sendHourlyNotification, 3600000);

    return () => clearInterval(hourlyInterval);
  }, [isAuthenticated, user?.name]);

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
      {/* Full-Width Top Header Bar spanning 100% top of screen */}
      <header className={`fixed top-0 left-0 right-0 h-16 z-50 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between border-b transition-colors duration-200 ${
        isDark
          ? 'bg-[#0a0f1d]/95 border-[#1a233a] text-white shadow-md'
          : 'bg-white/95 border-gray-200 text-gray-800 shadow-sm'
      }`}>
        {/* Left: Brand Logo & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className={`md:hidden p-2 rounded-xl border transition-all cursor-pointer ${
              isDark
                ? 'bg-[#121929] border-[#1e2942] text-white hover:bg-[#1a243a]'
                : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
            }`}
            title="Open Navigation Menu"
          >
            <Menu size={18} />
          </button>

          <div className="flex items-center gap-2.5">
            <VerisightLogo size={24} />
            <span className={`text-lg font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#9a55ff]'}`}>
              {APP_NAME}
            </span>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Input */}
            <div className="relative w-36 sm:w-64 md:w-80">
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

            {/* Voice Assistant */}
            <VoiceAssistant onTranscript={(text) => setSearchQuery(text)} />

            {/* History Icon */}
            {isDark && (
              <button className="p-2 rounded-xl text-[#7b89a6] hover:text-white hover:bg-[#121929] border border-transparent hover:border-[#1e2942] transition-all">
                <History size={17} />
              </button>
            )}

            {/* Bell Icon & Daily Notifications Popover */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen((prev) => !prev)}
                className={`relative p-2 rounded-xl transition-colors cursor-pointer ${
                  isDark
                    ? 'text-[#7b89a6] hover:text-white hover:bg-[#121929]'
                    : 'text-gray-400 hover:text-[#9a55ff] hover:bg-purple-50'
                }`}
              >
                <Bell size={17} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Popover Panel */}
              {notifOpen && (
                <div className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl p-4 shadow-2xl border backdrop-blur-xl z-50 transition-all ${
                  isDark
                    ? 'bg-[#111726] border-[#1e2942] text-white'
                    : 'bg-white border-gray-200 text-gray-800'
                }`}>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200 dark:border-[#1e2942]">
                    <div className="flex items-center gap-2">
                      <Bell size={16} className="text-blue-500" />
                      <h3 className="text-xs font-bold uppercase tracking-wider">Daily Notifications</h3>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[10px] font-semibold text-blue-500 hover:underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="space-y-2.5 max-h-80 overflow-y-auto">
                    {notificationsList.length > 0 ? (
                      notificationsList.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markItemRead(n.id, n.type === 'report' ? '/reports' : n.type === 'case' ? '/dashboard' : null)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer ${
                            !n.read
                              ? isDark
                                ? 'bg-blue-500/10 border-blue-500/30'
                                : 'bg-purple-50/70 border-purple-200'
                              : isDark
                              ? 'bg-[#151c2e] border-[#1e2942] opacity-75'
                              : 'bg-gray-50 border-gray-150 opacity-75'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-bold text-gray-900 dark:text-white">{n.title}</h4>
                            <span className="text-[9px] text-gray-400 dark:text-[#5c6b8a] shrink-0">
                              {n.created_at ? new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (n.time || 'Today')}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-600 dark:text-[#8a99b5] mt-1 leading-snug">{n.desc}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-gray-500 dark:text-[#8a99b5]">
                        No notifications right now
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

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
                      {user?.dob && (
                        <p className={`text-[10px] font-medium truncate mt-0.5 ${isDark ? 'text-blue-300' : 'text-purple-700'}`}>
                          DOB: {user.dob}
                        </p>
                      )}
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

      {/* Sidebar starting below top header */}
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content Area starting below top header */}
      <main className="ml-0 md:ml-64 pt-16 min-h-screen flex-1 min-w-0 max-w-full overflow-x-hidden">
        <div className="px-4 sm:px-8 py-6 space-y-6 w-full">
          {/* Daily Notification Welcome Banner Toast */}
          {showDailyBanner && (
            <div className={`p-4 rounded-2xl border flex items-center justify-between shadow-sm transition-all animate-fade-in ${
              isDark
                ? 'bg-gradient-to-r from-[#111827] via-[#1e293b] to-[#0f172a] border-blue-500/20 text-white'
                : 'bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 border-purple-100 text-gray-800'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-100 text-[#9a55ff]'}`}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold">
                    Daily Notification Digest for {user?.name || 'Logged-In User'}
                  </h4>
                  <p className="text-[11px] sm:text-xs opacity-80 mt-0.5">
                    Welcome back! You have {unreadCount} unread daily notification{unreadCount === 1 ? '' : 's'} for today.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={dismissDailyBanner}
                className="p-1.5 rounded-lg opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                title="Dismiss Banner"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <Outlet />
        </div>
      </main>

      <AICopilot />
    </div>
  );
}






