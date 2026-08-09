import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('aegis_token') || sessionStorage.getItem('aegis_token'));
  const [loading, setLoading] = useState(true);

  const clearAuth = useCallback(() => {
    localStorage.removeItem('aegis_token');
    sessionStorage.removeItem('aegis_token');
    localStorage.removeItem('aegis_user_avatar');
    localStorage.removeItem('aegis_user_name');
    setToken(null);
    setUser(null);
  }, []);

  const fetchUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await authService.getMe();
      if (res.data?.user) {
        const storedAvatar = localStorage.getItem('aegis_user_avatar') || '/default_avatar.png';
        const storedName = localStorage.getItem('aegis_user_name');
        setUser({
          ...res.data.user,
          name: storedName || res.data.user.name,
          avatar: storedAvatar,
        });
      } else {
        clearAuth();
      }
    } catch {
      clearAuth();
    } finally {
      setLoading(false);
    }
  }, [token, clearAuth]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('aegis_token', newToken);
    const storedAvatar = localStorage.getItem('aegis_user_avatar') || '/default_avatar.png';
    const storedName = localStorage.getItem('aegis_user_name');
    const mergedUser = {
      ...userData,
      name: storedName || userData.name,
      avatar: storedAvatar,
    };
    setToken(newToken);
    setUser(mergedUser);
    return mergedUser;
  };

  const signup = async (name, email, password) => {
    const res = await authService.signup({ name, email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('aegis_token', newToken);
    const storedAvatar = localStorage.getItem('aegis_user_avatar') || '/default_avatar.png';
    const mergedUser = {
      ...userData,
      name: name || userData.name,
      avatar: storedAvatar,
    };
    setToken(newToken);
    setUser(mergedUser);
    return mergedUser;
  };

  const loginWithGoogle = async (googleData = {}) => {
    const res = await authService.googleLogin(googleData);
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('aegis_token', newToken);

    const storedCustomAvatar = localStorage.getItem('aegis_user_avatar');
    const isCustomUploaded = localStorage.getItem('aegis_custom_avatar_uploaded') === 'true';

    // If user previously uploaded a custom profile photo, preserve it
    const finalAvatar = (isCustomUploaded && storedCustomAvatar) ? storedCustomAvatar : (userData.avatar || storedCustomAvatar);

    const finalUser = {
      ...userData,
      avatar: finalAvatar || userData?.avatar,
    };

    if (finalUser?.name) localStorage.setItem('aegis_user_name', finalUser.name);
    if (finalUser?.avatar) localStorage.setItem('aegis_user_avatar', finalUser.avatar);
    if (finalUser?.dob) localStorage.setItem('aegis_user_dob', finalUser.dob);

    setToken(newToken);
    setUser(finalUser);
    return finalUser;
  };

  const updateUser = (updatedFields) => {
    if (updatedFields.name) {
      localStorage.setItem('aegis_user_name', updatedFields.name);
    }
    if (updatedFields.avatar) {
      localStorage.setItem('aegis_user_avatar', updatedFields.avatar);
      localStorage.setItem('aegis_custom_avatar_uploaded', 'true');
    }
    if (updatedFields.dob) {
      localStorage.setItem('aegis_user_dob', updatedFields.dob);
    }
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : prev));
  };

  const logout = () => {
    clearAuth();
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    loginWithGoogle,
    updateUser,
    logout,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;

