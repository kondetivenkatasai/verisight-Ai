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
      className="fixed left-0 top-0 bottom-0 w-64 bg-surface-950/90 backdrop-blur-xl border-r border-surface-800/40 z-40 flex flex-col"
    >
      {/* Logo */}
      <div className="p-6 border-b border-surface-800/30">
        <div className="flex items-center gap-2.5">
          <VerisightLogo size={20} />
          <span className="text-lg font-bold text-white tracking-tight">{APP_NAME}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-aegis-600/15 text-aegis-400 border border-aegis-500/20'
                    : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/50'
                }`
              }
            >
              {Icon && <Icon size={18} className="shrink-0" />}
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-surface-800/30">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="h-8 w-8 rounded-full bg-aegis-600/20 flex items-center justify-center text-aegis-400 text-sm font-semibold">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-surface-200 truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-surface-500 truncate">{user?.email || ''}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-surface-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </motion.aside>
  );
}
