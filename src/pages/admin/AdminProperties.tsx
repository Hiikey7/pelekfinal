import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type Property = Tables<'properties'>;

const emptyForm = {
  title: '', location: '', price: 0, price_label: '', rating: 0, reviews_count: 0,
  category: 'rental', type: '', image: '', images: [] as string[], description: '',
  amenities: [] as string[], bedrooms: 1, bathrooms: 1, guests: null as number | null,
  featured: false, whatsapp: '+254700000000', lat: 0, lng: 0,
};

export default function AdminProperties() {
  const [items, setItems] = useState<Property[]>([]);
  const [editing, setEditing] = useState<Property | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  const fetch = async () => {
    const { data } = await supabase.from('properties').select('*').order('created_at', { ascending: false });
    if (data) setItems(data);
  };

  useEffect(() => { fetch(); }, []);

  const openNew = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (p: Property) => {
    setEditing(p);
    setForm({
      title: p.title, location: p.location, price: Number(p.price), price_label: p.price_label,
      rating: Number(p.rating), reviews_count: p.reviews_count, category: p.category, type: p.type,
      image: p.image, images: p.images || [], description: p.description,
      amenities: p.amenities || [], bedrooms: p.bedrooms, bathrooms: p.bathrooms,
      guests: p.guests, featured: p.featured, whatsapp: p.whatsapp,
      lat: Number(p.lat), lng: Number(p.lng),
    });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.title) { toast.error('Title is required'); return; }
    const payload = { ...form, price: form.price, rating: form.rating, lat: form.lat, lng: form.lng };
    if (editing) {
      const { error } = await supabase.from('properties').update(payload).eq('id', editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success('Property updated');
    } else {
      const { error } = await supabase.from('properties').insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success('Property created');
    }
    setShowForm(false);
    fetch();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this property?')) return;
    await supabase.from('properties').delete().eq('id', id);
    toast.success('Deleted');
    fetch();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Properties</h1>
        <button onClick={openNew} className="flex items-center gap-2 bg-secondary text-accent-foreground rounded-lg px-4 py-2 text-sm font-semibold hover:opacity-90">
          <Plus className="w-4 h-4" /> Add Property
        </button>
      </div>

      {showForm && (
        <div className="bg-card rounded-xl p-6 shadow-card mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary" />
            <input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary" />
            <input placeholder="Price" type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} className="bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary" />
            <input placeholder="Price Label (e.g. KSh 25,000/night)" value={form.price_label} onChange={e => setForm({ ...form, price_label: e.target.value })} className="bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary" />
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary">
              <option value="airbnb">Airbnb</option>
              <option value="rental">Rental</option>
              <option value="sale">For Sale</option>
            </select>
            <input placeholder="Type (e.g. Villa)" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary" />
            <input placeholder="Image URL" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} className="bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary" />
            <input placeholder="WhatsApp" value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} className="bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary" />
            <input placeholder="Bedrooms" type="number" value={form.bedrooms} onChange={e => setForm({ ...form, bedrooms: Number(e.target.value) })} className="bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary" />
            <input placeholder="Bathrooms" type="number" value={form.bathrooms} onChange={e => setForm({ ...form, bathrooms: Number(e.target.value) })} className="bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary" />
            <input placeholder="Latitude" type="number" step="any" value={form.lat} onChange={e => setForm({ ...form, lat: Number(e.target.value) })} className="bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary" />
            <input placeholder="Longitude" type="number" step="any" value={form.lng} onChange={e => setForm({ ...form, lng: Number(e.target.value) })} className="bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary" />
          </div>
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary min-h-[80px]" />
          <input placeholder="Amenities (comma separated)" value={form.amenities.join(', ')} onChange={e => setForm({ ...form, amenities: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary" />
          <input placeholder="Gallery Image URLs (comma separated)" value={form.images.join(', ')} onChange={e => setForm({ ...form, images: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary" />
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="accent-secondary" />
            Featured Property
          </label>
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

      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Location</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Category</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Featured</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(p => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-4 py-3 text-foreground font-medium">{p.title}</td>
                <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{p.location}</td>
                <td className="px-4 py-3 hidden md:table-cell"><span className="px-2 py-1 rounded-full bg-secondary/10 text-secondary text-xs capitalize">{p.category}</span></td>
                <td className="px-4 py-3 hidden md:table-cell">{p.featured ? '⭐' : '—'}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => remove(p.id)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-destructive ml-1"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No properties yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
