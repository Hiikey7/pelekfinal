import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Home, FileText, HelpCircle, Star, Gift, Mail } from 'lucide-react';

interface Stats {
  properties: number;
  blogs: number;
  faqs: number;
  reviews: number;
  offers: number;
  messages: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ properties: 0, blogs: 0, faqs: 0, reviews: 0, offers: 0, messages: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [p, b, f, r, o, m] = await Promise.all([
        supabase.from('properties').select('id', { count: 'exact', head: true }),
        supabase.from('blogs').select('id', { count: 'exact', head: true }),
        supabase.from('faqs').select('id', { count: 'exact', head: true }),
        supabase.from('reviews').select('id', { count: 'exact', head: true }),
        supabase.from('offers').select('id', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
      ]);
      setStats({
        properties: p.count ?? 0,
        blogs: b.count ?? 0,
        faqs: f.count ?? 0,
        reviews: r.count ?? 0,
        offers: o.count ?? 0,
        messages: m.count ?? 0,
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Properties', count: stats.properties, icon: Home, color: 'text-secondary' },
    { label: 'Blogs', count: stats.blogs, icon: FileText, color: 'text-secondary' },
    { label: 'FAQs', count: stats.faqs, icon: HelpCircle, color: 'text-secondary' },
    { label: 'Reviews', count: stats.reviews, icon: Star, color: 'text-secondary' },
    { label: 'Offers', count: stats.offers, icon: Gift, color: 'text-secondary' },
    { label: 'Messages', count: stats.messages, icon: Mail, color: 'text-secondary' },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map(c => (
          <div key={c.label} className="bg-card rounded-xl p-5 shadow-card">
            <c.icon className={`w-6 h-6 ${c.color} mb-3`} />
            <p className="text-2xl font-bold text-foreground">{c.count}</p>
            <p className="text-sm text-muted-foreground">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
