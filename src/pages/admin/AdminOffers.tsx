import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type Offer = Tables<'offers'>;

export default function AdminOffers() {
  const [items, setItems] = useState<Offer[]>([]);
  const [editing, setEditing] = useState<Offer | null>(null);
  const [form, setForm] = useState({ title: '', description: '', image: '', cta_text: 'View Now', cta_link: '/', active: true });
  const [showForm, setShowForm] = useState(false);

  const fetchData = async () => {
    const { data } = await supabase.from('offers').select('*').order('created_at', { ascending: false });
    if (data) setItems(data);
  };
  useEffect(() => { fetchData(); }, []);

  const openNew = () => { setEditing(null); setForm({ title: '', description: '', image: '', cta_text: 'View Now', cta_link: '/', active: true }); setShowForm(true); };
  const openEdit = (o: Offer) => { setEditing(o); setForm({ title: o.title, description: o.description, image: o.image, cta_text: o.cta_text, cta_link: o.cta_link, active: o.active }); setShowForm(true); };

  const save = async () => {
    if (!form.title) { toast.error('Title required'); return; }
    if (editing) {
      const { error } = await supabase.from('offers').update(form).eq('id', editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success('Updated');
    } else {
      const { error } = await supabase.from('offers').insert(form);
      if (error) { toast.error(error.message); return; }
      toast.success('Created');
    }
    setShowForm(false); fetchData();
  };

  const remove = async (id: string) => { if (!confirm('Delete?')) return; await supabase.from('offers').delete().eq('id', id); toast.success('Deleted'); fetchData(); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Offers & Banners</h1>
        <button onClick={openNew} className="flex items-center gap-2 bg-secondary text-accent-foreground rounded-lg px-4 py-2 text-sm font-semibold hover:opacity-90"><Plus className="w-4 h-4" /> Add Offer</button>
      </div>
      {showForm && (
        <div className="bg-card rounded-xl p-6 shadow-card mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary" />
            <input placeholder="Image URL" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary" />
            <input placeholder="CTA Text" value={form.cta_text} onChange={e => setForm({ ...form, cta_text: e.target.value })} className="bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary" />
            <input placeholder="CTA Link" value={form.cta_link} onChange={e => setForm({ ...form, cta_link: e.target.value })} className="bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary" />
          </div>
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary min-h-[60px]" />
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} className="accent-secondary" /> Active
          </label>
          <div className="flex gap-3">
            <button onClick={save} className="bg-secondary text-accent-foreground rounded-lg px-6 py-2 text-sm font-semibold hover:opacity-90">{editing ? 'Update' : 'Create'}</button>
            <button onClick={() => setShowForm(false)} className="border border-border rounded-lg px-6 py-2 text-sm font-medium text-foreground hover:bg-muted">Cancel</button>
          </div>
        </div>
      )}
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted"><tr><th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th><th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">CTA</th><th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th><th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th></tr></thead>
          <tbody>
            {items.map(o => (
              <tr key={o.id} className="border-t border-border">
                <td className="px-4 py-3 text-foreground font-medium">{o.title}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{o.cta_text}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${o.active ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}`}>{o.active ? 'Active' : 'Inactive'}</span></td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(o)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => remove(o.id)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-destructive ml-1"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No offers yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
