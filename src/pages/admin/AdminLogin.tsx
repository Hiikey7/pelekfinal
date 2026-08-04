import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.tsx';
import { backend } from '@/integrations/backend/client';
import { toast } from 'sonner';

function defaultAdminPath(roles: string[] = []) {
  if (roles.includes('admin')) return '/admin';
  if (roles.includes('properties')) return '/admin/properties';
  if (roles.includes('blogs')) return '/admin/blogs';
  return '/admin/login';
}

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setIsAdmin, setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { data, error } = await backend.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    const roles = data.user?.app_metadata?.roles ?? [];
    if (!data.user || (!roles.length && data.user.app_metadata?.role !== 'admin')) {
      toast.error('Login failed');
      setLoading(false);
      return;
    }

    setUser(data.user);
    setIsAdmin(true);
    navigate(defaultAdminPath(roles));
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <div className="bg-card rounded-2xl shadow-card p-8 w-full max-w-sm">
        <h1 className="font-display text-2xl font-bold text-foreground text-center mb-2">Admin Login</h1>
        <p className="text-muted-foreground text-sm text-center mb-6">Pelek Properties Dashboard</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-muted rounded-lg px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-muted rounded-lg px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary text-accent-foreground rounded-lg py-3 font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
