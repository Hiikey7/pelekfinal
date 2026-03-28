import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Home, BarChart3, Key, Briefcase, ArrowLeft, CheckCircle2 } from 'lucide-react';

const services = [
  {
    icon: Building2,
    title: 'Property Management',
    description: 'Comprehensive property management solutions to maximize your investment returns while minimizing your workload.',
    features: [
      'Tenant screening & placement',
      'Rent collection',
      'Property maintenance & inspections',
      'Tenant relations management',
      'Financial reporting',
    ],
  },
  {
    icon: Home,
    title: 'Real Estate Sales',
    description: 'Expert guidance through every step of buying or selling property, ensuring you get the best deal.',
    features: [
      'Buying and selling property support',
      'Property marketing & listing',
      'Negotiation assistance',
      'Transaction and closing guidance',
    ],
  },
  {
    icon: BarChart3,
    title: 'Property Valuation Services',
    description: 'Accurate property valuations backed by market data and industry expertise.',
    features: [
      'Property assessment',
      'Market analysis',
      'Investment evaluation',
      'Valuation reports',
    ],
  },
  {
    icon: Key,
    title: 'Rentals & Airbnb Solutions',
    description: 'End-to-end rental and short-stay management to keep your properties booked and earning.',
    features: [
      'Residential rentals',
      'Short-term stays (Airbnb management)',
      'Tenant sourcing and bookings',
    ],
  },
  {
    icon: Briefcase,
    title: 'Commercial Property Solutions',
    description: 'Strategic commercial real estate services for businesses and investors.',
    features: [
      'Office and business spaces',
      'Commercial property investment support',
    ],
  },
];

export default function Services() {
  return (
    <div className="pt-20 pb-24 md:pb-12">
      {/* Hero */}
      <section className="bg-hero-gradient py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-4"
          >
            Our Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-primary-foreground/80 text-lg max-w-2xl mx-auto"
          >
            From property management to real estate sales, we provide comprehensive solutions tailored to your needs.
          </motion.p>
        </div>
      </section>

      {/* Services Detail */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl space-y-16">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className={`flex flex-col md:flex-row gap-8 items-start ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center">
                <service.icon className="w-8 h-8 text-secondary" />
              </div>
              <div className="flex-1">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">{service.title}</h2>
                <p className="text-muted-foreground mb-5 leading-relaxed">{service.description}</p>
                <ul className="space-y-2.5">
                  {service.features.map(feature => (
                    <li key={feature} className="flex items-center gap-3 text-foreground">
                      <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Let us help you with your property needs. Contact us today for a free consultation.
          </p>
          <Link
            to="/contact"
            className="inline-flex px-8 py-3 bg-secondary text-accent-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
