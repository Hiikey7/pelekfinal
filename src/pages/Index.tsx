import { Link } from 'react-router-dom';
import { Search, Star, ArrowRight, MessageCircle, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import heroBg from '@/assets/hero-bg.jpg';
import { properties, blogPosts, faqs, reviews } from '@/data/mockData';
import PropertyCard from '@/components/PropertyCard';
import { useFavorites } from '@/hooks/useFavorites';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function Index() {
  const { toggleFavorite, isFavorite } = useFavorites();
  const featured = properties.filter(p => p.featured);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <img src={heroBg} alt="Luxury property" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6"
          >
            Find Your Dream <br />
            <span className="text-secondary">Property</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-primary-foreground/80 text-lg md:text-xl mb-8 max-w-2xl mx-auto"
          >
            Luxury Airbnb stays, premium rentals, and properties for sale across Kenya
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="bg-background/95 backdrop-blur-xl rounded-2xl p-4 md:p-6 max-w-3xl mx-auto shadow-card"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">Location</label>
                <input
                  type="text"
                  placeholder="Where to?"
                  className="bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">Type</label>
                <select className="bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary appearance-none">
                  <option>All Types</option>
                  <option>Airbnb</option>
                  <option>Rental</option>
                  <option>For Sale</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">Budget</label>
                <input
                  type="text"
                  placeholder="Max price"
                  className="bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
              <Link
                to="/properties"
                className="bg-secondary text-accent-foreground rounded-lg px-6 py-2.5 text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mt-auto"
              >
                <Search className="w-4 h-4" /> Search
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Featured Properties</h2>
              <p className="text-muted-foreground mt-2">Hand-picked properties for you</p>
            </div>
            <Link to="/properties" className="hidden md:flex items-center gap-1 text-secondary font-medium text-sm hover:underline">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map(p => (
              <PropertyCard key={p.id} property={p} isFavorite={isFavorite(p.id)} onToggleFavorite={toggleFavorite} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link to="/properties" className="inline-flex items-center gap-1 text-secondary font-medium text-sm">
              View All Properties <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Google Reviews */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-4">What Our Clients Say</h2>
          <div className="flex items-center justify-center gap-1 mb-10">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />)}
            <span className="ml-2 font-semibold text-foreground">4.8</span>
            <span className="text-muted-foreground text-sm">from Google Reviews</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {reviews.map(r => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-card rounded-xl p-6 shadow-card flex-shrink-0 w-[280px] md:w-[320px] snap-start"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-semibold text-sm">
                    {r.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground text-sm">{r.name}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-secondary text-secondary" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{r.comment}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Blogs */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Recent Blogs</h2>
              <p className="text-muted-foreground mt-2">Tips, guides, and insights</p>
            </div>
            <Link to="/blog" className="hidden md:flex items-center gap-1 text-secondary font-medium text-sm hover:underline">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map(post => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={post.image} alt={post.title} loading="lazy" width={800} height={600} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <span className="text-xs font-medium text-secondary">{post.category}</span>
                  <h3 className="font-display font-semibold text-card-foreground mt-1 mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{post.date}</span>
                    <Link to={`/blog/${post.id}`} className="text-secondary font-medium hover:underline">Read More</Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-10">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible>
            {faqs.slice(0, 3).map(faq => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left font-medium text-foreground">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="text-center mt-8">
            <Link to="/faq" className="inline-flex items-center gap-1 text-secondary font-medium text-sm hover:underline">
              View All FAQs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 md:py-24 bg-hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Need Help Finding a Property?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">Our team is ready to help you find the perfect property. Get in touch today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="px-8 py-3 bg-background text-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity">
              Contact Us
            </Link>
            <a
              href="https://wa.me/254700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-secondary text-accent-foreground rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
