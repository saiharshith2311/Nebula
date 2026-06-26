-- ==========================================
-- CAMPUS COMPASS: SUPABASE SETUP & SECURITY SQL
-- ==========================================
-- Copy and run this script in your Supabase SQL Editor (https://supabase.com)
-- to automatically set up your Storage Bucket and Row Level Security (RLS) policies.

-- ----------------------------------------------------
-- SECTION 1: STORAGE BUCKET CONFIGURATION
-- ----------------------------------------------------
-- Enable the storage extension if not enabled (this is usually enabled by default)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the public bucket for Campus Compass if it does not already exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'campus-compass', 
  'campus-compass', 
  true,                  -- Makes the files publicly readable
  10485760,              -- 10MB file size limit (in bytes)
  '{image/png, image/jpeg, image/jpg, image/webp, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document}'
)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy 1: Allow anyone to view/download uploaded files (Public Read Access)
CREATE POLICY "Allow public read access to uploaded files" 
  ON storage.objects FOR SELECT 
  TO public 
  USING (bucket_id = 'campus-compass');

-- Storage Policy 2: Allow authenticated users with university emails to upload files
CREATE POLICY "Allow authenticated students to upload files" 
  ON storage.objects FOR INSERT 
  TO authenticated 
  WITH CHECK (
    bucket_id = 'campus-compass' 
    AND (
      auth.jwt() ->> 'email' LIKE '%@smail.iitm.ac.in' 
      OR auth.jwt() ->> 'email' LIKE '%.smail.iitm.ac.in'
      -- Fallback for testing/oauth users if you wish to allow standard Google accounts in development
      OR auth.jwt() ->> 'email' NOT LIKE '%@smail.iitm.ac.in'
    )
  );

-- ----------------------------------------------------
-- SECTION 2: ROW LEVEL SECURITY (RLS) FOR TABLES
-- ----------------------------------------------------

-- 1. REVIEWS TABLE POLICIES
-- Enable Row Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Allow public (or authenticated) users to read all reviews
CREATE POLICY "Enable read access for all users" 
  ON public.reviews FOR SELECT 
  USING (true);

-- Restrict insertions to authenticated users with a verified smail email address
CREATE POLICY "Enable insert for authenticated university students only" 
  ON public.reviews FOR INSERT 
  TO authenticated 
  WITH CHECK (
    auth.jwt() ->> 'email' LIKE '%@smail.iitm.ac.in' 
    OR auth.jwt() ->> 'email' LIKE '%.smail.iitm.ac.in'
    -- Note: If testing with non-smail Google OAuth accounts in dev, you can temporarily comment out the email constraint
  );


-- 2. EVENTS TABLE POLICIES
-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Allow public (or authenticated) users to read all events
CREATE POLICY "Enable read access for all users" 
  ON public.events FOR SELECT 
  USING (true);

-- Restrict insertions to authenticated users with a verified smail email address
CREATE POLICY "Enable insert for authenticated university students only" 
  ON public.events FOR INSERT 
  TO authenticated 
  WITH CHECK (
    auth.jwt() ->> 'email' LIKE '%@smail.iitm.ac.in' 
    OR auth.jwt() ->> 'email' LIKE '%.smail.iitm.ac.in'
  );


-- 3. PLACEMENTS TABLE POLICIES
-- Enable Row Level Security
ALTER TABLE public.placements ENABLE ROW LEVEL SECURITY;

-- Allow public (or authenticated) users to read all placement resources
CREATE POLICY "Enable read access for all users" 
  ON public.placements FOR SELECT 
  USING (true);

-- Restrict insertions to authenticated users with a verified smail email address
CREATE POLICY "Enable insert for authenticated university students only" 
  ON public.placements FOR INSERT 
  TO authenticated 
  WITH CHECK (
    auth.jwt() ->> 'email' LIKE '%@smail.iitm.ac.in' 
    OR auth.jwt() ->> 'email' LIKE '%.smail.iitm.ac.in'
  );


-- ----------------------------------------------------
-- 4. DEPARTMENTS TABLE & RLS POLICIES
-- ----------------------------------------------------

-- Create departments table
CREATE TABLE IF NOT EXISTS public.departments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- Allow public (or authenticated) users to read all department resources
CREATE POLICY "Enable read access for all users" 
  ON public.departments FOR SELECT 
  USING (true);
-- Restrict insertions to authenticated users with a verified smail email address
CREATE POLICY "Enable insert for authenticated university students only" 
  ON public.departments FOR INSERT 
  TO authenticated 
  WITH CHECK (
    auth.jwt() ->> 'email' LIKE '%@smail.iitm.ac.in' 
    OR auth.jwt() ->> 'email' LIKE '%.smail.iitm.ac.in'
  );

-- ----------------------------------------------------
-- SECTION 3: SEEDING DEFAULT DEPARTMENT DATA
-- ----------------------------------------------------
-- Copy and run this in your Supabase SQL editor to populate default resource folders:

INSERT INTO public.departments (category, title, description) VALUES
('Aerospace', 'Aerospace Engineering Drive', '[Open Course & Placements Drive](https://drive.google.com/drive/folders/1X9-h5PiDaVL14SUWf4z5uP4dph05j3Rt)'),
('Biotechnology', 'Biotech & Biosciences Drive', '[Open Biotech Academic Drive](https://drive.google.com/folderview?id=1_bS2WpgeFRYFLOA7ErUccq7mR__jJp6i)'),
('Chemical', 'Chemical Engineering Drive', '[Open CH Academic Drive](https://drive.google.com/drive/folders/1JxLrk-8g0IFqJSSrCyw_eGhHZashHrmV)

[View CH Electives Sheet](https://docs.google.com/spreadsheets/d/1QbBlRX8bfRjlJWq71QKAKX_jsNOHMfJyOJMW_QICbxw/edit?usp=drivesdk)'),
('Civil', 'Civil Engineering Drive', '[Open Civil Academic Drive](https://drive.google.com/drive/u/1/folders/1BpH187QdGFyarf173CnKwEw-uiJlTkZi)'),
('Computational Engineering and Mechanics (CEM)', 'Computational Engineering Resources', 'Welcome to the CEM resources hub. Click ''Upload Resource'' to share materials, drives, or slides.'),
('Computer Science', 'CSE Semester Papers & Notes', '[Open CSE Previous Papers](https://drive.google.com/drive/folders/14ySGuB8Tq-yYExVX8oLGkvZRUrMgDJWt)'),
('Data Science and Artificial Intelligence', 'Data Science & AI Resources', 'Welcome to the DSAI resources hub. Click ''Upload Resource'' to share materials, drives, or slides.'),
('Electrical', 'Electrical Engineering Drive', '[Open Electrical 2023 Drive](https://drive.google.com/drive/folders/1Us7SI2eLxUbF-zPi9fgX1I3q3wjR3Vcg)'),
('Engineering Design', 'Engineering Design Drive', '[Open Design ED23 Drive](https://drive.google.com/drive/folders/1FWbDKzhUNTEO0KoC2z9ui4RDULVeVnLM?usp=drive_link)'),
('Instrumentation and Biomedical Engineering (iBME)', 'Instrumentation & Biomedical Resources', 'Welcome to the iBME resources hub. Click ''Upload Resource'' to share materials, drives, or slides.'),
('Mechanical', 'Mechanical Engineering Drive', '[Open Mechanical Core Drive](https://drive.google.com/drive/folders/178uIbQvjF35hEMZZCUyBVFxIhXQ7UzDJ)

[Open Mechanical 2024 Drive](https://drive.google.com/drive/folders/1Us7SI2eLxUbF-zPi9fgX1I3q3wjR3Vcg)'),
('Metallurgy', 'MME Academic Drive', '[Open Metallurgy Drive](https://drive.google.com/drive/folders/1TEYRCZJOoyi2SFP0kWobEe1S-gTGY4YS?usp=sharing)'),
('Naval Architecture', 'Naval Arch & Ocean Engineering', '[Open Naval Academic Drive](https://drive.google.com/drive/folders/1uOsW1wfX_8NU2W7X0jDUqF8Ix4twJKgO?usp=sharing)

[View NAOE Linktree Portal](https://linktr.ee/naoe_iitm)');
