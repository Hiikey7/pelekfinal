import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Heart, MapPin, MessageCircle, Bed, Bath, Users, ArrowLeft, ExternalLink, Instagram } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Tables } from '@/integrations/supabase/types';

type Property = Tables<'properties'>;

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.16z"/>
  </svg>
);

export default function PropertyDetail() {
  const { id } = useParams();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { settings } = useSiteSettings();
  const [activeImage, setActiveImage] = useState(0);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      const { data } = await supabase.from('properties').select('*').eq('id', id).single();
      setProperty(data);
      setLoading(false);
    };
    fetchProperty();
  }, [id]);

  if (loading) {
    return <div className="pt-20 pb-24 container mx-auto px-4 text-center"><p className="text-muted-foreground py-20">Loading...</p></div>;
  }

  if (!property) {
    return (
      <div className="pt-20 pb-24 container mx-auto px-4 text-center">
        <p className="text-muted-foreground py-20">Property not found.</p>
        <Link to="/properties" className="text-secondary hover:underline">Back to Properties</Link>
      </div>
    );
  }

  const whatsappUrl = `https://wa.me/${property.whatsapp.replace('+', '')}?text=${encodeURIComponent(`Hi, I'm interested in "${property.title}" at ${property.location}. Is it available?`)}`;
  const mapUrl = property.google_map_link || `https://www.google.com/maps?q=${property.lat},${property.lng}`;
  const directionsUrl = property.google_map_link || `https://www.google.com/maps/dir/?api=1&destination=${property.lat},${property.lng}`;

  return (
    <div className="pt-20 pb-24 md:pb-12">
      <div className="container mx-auto px-4">
        <Link to="/properties" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Properties
        </Link>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden mb-4">
          <img src={property.images[activeImage] || property.image} alt={property.title} className="w-full h-full object-cover" />
        </motion.div>

        <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {property.images.map((img, i) => (
            <button key={i} onClick={() => setActiveImage(i)}
              className={`flex-shrink-0 w-24 h-20 md:w-32 md:h-24 rounded-xl overflow-hidden border-2 transition-colors ${activeImage === i ? 'border-secondary' : 'border-transparent opacity-70 hover:opacity-100'}`}>
              <img src={img} alt="" loading="lazy" className="w-full h-full object-cover" />
            </button>
          ))}
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
              <button onClick={() => toggleFavorite(property.id)} className="p-3 rounded-xl border border-border hover:bg-muted transition-colors">
                <Heart className={`w-5 h-5 ${isFavorite(property.id) ? 'fill-secondary text-secondary' : 'text-foreground'}`} />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
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

            <h2 className="font-display text-lg font-semibold text-foreground mb-3">Location</h2>
            <div className="rounded-xl overflow-hidden mb-4 aspect-[16/9]">
              <iframe title="Property Location" src={`https://www.google.com/maps?q=${property.lat},${property.lng}&z=14&output=embed`} className="w-full h-full border-0" loading="lazy" />
            </div>
            <div className="flex items-center gap-4">
              <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-secondary text-sm font-medium hover:underline">
                <ExternalLink className="w-4 h-4" /> Get Directions
              </a>
              {property.google_map_link && (
                <a href={property.google_map_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-secondary text-sm font-medium hover:underline">
                  <MapPin className="w-4 h-4" /> View on Google Maps
                </a>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl p-6 shadow-card sticky top-24 space-y-3">
              <div className="text-2xl font-display font-bold text-secondary mb-1">{property.price_label}</div>
              <p className="text-sm text-muted-foreground mb-6">{property.type} · {property.location}</p>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-secondary text-accent-foreground rounded-xl py-3 font-semibold hover:opacity-90 transition-opacity">
                <MessageCircle className="w-5 h-5" /> Book via WhatsApp
              </a>
              <Link to="/contact" className="w-full flex items-center justify-center gap-2 border border-border rounded-xl py-3 text-foreground font-medium hover:bg-muted transition-colors">
                Contact Us
              </Link>

              {property.social_media_type && property.social_media_url && (
                <a href={property.social_media_url} target="_blank" rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 border border-border rounded-xl py-3 text-foreground font-medium hover:bg-muted transition-colors">
                  {property.social_media_type === 'instagram' ? <Instagram className="w-5 h-5" /> : <TikTokIcon />}
                  View on {property.social_media_type === 'instagram' ? 'Instagram' : 'TikTok'}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}