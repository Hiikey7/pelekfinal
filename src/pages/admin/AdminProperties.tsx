import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Pencil, Trash2, Upload, Star, X } from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type Property = Tables<'properties'>;

const emptyForm = {
  title: '', location: '', price: 0, price_label: '', rating: 0, reviews_count: 0,
  category: 'rental', type: '', image: '', images: [] as string[], description: '',
  amenities: [] as string[], bedrooms: 1, bathrooms: 1, guests: null as number | null,
  featured: false, whatsapp: '+254700000000', lat: 0, lng: 0,
  google_map_link: '', social_media_url: '', social_media_type: '',
};

export default function AdminProperties() {
  const [items, setItems] = useState<Property[]>([]);
  const [editing, setEditing] = useState<Property | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [amenitiesList, setAmenitiesList] = useState<{ id: string; name: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showAmenityDropdown, setShowAmenityDropdown] = useState(false);

  const fetchData = async () => {
    const [{ data: props }, { data: amenities }] = await Promise.all([
      supabase.from('properties').select('*').order('created_at', { ascending: false }),
      supabase.from('amenities').select('*').order('name'),
    ]);
    if (props) setItems(props);
    if (amenities) setAmenitiesList(amenities);
  };

  useEffect(() => { fetchData(); }, []);

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
      google_map_link: p.google_map_link || '', social_media_url: p.social_media_url || '', social_media_type: p.social_media_type || '',
    });
    setShowForm(true);
  };

  const uploadImages = async (files: FileList) => {
    setUploading(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from('property-images').upload(path, file);
      if (error) { toast.error(`Upload failed: ${error.message}`); continue; }
      const { data: urlData } = supabase.storage.from('property-images').getPublicUrl(path);
      urls.push(urlData.publicUrl);
    }
    setForm(prev => {
      const newImages = [...prev.images, ...urls];
      return { ...prev, images: newImages, image: prev.image || newImages[0] || '' };
    });
    setUploading(false);
    if (urls.length) toast.success(`${urls.length} image(s) uploaded`);
  };

  const setCover = (url: string) => {
    setForm(prev => ({ ...prev, image: url }));
  };

  const removeImage = (url: string) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter(u => u !== url),
      image: prev.image === url ? (prev.images.filter(u => u !== url)[0] || '') : prev.image,
    }));
  };

  const toggleAmenity = (name: string) => {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(name)
        ? prev.amenities.filter(a => a !== name)
        : [...prev.amenities, name],
    }));
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
    fetchData();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this property?')) return;
    await supabase.from('properties').delete().eq('id', id);
    toast.success('Deleted');
    fetchData();
  };

  const inputClass = "bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary";

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
            <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={inputClass} />
            <input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className={inputClass} />
            <input placeholder="Price" type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} className={inputClass} />
            <input placeholder="Price Label (e.g. KSh 25,000/night)" value={form.price_label} onChange={e => setForm({ ...form, price_label: e.target.value })} className={inputClass} />
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inputClass}>
              <option value="airbnb">Airbnb</option>
              <option value="rental">Rental</option>
              <option value="sale">For Sale</option>
            </select>
            <input placeholder="Type (e.g. Villa)" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className={inputClass} />
            <input placeholder="Bedrooms" type="number" value={form.bedrooms} onChange={e => setForm({ ...form, bedrooms: Number(e.target.value) })} className={inputClass} />
            <input placeholder="Bathrooms" type="number" value={form.bathrooms} onChange={e => setForm({ ...form, bathrooms: Number(e.target.value) })} className={inputClass} />
            <input placeholder="Latitude" type="number" step="any" value={form.lat} onChange={e => setForm({ ...form, lat: Number(e.target.value) })} className={inputClass} />
            <input placeholder="Longitude" type="number" step="any" value={form.lng} onChange={e => setForm({ ...form, lng: Number(e.target.value) })} className={inputClass} />
          </div>

          <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={`w-full ${inputClass} min-h-[80px]`} />

          {/* Amenities multi-select dropdown */}
          <div className="relative">
            <label className="text-sm text-muted-foreground mb-1 block">Amenities</label>
            <button
              type="button"
              onClick={() => setShowAmenityDropdown(!showAmenityDropdown)}
              className={`w-full text-left ${inputClass} flex items-center justify-between`}
            >
              <span className={form.amenities.length ? 'text-foreground' : 'text-muted-foreground'}>
                {form.amenities.length ? `${form.amenities.length} selected` : 'Select amenities...'}
              </span>
              <span className="text-muted-foreground text-xs">▼</span>
            </button>
            {form.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.amenities.map(a => (
                  <span key={a} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/10 text-secondary text-xs">
                    {a}
                    <button type="button" onClick={() => toggleAmenity(a)} className="hover:text-destructive"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}
            {showAmenityDropdown && (
              <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {amenitiesList.map(a => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => toggleAmenity(a.name)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center justify-between ${
                      form.amenities.includes(a.name) ? 'text-secondary font-medium' : 'text-foreground'
                    }`}
                  >
                    {a.name}
                    {form.amenities.includes(a.name) && <span>✓</span>}
                  </button>
                ))}
                {amenitiesList.length === 0 && <p className="px-3 py-2 text-sm text-muted-foreground">No amenities. Add some in Amenities management.</p>}
              </div>
            )}
          </div>

          {/* Image upload */}
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Property Images</label>
            <label className={`inline-flex items-center gap-2 cursor-pointer bg-muted rounded-lg px-4 py-2.5 text-sm text-foreground hover:bg-muted/80 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
              <Upload className="w-4 h-4" />
              {uploading ? 'Uploading...' : 'Upload Images'}
              <input type="file" accept="image/*" multiple className="hidden" onChange={e => e.target.files && uploadImages(e.target.files)} />
            </label>
            {form.images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mt-3">
                {form.images.map(url => (
                  <div key={url} className={`relative group rounded-lg overflow-hidden border-2 ${form.image === url ? 'border-secondary' : 'border-transparent'}`}>
                    <img src={url} alt="" className="w-full h-20 object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      <button type="button" onClick={() => setCover(url)} title="Set as cover" className="p-1 bg-white/90 rounded-full text-secondary hover:scale-110 transition-transform">
                        <Star className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" onClick={() => removeImage(url)} title="Remove" className="p-1 bg-white/90 rounded-full text-destructive hover:scale-110 transition-transform">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {form.image === url && (
                      <span className="absolute top-1 left-1 bg-secondary text-accent-foreground text-[10px] px-1.5 py-0.5 rounded-full font-medium">Cover</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

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
