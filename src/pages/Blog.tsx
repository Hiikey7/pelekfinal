import { Link } from 'react-router-dom';
import { blogPosts } from '@/data/mockData';
import { motion } from 'framer-motion';

export default function Blog() {
  return (
    <div className="pt-20 pb-24 md:pb-12">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">Blog</h1>
        <p className="text-muted-foreground mb-10">Insights, guides, and tips on real estate and travel</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-secondary">{post.category}</span>
                  <span className="text-xs text-muted-foreground">· {post.readTime}</span>
                </div>
                <h2 className="font-display font-semibold text-card-foreground mb-2 line-clamp-2">{post.title}</h2>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{post.author} · {post.date}</span>
                  <Link to={`/blog/${post.id}`} className="text-secondary font-medium hover:underline">Read More</Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
