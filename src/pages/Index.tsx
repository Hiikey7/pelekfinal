import { Link } from "react-router-dom";
import {
  Search,
  Star,
  ArrowRight,
  MessageCircle,
  Building2,
  Home as HomeIcon,
  BarChart3,
  Key,
  Briefcase,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import heroBg from "@/assets/hero-bg.jpg";
import { backend } from "@/integrations/backend/client";
import PropertyCard from "@/components/PropertyCard";
import { useFavorites } from "@/hooks/useFavorites";
import servicesImg from "@/assets/property-1.jpg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Tables } from "@/integrations/backend/types";

type Property = Tables<"properties">;
type Blog = Tables<"blogs">;
type Review = Tables<"reviews">;

export default function Index() {
  const { toggleFavorite, isFavorite } = useFavorites();
  const [featured, setFeatured] = useState<Property[]>([]);
  const [blogPosts, setBlogPosts] = useState<Blog[]>([]);
  const [activeReview, setActiveReview] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchAll = async () => {
      const [{ data: props }, { data: blogs }, { data: reviewData }] =
        await Promise.all([
          backend
            .from("properties")
            .select("*")
            .eq("featured", true)
            .order("created_at", { ascending: false }),
          backend
            .from("blogs")
            .select("*")
            .eq("show_on_homepage", true)
            .order("created_at", { ascending: false })
            .limit(3),
          backend
            .from("reviews")
            .select("*")
            .order("created_at", { ascending: false }),
        ]);
      if (props) setFeatured(props);
      if (blogs) setBlogPosts(blogs);
      if (reviewData) setReviews(reviewData);
    };
    fetchAll();
  }, []);

  useEffect(() => {
    if (reviews.length === 0) return;
    const timer = setInterval(() => {
      setActiveReview((prev) => (prev + 1) % reviews.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <img
          src={heroBg}
          alt="Luxury property"
          className="absolute inset-0 w-full h-full object-cover object-center"
          width={1920}
          height={1080}
          fetchPriority="high"
          decoding="async"
        />
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
            Luxury Airbnb stays, premium rentals, and properties for sale across
            Kenya
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="bg-background/95 backdrop-blur-xl rounded-xl p-3 md:p-4 max-w-2xl mx-auto shadow-card w-[88%]"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Where to?"
                  className="bg-muted rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Type
                </label>
                <select className="bg-muted rounded-md px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary appearance-none">
                  <option>All Types</option>
                  <option>Airbnb</option>
                  <option>Rental</option>
                  <option>For Sale</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Budget
                </label>
                <input
                  type="text"
                  placeholder="Max price"
                  className="bg-muted rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-secondary"
                />
              </div>
              <Link
                to="/properties"
                className="bg-secondary text-accent-foreground rounded-md px-4 py-2 text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mt-auto min-h-9"
              >
                <Search className="w-4 h-4" /> Search
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Properties */}
      {featured.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  Featured Properties
                </h2>
                <p className="text-muted-foreground mt-2">
                  Hand-picked properties for you
                </p>
              </div>
              <Link
                to="/properties"
                className="hidden md:flex items-center gap-1 text-secondary font-medium text-sm hover:underline"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((p) => (
                <PropertyCard
                  key={p.id}
                  property={p}
                  isFavorite={isFavorite(p.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
            <div className="mt-8 text-center md:hidden">
              <Link
                to="/properties"
                className="inline-flex items-center gap-1 text-secondary font-medium text-sm"
              >
                View All Properties <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center max-w-5xl mx-auto">
            {/* Image Column */}
            <div className="w-full md:w-1/2">
              <img
                src={servicesImg}
                alt="Our Services"
                className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-card"
                width={800}
                height={600}
                loading="lazy"
                decoding="async"
              />
            </div>
            {/* Content Column */}
            <div className="w-full md:w-1/2">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
                Our Services
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Comprehensive property solutions tailored to your needs. From
                management to sales, we've got you covered.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-foreground">
                  <Building2 className="w-5 h-5 text-secondary flex-shrink-0" />
                  Property Management
                </li>
                <li className="flex items-center gap-3 text-foreground">
                  <HomeIcon className="w-5 h-5 text-secondary flex-shrink-0" />
                  Real Estate Sales
                </li>
                <li className="flex items-center gap-3 text-foreground">
                  <BarChart3 className="w-5 h-5 text-secondary flex-shrink-0" />
                  Property Valuation
                </li>
                <li className="flex items-center gap-3 text-foreground">
                  <Key className="w-5 h-5 text-secondary flex-shrink-0" />
                  Rentals & Airbnb
                </li>
                <li className="flex items-center gap-3 text-foreground">
                  <Briefcase className="w-5 h-5 text-secondary flex-shrink-0" />
                  Commercial Solutions
                </li>
              </ul>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 bg-secondary text-accent-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                View All Services <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Google Reviews */}
      {reviews.length > 0 && (
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
              What Our Clients Say
            </h2>
            <div className="flex items-center justify-center gap-1 mb-10">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-secondary text-secondary"
                />
              ))}
              <span className="ml-2 font-semibold text-foreground">4.8</span>
              <span className="text-muted-foreground text-sm">
                from Google Reviews
              </span>
            </div>
            <div className="relative overflow-hidden max-w-md mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeReview}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.4 }}
                  className="bg-card rounded-xl p-6 shadow-card"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-semibold text-sm">
                      {reviews[activeReview]?.avatar || "?"}
                    </div>
                    <div>
                      <p className="font-semibold text-card-foreground text-sm">
                        {reviews[activeReview]?.name}
                      </p>
                      <div className="flex gap-0.5">
                        {Array.from({
                          length: reviews[activeReview]?.rating || 0,
                        }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 fill-secondary text-secondary"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {reviews[activeReview]?.comment}
                  </p>
                </motion.div>
              </AnimatePresence>
              <div className="flex justify-center gap-1.5 mt-4">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveReview(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${i === activeReview ? "bg-secondary" : "bg-border"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recent Blogs */}
      {blogPosts.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  Recent Blogs
                </h2>
                <p className="text-muted-foreground mt-2">
                  Tips, guides, and insights
                </p>
              </div>
              <Link
                to="/blog"
                className="hidden md:flex items-center gap-1 text-secondary font-medium text-sm hover:underline"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      decoding="async"
                      width={800}
                      height={600}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-medium text-secondary">
                      {post.category}
                    </span>
                    <h3 className="font-display font-semibold text-card-foreground mt-1 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{post.date}</span>
                      <Link
                        to={`/blog/${post.id}`}
                        className="text-secondary font-medium hover:underline"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section className="py-16 md:py-24 bg-hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Need Help Finding a Property?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Our team is ready to help you find the perfect property. Get in
            touch today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="px-8 py-3 bg-background text-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Contact Us
            </Link>
            <a
              href="https://wa.me/254711614099"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-secondary text-accent-foreground rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-10">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible>
            {[
              {
                question: "What types of properties do you offer?",
                answer:
                  "We offer a wide range of properties including Airbnb vacation rentals, long-term rentals, and properties for sale across Kenya. Our portfolio includes apartments, houses, villas, and commercial spaces in prime locations.",
              },
              {
                question: "How do I book an Airbnb property?",
                answer:
                  "You can browse our available Airbnb properties on the Properties page, select your desired dates, and book directly through our platform. We also offer assistance with check-in, housekeeping, and any special requests during your stay.",
              },
              {
                question: "Can you help me buy or sell property?",
                answer:
                  "Yes! Our team provides comprehensive real estate services including property valuation, market analysis, marketing for sellers, and buyer representation. We guide you through the entire process from viewing to closing.",
              },
              {
                question: "Do you offer property management services?",
                answer:
                  "Absolutely. We provide full property management services including tenant screening, rent collection, maintenance, and financial reporting. We also manage Airbnb properties with professional cleaning and guest communication.",
              },
              {
                question: "How can I contact you for more information?",
                answer:
                  "You can reach us through the Contact page, WhatsApp, or call us directly. Our team is available to answer your questions and help you find the perfect property solution for your needs.",
              },
            ].map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger className="text-left font-medium text-foreground">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="text-center mt-8">
            <Link
              to="/faq"
              className="inline-flex items-center gap-1 text-secondary font-medium text-sm hover:underline"
            >
              View All FAQs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
