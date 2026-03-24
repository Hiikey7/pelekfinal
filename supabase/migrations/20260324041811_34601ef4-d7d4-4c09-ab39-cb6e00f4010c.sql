-- Add promo_code and offer_type columns to offers
ALTER TABLE public.offers ADD COLUMN promo_code text NOT NULL DEFAULT '';
ALTER TABLE public.offers ADD COLUMN offer_type text NOT NULL DEFAULT 'cta_button';

-- Create storage bucket for offer images
INSERT INTO storage.buckets (id, name, public) VALUES ('offer-images', 'offer-images', true);

-- Allow admins to upload/manage offer images
CREATE POLICY "Admins can manage offer images" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'offer-images' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'offer-images' AND public.has_role(auth.uid(), 'admin'));

-- Public can view offer images
CREATE POLICY "Public can view offer images" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'offer-images');