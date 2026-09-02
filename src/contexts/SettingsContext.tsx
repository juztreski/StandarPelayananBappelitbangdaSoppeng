import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { SiteSettings } from '@/types/siteSettings';

interface SettingsContextValue {
  settings: SiteSettings;
  loading: boolean;
  refresh: () => Promise<void>;
}

const defaultSettings: SiteSettings = {
  id: 1,
  site_title: 'BAPPELITBANGDA',
  site_subtitle: 'Kabupaten Soppeng',
  logo_url: '/logo_soppeng.png',
  banner_url: '/images/Xvo0g.jpg',
  banner_title: 'Standar Pelayanan BAPPELITBANGDA',
  banner_subtitle: 'Panduan resmi jenis-jenis pelayanan Badan Perencanaan Pembangunan, Penelitian dan Pengembangan Daerah Kabupaten Soppeng.',
  updated_at: '',
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    const { data } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();
    if (data) {
      setSettings(data as SiteSettings);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refresh: loadSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
