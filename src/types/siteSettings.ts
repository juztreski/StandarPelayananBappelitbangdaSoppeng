export interface SiteSettings {
  id: number;
  site_title: string;
  site_subtitle: string;
  logo_url: string | null;
  banner_url: string | null;
  banner_title: string | null;
  banner_subtitle: string | null;
  updated_at: string;
}

export interface SiteSettingsInput {
  site_title: string;
  site_subtitle: string;
  logo_url: string | null;
  banner_url: string | null;
  banner_title: string | null;
  banner_subtitle: string | null;
}
