import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Heart,
  MapPin,
  MessageCircle,
  Bed,
  Bath,
  Users,
  ArrowLeft,
  ExternalLink,
  Instagram,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { PropertyDetailSkeleton } from "@/components/loading-skeletons";
import PageSEO from "@/components/PageSEO";
import {
  fetchOtherProperties,
  fetchProperty,
  publicQueryOptions,
} from "@/lib/public-queries";

const categoryLabels: Record<string, string> = {
  airbnb: "Airbnb",
  rental: "Rental",
  sale: "For Sale",
  commercial_spaces: "Commercial spaces",
};

const categoryColors: Record<string, string> = {
  airbnb: "bg-secondary/10 text-secondary",
  rental: "bg-primary/10 text-primary",
  sale: "bg-destructive/10 text-destructive",
  commercial_spaces: "bg-amber-500/10 text-amber-700",
};

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.16z" />
  </svg>
);

export default function PropertyDetail() {
  const { id } = useParams();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { settings } = useSiteSettings();
  const [activeImage, setActiveImage] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const { data: property = null, isLoading: loading } = useQuery({
    queryKey: ["property", id],
    queryFn: () => fetchProperty(id || ""),
    enabled: !!id,
    ...publicQueryOptions,
  });
  const { data: otherProperties = [] } = useQuery({
    queryKey: ["properties", "other", id],
    queryFn: () => fetchOtherProperties(id || ""),
    enabled: !!id,
    ...publicQueryOptions,
  });

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 350;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return <PropertyDetailSkeleton />;
  }

  if (!property) {
    return (
      <div className="pt-20 pb-24 container mx-auto px-4 text-center">
        <p className="text-muted-foreground py-20">Property not found.</p>
        <Link to="/properties" className="text-secondary hover:underline">
          Back to Properties
        </Link>
      </div>
    );
  }

  const whatsappNumber = settings.whatsapp || property.whatsapp;
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi, I'm interested in "${property.title}" at ${property.location}. Is it available?`)}`;
  const directionsUrl =
    property.google_map_link ||
    `https://www.google.com/maps/dir/?api=1&destination=${property.lat},${property.lng}`;

  return (
    <div className="pt-20 pb-24 md:pb-12">
      <PageSEO
        title={`${property.title} in ${property.location} | Pelek Properties`}
        description={`${property.price_label} ${categoryLabels[property.category] || property.category} property in ${property.location}. View photos, amenities, location, and booking details from Pelek Properties.`}
        image={property.image}
      />
      <div className="w-[90%] mx-auto">
        <Link
          to="/properties"
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Properties
        </Link>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden mb-4"
        >
          <img
            src={property.images[activeImage] || property.image}
            alt={property.title}
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {property.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(i)}
              className={`flex-shrink-0 w-24 h-20 md:w-32 md:h-24 rounded-xl overflow-hidden border-2 transition-colors ${activeImage === i ? "border-secondary" : "border-transparent opacity-70 hover:opacity-100"}`}
            >
              <img
                src={img}
                alt=""
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 order-1 lg:order-none">
            <div className="bg-card rounded-2xl p-6 shadow-card sticky top-24 space-y-3">
              <div className="text-2xl font-display font-bold text-secondary mb-1">
                {property.price_label}
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                {property.type} · {property.location}
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-secondary text-accent-foreground rounded-xl py-3 font-semibold hover:opacity-90 transition-opacity"
              >
                <MessageCircle className="w-5 h-5" /> Book via WhatsApp
              </a>
              <Link
                to="/contact"
                className="w-full flex items-center justify-center gap-2 border border-border rounded-xl py-3 text-foreground font-medium hover:bg-muted transition-colors"
              >
                Contact Us
              </Link>

              {property.social_media_type && property.social_media_url && (
                <a
                  href={property.social_media_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 border border-border rounded-xl py-3 text-foreground font-medium hover:bg-muted transition-colors"
                >
                  {property.social_media_type === "instagram" ? (
                    <Instagram className="w-5 h-5" />
                  ) : (
                    <TikTokIcon />
                  )}
                  View on{" "}
                  {property.social_media_type === "instagram"
                    ? "Instagram"
                    : "TikTok"}
                </a>
              )}
            </div>
          </div>
          <div className="lg:col-span-2 order-3 lg:order-none">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  {property.title}
                </h1>
                <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" /> {property.location}
                </div>
              </div>
              <button
                onClick={() => toggleFavorite(property.id)}
                className="p-3 rounded-xl border border-border hover:bg-muted transition-colors"
              >
                <Heart
                  className={`w-5 h-5 ${isFavorite(property.id) ? "fill-secondary text-secondary" : "text-foreground"}`}
                />
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${categoryColors[property.category] || "bg-muted text-muted-foreground"}`}>
                {categoryLabels[property.category] || property.category}
              </span>
            </div>

            <div className="flex gap-6 mb-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" /> {property.bedrooms} Bedrooms
              </div>
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" /> {property.bathrooms} Bathrooms
              </div>
              {property.guests && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" /> {property.guests} Guests
                </div>
              )}
            </div>

            <h2 className="font-display text-lg font-semibold text-foreground mb-3">
              About this property
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {property.description}
            </p>

            <h2 className="font-display text-lg font-semibold text-foreground mb-3">
              Amenities
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {property.amenities.map((a) => (
                <div
                  key={a}
                  className="px-4 py-2.5 rounded-lg bg-muted text-sm text-foreground"
                >
                  {a}
                </div>
              ))}
            </div>

            <h2 className="font-display text-lg font-semibold text-foreground mb-3">
              Location
            </h2>
            <div className="rounded-xl overflow-hidden mb-4 aspect-[16/9]">
              <iframe
                title="Property Location"
                src={`https://www.google.com/maps?q=${property.lat},${property.lng}&z=14&output=embed`}
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
            <div className="flex items-center gap-4">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-secondary text-sm font-medium hover:underline"
              >
                <ExternalLink className="w-4 h-4" /> Get Directions
              </a>
              {property.google_map_link && (
                <a
                  href={property.google_map_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-secondary text-sm font-medium hover:underline"
                >
                  <MapPin className="w-4 h-4" /> View on Google Maps
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Similar Properties Carousel */}
        {otherProperties.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-foreground">
                Similar Properties
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => scrollCarousel("left")}
                  className="p-2 rounded-full border border-border hover:bg-muted transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scrollCarousel("right")}
                  className="p-2 rounded-full border border-border hover:bg-muted transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div
              ref={carouselRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-2 px-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {otherProperties.map((prop) => (
                <motion.div
                  key={prop.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex-shrink-0 w-[300px] sm:w-[320px] md:w-[340px] group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
                >
                  <Link to={`/property/${prop.id}`}>
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <img
                        src={prop.image}
                        alt={prop.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                            categoryColors[prop.category] || "bg-muted text-muted-foreground"
                          }`}
                        >
                          {categoryLabels[prop.category] || prop.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{prop.location}</span>
                      </div>
                      <h3 className="font-display font-semibold text-card-foreground mb-2 line-clamp-1">
                        {prop.title}
                      </h3>
                      <div className="flex items-center gap-1 mb-3">
                        <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
                        <span className="text-sm font-medium text-card-foreground">
                          {prop.rating}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({prop.reviews_count})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5" /> {prop.bedrooms}
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="w-3.5 h-3.5" /> {prop.bathrooms}
                        </div>
                        {prop.guests && (
                          <div className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" /> {prop.guests}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-display font-bold text-secondary">
                          {prop.price_label}
                        </span>
                        <span className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium">
                          View Details
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
