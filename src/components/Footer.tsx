import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pb-20 md:pb-0">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-display text-xl font-bold mb-4">Pelek Properties</h3>
            <p className="text-sm opacity-80 leading-relaxed">
              Your trusted partner for luxury Airbnb stays, rentals, and property sales across Kenya.
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm opacity-80">
              <Link to="/properties" className="hover:opacity-100 transition-opacity">Properties</Link>
              <Link to="/blog" className="hover:opacity-100 transition-opacity">Blog</Link>
              <Link to="/faq" className="hover:opacity-100 transition-opacity">FAQ</Link>
              <Link to="/contact" className="hover:opacity-100 transition-opacity">Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-4">Categories</h4>
            <div className="flex flex-col gap-2 text-sm opacity-80">
              <Link to="/properties?category=airbnb" className="hover:opacity-100 transition-opacity">Airbnb Stays</Link>
              <Link to="/properties?category=rental" className="hover:opacity-100 transition-opacity">Rentals</Link>
              <Link to="/properties?category=sale" className="hover:opacity-100 transition-opacity">For Sale</Link>
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold mb-4">Contact</h4>
            <div className="flex flex-col gap-3 text-sm opacity-80">
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Nairobi, Kenya</div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> +254 700 000 000</div>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@pelekproperties.com</div>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-60">
          © {new Date().getFullYear()} Pelek Properties. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
