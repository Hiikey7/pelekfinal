import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { properties } from '@/data/mockData';
import PropertyCard from '@/components/PropertyCard';
import { useFavorites } from '@/hooks/useFavorites';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function Properties() {
  const [searchParams] = useSearchParams();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [sort, setSort] = useState('popular');

  const filtered = useMemo(() => {
    let result = properties;
    if (category !== 'all') result = result.filter(p => p.category === category);
    if (search) result = result.filter(p =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase())
    );
    if (sort === 'price-low') result = [...result].sort((a, b) => a.price - b.price);
    if (sort === 'price-high') result = [...result].sort((a, b) => b.price - a.price);
    if (sort === 'rating') result = [...result].sort((a, b) => b.rating - a.rating);
    return result;
  }, [category, search, sort]);

  return (
    <div className="pt-20 pb-24 md:pb-12">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">All Properties</h1>
        <p className="text-muted-foreground mb-8">Browse Airbnb stays, rentals, and properties for sale</p>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary"
            >
              <option value="all">All Categories</option>
              <option value="airbnb">Airbnb</option>
              <option value="rental">Rental</option>
              <option value="sale">For Sale</option>
            </select>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary"
            >
              <option value="popular">Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No properties found matching your criteria.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(p => (
              <PropertyCard key={p.id} property={p} isFavorite={isFavorite(p.id)} onToggleFavorite={toggleFavorite} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
