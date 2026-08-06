import { useState } from 'react';
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
} from 'lucide-react';
import VerisightLogo from '@/ui/VerisightLogo';
import { sidebarVariants } from '@/animations/variants';
import { useAuth } from '@/hooks/useAuth';
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
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      className="fixed left-0 top-0 bottom-0 w-64 bg-[#0a0f1d] border-r border-[#1a233a] z-40 flex flex-col justify-between"
    >
      <div>
        {/* Logo Header */}
        <div className="p-6">
          <div className="flex items-center gap-3">
            <VerisightLogo size={26} />
            <span className="text-xl font-extrabold text-white tracking-tight">{APP_NAME}</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="px-3 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-[#7b89a6] hover:text-white hover:bg-[#131b2e]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {Icon && (
                      <Icon
                        size={19}
                        className={`shrink-0 transition-colors ${
                          isActive ? 'text-white' : 'text-[#7b89a6] group-hover:text-white'
                        }`}
                      />
                    )}
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Theme Switcher & User Footer */}
      <div className="p-4 space-y-3">
        {/* Light | Dark Mode Toggle (matching bottom left of image) */}
        <div className="p-1 rounded-xl bg-[#111728] border border-[#1d263b] flex items-center gap-1">
          <button
            onClick={() => setIsDark(false)}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              !isDark
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-[#7b89a6] hover:text-white'
            }`}
          >
            <Sun size={13} />
            <span>Light</span>
          </button>

          <button
            onClick={() => setIsDark(true)}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              isDark
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-[#7b89a6] hover:text-white'
            }`}
          >
            <Moon size={13} />
            <span>Dark</span>
          </button>
        </div>

        {/* User Card & Logout */}
        <div className="flex items-center justify-between p-2.5 rounded-xl border border-[#1d263b] bg-[#111728]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-[#7b89a6] truncate">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 text-[#7b89a6] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </motion.aside>
  );
}



