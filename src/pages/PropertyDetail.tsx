import { useParams, Link } from 'react-router-dom';
import { properties } from '@/data/mockData';
import { Heart, Star, MapPin, MessageCircle, Bed, Bath, Users, ArrowLeft, ExternalLink } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function PropertyDetail() {
  const { id } = useParams();
  const property = properties.find(p => p.id === id);
  const { toggleFavorite, isFavorite } = useFavorites();
  const [activeImage, setActiveImage] = useState(0);

  if (!property) {
    return (
      <div className="pt-20 pb-24 container mx-auto px-4 text-center">
        <p className="text-muted-foreground py-20">Property not found.</p>
        <Link to="/properties" className="text-secondary hover:underline">Back to Properties</Link>
      </div>
    );
  }

  const whatsappUrl = `https://wa.me/${property.whatsapp.replace('+', '')}?text=${encodeURIComponent(`Hi, I'm interested in "${property.title}" at ${property.location}. Is it available?`)}`;

  return (
    <div className="pt-20 pb-24 md:pb-12">
      <div className="container mx-auto px-4">
        <Link to="/properties" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Properties
        </Link>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-[4/3] rounded-2xl overflow-hidden"
          >
            <img src={property.images[activeImage]} alt={property.title} className="w-full h-full object-cover" />
          </motion.div>
          <div className="grid grid-cols-2 gap-4">
            {property.images.slice(0, 4).map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`aspect-[4/3] rounded-xl overflow-hidden border-2 transition-colors ${activeImage === i ? 'border-secondary' : 'border-transparent'}`}
              >
                <img src={img} alt="" loading="lazy" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">{property.title}</h1>
                <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" /> {property.location}
                </div>
              </div>
              <button
                onClick={() => toggleFavorite(property.id)}
                className="p-3 rounded-xl border border-border hover:bg-muted transition-colors"
              >
                <Heart className={`w-5 h-5 ${isFavorite(property.id) ? 'fill-secondary text-secondary' : 'text-foreground'}`} />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-secondary text-secondary" />
                <span className="font-semibold text-foreground">{property.rating}</span>
                <span className="text-sm text-muted-foreground">({property.reviews} reviews)</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-semibold capitalize">
                {property.category === 'sale' ? 'For Sale' : property.category}
              </span>
            </div>

            <div className="flex gap-6 mb-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-1"><Bed className="w-4 h-4" /> {property.bedrooms} Bedrooms</div>
              <div className="flex items-center gap-1"><Bath className="w-4 h-4" /> {property.bathrooms} Bathrooms</div>
              {property.guests && <div className="flex items-center gap-1"><Users className="w-4 h-4" /> {property.guests} Guests</div>}
            </div>

            <h2 className="font-display text-lg font-semibold text-foreground mb-3">About this property</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">{property.description}</p>

            <h2 className="font-display text-lg font-semibold text-foreground mb-3">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {property.amenities.map(a => (
                <div key={a} className="px-4 py-2.5 rounded-lg bg-muted text-sm text-foreground">{a}</div>
              ))}
            </div>

            {/* Map */}
            <h2 className="font-display text-lg font-semibold text-foreground mb-3">Location</h2>
            <div className="rounded-xl overflow-hidden mb-4 aspect-[16/9]">
              <iframe
                title="Property Location"
                src={`https://www.google.com/maps?q=${property.lat},${property.lng}&z=14&output=embed`}
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${property.lat},${property.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-secondary text-sm font-medium hover:underline"
            >
              <ExternalLink className="w-4 h-4" /> Get Directions
            </a>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl p-6 shadow-card sticky top-24">
              <div className="text-2xl font-display font-bold text-secondary mb-1">{property.priceLabel}</div>
              <p className="text-sm text-muted-foreground mb-6">{property.type} · {property.location}</p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-secondary text-accent-foreground rounded-xl py-3 font-semibold hover:opacity-90 transition-opacity mb-3"
              >
                <MessageCircle className="w-5 h-5" /> Book via WhatsApp
              </a>
              <Link
                to="/contact"
                className="w-full flex items-center justify-center gap-2 border border-border rounded-xl py-3 text-foreground font-medium hover:bg-muted transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
