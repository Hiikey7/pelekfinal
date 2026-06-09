import { useEffect, useState } from 'react';
import { backend } from '@/integrations/backend/client';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

type Amenity = { id: string; name: string; created_at: string };

export default function AdminAmenities() {
  const [items, setItems] = useState<Amenity[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchData = async () => {
    const { data } = await backend.from('amenities').select('*').order('name');
    if (data) setItems(data);
  };

  useEffect(() => { fetchData(); }, []);

  const save = async () => {
    if (!name.trim()) { toast.error('Name is required'); return; }
    if (editingId) {
      const { error } = await backend.from('amenities').update({ name: name.trim() }).eq('id', editingId);
      if (error) { toast.error(error.message); return; }
      toast.success('Amenity updated');
    } else {
      const { error } = await backend.from('amenities').insert({ name: name.trim() });
      if (error) { toast.error(error.message); return; }
      toast.success('Amenity added');
    }
    setName('');
    setEditingId(null);
    setShowForm(false);
    fetchData();
  };

  const startEdit = (a: Amenity) => {
    setEditingId(a.id);
    setName(a.name);
    setShowForm(true);
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this amenity?')) return;
    await backend.from('amenities').delete().eq('id', id);
    toast.success('Deleted');
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Amenities</h1>
        <button onClick={() => { setEditingId(null); setName(''); setShowForm(true); }} className="flex items-center gap-2 bg-secondary text-accent-foreground rounded-lg px-4 py-2 text-sm font-semibold hover:opacity-90">
          <Plus className="w-4 h-4" /> Add Amenity
        </button>
      </div>

      {showForm && (
        <div className="bg-card rounded-xl p-6 shadow-card mb-6 flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-sm text-muted-foreground mb-1 block">Amenity Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Swimming Pool"
              className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-secondary"
              onKeyDown={e => e.key === 'Enter' && save()}
            />
          </div>
          <button onClick={save} className="bg-secondary text-accent-foreground rounded-lg px-6 py-2.5 text-sm font-semibold hover:opacity-90">
            {editingId ? 'Update' : 'Add'}
          </button>
          <button onClick={() => { setShowForm(false); setEditingId(null); setName(''); }} className="border border-border rounded-lg px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted">
            Cancel
          </button>
        </div>
      )}

      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-px bg-border">
          {items.map(a => (
            <div key={a.id} className="bg-card px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-foreground">{a.name}</span>
              <div className="flex gap-1">
                <button onClick={() => startEdit(a)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => remove(a.id)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
        {items.length === 0 && (
          <p className="px-4 py-8 text-center text-muted-foreground">No amenities yet</p>
        )}
      </div>
    </div>
  );
}
