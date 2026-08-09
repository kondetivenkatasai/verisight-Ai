import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Plus,
  GitBranch,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Sun,
  Moon,
  ChevronRight,
} from 'lucide-react';
import VerisightLogo from '@/ui/VerisightLogo';
import { sidebarVariants } from '@/animations/variants';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';
import { APP_NAME } from '@/utils/constants';

const iconMap = {
  LayoutDashboard,
  Plus,
  GitBranch,
  FileText,
  BarChart3,
  Settings,
};

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Create Case', path: '/create-case', icon: 'Plus' },
  { label: 'Workflow', path: '/workflow', icon: 'GitBranch' },
  { label: 'Reports', path: '/reports', icon: 'FileText' },
  { label: 'Analytics', path: '/analytics', icon: 'BarChart3' },
  { label: 'Settings', path: '/settings', icon: 'Settings' },
];

import { Menu, X } from 'lucide-react';

export default function Sidebar({ isOpen = false, onClose }) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const isDark = theme === 'dark';

  const handleLogout = () => {
    onClose?.();
    logout();
    navigate('/login');
  };

  const handleNavClick = () => {
    onClose?.();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container (Desktop Fixed under top navbar + Mobile Slide-Out Drawer) */}
      <aside
        className={`fixed left-0 top-0 md:top-16 bottom-0 w-64 z-40 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        } ${
          isDark
            ? 'bg-[#0a0f1d] border-r border-[#1a233a]'
            : 'bg-white border-r border-gray-150'
        }`}
      >
        <div>
          {/* Mobile Drawer Header with Logo & Close Button */}
          <div className="md:hidden p-5 flex items-center justify-between border-b border-gray-200 dark:border-[#1a233a] mb-3">
            <div className="flex items-center gap-3">
              <VerisightLogo size={24} />
              <span className={`text-lg font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#9a55ff]'}`}>
                {APP_NAME}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="pt-3 md:pt-4">


        {/* Navigation Links */}
        <nav className="space-y-1 overflow-y-auto custom-scrollbar px-3">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 group relative ${
                    isActive
                      ? isDark
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                        : 'bg-purple-50/80 text-[#9a55ff] border-l-4 border-[#9a55ff]'
                      : isDark
                        ? 'text-[#7b89a6] hover:text-white hover:bg-[#131b2e]'
                        : 'text-gray-500 hover:text-[#9a55ff] hover:bg-purple-50/30'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      {Icon && (
                        <Icon
                          size={18}
                          className={`shrink-0 transition-colors ${
                            isActive
                              ? 'text-white dark:text-white'
                              : isDark
                                ? 'text-[#7b89a6] group-hover:text-white'
                                : 'text-gray-400 group-hover:text-[#9a55ff]'
                          }`}
                        />
                      )}
                      <span>{item.label}</span>
                    </div>
                    {isActive && !isDark && (
                      <ChevronRight size={14} className="text-[#9a55ff]" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
        </div>
      </div>

      {/* Bottom CTA, Theme Switcher & Sign Out */}
      <div className="p-4 space-y-3">
        {/* Light | Dark Mode Toggle Switcher */}
        <div className={`p-1 rounded-xl border flex items-center gap-1 ${
          isDark ? 'bg-[#111728] border-[#1d263b]' : 'bg-gray-100 border-gray-200'
        }`}>
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              !isDark
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-[#7b89a6] hover:text-white'
            }`}
          >
            <Sun size={13} />
            <span>Light</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isDark
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Moon size={13} />
            <span>Dark</span>
          </button>
        </div>

        {/* Action Button */}
        <button
          onClick={() => navigate('/create-case')}
          className={`w-full py-3 px-4 rounded-xl text-white font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] ${
            isDark
              ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/30'
              : 'bg-gradient-to-r from-[#da8cff] to-[#9a55ff] hover:from-[#c87be5] hover:to-[#8843ed] shadow-md shadow-purple-500/20'
          }`}
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>New Investigation</span>
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            isDark ? 'text-[#7b89a6] hover:text-rose-400 hover:bg-rose-500/10' : 'text-gray-500 hover:text-rose-600 hover:bg-rose-50'
          }`}
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
    </>
  );
}





