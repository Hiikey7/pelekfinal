import { useQuery } from "@tanstack/react-query";
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
  const { data: settings = defaults, isLoading: loading } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data } = await backend
        .from("site_settings")
        .select("key, value");

      const mapped = { ...defaults };
      if (data) {
        data.forEach((row: { key: string; value: string }) => {
          if (row.key in mapped) {
            mapped[row.key as keyof SiteSettings] = row.value;
          }
        });
      }
      return mapped;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return { settings, loading };
}
