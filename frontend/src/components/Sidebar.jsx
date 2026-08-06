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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      className="fixed left-0 top-0 bottom-0 w-64 bg-white/80 dark:bg-[#09090b]/90 backdrop-blur-xl border-r border-surface-200 dark:border-white/10 z-40 flex flex-col"
    >
      {/* Logo */}
      <div className="p-5 border-b border-surface-200 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <VerisightLogo size={22} />
          <span className="text-lg font-bold text-surface-900 dark:text-white tracking-tight">{APP_NAME}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-aegis-500/10 text-aegis-600 dark:text-aegis-400 font-semibold border border-aegis-500/20'
                    : 'text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-surface-200/60 dark:hover:bg-surface-800/40'
                }`
              }
            >
              {Icon && <Icon size={18} className="shrink-0" />}
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-surface-200 dark:border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-1.5 rounded-xl bg-surface-100 dark:bg-surface-800/40 border border-surface-200 dark:border-white/5">
          <div className="h-8 w-8 rounded-full bg-aegis-500/20 flex items-center justify-center text-aegis-600 dark:text-aegis-400 text-xs font-bold shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-surface-900 dark:text-surface-100 truncate">{user?.name || 'User'}</p>
            <p className="text-[11px] text-surface-500 truncate">{user?.email || ''}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-medium text-surface-500 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </motion.aside>
  );
}

