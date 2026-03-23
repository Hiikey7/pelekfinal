import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.tsx';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setIsAdmin, setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    // Check admin role separately after auth completes
    const userId = data.user?.id;
    if (!userId) {
      toast.error('Login failed');
      setLoading(false);
      return;
    }

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();

    if (!roleData) {
      toast.error('You do not have admin access');
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    setUser(data.user);
    setIsAdmin(true);
    navigate('/admin');
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
