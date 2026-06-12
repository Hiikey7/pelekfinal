import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.tsx';
import { LayoutDashboard, Home, FileText, Star, Gift, ShoppingCart, LogOut, Menu, X, ListChecks, Receipt, Settings, ExternalLink, PlusCircle, ChevronDown, BarChart3 } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true, roles: ['admin'] },
  { to: '/admin/reviews', icon: Star, label: 'Reviews', roles: ['admin'] },
  { to: '/admin/expenses', icon: Receipt, label: 'Expenses', roles: ['admin'] },
  { to: '/admin/reports', icon: BarChart3, label: 'Reports', roles: ['admin'] },
  { to: '/admin/offers', icon: Gift, label: 'Offers', roles: ['admin'] },
  { to: '/admin/amenities', icon: ListChecks, label: 'Amenities', roles: ['admin'] },
  { to: '/admin/settings', icon: Settings, label: 'Settings', roles: ['admin'] },
];

const ordersNavItem = { to: '/admin/orders', icon: ShoppingCart, label: 'Orders', roles: ['admin'] };

const navGroups = [
  {
    key: 'properties',
    icon: Home,
    label: 'Properties',
    roles: ['admin', 'properties'],
    children: [
      { to: '/admin/properties/new', icon: PlusCircle, label: 'Add New Property', end: true },
      { to: '/admin/properties', icon: ListChecks, label: 'Property List', end: true },
    ],
  },
  {
    key: 'blogs',
    icon: FileText,
    label: 'Blogs',
    roles: ['admin', 'blogs'],
    children: [
      { to: '/admin/blogs/new', icon: PlusCircle, label: 'Create Blog', end: true },
      { to: '/admin/blogs', icon: ListChecks, label: 'Blogs', end: true },
    ],
  },
];

function defaultAdminPath(roles: string[]) {
  if (roles.includes('admin')) return '/admin';
  if (roles.includes('properties')) return '/admin/properties';
  if (roles.includes('blogs')) return '/admin/blogs';
  return '/admin/login';
}

export default function AdminLayout() {
  const { user, isAdmin, roles, loading, signOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    properties: location.pathname.startsWith('/admin/properties'),
    blogs: location.pathname.startsWith('/admin/blogs'),
  });

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const visibleNavItems = navItems.filter((item) =>
    item.roles.some((role) => roles.includes(role)),
  );
  const primaryNavItems = visibleNavItems.filter((item) => item.to === '/admin');
  const secondaryNavItems = visibleNavItems.filter((item) => item.to !== '/admin');
  const showOrdersNavItem = ordersNavItem.roles.some((role) => roles.includes(role));
  const visibleNavGroups = navGroups.filter((group) =>
    group.roles.some((role) => roles.includes(role)),
  );
  const propertiesNavGroup = visibleNavGroups.find((group) => group.key === 'properties');
  const blogsNavGroup = visibleNavGroups.find((group) => group.key === 'blogs');

  const isActive = (path: string, end?: boolean) =>
    end ? location.pathname === path : location.pathname === path || location.pathname.startsWith(`${path}/`);

  const childNavItems = navGroups.flatMap((group) =>
    group.children.map((child) => ({ ...child, roles: group.roles })),
  );
  const currentItem = [...navItems, ordersNavItem, ...childNavItems].find((item) => isActive(item.to, item.end));
  const canAccessRoute =
    !currentItem || currentItem.roles.some((role) => roles.includes(role));

  if (!canAccessRoute) {
    return <Navigate to={defaultAdminPath(roles)} replace />;
  }

  const renderNavGroup = (group: (typeof navGroups)[number]) => {
    const groupActive = group.children.some(item => isActive(item.to, item.end));
    const isOpen = openGroups[group.key] ?? groupActive;

    return (
      <div key={group.key} className="space-y-1">
        <button
          type="button"
          onClick={() => setOpenGroups((current) => ({ ...current, [group.key]: !isOpen }))}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full ${
            groupActive ? 'bg-secondary/10 text-secondary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <group.icon className="w-4 h-4" />
          <span className="flex-1 text-left">{group.label}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="ml-4 border-l border-border pl-2 space-y-1">
            {group.children.map(item => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.to, item.end) ? 'bg-secondary/10 text-secondary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  const OrdersIcon = ordersNavItem.icon;

  return (
    <div className="min-h-screen flex bg-muted">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-card border-r border-border flex flex-col transition-transform md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-border">
          <Link to="/" className="font-display text-lg font-bold text-gradient">Pelek Properties</Link>
          <p className="text-xs text-muted-foreground mt-1">Admin Dashboard</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {primaryNavItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.to, item.end) ? 'bg-secondary/10 text-secondary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
          {propertiesNavGroup && renderNavGroup(propertiesNavGroup)}
          {showOrdersNavItem && (
            <Link
              to={ordersNavItem.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(ordersNavItem.to) ? 'bg-secondary/10 text-secondary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <OrdersIcon className="w-4 h-4" />
              {ordersNavItem.label}
            </Link>
          )}
          {blogsNavGroup && renderNavGroup(blogsNavGroup)}
          {secondaryNavItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.to, item.end) ? 'bg-secondary/10 text-secondary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-2 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground w-full transition-colors"
          >
            <ExternalLink className="w-4 h-4" /> View Website
          </Link>
          <button onClick={signOut} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground w-full transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className="h-14 flex items-center px-4 border-b border-border bg-card md:hidden">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-muted text-foreground">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="ml-3 font-display font-semibold text-foreground">Admin</span>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
