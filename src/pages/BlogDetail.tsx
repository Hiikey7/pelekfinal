import { useParams, Link } from 'react-router-dom';
import { blogPosts } from '@/data/mockData';
import { ArrowLeft } from 'lucide-react';

export default function BlogDetail() {
  const { id } = useParams();
  const post = blogPosts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="pt-20 pb-24 container mx-auto px-4 text-center">
        <p className="text-muted-foreground py-20">Blog post not found.</p>
        <Link to="/blog" className="text-secondary hover:underline">Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-24 md:pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link to="/blog" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
        <span className="text-sm font-medium text-secondary">{post.category}</span>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">{post.title}</h1>
        <p className="text-muted-foreground text-sm mb-8">{post.author} · {post.date} · {post.readTime}</p>
        <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-8">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>
        <div className="prose prose-lg max-w-none text-foreground">
          <p className="text-muted-foreground leading-relaxed">{post.content}</p>
          <p className="text-muted-foreground leading-relaxed mt-4">{post.excerpt} This is a sample blog post content. In a production setup, this would contain rich formatted content from your CMS.</p>
        </div>
      </div>
    </div>
  );
}
