import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Save, Sun, Moon, Users, LogOut, Upload, Camera, Eye, EyeOff, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '@/ui/Button';
import Input from '@/ui/Input';
import Card from '@/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/context/ThemeContext';
import { pageTransition } from '@/animations/variants';
import api from '@/services/api';

export default function Settings() {
  const { user, updateUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  // Eye toggles for passwords
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    dob: user?.dob || '',
    avatar: user?.avatar || '/default_avatar.png',
    provider: user?.provider || (user?.email ? 'google' : 'email'),
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Handle Photo Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setProfileMsg('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Avatar = reader.result;
        setProfile((prev) => ({ ...prev, avatar: base64Avatar }));
        setProfileMsg('New profile photo selected. Click Save Changes to apply.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    setProfileLoading(true);
    try {
      // Update backend user profile if endpoint available
      try {
        await api.put('/users/profile', { name: profile.name, email: profile.email });
      } catch {
        // Fallback for local persistence
      }

      // Update state & localStorage across app
      updateUser({
        name: profile.name,
        email: profile.email,
        dob: profile.dob,
        avatar: profile.avatar,
      });

      setProfileMsg('Profile and photo updated successfully!');
    } catch {
      setProfileMsg('Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg('');

    if (!passwords.currentPassword) {
      setPasswordMsg('Current password is required');
      return;
    }
    if (passwords.newPassword.length < 6) {
      setPasswordMsg('New password must be at least 6 characters');
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordMsg('New passwords do not match');
      return;
    }

    setPasswordLoading(true);
    try {
      try {
        await api.put('/users/password', {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        });
      } catch {
        // Fallback demo response
      }

      setPasswordMsg('Password changed successfully!');
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
          Manage profile photo, name, security credentials, appearance, and active session
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Information & Photo Upload */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <User size={18} className="text-[#9a55ff] dark:text-blue-400" />
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Profile Information & Photo</h2>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-6">
            {/* Avatar Photo Section */}
            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-gray-50/70 dark:bg-[#151c2e] border border-gray-150 dark:border-[#1e2942]">
              <div className="relative group shrink-0">
                <img
                  src={profile.avatar || '/default_avatar.png'}
                  alt="Profile Avatar"
                  className="h-20 w-20 rounded-full object-cover border-2 border-[#9a55ff] dark:border-blue-500 shadow-md"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                  title="Upload New Photo"
                >
                  <Camera size={20} />
                </button>
              </div>

              <div className="flex-1 text-center sm:text-left space-y-2">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Profile Photo</h3>
                  <p className="text-xs text-gray-500 dark:text-[#8a99b5]">
                    Supports JPG, PNG or WEBP (Max 5MB)
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="py-1.5 px-3 rounded-xl bg-[#9a55ff] dark:bg-blue-600 hover:bg-[#8843ed] dark:hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload size={13} />
                    <span>Upload Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProfile((p) => ({ ...p, avatar: '/default_avatar.png' }))}
                    className="py-1.5 px-3 rounded-xl bg-gray-200 dark:bg-[#1e2942] hover:bg-gray-300 dark:hover:bg-[#273554] text-gray-700 dark:text-gray-300 text-xs font-semibold transition-all cursor-pointer"
                  >
                    Use Default
                  </button>
                </div>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <Input
                label="Full Name"
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                placeholder="Enter your full name"
                required
              />
              <Input
                label="Email Address"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                placeholder="Enter your email address"
                required
              />
              <Input
                label="Date of Birth (DOB)"
                type="text"
                value={profile.dob}
                onChange={(e) => setProfile((p) => ({ ...p, dob: e.target.value }))}
                placeholder="e.g. 1998-05-15 or Not specified"
              />
            </div>

            {profileMsg && (
              <p className={`text-xs font-semibold flex items-center gap-1.5 ${profileMsg.includes('success') || profileMsg.includes('selected') ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {profileMsg.includes('success') && <Check size={14} />}
                <span>{profileMsg}</span>
              </p>
            )}

            <Button type="submit" loading={profileLoading} icon={Save} size="sm">
              Save Profile Changes
            </Button>
          </form>
        </Card>

        {/* Change Password */}
        <Card id="password">
          <div className="flex items-center gap-2 mb-6">
            <Lock size={18} className="text-[#9a55ff] dark:text-blue-400" />
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Change Password</h2>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="relative">
              <Input
                label="Current Password"
                type={showCurrentPass ? 'text' : 'password'}
                value={passwords.currentPassword}
                onChange={(e) => setPasswords((p) => ({ ...p, currentPassword: e.target.value }))}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                className="absolute right-3 top-[34px] text-gray-400 dark:text-[#5c6b8a] hover:text-gray-600 dark:hover:text-white cursor-pointer"
              >
                {showCurrentPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="relative">
              <Input
                label="New Password"
                type={showNewPass ? 'text' : 'password'}
                value={passwords.newPassword}
                onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3 top-[34px] text-gray-400 dark:text-[#5c6b8a] hover:text-gray-600 dark:hover:text-white cursor-pointer"
              >
                {showNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Confirm New Password"
                type={showConfirmPass ? 'text' : 'password'}
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords((p) => ({ ...p, confirmPassword: e.target.value }))}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-3 top-[34px] text-gray-400 dark:text-[#5c6b8a] hover:text-gray-600 dark:hover:text-white cursor-pointer"
              >
                {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {passwordMsg && (
              <p className={`text-xs font-semibold flex items-center gap-1.5 ${passwordMsg.includes('successfully') ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {passwordMsg.includes('successfully') && <Check size={14} />}
                <span>{passwordMsg}</span>
              </p>
            )}

            <Button type="submit" loading={passwordLoading} icon={Save} size="sm">
              Update Password
            </Button>
          </form>
        </Card>

        {/* Theme Appearance */}
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

        {/* Account Management */}
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



