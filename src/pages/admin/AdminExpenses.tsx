import { useEffect, useState } from 'react';
import { backend } from '@/integrations/backend/client';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const CATEGORIES = ['Ads', 'Repairs', 'Utilities', 'Supplies', 'Staff', 'Transport', 'Other'];

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  description: string;
  created_at: string;
}

export default function AdminExpenses() {
  const [items, setItems] = useState<Expense[]>([]);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', amount: 0, category: 'Other', description: '' });
  const [filterMonth, setFilterMonth] = useState('');

  const fetchData = async () => {
    const { data } = await backend.from('expenses').select('*').order('created_at', { ascending: false });
    if (data) setItems(data as Expense[]);
  };

  useEffect(() => { fetchData(); }, []);

  const openNew = () => { setEditing(null); setForm({ title: '', amount: 0, category: 'Other', description: '' }); setShowForm(true); };
  const openEdit = (e: Expense) => { setEditing(e); setForm({ title: e.title, amount: e.amount, category: e.category, description: e.description }); setShowForm(true); };

  const save = async () => {
    if (!form.title || !form.amount) { toast.error('Title and amount required'); return; }
    if (editing) {
      const { error } = await backend.from('expenses').update(form).eq('id', editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success('Updated');
    } else {
      const { error } = await backend.from('expenses').insert(form);
      if (error) { toast.error(error.message); return; }
      toast.success('Created');
    }
    setShowForm(false); fetchData();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this expense?')) return;
    await backend.from('expenses').delete().eq('id', id);
    toast.success('Deleted'); fetchData();
  };

  const filtered = filterMonth
    ? items.filter(i => i.created_at.slice(0, 7) === filterMonth)
    : items;

  const totalExpenses = filtered.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-display text-2xl font-bold text-foreground">Expenses</h1>
        <Button onClick={openNew} className="gap-2"><Plus className="w-4 h-4" /> Add Expense</Button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-muted-foreground">Filter by month:</label>
          <Input type="month" value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="w-44" />
          {filterMonth && <button onClick={() => setFilterMonth('')} className="text-xs text-secondary hover:underline">Clear</button>}
        </div>
        <div className="ml-auto bg-muted rounded-lg px-4 py-2">
          <span className="text-sm text-muted-foreground">Total: </span>
          <span className="text-sm font-bold text-foreground">KES {totalExpenses.toLocaleString()}</span>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-card rounded-xl p-6 shadow-card mb-6 space-y-4">
          <Input placeholder="Expense title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input type="number" placeholder="Amount (KES)" value={form.amount || ''} onChange={e => setForm({ ...form, amount: Number(e.target.value) })} />
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Input placeholder="Description (optional)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <div className="flex gap-3">
            <Button onClick={save}>{editing ? 'Update' : 'Create'}</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Amount</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-foreground">{new Date(e.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-foreground font-medium">{e.title}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{e.category}</td>
                  <td className="px-4 py-3 text-foreground font-medium">KES {Number(e.amount).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(e)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => remove(e.id)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-destructive ml-1"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No expenses recorded</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
