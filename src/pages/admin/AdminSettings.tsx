import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";

interface Setting {
  id: string;
  key: string;
  value: string;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [form, setForm] = useState({ whatsapp: "", instagram: "", tiktok: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("site_settings").select("*");
      if (data) {
        setSettings(data as Setting[]);
        const mapped: any = { whatsapp: "", instagram: "", tiktok: "" };
        (data as Setting[]).forEach((s) => {
          if (s.key in mapped) mapped[s.key] = s.value;
        });
        setForm(mapped);
      }
    };
    fetch();
  }, []);

  const save = async () => {
    setSaving(true);
    for (const key of ["whatsapp", "instagram", "tiktok"] as const) {
      const existing = settings.find((s) => s.key === key);
      if (existing) {
        await supabase
          .from("site_settings")
          .update({ value: form[key] })
          .eq("id", existing.id);
      }
    }
    setSaving(false);
    toast.success("Settings saved");
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground mb-6">
        Settings
      </h1>
      <div className="bg-card rounded-xl p-6 shadow-card space-y-6 max-w-lg">
        <div>
          <label className="text-sm font-medium text-foreground block mb-1">
            WhatsApp Number
          </label>
          <Input
            value={form.whatsapp}
            onChange={(e) =>
              setForm((f) => ({ ...f, whatsapp: e.target.value }))
            }
            placeholder="+254711614099"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Used in mobile nav and property pages
          </p>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1">
            Instagram URL
          </label>
          <Input
            value={form.instagram}
            onChange={(e) =>
              setForm((f) => ({ ...f, instagram: e.target.value }))
            }
            placeholder="https://instagram.com/yourpage"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground block mb-1">
            TikTok URL
          </label>
          <Input
            value={form.tiktok}
            onChange={(e) => setForm((f) => ({ ...f, tiktok: e.target.value }))}
            placeholder="https://tiktok.com/@yourpage"
          />
        </div>
        <Button onClick={save} disabled={saving} className="gap-2">
          <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
}
