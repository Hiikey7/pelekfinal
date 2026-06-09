import { useEffect, useState, useRef, lazy, Suspense } from 'react';
import { backend } from '@/integrations/backend/client';
import { Plus, Pencil, Trash2, Upload, ImageIcon, Home } from 'lucide-react';
const RichTextEditor = lazy(() => import('@/components/RichTextEditor'));
import { toast } from 'sonner';
import type { Tables } from '@/integrations/backend/types';

type Blog = Tables<'blogs'>;

const emptyForm = { title: '', excerpt: '', content: '', image: '', author: 'Pelek Properties', date: '', category: '', read_time: '5 min read', show_on_homepage: false };

export default function AdminBlogs() {
  const [items, setItems] = useState<Blog[]>([]);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    const { data } = await backend.from('blogs').select('*').order('created_at', { ascending: false });
    if (data) setItems(data);
  };
  useEffect(() => { fetchData(); }, []);

  const openNew = () => { setEditing(null); setForm({ ...emptyForm, date: new Date().toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' }) }); setShowForm(true); };
  const openEdit = (b: Blog) => { setEditing(b); setForm({ title: b.title, excerpt: b.excerpt, content: b.content, image: b.image, author: b.author, date: b.date, category: b.category, read_time: b.read_time, show_on_homepage: (b as any).show_on_homepage ?? false }); setShowForm(true); };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await backend.storage.from('blog-images').upload(path, file);
    if (error) { toast.error(error.message); setUploading(false); return; }
    const { data: { publicUrl } } = backend.storage.from('blog-images').getPublicUrl(path);
    setForm(f => ({ ...f, image: publicUrl }));
    setUploading(false);
    toast.success('Image uploaded');
  };

  const save = async () => {
    if (!form.title) { toast.error('Title required'); return; }
    if (editing) {
      const { error } = await backend.from('blogs').update(form).eq('id', editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success('Blog updated');
    } else {
      const { error } = await backend.from('blogs').insert(form);
      if (error) { toast.error(error.message); return; }
      toast.success('Blog created');
    }
    setShowForm(false); fetchData();
  };

  const remove = async (id: string) => { if (!confirm('Delete?')) return; await backend.from('blogs').delete().eq('id', id); toast.success('Deleted'); fetchData(); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Blogs</h1>
        <button onClick={openNew} className="flex items-center gap-2 bg-secondary text-accent-foreground rounded-lg px-4 py-2 text-sm font-semibold hover:opacity-90"><Plus className="w-4 h-4" /> Add Blog</button>
      </div>
      {showForm && (
        <div className="bg-card rounded-xl p-6 shadow-card mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary" />
            <input placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary" />
            <input placeholder="Author" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} className="bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary" />
            <input placeholder="Date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary" />
            <input placeholder="Read Time" value={form.read_time} onChange={e => setForm({ ...form, read_time: e.target.value })} className="bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary" />
          </div>

          {/* Image upload */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Cover Image</label>
            <input type="file" ref={fileRef} accept="image/*" onChange={uploadImage} className="hidden" />
            {form.image ? (
              <div className="relative rounded-lg overflow-hidden h-40 bg-muted">
                <img src={form.image} alt="Cover" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-sm font-medium opacity-0 hover:opacity-100 transition-opacity"
                >
                  {uploading ? 'Uploading...' : 'Change Image'}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-secondary hover:text-secondary transition-colors"
              >
                {uploading ? (
                  <span className="text-sm">Uploading...</span>
                ) : (
                  <>
                    <Upload className="w-6 h-6" />
                    <span className="text-sm">Click to upload cover image</span>
                  </>
                )}
              </button>
            )}
          </div>

          <textarea placeholder="Excerpt" value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary min-h-[60px]" />
          <div>
            <label className="text-sm font-medium text-foreground block mb-1">Content</label>
            <Suspense fallback={<div className="h-[200px] bg-muted rounded-lg animate-pulse" />}>
              <RichTextEditor content={form.content} onChange={(html) => setForm(f => ({ ...f, content: html }))} />
            </Suspense>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.show_on_homepage} onChange={e => setForm({ ...form, show_on_homepage: e.target.checked })} className="w-4 h-4 rounded border-border text-secondary focus:ring-secondary" />
            <span className="text-sm font-medium text-foreground">Show on homepage</span>
          </label>

          <div className="flex gap-3">
            <button onClick={save} className="bg-secondary text-accent-foreground rounded-lg px-6 py-2 text-sm font-semibold hover:opacity-90">{editing ? 'Update' : 'Create'}</button>
            <button onClick={() => setShowForm(false)} className="border border-border rounded-lg px-6 py-2 text-sm font-medium text-foreground hover:bg-muted">Cancel</button>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {items.length === 0 && <p className="text-center text-muted-foreground py-8">No blogs yet</p>}
        {items.map(b => (
          <div key={b.id} className="bg-card rounded-xl shadow-card p-4 flex items-center gap-3">
            {b.image ? <img src={b.image} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" /> : <ImageIcon className="w-12 h-12 text-muted-foreground flex-shrink-0" />}
            <div className="min-w-0 flex-1">
              <p className="text-foreground font-medium truncate">{b.title}</p>
              <p className="text-xs text-muted-foreground">{b.category}{b.date ? ` · ${b.date}` : ''}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {b.show_on_homepage && <Home className="w-4 h-4 text-secondary" />}
              <button onClick={() => openEdit(b)} className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => remove(b.id)} className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
