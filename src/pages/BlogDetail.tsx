import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, MessageCircle } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Blog = Tables<"blogs">;

export default function BlogDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("blogs")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        setPost(data);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div className="pt-20 pb-24 container mx-auto px-4 text-center">
        <p className="text-muted-foreground py-20">Loading...</p>
      </div>
    );

  if (!post) {
    return (
      <div className="pt-20 pb-24 container mx-auto px-4 text-center">
        <p className="text-muted-foreground py-20">Blog post not found.</p>
        <Link to="/blog" className="text-secondary hover:underline">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-24 md:pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
        <span className="text-sm font-medium text-secondary">
          {post.category}
        </span>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
          {post.title}
        </h1>
        <p className="text-muted-foreground text-sm mb-8">
          {post.author} · {post.date} · {post.read_time}
        </p>
        <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-8">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="prose prose-lg max-w-none text-foreground [&_a]:text-secondary [&_img]:rounded-xl">
          <div
            className="text-muted-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* CTA Section */}
        <section className="mt-12 py-10 bg-hero-gradient rounded-2xl text-center">
          <h2 className="font-display text-2xl font-bold text-primary-foreground mb-3">
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
