-- Create amenities table
CREATE TABLE public.amenities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.amenities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read amenities" ON public.amenities FOR SELECT USING (true);
CREATE POLICY "Admins can manage amenities" ON public.amenities FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Seed some common amenities
INSERT INTO public.amenities (name) VALUES
  ('WiFi'), ('Swimming Pool'), ('Parking'), ('Air Conditioning'), ('Kitchen'),
  ('TV'), ('Washer'), ('Dryer'), ('Hot Tub'), ('Gym'), ('Garden'),
  ('Balcony'), ('Security'), ('CCTV'), ('Generator'), ('Water Tank'),
  ('BBQ Area'), ('Pet Friendly'), ('Elevator'), ('Furnished');

-- Create storage bucket for property images
INSERT INTO storage.buckets (id, name, public) VALUES ('property-images', 'property-images', true);

-- Storage policies
CREATE POLICY "Anyone can view property images" ON storage.objects FOR SELECT USING (bucket_id = 'property-images');
CREATE POLICY "Admins can upload property images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'property-images' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete property images" ON storage.objects FOR DELETE USING (bucket_id = 'property-images' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update property images" ON storage.objects FOR UPDATE USING (bucket_id = 'property-images' AND has_role(auth.uid(), 'admin'));