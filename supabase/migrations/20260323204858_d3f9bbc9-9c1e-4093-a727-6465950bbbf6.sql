
-- Drop the overly permissive insert policy and replace with a more specific one
DROP POLICY "Anyone can insert messages" ON public.contact_messages;
CREATE POLICY "Anyone can submit contact form" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
