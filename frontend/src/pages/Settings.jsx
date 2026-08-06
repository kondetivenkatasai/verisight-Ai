import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Save, Sun, Moon, Users, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/ui/Button';
import Input from '@/ui/Input';
import Card from '@/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';
import { pageTransition } from '@/animations/variants';
import api from '@/services/api';

export default function Settings() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    setProfileLoading(true);
    try {
      await api.put('/users/profile', profile);
      setProfileMsg('Profile updated successfully');
    } catch (err) {
      setProfileMsg(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg('');

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordMsg('Passwords do not match');
      return;
    }

    setPasswordLoading(true);
    try {
      await api.put('/users/password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswordMsg('Password updated successfully');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordMsg(err.response?.data?.message || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSwitchAccount = () => {
    logout();
    navigate('/login');
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.div {...pageTransition} className="max-w-2xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Account Settings & Preferences
        </h1>
        <p className="text-gray-500 dark:text-[#8a99b5] text-sm mt-1">
          Manage profile, security credentials, appearance, and active session
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <User size={18} className="text-[#9a55ff] dark:text-blue-400" />
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Profile Information</h2>
          </div>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <Input
              label="Name"
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
            />
            <Input
              label="Email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
            />
            {profileMsg && (
              <p className={`text-xs font-semibold ${profileMsg.includes('success') ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {profileMsg}
              </p>
            )}
            <Button type="submit" loading={profileLoading} icon={Save} size="sm">
              Save Changes
            </Button>
          </form>
        </Card>

        {/* Password */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <Lock size={18} className="text-[#9a55ff] dark:text-blue-400" />
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Change Password</h2>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords((p) => ({ ...p, currentPassword: e.target.value }))}
            />
            <Input
              label="New Password"
              type="password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords((p) => ({ ...p, confirmPassword: e.target.value }))}
            />
            {passwordMsg && (
              <p className={`text-xs font-semibold ${passwordMsg.includes('success') ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {passwordMsg}
              </p>
            )}
            <Button type="submit" loading={passwordLoading} icon={Save} size="sm">
              Update Password
            </Button>
          </form>
        </Card>

        {/* Theme */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-1">Appearance</h2>
              <p className="text-sm text-gray-500 dark:text-[#8a99b5] font-normal">
                Currently using {theme === 'dark' ? 'dark' : 'light'} mode
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-[#151c2e] hover:bg-gray-200 dark:hover:bg-[#1e2942] border border-gray-200 dark:border-[#1e2942] transition-all cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun size={18} className="text-amber-400" />
              ) : (
                <Moon size={18} className="text-[#9a55ff]" />
              )}
            </button>
          </div>
        </Card>

        {/* Account Management (Switch Account & Sign Out) */}
        <Card>
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Account Actions</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" icon={Users} onClick={handleSwitchAccount} size="sm">
              Switch Account
            </Button>
            <Button variant="danger" icon={LogOut} onClick={handleSignOut} size="sm">
              Sign Out
            </Button>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}


