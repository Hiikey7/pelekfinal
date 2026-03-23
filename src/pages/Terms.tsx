import { motion } from 'framer-motion';

export default function Terms() {
  return (
    <div className="pt-20 pb-24 md:pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8"
        >
          Terms of Service
        </motion.h1>

        <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-muted-foreground space-y-6">
          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground mt-8 mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using the Pelek Properties website, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our services.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground mt-8 mb-3">2. Services</h2>
            <p>Pelek Properties provides a platform for listing and discovering Airbnb stays, rental properties, and properties for sale across Kenya. We facilitate connections between property owners and potential tenants or buyers through our website and WhatsApp communication.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground mt-8 mb-3">3. Property Listings</h2>
            <p>All property listings on our platform are provided for informational purposes. While we strive to ensure accuracy, we do not guarantee the completeness or reliability of any listing information. Availability, pricing, and property details are subject to change without notice.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground mt-8 mb-3">4. Booking & Payments</h2>
            <p>Bookings made through Pelek Properties are subject to availability and confirmation. Payment terms, cancellation policies, and refund conditions will be communicated at the time of booking. All transactions are conducted in Kenyan Shillings (KSh) unless otherwise stated.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground mt-8 mb-3">5. User Responsibilities</h2>
            <p>Users agree to provide accurate information when making enquiries or bookings, treat properties with care and respect, comply with all applicable Kenyan laws and regulations, and not use our platform for any unlawful or prohibited activities.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground mt-8 mb-3">6. Intellectual Property</h2>
            <p>All content on the Pelek Properties website, including text, images, logos, and design elements, is the property of Pelek Properties and is protected by intellectual property laws. Unauthorized use or reproduction is prohibited.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground mt-8 mb-3">7. Limitation of Liability</h2>
            <p>Pelek Properties shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of our services. We act as an intermediary and are not responsible for disputes between property owners and tenants or buyers.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground mt-8 mb-3">8. Privacy</h2>
            <p>Your privacy is important to us. Any personal information collected through our platform will be handled in accordance with our privacy practices. We do not sell or share your personal data with third parties without your consent.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground mt-8 mb-3">9. Changes to Terms</h2>
            <p>Pelek Properties reserves the right to update these Terms of Service at any time. Changes will be posted on this page with an updated revision date. Continued use of our services after changes constitutes acceptance of the revised terms.</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-foreground mt-8 mb-3">10. Contact</h2>
            <p>For questions about these Terms of Service, please contact us at <a href="mailto:info@pelekproperties.com" className="text-secondary hover:underline">info@pelekproperties.com</a> or call <a href="tel:+254700000000" className="text-secondary hover:underline">+254 700 000 000</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
