import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Tables } from '@/integrations/backend/types';

type Property = Tables<'properties'>;

interface Props {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  airbnb: 'bg-secondary/10 text-secondary',
  rental: 'bg-primary/10 text-primary',
  sale: 'bg-destructive/10 text-destructive',
};

export default function PropertyCard({ property, isFavorite, onToggleFavorite }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={property.image}
          alt={property.title}
          loading="lazy"
          decoding="async"
          width={800}
          height={600}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${categoryColors[property.category] || ''}`}>
            {property.category === 'sale' ? 'For Sale' : property.category}
          </span>
        </div>
        <button
          onClick={(e) => { e.preventDefault(); onToggleFavorite(property.id); }}
          className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-secondary text-secondary' : 'text-foreground'}`} />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
          <MapPin className="w-3.5 h-3.5" />
          <span>{property.location}</span>
        </div>
        <h3 className="font-display font-semibold text-card-foreground mb-2 line-clamp-1">{property.title}</h3>
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
          <span className="text-sm font-medium text-card-foreground">{property.rating}</span>
          <span className="text-xs text-muted-foreground">({property.reviews_count})</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-secondary">{property.price_label}</span>
          <div className="flex gap-2">
            <a
              href={`https://wa.me/${property.whatsapp.replace('+', '')}?text=Hi, I'm interested in ${property.title}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            <Link
              to={`/property/${property.id}`}
              className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
