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
  Smartphone,
  ChevronDown,
  Bell
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
  { label: 'Overview', path: '/dashboard', icon: 'LayoutDashboard' },
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
      className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-150 z-40 flex flex-col justify-between"
    >
      <div>
        {/* Logo */}
        <div className="p-6">
          <div className="flex items-center gap-3">
            <VerisightLogo size={26} />
            <span className="text-xl font-bold text-gray-900 tracking-tight">{APP_NAME}</span>
          </div>
        </div>

        {/* Action Button "+ Register patient" / "+ New Investigation" */}
        <div className="px-5 mb-4">
          <button
            onClick={() => navigate('/create-case')}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-semibold text-sm shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>New Investigation</span>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-purple-50 text-purple-700 font-bold'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {Icon && (
                      <Icon
                        size={19}
                        className={`shrink-0 transition-colors ${
                          isActive ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-600'
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

      {/* Bottom Section: Promo Card & User Footer */}
      <div className="p-4 space-y-3">
        {/* "Get mobile app" sidebar promo card */}
        <div className="rounded-2xl bg-gradient-to-b from-purple-50/80 to-indigo-50/80 border border-purple-100/80 p-4 text-center relative overflow-hidden">
          <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-purple-600/10 flex items-center justify-center text-purple-600">
            <Smartphone size={20} />
          </div>
          <p className="text-xs font-bold text-gray-900 mb-1">Get mobile app</p>
          <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-gray-400 font-medium">
            <span>iOS</span>
            <span>•</span>
            <span>Android</span>
          </div>
        </div>

        {/* User Card */}
        <div className="flex items-center justify-between p-2 rounded-2xl border border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-800 truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-gray-400 truncate">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </motion.aside>
  );
}


