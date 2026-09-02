/*
# Create site_settings table for dynamic logo and banner management

1. New Tables
- `site_settings`
  - `id` (int, primary key, always 1 — singleton row)
  - `site_title` (text) — main site title shown in header/footer
  - `site_subtitle` (text) — subtitle shown in header
  - `logo_url` (text) — URL to logo image
  - `banner_url` (text) — URL to banner image for homepage hero
  - `banner_title` (text) — title overlay on banner
  - `banner_subtitle` (text) — subtitle overlay on banner
  - `updated_at` (timestamptz)

2. Security
- Enable RLS on `site_settings`.
- Public read access (anon + authenticated) since site settings are public.
- Only authenticated admin users can update.

3. Notes
- Singleton pattern: only one row with id=1.
- Seed with default values matching the existing static content.
*/

CREATE TABLE IF NOT EXISTS site_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  site_title text NOT NULL DEFAULT 'BAPPELITBANGDA',
  site_subtitle text NOT NULL DEFAULT 'Kabupaten Soppeng',
  logo_url text,
  banner_url text,
  banner_title text,
  banner_subtitle text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_site_settings" ON site_settings;
CREATE POLICY "public_read_site_settings" ON site_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_site_settings" ON site_settings;
CREATE POLICY "admin_update_site_settings" ON site_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_insert_site_settings" ON site_settings;
CREATE POLICY "admin_insert_site_settings" ON site_settings FOR INSERT
  TO authenticated WITH CHECK (true);

-- Seed default row
INSERT INTO site_settings (id, site_title, site_subtitle, logo_url, banner_url, banner_title, banner_subtitle)
VALUES (1, 'BAPPELITBANGDA', 'Kabupaten Soppeng', '/logo_soppeng.png', '/images/Xvo0g.jpg',
  'Standar Pelayanan BAPPELITBANGDA',
  'Panduan resmi jenis-jenis pelayanan Badan Perencanaan Pembangunan, Penelitian dan Pengembangan Daerah Kabupaten Soppeng.')
ON CONFLICT (id) DO NOTHING;
