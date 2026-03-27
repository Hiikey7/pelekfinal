import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Trash2, Eye, Download, Send, X } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Property {
  id: string;
  title: string;
  price: number;
  price_label: string;
}

interface Order {
  id: string;
  visitor_name: string;
  phone: string;
  property_id: string | null;
  property_title: string;
  price_per_night: number;
  num_days: number;
  total_amount: number;
  payment_method: string;
  status: string;
  notes: string;
  created_at: string;
}

const PAYMENT_METHODS = ['Cash', 'M-Pesa', 'Bank Transfer', 'Card'];
const BRAND = {
  name: 'Pelek Properties',
  tagline: 'Premium Airbnb & Rental Properties',
  whatsapp: '+254700000000',
  email: 'info@pelekproperties.com',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [viewReceipt, setViewReceipt] = useState<Order | null>(null);
  const [filterMonth, setFilterMonth] = useState('');
  const [form, setForm] = useState({
    visitor_name: '',
    phone: '',
    property_id: '',
    price_per_night: 0,
    num_days: 1,
    payment_method: 'Cash',
    notes: '',
  });
  const receiptRef = useRef<HTMLDivElement>(null);

  const fetchOrders = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (data) setOrders(data as Order[]);
  };

  const fetchProperties = async () => {
    const { data } = await supabase.from('properties').select('id, title, price, price_label');
    if (data) setProperties(data);
  };

  useEffect(() => {
    fetchOrders();
    fetchProperties();
  }, []);

  const handlePropertyChange = (propertyId: string) => {
    const prop = properties.find(p => p.id === propertyId);
    setForm(f => ({
      ...f,
      property_id: propertyId,
      price_per_night: prop?.price ?? 0,
    }));
  };

  const total = form.price_per_night * form.num_days;

  const save = async () => {
    if (!form.visitor_name || !form.property_id) {
      toast.error('Fill visitor name and select a property');
      return;
    }
    const prop = properties.find(p => p.id === form.property_id);
    const { error } = await supabase.from('orders').insert({
      visitor_name: form.visitor_name,
      phone: form.phone,
      property_id: form.property_id,
      property_title: prop?.title ?? '',
      price_per_night: form.price_per_night,
      num_days: form.num_days,
      total_amount: total,
      payment_method: form.payment_method,
      notes: form.notes,
      status: 'confirmed',
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Order recorded');
    setShowForm(false);
    setForm({ visitor_name: '', phone: '', property_id: '', price_per_night: 0, num_days: 1, payment_method: 'Cash', notes: '' });
    fetchOrders();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this order?')) return;
    await supabase.from('orders').delete().eq('id', id);
    toast.success('Deleted');
    if (viewReceipt?.id === id) setViewReceipt(null);
    fetchOrders();
  };

  const filteredOrders = filterMonth
    ? orders.filter(o => o.created_at.slice(0, 7) === filterMonth)
    : orders;

  const downloadCSV = () => {
    const rows = filteredOrders.map(o => ({
      Date: new Date(o.created_at).toLocaleDateString(),
      Guest: o.visitor_name,
      Phone: o.phone,
      Property: o.property_title,
      'Price/Night': o.price_per_night,
      Days: o.num_days,
      Total: o.total_amount,
      Payment: o.payment_method,
      Status: o.status,
      Notes: o.notes,
    }));
    if (rows.length === 0) { toast.error('No orders to export'); return; }
    const headers = Object.keys(rows[0]);
    const csv = [headers.join(','), ...rows.map(r => headers.map(h => `"${String((r as any)[h]).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders${filterMonth ? '-' + filterMonth : ''}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV downloaded');
  };

  const generateReceiptHTML = (order: Order) => {
    return `
<!DOCTYPE html><html><head><meta charset="utf-8"><title>Receipt</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',sans-serif;padding:40px;max-width:600px;margin:auto;color:#1a1a1a}
.header{text-align:center;border-bottom:3px solid #0d9488;padding-bottom:20px;margin-bottom:24px}
.brand{font-size:24px;font-weight:700;color:#0d4d40}
.tagline{font-size:12px;color:#666;margin-top:4px}
.receipt-no{font-size:13px;color:#888;margin-top:8px}
.row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #eee;font-size:14px}
.row .label{color:#666;font-weight:500}
.row .value{font-weight:600}
.total-row{font-size:18px;color:#0d4d40;border-top:2px solid #0d9488;margin-top:8px;padding-top:12px}
.footer{text-align:center;margin-top:32px;padding-top:16px;border-top:1px solid #eee;font-size:12px;color:#888}
.footer a{color:#0d9488}
</style></head><body>
<div class="header">
  <div class="brand">${BRAND.name}</div>
  <div class="tagline">${BRAND.tagline}</div>
  <div class="receipt-no">Receipt #${order.id.slice(0, 8).toUpperCase()}</div>
  <div class="receipt-no">${new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
</div>
<div class="row"><span class="label">Guest Name</span><span class="value">${order.visitor_name}</span></div>
<div class="row"><span class="label">Phone</span><span class="value">${order.phone || 'N/A'}</span></div>
<div class="row"><span class="label">Property</span><span class="value">${order.property_title}</span></div>
<div class="row"><span class="label">Price / Night</span><span class="value">KES ${Number(order.price_per_night).toLocaleString()}</span></div>
<div class="row"><span class="label">Number of Days</span><span class="value">${order.num_days}</span></div>
<div class="row"><span class="label">Payment Method</span><span class="value">${order.payment_method}</span></div>
<div class="row total-row"><span class="label">Total Amount</span><span class="value">KES ${Number(order.total_amount).toLocaleString()}</span></div>
${order.notes ? `<div class="row"><span class="label">Notes</span><span class="value">${order.notes}</span></div>` : ''}
<div class="footer">
  <p>Thank you for choosing ${BRAND.name}</p>
  <p>WhatsApp: <a href="https://wa.me/${BRAND.whatsapp.replace('+', '')}">${BRAND.whatsapp}</a> | ${BRAND.email}</p>
</div>
</body></html>`;
  };

  const downloadReceipt = (order: Order) => {
    const html = generateReceiptHTML(order);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${order.id.slice(0, 8)}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Receipt downloaded');
  };

  const sendWhatsApp = (order: Order) => {
    const text = encodeURIComponent(
      `🧾 *Receipt - ${BRAND.name}*\n` +
      `Receipt #${order.id.slice(0, 8).toUpperCase()}\n\n` +
      `Guest: ${order.visitor_name}\n` +
      `Property: ${order.property_title}\n` +
      `Days: ${order.num_days}\n` +
      `Price/Night: KES ${Number(order.price_per_night).toLocaleString()}\n` +
      `*Total: KES ${Number(order.total_amount).toLocaleString()}*\n` +
      `Payment: ${order.payment_method}\n\n` +
      `Thank you for choosing ${BRAND.name}! 🏠`
    );
    const phone = order.phone?.replace(/[^0-9]/g, '') || '';
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <div className="min-w-0">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-display text-2xl font-bold text-foreground">Orders</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" className="gap-2" onClick={downloadCSV}><Download className="w-4 h-4" /> CSV</Button>
          <Button size="sm" onClick={() => setShowForm(true)} className="gap-2"><Plus className="w-4 h-4" /> New Order</Button>
        </div>
      </div>

      {/* Month filter */}
      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm font-medium text-muted-foreground">Filter by month:</label>
        <Input type="month" value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="w-44" />
        {filterMonth && <button onClick={() => setFilterMonth('')} className="text-xs text-secondary hover:underline">Clear</button>}
      </div>

      {/* New Order Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-card rounded-xl shadow-card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold text-foreground">Record New Order</h2>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-muted rounded-lg"><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Visitor Name *</label>
                <Input value={form.visitor_name} onChange={e => setForm(f => ({ ...f, visitor_name: e.target.value }))} placeholder="Guest name" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Phone Number</label>
                <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+254..." />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Property *</label>
                <select
                  value={form.property_id}
                  onChange={e => handlePropertyChange(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select property...</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.title} — KES {p.price.toLocaleString()}/{p.price_label || 'night'}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1">Price / Night (KES)</label>
                  <Input type="number" value={form.price_per_night} onChange={e => setForm(f => ({ ...f, price_per_night: Number(e.target.value) }))} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1">Number of Days</label>
                  <Input type="number" min={1} value={form.num_days} onChange={e => setForm(f => ({ ...f, num_days: Number(e.target.value) }))} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Payment Method</label>
                <select
                  value={form.payment_method}
                  onChange={e => setForm(f => ({ ...f, payment_method: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Notes</label>
                <Input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Optional notes" />
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold text-foreground">KES {total.toLocaleString()}</p>
              </div>
              <Button onClick={save} className="w-full">Record Order</Button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {viewReceipt && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setViewReceipt(null)}>
          <div className="bg-card rounded-xl shadow-card w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6" ref={receiptRef}>
              <div className="text-center border-b-2 border-secondary pb-4 mb-4">
                <h2 className="font-display text-xl font-bold text-primary">{BRAND.name}</h2>
                <p className="text-xs text-muted-foreground">{BRAND.tagline}</p>
                <p className="text-xs text-muted-foreground mt-1">Receipt #{viewReceipt.id.slice(0, 8).toUpperCase()}</p>
                <p className="text-xs text-muted-foreground">{new Date(viewReceipt.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              {[
                ['Guest Name', viewReceipt.visitor_name],
                ['Phone', viewReceipt.phone || 'N/A'],
                ['Property', viewReceipt.property_title],
                ['Price / Night', `KES ${Number(viewReceipt.price_per_night).toLocaleString()}`],
                ['Number of Days', viewReceipt.num_days],
                ['Payment Method', viewReceipt.payment_method],
              ].map(([label, value]) => (
                <div key={String(label)} className="flex justify-between py-2 border-b border-border text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-foreground">{value}</span>
                </div>
              ))}
              <div className="flex justify-between py-3 border-t-2 border-secondary mt-2 text-lg">
                <span className="text-muted-foreground font-medium">Total</span>
                <span className="font-bold text-primary">KES {Number(viewReceipt.total_amount).toLocaleString()}</span>
              </div>
              {viewReceipt.notes && (
                <div className="flex justify-between py-2 border-b border-border text-sm">
                  <span className="text-muted-foreground">Notes</span>
                  <span className="font-medium text-foreground">{viewReceipt.notes}</span>
                </div>
              )}
              <div className="text-center mt-6 text-xs text-muted-foreground">
                <p>Thank you for choosing {BRAND.name}</p>
                <p>WhatsApp: {BRAND.whatsapp}</p>
              </div>
            </div>
            <div className="flex gap-2 p-4 border-t border-border">
              <Button variant="outline" className="flex-1 gap-2" onClick={() => downloadReceipt(viewReceipt)}>
                <Download className="w-4 h-4" /> Download
              </Button>
              <Button className="flex-1 gap-2" onClick={() => sendWhatsApp(viewReceipt)}>
                <Send className="w-4 h-4" /> WhatsApp
              </Button>
              <button onClick={() => setViewReceipt(null)} className="px-3 py-2 text-sm text-muted-foreground hover:bg-muted rounded-lg">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Guest</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Property</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Days</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Total</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Payment</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(o => (
                <tr key={o.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-foreground font-medium">{o.visitor_name}</td>
                  <td className="px-4 py-3 text-foreground">{o.property_title}</td>
                  <td className="px-4 py-3 text-foreground">{o.num_days}</td>
                  <td className="px-4 py-3 text-foreground font-medium">KES {Number(o.total_amount).toLocaleString()}</td>
                  <td className="px-4 py-3 text-foreground">{o.payment_method}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setViewReceipt(o)} className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-secondary" title="View Receipt"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => sendWhatsApp(o)} className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-secondary" title="Send via WhatsApp"><Send className="w-4 h-4" /></button>
                      <button onClick={() => remove(o.id)} className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-destructive" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
