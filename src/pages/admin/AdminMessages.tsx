import { useEffect, useState } from 'react';
import { backend } from '@/integrations/backend/client';
import { Trash2, Mail, MailOpen } from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/backend/types';

type Message = Tables<'contact_messages'>;

export default function AdminMessages() {
  const [items, setItems] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);

  const fetchData = async () => {
    const { data } = await backend.from('contact_messages').select('*').order('created_at', { ascending: false });
    if (data) setItems(data);
  };
  useEffect(() => { fetchData(); }, []);

  const markRead = async (msg: Message) => {
    setSelected(msg);
    if (!msg.read) {
      await backend.from('contact_messages').update({ read: true }).eq('id', msg.id);
      fetchData();
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete?')) return;
    await backend.from('contact_messages').delete().eq('id', id);
    if (selected?.id === id) setSelected(null);
    toast.success('Deleted');
    fetchData();
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground mb-6">Contact Messages</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 bg-card rounded-xl shadow-card overflow-hidden">
          <div className="max-h-[70vh] overflow-y-auto">
            {items.map(m => (
              <button
                key={m.id}
                onClick={() => markRead(m)}
                className={`w-full text-left px-4 py-3 border-b border-border hover:bg-muted transition-colors ${selected?.id === m.id ? 'bg-muted' : ''}`}
              >
                <div className="flex items-center gap-2">
                  {m.read ? <MailOpen className="w-4 h-4 text-muted-foreground" /> : <Mail className="w-4 h-4 text-secondary" />}
                  <span className={`text-sm font-medium ${m.read ? 'text-muted-foreground' : 'text-foreground'}`}>{m.full_name}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">{m.subject || m.message}</p>
              </button>
            ))}
            {items.length === 0 && <p className="px-4 py-8 text-center text-muted-foreground text-sm">No messages</p>}
          </div>
        </div>
        <div className="md:col-span-2 bg-card rounded-xl shadow-card p-6">
          {selected ? (
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="font-display text-lg font-semibold text-foreground">{selected.subject || 'No Subject'}</h2>
                  <p className="text-sm text-muted-foreground">From: {selected.full_name} ({selected.email})</p>
                  {selected.phone && <p className="text-sm text-muted-foreground">Phone: {selected.phone}</p>}
                  <p className="text-xs text-muted-foreground mt-1">{new Date(selected.created_at).toLocaleString()}</p>
                </div>
                <button onClick={() => remove(selected.id)} className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div>
              <p className="text-foreground leading-relaxed">{selected.message}</p>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-12">Select a message to view</p>
          )}
        </div>
      </div>
    </div>
  );
}
