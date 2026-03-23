import { Link, useLocation } from 'react-router-dom';
import { Heart, Home, MessageCircle } from 'lucide-react';

const items = [
  { to: '/favorites', icon: Heart, label: 'Wishlist' },
  { to: '/properties', icon: Home, label: 'Properties', center: true },
  { to: 'https://wa.me/254700000000', icon: MessageCircle, label: 'WhatsApp', external: true },
];

export default function MobileNav() {
  const location = useLocation();

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
      <div className="flex items-center justify-around h-16 bg-background/95 backdrop-blur-xl border border-border rounded-full shadow-lg">
        {items.map((item) => {
          const isActive = !item.external && location.pathname === item.to;
          const Icon = item.icon;

          if (item.external) {
            return (
              <a
                key={item.label}
                href={item.to}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center text-secondary"
              >
                <Icon className="w-5 h-5" />
              </a>
            );
          }

          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex items-center justify-center transition-colors ${
                item.center
                  ? 'relative -mt-5 bg-secondary rounded-full p-3 text-accent-foreground shadow-lg'
                  : isActive
                  ? 'text-secondary'
                  : 'text-muted-foreground'
              }`}
            >
              <Icon className={item.center ? 'w-6 h-6' : 'w-5 h-5'} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}