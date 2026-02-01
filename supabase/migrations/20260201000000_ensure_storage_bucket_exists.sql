-- Ensure storage bucket exists and is configured properly
-- This fixes the "Bucket not found" error when viewing documents in admin panel

-- Create bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'tutor-documents', 
  'tutor-documents', 
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE 
SET 
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];

-- Drop existing storage policies to recreate them
DROP POLICY IF EXISTS "Tutors can upload their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Tutors can read their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Public can read documents" ON storage.objects;
DROP POLICY IF EXISTS "Admin can read all documents" ON storage.objects;

-- Allow authenticated users to upload their own documents
CREATE POLICY "Tutors can upload their own documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'tutor-documents' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to read their own documents  
CREATE POLICY "Tutors can read their own documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'tutor-documents' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read access to all documents (since URLs are shared via public links)
CREATE POLICY "Public can read documents"
ON storage.objects
FOR SELECT
USING (bucket_id = 'tutor-documents');

-- Allow admin full access to all documents
CREATE POLICY "Admin can read all documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'tutor-documents' AND
  auth.uid() = 'a43652ff-1008-4730-9b59-33503ba34ea5'::uuid
);

CREATE POLICY "Admin can delete documents"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'tutor-documents' AND
  auth.uid() = 'a43652ff-1008-4730-9b59-33503ba34ea5'::uuid
);
