import { Link, useLocation } from 'react-router-dom';
import { Heart, Home, MessageCircle } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export default function MobileNav() {
  const location = useLocation();
  const { settings } = useSiteSettings();

  const whatsappUrl = `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`;

  const items = [
    { to: '/favorites', icon: Heart, label: 'Wishlist' },
    { to: '/properties', icon: Home, label: 'Properties', center: true },
    { to: whatsappUrl, icon: MessageCircle, label: 'WhatsApp', external: true },
  ];

  return (
    <div className="fixed bottom-3 left-6 right-6 z-50 md:hidden">
      <div className="flex items-center justify-around h-12 bg-background/95 backdrop-blur-xl border border-border rounded-full shadow-lg">
        {items.map((item) => {
          const isActive = !('external' in item) && location.pathname === item.to;
          const Icon = item.icon;

          if ('external' in item && item.external) {
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
