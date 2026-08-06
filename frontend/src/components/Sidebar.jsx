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

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const isDark = theme === 'dark';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      className={`fixed left-0 top-0 bottom-0 w-64 z-40 flex flex-col justify-between transition-colors duration-200 ${
        isDark
          ? 'bg-[#0a0f1d] border-r border-[#1a233a]'
          : 'bg-white border-r border-gray-150'
      }`}
    >
      <div>
        {/* Brand Logo Header */}
        <div className="p-6">
          <div className="flex items-center gap-3">
            <VerisightLogo size={26} />
            <span className={`text-xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#9a55ff]'}`}>
              {APP_NAME}
            </span>
          </div>
        </div>

        {/* User Card right under logo */}
        <div className="px-5 mb-5">
          <div className={`flex items-center gap-3 p-3 rounded-2xl border ${
            isDark
              ? 'bg-[#111728] border-[#1d263b] text-white'
              : 'bg-purple-50/50 border-purple-100/60 text-gray-900'
          }`}>
            <div className={`h-9 w-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm ${
              isDark ? 'bg-blue-600' : 'bg-gradient-to-tr from-[#9a55ff] to-[#da8cff]'
            }`}>
              {user?.name?.charAt(0)?.toUpperCase() || 'V'}
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{user?.name || 'Verisight User'}</p>
              <span className={`text-[10px] font-semibold uppercase tracking-wider block ${isDark ? 'text-[#7b89a6]' : 'text-purple-600'}`}>
                Decision Workspace
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1 overflow-y-auto custom-scrollbar px-3">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <NavLink
                key={item.path}
                to={item.path}
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
    </motion.aside>
  );
}





