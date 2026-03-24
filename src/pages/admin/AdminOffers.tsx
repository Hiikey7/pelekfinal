import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Pencil, Trash2, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface Offer {
  id: string;
  title: string;
  description: string;
  image: string;
  cta_text: string;
  cta_link: string;
  promo_code: string;
  offer_type: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

const defaultForm = {
  title: '',
  description: '',
  image: '',
  cta_text: 'View Now',
  cta_link: '/',
  promo_code: '',
  offer_type: 'cta_button' as 'cta_button' | 'promo_code',
  active: true,
};

export default function AdminOffers() {
  const [items, setItems] = useState<Offer[]>([]);
  const [editing, setEditing] = useState<Offer | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    const { data } = await supabase.from('offers').select('*').order('created_at', { ascending: false });
    if (data) setItems(data as unknown as Offer[]);
  };

  useEffect(() => { fetchData(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm(defaultForm);
    setShowForm(true);
  };

  const openEdit = (o: Offer) => {
    setEditing(o);
    setForm({
      title: o.title,
      description: o.description,
      image: o.image,
      cta_text: o.cta_text,
      cta_link: o.cta_link,
      promo_code: o.promo_code || '',
      offer_type: (o.offer_type as 'cta_button' | 'promo_code') || 'cta_button',
      active: o.active,
    });
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('offer-images').upload(path, file);
    if (error) { toast.error('Upload failed'); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from('offer-images').getPublicUrl(path);
    setForm(f => ({ ...f, image: urlData.publicUrl }));
    setUploading(false);
    toast.success('Image uploaded');
  };

  const save = async () => {
    if (!form.title) { toast.error('Title required'); return; }
    const payload = { ...form };
    if (editing) {
      const { error } = await supabase.from('offers').update(payload as any).eq('id', editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success('Updated');
    } else {
      const { error } = await supabase.from('offers').insert(payload as any);
      if (error) { toast.error(error.message); return; }
      toast.success('Created');
    }
    setShowForm(false);
    fetchData();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete?')) return;
    await supabase.from('offers').delete().eq('id', id);
    toast.success('Deleted');
    fetchData();
  };

  const inputCls = 'bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary w-full';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Offers & Banners</h1>
        <button onClick={openNew} className="flex items-center gap-2 bg-secondary text-accent-foreground rounded-lg px-4 py-2 text-sm font-semibold hover:opacity-90">
          <Plus className="w-4 h-4" /> Add Offer
        </button>
      </div>

      {showForm && (
        <div className="bg-card rounded-xl p-6 shadow-card mb-6 space-y-4">
          {/* Title */}
          <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={inputCls} />

          {/* Image upload */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Banner Image</label>
            <div className="flex items-center gap-3">
              {form.image ? (
                <img src={form.image} alt="Banner" className="w-24 h-16 object-cover rounded-lg border border-border" />
              ) : (
                <div className="w-24 h-16 bg-muted rounded-lg flex items-center justify-center border border-border">
                  <ImageIcon className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 bg-muted rounded-lg px-4 py-2 text-sm text-foreground hover:bg-accent disabled:opacity-50"
              >
                <Upload className="w-4 h-4" /> {uploading ? 'Uploading…' : 'Upload Image'}
              </button>
            </div>
          </div>

          {/* Description */}
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={`${inputCls} min-h-[60px]`} />

          {/* Offer type toggle */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Offer Type</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, offer_type: 'cta_button' })}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${form.offer_type === 'cta_button' ? 'bg-secondary text-accent-foreground border-secondary' : 'bg-muted text-muted-foreground border-border hover:bg-accent'}`}
              >
                Button with URL
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, offer_type: 'promo_code' })}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${form.offer_type === 'promo_code' ? 'bg-secondary text-accent-foreground border-secondary' : 'bg-muted text-muted-foreground border-border hover:bg-accent'}`}
              >
                Promo Code
              </button>
            </div>
          </div>

          {/* Conditional fields based on type */}
          {form.offer_type === 'cta_button' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input placeholder="Button Text (e.g. View Now)" value={form.cta_text} onChange={e => setForm({ ...form, cta_text: e.target.value })} className={inputCls} />
              <input placeholder="Button URL (e.g. /properties)" value={form.cta_link} onChange={e => setForm({ ...form, cta_link: e.target.value })} className={inputCls} />
            </div>
          ) : (
            <div>
              <input placeholder="Promo Code (e.g. SAVE20)" value={form.promo_code} onChange={e => setForm({ ...form, promo_code: e.target.value.toUpperCase() })} className={`${inputCls} font-mono tracking-widest text-base`} />
              <p className="text-xs text-muted-foreground mt-1">Users will see a copy button next to this code</p>
            </div>
          )}

          {/* Active toggle */}
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} className="accent-secondary" /> Active
          </label>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={save} className="bg-secondary text-accent-foreground rounded-lg px-6 py-2 text-sm font-semibold hover:opacity-90">
              {editing ? 'Update' : 'Create'}
            </button>
            <button onClick={() => setShowForm(false)} className="border border-border rounded-lg px-6 py-2 text-sm font-medium text-foreground hover:bg-muted">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Image</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Type</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(o => (
              <tr key={o.id} className="border-t border-border">
                <td className="px-4 py-3">
                  {o.image ? (
                    <img src={o.image} alt="" className="w-12 h-8 object-cover rounded" />
                  ) : (
                    <div className="w-12 h-8 bg-muted rounded flex items-center justify-center"><ImageIcon className="w-4 h-4 text-muted-foreground" /></div>
                  )}
                </td>
                <td className="px-4 py-3 text-foreground font-medium">{o.title}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                  {o.offer_type === 'promo_code' ? (
                    <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{o.promo_code}</span>
                  ) : (
                    <span className="text-xs">{o.cta_text}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${o.active ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}`}>
                    {o.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(o)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => remove(o.id)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-destructive ml-1"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No offers yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
