'use client';

import { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { fetchMe, login as loginRequest, logout as logoutRequest } from '@/lib/admin/api';

const AuthContext = createContext(null);

// The session cookies are httpOnly, so JS can't see them. This flag records
// that an admin signed in on this browser, so logged-out visitors don't fire a
// pointless GET /auth/me (which always answers 401 and shows as a console error).
const SESSION_HINT = 'amrooz_admin_session';
const hint = {
  get() {
    try { return window.localStorage.getItem(SESSION_HINT) === '1'; } catch { return true; }
  },
  set() {
    try { window.localStorage.setItem(SESSION_HINT, '1'); } catch {}
  },
  clear() {
    try { window.localStorage.removeItem(SESSION_HINT); } catch {}
  },
};

/** Holds the current admin session for everything under /admin. */
export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        if (!hint.get()) {
          if (active) setAdmin(null);
          return;
        }
        const me = await fetchMe();
        if (!me) hint.clear();
        if (active) setAdmin(me);
      } catch {
        if (active) setAdmin(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const me = await loginRequest(email, password);
    hint.set();
    setAdmin(me);
    return me;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      hint.clear();
      setAdmin(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
