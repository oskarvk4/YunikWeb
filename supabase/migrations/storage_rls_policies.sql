-- Storage RLS Policies for product-images bucket
-- Run this in Supabase Dashboard > SQL Editor

-- 1. Enable RLS on storage.objects (if not already)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 2. Allow PUBLIC to view/download images (for displaying on site)
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- 3. Only ADMINS can upload images
CREATE POLICY "Admins can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images'
  AND EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- 4. Only ADMINS can update images
CREATE POLICY "Admins can update product images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images'
  AND EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- 5. Only ADMINS can delete images
CREATE POLICY "Admins can delete product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images'
  AND EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);
