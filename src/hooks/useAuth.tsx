import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { backend } from '@/integrations/backend/client';
import type { NeonUser } from '@/integrations/backend/client';

interface AuthContextType {
  user: NeonUser | null;
  isAdmin: boolean;
  roles: string[];
  loading: boolean;
  setIsAdmin: (v: boolean) => void;
  setUser: (u: NeonUser | null) => void;
  hasRole: (role: string) => boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<NeonUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const userRoles = (u: NeonUser | null) =>
    u?.app_metadata?.roles ?? (u?.app_metadata?.role === 'admin' ? ['admin'] : []);
  const canAccessAdmin = (u: NeonUser | null) => {
    const roles = userRoles(u);
    return u?.app_metadata?.role === 'admin' || roles.length > 0;
  };

  useEffect(() => {
    backend.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      setIsAdmin(canAccessAdmin(u));
      setLoading(false);
    });

    const { data: { subscription } } = backend.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (!u) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      setIsAdmin(canAccessAdmin(u));
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await backend.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  const roles = userRoles(user);
  const hasRole = (role: string) =>
    roles.includes('admin') || roles.includes(role);

  return (
    <AuthContext.Provider value={{ user, isAdmin, roles, loading, setIsAdmin, setUser, hasRole, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
