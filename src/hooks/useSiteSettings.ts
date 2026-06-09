import { useEffect, useState } from "react";
import { backend } from "@/integrations/backend/client";

interface SiteSettings {
  whatsapp: string;
  instagram: string;
  tiktok: string;
  facebook: string;
}

const defaults: SiteSettings = {
  whatsapp: "+254711614099",
  instagram: "",
  tiktok: "",
  facebook: "",
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaults);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await backend
        .from("site_settings")
        .select("key, value");
      if (data) {
        const mapped = { ...defaults };
        data.forEach((row: { key: string; value: string }) => {
          if (row.key in mapped) {
            (mapped as any)[row.key] = row.value;
          }
        });
        setSettings(mapped);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  return { settings, loading };
}
