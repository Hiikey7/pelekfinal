import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Home, FileText, Star, Gift, ShoppingCart, TrendingUp, Eye, Heart, DollarSign, Receipt } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

interface Stats {
  properties: number;
  blogs: number;
  reviews: number;
  offers: number;
  orders: number;
  expenses: number;
}

interface Order {
  id: string;
  property_title: string;
  total_amount: number;
  created_at: string;
  payment_method: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ properties: 0, blogs: 0, reviews: 0, offers: 0, orders: 0, expenses: 0 });
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      const [p, b, r, o, ord, exp] = await Promise.all([
        supabase.from('properties').select('id', { count: 'exact', head: true }),
        supabase.from('blogs').select('id', { count: 'exact', head: true }),
        supabase.from('reviews').select('id', { count: 'exact', head: true }),
        supabase.from('offers').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase.from('expenses').select('id', { count: 'exact', head: true }),
      ]);
      setStats({
        properties: p.count ?? 0,
        blogs: b.count ?? 0,
        reviews: r.count ?? 0,
        offers: o.count ?? 0,
        orders: ord.count ?? 0,
        expenses: exp.count ?? 0,
      });

      const { data: orderData } = await supabase.from('orders').select('id, property_title, total_amount, created_at, payment_method').order('created_at', { ascending: false }).limit(100);
      if (orderData) setOrders(orderData as Order[]);
    };
    fetchAll();
  }, []);

  const totalEarnings = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);

  // Earnings by month
  const earningsByMonth: Record<string, number> = {};
  orders.forEach(o => {
    const month = new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    earningsByMonth[month] = (earningsByMonth[month] || 0) + Number(o.total_amount);
  });
  const earningsData = Object.entries(earningsByMonth).reverse().map(([month, amount]) => ({ month, amount }));

  // Most booked properties
  const propertyBookings: Record<string, number> = {};
  orders.forEach(o => {
    propertyBookings[o.property_title] = (propertyBookings[o.property_title] || 0) + 1;
  });
  const topProperties = Object.entries(propertyBookings)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, bookings]) => ({ name: name.length > 20 ? name.slice(0, 20) + '…' : name, bookings }));

  // Payment methods distribution
  const paymentDist: Record<string, number> = {};
  orders.forEach(o => {
    paymentDist[o.payment_method] = (paymentDist[o.payment_method] || 0) + 1;
  });
  const paymentData = Object.entries(paymentDist).map(([name, value]) => ({ name, value }));
  const COLORS = ['hsl(175, 94%, 40%)', 'hsl(168, 100%, 10%)', 'hsl(0, 84%, 60%)', 'hsl(45, 93%, 47%)'];

  const summaryCards = [
    { label: 'Properties', count: stats.properties, icon: Home },
    { label: 'Orders', count: stats.orders, icon: ShoppingCart },
    { label: 'Blogs', count: stats.blogs, icon: FileText },
    { label: 'Reviews', count: stats.reviews, icon: Star },
    { label: 'Offers', count: stats.offers, icon: Gift },
    { label: 'Expenses', count: stats.expenses, icon: Receipt },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {summaryCards.map(c => (
          <div key={c.label} className="bg-card rounded-xl p-5 shadow-card">
            <c.icon className="w-6 h-6 text-secondary mb-3" />
            <p className="text-2xl font-bold text-foreground">{c.count}</p>
            <p className="text-sm text-muted-foreground">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Earnings highlight */}
      <div className="bg-hero-gradient rounded-xl p-6 text-primary-foreground">
        <div className="flex items-center gap-3 mb-1">
          <DollarSign className="w-6 h-6" />
          <span className="text-sm font-medium opacity-80">Total Earnings</span>
        </div>
        <p className="text-3xl font-bold">KES {totalEarnings.toLocaleString()}</p>
        <p className="text-sm opacity-70 mt-1">{orders.length} total orders recorded</p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings over time */}
        <div className="bg-card rounded-xl p-5 shadow-card">
          <h3 className="font-display text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-secondary" /> Earnings Over Time
          </h3>
          {earningsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(168, 10%, 90%)" />
                <XAxis dataKey="month" fontSize={12} tick={{ fill: 'hsl(168, 10%, 40%)' }} />
                <YAxis fontSize={12} tick={{ fill: 'hsl(168, 10%, 40%)' }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [`KES ${v.toLocaleString()}`, 'Earnings']} />
                <Line type="monotone" dataKey="amount" stroke="hsl(175, 94%, 40%)" strokeWidth={2} dot={{ fill: 'hsl(175, 94%, 40%)' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-12">No order data yet</p>
          )}
        </div>

        {/* Most booked */}
        <div className="bg-card rounded-xl p-5 shadow-card">
          <h3 className="font-display text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Eye className="w-4 h-4 text-secondary" /> Most Booked Properties
          </h3>
          {topProperties.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topProperties} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(168, 10%, 90%)" />
                <XAxis type="number" fontSize={12} tick={{ fill: 'hsl(168, 10%, 40%)' }} />
                <YAxis dataKey="name" type="category" width={120} fontSize={11} tick={{ fill: 'hsl(168, 10%, 40%)' }} />
                <Tooltip />
                <Bar dataKey="bookings" fill="hsl(175, 94%, 40%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-12">No order data yet</p>
          )}
        </div>

        {/* Payment methods */}
        <div className="bg-card rounded-xl p-5 shadow-card">
          <h3 className="font-display text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Heart className="w-4 h-4 text-secondary" /> Payment Methods
          </h3>
          {paymentData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={paymentData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={12}>
                  {paymentData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-12">No order data yet</p>
          )}
        </div>

        {/* Recent orders */}
        <div className="bg-card rounded-xl p-5 shadow-card">
          <h3 className="font-display text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-secondary" /> Recent Orders
          </h3>
          <div className="space-y-3 max-h-[250px] overflow-y-auto">
            {orders.slice(0, 8).map(o => (
              <div key={o.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{o.property_title}</p>
                  <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</p>
                </div>
                <span className="text-sm font-semibold text-foreground">KES {Number(o.total_amount).toLocaleString()}</span>
              </div>
            ))}
            {orders.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">No orders yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
