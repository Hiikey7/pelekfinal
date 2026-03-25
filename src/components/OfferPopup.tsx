import { useEffect, useState } from 'react';
import { X, Copy, Check, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import type { Tables } from '@/integrations/supabase/types';

type Offer = Tables<'offers'>;

export default function OfferPopup() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchOffers = async () => {
      const { data } = await supabase.from('offers').select('*').eq('active', true);
      if (data && data.length > 0) {
        setOffers(data);
        const timer = setTimeout(() => setVisible(true), 5000);
        return () => clearTimeout(timer);
      }
    };
    fetchOffers();
  }, []);

  const offer = offers[current];

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const next = () => {
    setCurrent(prev => (prev + 1) % offers.length);
    setCopied(false);
  };

  if (!offer) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setVisible(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
            className="bg-card rounded-2xl shadow-xl max-w-sm w-full overflow-hidden relative"
          >
            <button onClick={() => setVisible(false)} className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors">
              <X className="w-4 h-4" />
            </button>

            {offer.image && (
              <img src={offer.image} alt={offer.title} className="w-full h-40 object-cover" />
            )}

            <div className="p-5 space-y-3">
              <h3 className="font-display text-lg font-bold text-foreground">{offer.title}</h3>
              {offer.description && (
                <p className="text-sm text-muted-foreground">{offer.description}</p>
              )}

              {offer.offer_type === 'promo_code' && offer.promo_code ? (
                <button
                  onClick={() => copyCode(offer.promo_code)}
                  className="w-full flex items-center justify-center gap-2 bg-muted border-2 border-dashed border-secondary/40 rounded-xl py-3 font-mono text-lg font-bold text-secondary tracking-wider hover:bg-secondary/5 transition-colors"
                >
                  {offer.promo_code}
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              ) : (
                <a
                  href={offer.cta_link}
                  className="w-full flex items-center justify-center gap-2 bg-secondary text-accent-foreground rounded-xl py-3 font-semibold hover:opacity-90 transition-opacity"
                >
                  {offer.cta_text || 'View Now'} <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {offers.length > 1 && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-muted-foreground">{current + 1} of {offers.length}</span>
                  <button onClick={next} className="text-xs text-secondary font-medium hover:underline">
                    Next offer →
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}