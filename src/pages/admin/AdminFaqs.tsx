import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type FAQ = Tables<'faqs'>;

export default function AdminFaqs() {
  const [items, setItems] = useState<FAQ[]>([]);
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [form, setForm] = useState({ question: '', answer: '', sort_order: 0 });
  const [showForm, setShowForm] = useState(false);

  const fetchData = async () => {
    const { data } = await supabase.from('faqs').select('*').order('sort_order');
    if (data) setItems(data);
  };
  useEffect(() => { fetchData(); }, []);

  const openNew = () => { setEditing(null); setForm({ question: '', answer: '', sort_order: items.length }); setShowForm(true); };
  const openEdit = (f: FAQ) => { setEditing(f); setForm({ question: f.question, answer: f.answer, sort_order: f.sort_order }); setShowForm(true); };

  const save = async () => {
    if (!form.question) { toast.error('Question required'); return; }
    if (editing) {
      const { error } = await supabase.from('faqs').update(form).eq('id', editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success('Updated');
    } else {
      const { error } = await supabase.from('faqs').insert(form);
      if (error) { toast.error(error.message); return; }
      toast.success('Created');
    }
    setShowForm(false); fetchData();
  };

  const remove = async (id: string) => { if (!confirm('Delete?')) return; await supabase.from('faqs').delete().eq('id', id); toast.success('Deleted'); fetchData(); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">FAQs</h1>
        <button onClick={openNew} className="flex items-center gap-2 bg-secondary text-accent-foreground rounded-lg px-4 py-2 text-sm font-semibold hover:opacity-90"><Plus className="w-4 h-4" /> Add FAQ</button>
      </div>
      {showForm && (
        <div className="bg-card rounded-xl p-6 shadow-card mb-6 space-y-4">
          <input placeholder="Question" value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary" />
          <textarea placeholder="Answer" value={form.answer} onChange={e => setForm({ ...form, answer: e.target.value })} className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary min-h-[80px]" />
          <input placeholder="Sort Order" type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} className="bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary w-32" />
          <div className="flex gap-3">
            <button onClick={save} className="bg-secondary text-accent-foreground rounded-lg px-6 py-2 text-sm font-semibold hover:opacity-90">{editing ? 'Update' : 'Create'}</button>
            <button onClick={() => setShowForm(false)} className="border border-border rounded-lg px-6 py-2 text-sm font-medium text-foreground hover:bg-muted">Cancel</button>
          </div>
        </div>
      )}
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted"><tr><th className="text-left px-4 py-3 font-medium text-muted-foreground">Question</th><th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Order</th><th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th></tr></thead>
          <tbody>
            {items.map(f => (
              <tr key={f.id} className="border-t border-border">
                <td className="px-4 py-3 text-foreground font-medium">{f.question}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{f.sort_order}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(f)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => remove(f.id)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-destructive ml-1"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">No FAQs yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
