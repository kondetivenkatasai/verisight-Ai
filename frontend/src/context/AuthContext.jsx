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
        setUser(res.data.user);
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
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const signup = async (name, email, password) => {
    const res = await authService.signup({ name, email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('aegis_token', newToken);
    setToken(newToken);
    setUser(userData);
    return userData;
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
