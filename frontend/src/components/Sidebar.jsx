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
  ChevronRight
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
      className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-150 z-40 flex flex-col justify-between"
    >
      <div>
        {/* Brand Logo Header */}
        <div className="p-6">
          <div className="flex items-center gap-3">
            <VerisightLogo size={26} />
            <span className="text-xl font-extrabold text-[#9a55ff] tracking-tight">{APP_NAME}</span>
          </div>
        </div>

        {/* User Card right under logo (matching image) */}
        <div className="px-5 mb-5">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-purple-50/50 border border-purple-100/60">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#9a55ff] to-[#da8cff] flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
              {user?.name?.charAt(0)?.toUpperCase() || 'V'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-gray-900 truncate">{user?.name || 'Verisight User'}</p>
              <span className="text-[10px] font-semibold text-purple-600 uppercase tracking-wider block">
                Decision Workspace
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-6 py-3 text-xs sm:text-sm font-semibold transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-purple-50/80 text-[#9a55ff] border-l-4 border-[#9a55ff]'
                      : 'text-gray-500 hover:text-[#9a55ff] hover:bg-purple-50/30 border-l-4 border-transparent'
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
                            isActive ? 'text-[#9a55ff]' : 'text-gray-400 group-hover:text-[#9a55ff]'
                          }`}
                        />
                      )}
                      <span>{item.label}</span>
                    </div>
                    {isActive && (
                      <ChevronRight size={14} className="text-[#9a55ff]" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom CTA & Sign Out */}
      <div className="p-5 space-y-3">
        {/* "+ Add a project" / "+ New Investigation" Button */}
        <button
          onClick={() => navigate('/create-case')}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#da8cff] to-[#9a55ff] hover:from-[#c87be5] hover:to-[#8843ed] text-white font-semibold text-xs sm:text-sm shadow-md shadow-purple-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>New Investigation</span>
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </motion.aside>
  );
}




