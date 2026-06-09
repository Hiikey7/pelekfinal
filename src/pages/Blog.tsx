import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { backend } from "@/integrations/backend/client";
import { motion } from "framer-motion";
import { MessageCircle, ArrowRight } from "lucide-react";
import { BlogGridSkeleton } from "@/components/loading-skeletons";
import type { Tables } from "@/integrations/backend/types";

type Blog = Tables<"blogs">;

export default function Blog() {
  const [posts, setPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    backend
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setPosts(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="pt-20 pb-24 md:pb-12">
      <div className="w-[90%] mx-auto">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
          Blog
        </h1>
        <p className="text-muted-foreground mb-10">
          Insights, guides, and tips on real estate and travel
        </p>
        {loading ? (
          <BlogGridSkeleton />
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
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
                  width={800}
                  height={600}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-secondary">
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    · {post.read_time}
                  </span>
                </div>
                <h2 className="font-display font-semibold text-card-foreground mb-2 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {post.author} · {post.date}
                  </span>
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
        ) : (
          <p className="text-center text-muted-foreground py-20">
            No blog posts yet.
          </p>
        )}

        {/* CTA Section */}
        <section className="mt-16 py-12 bg-hero-gradient rounded-2xl text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
            Need Help Finding a Property?
          </h2>
          <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
            Our team is ready to help you find the perfect property. Get in
            touch today.
          </p>
          <div className="w-[80%] mx-auto flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="w-full sm:w-auto px-6 py-3 bg-background text-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Contact Us
            </Link>
            <a
              href="https://wa.me/254711614099"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 bg-secondary text-accent-foreground rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
