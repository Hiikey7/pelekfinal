import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.52 3.48A11.87 11.87 0 0 0 12.06 0C5.46 0 .08 5.37.08 11.98c0 2.11.55 4.18 1.6 6L0 24l6.17-1.62a11.97 11.97 0 0 0 5.89 1.5h.01c6.6 0 11.98-5.37 11.98-11.98 0-3.2-1.25-6.2-3.53-8.42ZM12.07 21.86h-.01a9.94 9.94 0 0 1-5.06-1.38l-.36-.21-3.66.96.98-3.56-.23-.37a9.9 9.9 0 0 1-1.52-5.32c0-5.49 4.47-9.96 9.97-9.96a9.9 9.9 0 0 1 7.04 2.92 9.88 9.88 0 0 1 2.91 7.04c0 5.49-4.47 9.96-9.96 9.96Zm5.46-7.45c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.08 4.49.71.31 1.27.49 1.7.63.71.23 1.36.2 1.88.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  );
}

export default function MobileNav() {
  const { settings } = useSiteSettings();

  const whatsappUrl = `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`;

  return (
    <div className="fixed bottom-5 right-4 z-50 md:hidden flex flex-col gap-3">
      <Link
        to="/favorites"
        aria-label="Open wishlist"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-background text-secondary border border-border shadow-lg backdrop-blur-xl hover:bg-muted transition-colors"
      >
        <Heart className="w-5 h-5" />
      </Link>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-accent-foreground shadow-lg hover:opacity-90 transition-opacity"
      >
        <WhatsAppIcon className="w-5 h-5" />
      </a>
    </div>
  );
}
