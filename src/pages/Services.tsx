import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import servicesImg from "@/assets/hero-bg.jpg";

const services = [
  {
    title: "Property Management",
    description:
      "Comprehensive property management solutions to maximize your investment returns while minimizing your workload. We handle everything so you can enjoy passive income.",
    features: [
      "Tenant screening & placement",
      "Rent collection & financial management",
      "Property maintenance & inspections",
      "Tenant relations management",
      "Detailed monthly financial reporting",
    ],
  },
  {
    title: "Real Estate Sales",
    description:
      "Expert guidance through every step of buying or selling property, ensuring you get the best deal. Our team handles all the complexities so you can focus on your decision.",
    features: [
      "Buying and selling property support",
      "Professional marketing & listing",
      "Negotiation assistance",
      "Transaction and closing guidance",
    ],
  },
  {
    title: "Property Valuation",
    description:
      "Accurate property valuations backed by market data and industry expertise. Make informed decisions with reliable data.",
    features: [
      "Property assessment",
      "Market analysis",
      "Investment evaluation",
      "Comprehensive valuation reports",
    ],
  },
  {
    title: "Rentals & Airbnb",
    description:
      "End-to-end rental and short-stay management to keep your properties booked and earning. Maximize your property's income potential.",
    features: [
      "Residential rentals",
      "Airbnb & short-term stay management",
      "Tenant sourcing & bookings",
    ],
  },
  {
    title: "Commercial Solutions",
    description:
      "Strategic commercial real estate services for businesses and investors. We help you navigate the commercial property market.",
    features: [
      "Office and business spaces",
      "Commercial property investment support",
      "Lease negotiation",
    ],
  },
];

export default function Services() {
  return (
    <div className="pt-20 pb-24 md:pb-12">
      {/* Hero */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        <img
          src={servicesImg}
          alt="Services"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/60 to-transparent" />
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
            >
              Our Services
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/90 text-lg md:text-xl"
            >
              Comprehensive property solutions tailored to your needs across
              Kenya.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-16">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-border pb-12 last:border-0"
              >
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                  {service.title}
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-3">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-foreground"
                    >
                      <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Contact us today for a free consultation about your property needs.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-secondary text-accent-foreground px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Contact Us <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
