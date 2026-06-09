import { useState, useEffect, useMemo } from "react";
import { backend } from "@/integrations/backend/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search } from "lucide-react";
import type { Tables } from "@/integrations/backend/types";

type FAQ = Tables<"faqs"> | { id: string; question: string; answer: string };

const staticFaqs: FAQ[] = [
  {
    id: "faq-1",
    question: "What types of properties do you offer?",
    answer:
      "We offer a wide range of properties including Airbnb vacation rentals, long-term rentals, and properties for sale across Kenya. Our portfolio includes apartments, houses, villas, and commercial spaces in prime locations.",
  },
  {
    id: "faq-2",
    question: "How do I book an Airbnb property?",
    answer:
      "You can browse our available Airbnb properties on the Properties page, select your desired dates, and book directly through our platform. We also offer assistance with check-in, housekeeping, and any special requests during your stay.",
  },
  {
    id: "faq-3",
    question: "Can you help me buy or sell property?",
    answer:
      "Yes! Our team provides comprehensive real estate services including property valuation, market analysis, marketing for sellers, and buyer representation. We guide you through the entire process from viewing to closing.",
  },
  {
    id: "faq-4",
    question: "Do you offer property management services?",
    answer:
      "Absolutely. We provide full property management services including tenant screening, rent collection, maintenance, and financial reporting. We also manage Airbnb properties with professional cleaning and guest communication.",
  },
  {
    id: "faq-5",
    question: "How can I contact you for more information?",
    answer:
      "You can reach us through the Contact page, WhatsApp, or call us directly. Our team is available to answer your questions and help you find the perfect property solution for your needs.",
  },
];

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  useEffect(() => {
    backend
      .from("faqs")
      .select("*")
      .order("sort_order")
      .then(({ data }) => {
        if (data) setFaqs(data);
      });
  }, []);

  const filtered = useMemo(() => {
    const allFaqs = [...staticFaqs, ...faqs];
    if (!search) return allFaqs;
    return allFaqs.filter(
      (f) =>
        f.question.toLowerCase().includes(search.toLowerCase()) ||
        f.answer.toLowerCase().includes(search.toLowerCase()),
    );
  }, [faqs, search]);

  return (
    <div className="pt-20 pb-24 md:pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
          Frequently Asked Questions
        </h1>
        <p className="text-muted-foreground mb-8">
          Find answers to common questions
        </p>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>

        <Accordion type="single" collapsible>
          {filtered.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger className="text-left font-medium text-foreground">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            No FAQs found matching your search.
          </p>
        )}
      </div>
    </div>
  );
}
