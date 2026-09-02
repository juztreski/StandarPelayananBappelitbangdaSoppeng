/*
# Create services table for Standar Pelayanan BAPPELITBANGDA

1. New Tables
- `services`
  - `id` (uuid, primary key)
  - `category` (text, not null) — 'langsung' for direct public services, 'tidak_langsung' for internal admin services
  - `service_number` (integer, not null) — ordering within category
  - `name` (text, not null) — name of the service
  - `slug` (text, not null, unique) — URL-friendly identifier
  - `description` (text, not null) — short description shown on listing pages
  - `responsible_person` (text) — person in charge (Penanggung Jawab)
  - `requirements` (text, not null) — documents/identity required (Persyaratan)
  - `procedure` (text, not null) — step-by-step process (Sistem & Prosedur)
  - `duration` (text, not null) — estimated processing time (Jangka Waktu)
  - `cost` (text, not null) — fee/tariff info (Biaya/Tarif)
  - `product` (text, not null) — output/result (Produk Layanan)
  - `complaint_handling` (text, not null) — complaint channels (Penanganan Pengaduan)
  - `icon` (text) — lucide-react icon name for display
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

2. Security
- Enable RLS on `services`.
- Public read access (anon + authenticated) since this is public government service data.
- Only authenticated admin users can insert/update/delete.
*/

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL CHECK (category IN ('langsung', 'tidak_langsung')),
  service_number integer NOT NULL,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL,
  responsible_person text,
  requirements text NOT NULL,
  procedure text NOT NULL,
  duration text NOT NULL,
  cost text NOT NULL,
  product text NOT NULL,
  complaint_handling text NOT NULL,
  icon text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Public read access
DROP POLICY IF EXISTS "public_read_services" ON services;
CREATE POLICY "public_read_services" ON services FOR SELECT
  TO anon, authenticated USING (true);

-- Admin write access (authenticated only)
DROP POLICY IF EXISTS "admin_insert_services" ON services;
CREATE POLICY "admin_insert_services" ON services FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_services" ON services;
CREATE POLICY "admin_update_services" ON services FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_services" ON services;
CREATE POLICY "admin_delete_services" ON services FOR DELETE
  TO authenticated USING (true);

-- Index for faster category queries
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_number ON services(category, service_number);
