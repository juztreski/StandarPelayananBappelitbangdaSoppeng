import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, AlertCircle, ImageIcon, Building2, Type } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSettings } from '@/contexts/SettingsContext';
import type { SiteSettingsInput } from '@/types/siteSettings';

export default function AdminSettingsPage() {
  const { settings, refresh } = useSettings();
  const [form, setForm] = useState<SiteSettingsInput>({
    site_title: '',
    site_subtitle: '',
    logo_url: null,
    banner_url: null,
    banner_title: null,
    banner_subtitle: null,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({
        site_title: settings.site_title,
        site_subtitle: settings.site_subtitle,
        logo_url: settings.logo_url,
        banner_url: settings.banner_url,
        banner_title: settings.banner_title,
        banner_subtitle: settings.banner_subtitle,
      });
    }
  }, [settings]);

  const handleChange = (field: keyof SiteSettingsInput, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value || null }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    const { error } = await supabase
      .from('site_settings')
      .update({
        ...form,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1);

    setSaving(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      await refresh();
    }
  };

  const inputClass = 'w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all';
  const labelClass = 'block text-sm font-medium text-slate-700 mb-1.5';

  return (
    <div className="p-8 max-w-4xl">
      <Link
        to="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke dashboard
      </Link>

      <h1 className="text-2xl font-bold text-slate-900 mb-1">Pengaturan Situs</h1>
      <p className="text-sm text-slate-500 mb-8">
        Kelola logo, banner, dan identitas website
      </p>

      {error && (
        <div className="mb-6 flex items-start gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-emerald-50 border border-emerald-100 text-sm text-emerald-700">
          Pengaturan berhasil disimpan.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identity */}
        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-semibold text-slate-900">Identitas Instansi</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Judul Situs</label>
              <input
                type="text"
                required
                value={form.site_title}
                onChange={(e) => handleChange('site_title', e.target.value)}
                className={inputClass}
                placeholder="BAPPELITBANGDA"
              />
            </div>
            <div>
              <label className={labelClass}>Subjudul Situs</label>
              <input
                type="text"
                required
                value={form.site_subtitle}
                onChange={(e) => handleChange('site_subtitle', e.target.value)}
                className={inputClass}
                placeholder="Kabupaten Soppeng"
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>URL Logo</label>
              <input
                type="text"
                value={form.logo_url ?? ''}
                onChange={(e) => handleChange('logo_url', e.target.value)}
                className={inputClass}
                placeholder="/logo_soppeng.png"
              />
              <p className="mt-1 text-xs text-slate-400">
                Letakkan file logo di folder <code>public/</code> dan isi path seperti <code>/logo_soppeng.png</code>
              </p>
              {form.logo_url && (
                <div className="mt-3 flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <img src={form.logo_url} alt="Logo preview" className="w-12 h-12 rounded-lg object-contain bg-white" />
                  <span className="text-xs text-slate-500">Pratinjau logo</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Banner */}
        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-semibold text-slate-900">Banner Beranda</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>URL Gambar Banner</label>
              <input
                type="text"
                value={form.banner_url ?? ''}
                onChange={(e) => handleChange('banner_url', e.target.value)}
                className={inputClass}
                placeholder="/images/Xvo0g.jpg"
              />
              <p className="mt-1 text-xs text-slate-400">
                Letakkan file banner di folder <code>public/images/</code> dan isi path seperti <code>/images/banner.jpg</code>
              </p>
              {form.banner_url && (
                <div className="mt-3 rounded-lg overflow-hidden border border-slate-200">
                  <img src={form.banner_url} alt="Banner preview" className="w-full h-40 object-cover" />
                </div>
              )}
            </div>
            <div>
              <label className={labelClass}>Judul Banner</label>
              <input
                type="text"
                value={form.banner_title ?? ''}
                onChange={(e) => handleChange('banner_title', e.target.value)}
                className={inputClass}
                placeholder="Standar Pelayanan BAPPELITBANGDA"
              />
            </div>
            <div>
              <label className={labelClass}>Subjudul Banner</label>
              <textarea
                value={form.banner_subtitle ?? ''}
                onChange={(e) => handleChange('banner_subtitle', e.target.value)}
                rows={3}
                className={inputClass}
                placeholder="Deskripsi singkat yang tampil di atas banner"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link
            to="/admin"
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Simpan Pengaturan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
