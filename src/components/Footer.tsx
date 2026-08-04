import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function Footer() {
  const { settings } = useSiteSettings();

  return (
    <footer className="bg-primary text-primary-foreground pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-display text-xl font-bold mb-4">
              Pelek Properties
            </h3>
            <p className="text-sm opacity-80 leading-relaxed">
              Your trusted partner for luxury Airbnb stays, rentals, and
              property sales across Kenya.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3 mt-4">
              {settings.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-80 hover:opacity-100 transition-opacity"
                  aria-label="Facebook"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}
              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-80 hover:opacity-100 transition-opacity"
                  aria-label="Instagram"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              )}
              {settings.tiktok && (
                <a
                  href={settings.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-80 hover:opacity-100 transition-opacity"
                  aria-label="TikTok"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.75a8.18 8.18 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.18z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm opacity-80">
              <Link
                to="/properties"
                className="hover:opacity-100 transition-opacity"
              >
                Properties
              </Link>
              <Link to="/blog" className="hover:opacity-100 transition-opacity">
                Blog
              </Link>
              <Link to="/faq" className="hover:opacity-100 transition-opacity">
                FAQ
              </Link>
              <Link
                to="/contact"
                className="hover:opacity-100 transition-opacity"
              >
                Contact
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-4">Categories</h4>
            <div className="flex flex-col gap-2 text-sm opacity-80">
              <Link
                to="/properties?category=airbnb"
                className="hover:opacity-100 transition-opacity"
              >
                Airbnb Stays
              </Link>
              <Link
                to="/properties?category=rental"
                className="hover:opacity-100 transition-opacity"
              >
                Rentals
              </Link>
              <Link
                to="/properties?category=sale"
                className="hover:opacity-100 transition-opacity"
              >
                For Sale
              </Link>
              <Link
                to="/properties?category=commercial_spaces"
                className="hover:opacity-100 transition-opacity"
              >
                Commercial spaces
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-4">Contact</h4>
            <div className="flex flex-col gap-3 text-sm opacity-80">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Nairobi, Kenya
              </div>
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`}
                className="flex items-center gap-2 hover:opacity-100 transition-opacity"
              >
                <Phone className="w-4 h-4" /> {settings.whatsapp}
              </a>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> info@pelekproperties.co.ke
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-60 flex flex-col sm:flex-row items-center justify-center gap-2">
          <span>
            © {new Date().getFullYear()} Pelek Properties. All rights reserved.
          </span>
          <span className="hidden sm:inline">·</span>
          <Link
            to="/terms"
            className="hover:opacity-100 transition-opacity underline"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
