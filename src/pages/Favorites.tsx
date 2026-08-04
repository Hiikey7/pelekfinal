import { useEffect, useState } from 'react';
import { backend } from '@/integrations/backend/client';
import PropertyCard from '@/components/PropertyCard';
import { useFavorites } from '@/hooks/useFavorites';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Tables } from '@/integrations/backend/types';

type Property = Tables<'properties'>;

export default function Favorites() {
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const fetch = async () => {
      if (favorites.length === 0) { setProperties([]); return; }
      const { data } = await backend.from('properties').select('*').in('id', favorites);
      if (data) setProperties(data);
    };
    fetch();
  }, [favorites]);

  return (
    <div className="pt-20 pb-24 md:pb-12">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">Your Favourites</h1>
        <p className="text-muted-foreground mb-10">Properties you've saved</p>

        {properties.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No favourites yet. Start exploring properties!</p>
            <Link to="/properties" className="text-secondary font-medium hover:underline">Browse Properties</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(p => (
              <PropertyCard key={p.id} property={p} isFavorite={isFavorite(p.id)} onToggleFavorite={toggleFavorite} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}