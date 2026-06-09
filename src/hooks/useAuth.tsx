import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { backend } from '@/integrations/backend/client';
import type { NeonUser } from '@/integrations/backend/client';

interface AuthContextType {
  user: NeonUser | null;
  isAdmin: boolean;
  loading: boolean;
  setIsAdmin: (v: boolean) => void;
  setUser: (u: NeonUser | null) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<NeonUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    backend.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      setIsAdmin(u?.app_metadata?.role === 'admin');
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
      setIsAdmin(u.app_metadata?.role === 'admin');
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await backend.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, setIsAdmin, setUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
