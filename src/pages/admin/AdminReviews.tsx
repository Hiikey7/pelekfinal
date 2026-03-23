import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type Review = Tables<'reviews'>;

export default function AdminReviews() {
  const [items, setItems] = useState<Review[]>([]);
  const [editing, setEditing] = useState<Review | null>(null);
  const [form, setForm] = useState({ name: '', rating: 5, comment: '', date: '', avatar: '' });
  const [showForm, setShowForm] = useState(false);

  const fetchData = async () => {
    const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
    if (data) setItems(data);
  };
  useEffect(() => { fetchData(); }, []);

  const openNew = () => { setEditing(null); setForm({ name: '', rating: 5, comment: '', date: new Date().toLocaleDateString('en-KE'), avatar: '' }); setShowForm(true); };
  const openEdit = (r: Review) => { setEditing(r); setForm({ name: r.name, rating: r.rating, comment: r.comment, date: r.date, avatar: r.avatar }); setShowForm(true); };

  const save = async () => {
    if (!form.name) { toast.error('Name required'); return; }
    if (editing) {
      const { error } = await supabase.from('reviews').update(form).eq('id', editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success('Updated');
    } else {
      const { error } = await supabase.from('reviews').insert(form);
      if (error) { toast.error(error.message); return; }
      toast.success('Created');
    }
    setShowForm(false); fetchData();
  };

  const remove = async (id: string) => { if (!confirm('Delete?')) return; await supabase.from('reviews').delete().eq('id', id); toast.success('Deleted'); fetchData(); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Reviews</h1>
        <button onClick={openNew} className="flex items-center gap-2 bg-secondary text-accent-foreground rounded-lg px-4 py-2 text-sm font-semibold hover:opacity-90"><Plus className="w-4 h-4" /> Add Review</button>
      </div>
      {showForm && (
        <div className="bg-card rounded-xl p-6 shadow-card mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary" />
            <input placeholder="Avatar (initials e.g. JD)" value={form.avatar} onChange={e => setForm({ ...form, avatar: e.target.value })} className="bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary" />
            <select value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })} className="bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary">
              {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Stars</option>)}
            </select>
            <input placeholder="Date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary" />
          </div>
          <textarea placeholder="Comment" value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary min-h-[80px]" />
          <div className="flex gap-3">
            <button onClick={save} className="bg-secondary text-accent-foreground rounded-lg px-6 py-2 text-sm font-semibold hover:opacity-90">{editing ? 'Update' : 'Create'}</button>
            <button onClick={() => setShowForm(false)} className="border border-border rounded-lg px-6 py-2 text-sm font-medium text-foreground hover:bg-muted">Cancel</button>
          </div>
        </div>
      )}
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted"><tr><th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th><th className="text-left px-4 py-3 font-medium text-muted-foreground">Rating</th><th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Comment</th><th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th></tr></thead>
          <tbody>
            {items.map(r => (
              <tr key={r.id} className="border-t border-border">
                <td className="px-4 py-3 text-foreground font-medium">{r.name}</td>
                <td className="px-4 py-3"><div className="flex gap-0.5">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="w-3 h-3 fill-secondary text-secondary" />)}</div></td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell truncate max-w-[200px]">{r.comment}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(r)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => remove(r.id)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-destructive ml-1"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No reviews yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
