import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Service, ServiceCategory, ServiceInput } from '@/types/service';
import { slugify } from '@/lib/utils';

const ICON_OPTIONS = [
  'MessageSquare', 'Megaphone', 'Database', 'DoorOpen', 'Lightbulb', 'Users',
  'FileText', 'BarChart3', 'ClipboardCheck', 'TrendingUp', 'Wallet', 'Coffee',
  'Calendar', 'Stethoscope', 'Baby', 'AlertCircle', 'Sun', 'GraduationCap',
  'ArrowLeftRight', 'Award', 'FileBarChart',
];

const emptyForm: ServiceInput = {
  category: 'langsung',
  service_number: 1,
  name: '',
  slug: '',
  description: '',
  responsible_person: '',
  requirements: '',
  procedure: '',
  duration: '',
  cost: 'Gratis / Tidak dipungut biaya',
  product: '',
  complaint_handling: '',
  icon: 'FileText',
};

export default function AdminServiceForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<ServiceInput>(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          const s = data as Service;
          setForm({
            category: s.category,
            service_number: s.service_number,
            name: s.name,
            slug: s.slug,
            description: s.description,
            responsible_person: s.responsible_person ?? '',
            requirements: s.requirements,
            procedure: s.procedure,
            duration: s.duration,
            cost: s.cost,
            product: s.product,
            complaint_handling: s.complaint_handling,
            icon: s.icon ?? 'FileText',
          });
        }
        setLoading(false);
      });
  }, [id]);

  const handleChange = (field: keyof ServiceInput, value: string | number) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'name' && !slugManuallyEdited) {
        next.slug = slugify(String(value));
      }
      if (field === 'slug') {
        setSlugManuallyEdited(true);
      }
      return next;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      responsible_person: form.responsible_person || null,
      icon: form.icon || null,
      slug: form.slug || slugify(form.name),
      updated_at: new Date().toISOString(),
    };

    const { error } = isEdit
      ? await supabase.from('services').update(payload).eq('id', id!)
      : await supabase.from('services').insert(payload);

    setSaving(false);

    if (error) {
      setError(error.message);
    } else {
      navigate('/admin/services');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  const inputClass = 'w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all';
  const labelClass = 'block text-sm font-medium text-slate-700 mb-1.5';

  return (
    <div className="p-8 max-w-4xl">
      <Link
        to="/admin/services"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke daftar layanan
      </Link>

      <h1 className="text-2xl font-bold text-slate-900 mb-1">
        {isEdit ? 'Edit Layanan' : 'Tambah Layanan Baru'}
      </h1>
      <p className="text-sm text-slate-500 mb-8">
        {isEdit ? 'Perbarui informasi standar pelayanan' : 'Isi formulir di bawah untuk membuat standar pelayanan baru'}
      </p>

      {error && (
        <div className="mb-6 flex items-start gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Informasi Dasar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nama Layanan</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={inputClass}
                placeholder="Contoh: Konsultasi Perencanaan"
              />
            </div>
            <div>
              <label className={labelClass}>Slug (URL)</label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                className={inputClass}
                placeholder="konsultasi-perencanaan"
              />
            </div>
            <div>
              <label className={labelClass}>Kategori</label>
              <select
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className={inputClass}
              >
                <option value="langsung">Pelayanan Langsung</option>
                <option value="tidak_langsung">Pelayanan Tidak Langsung</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Nomor Urut</label>
              <input
                type="number"
                required
                min={1}
                value={form.service_number}
                onChange={(e) => handleChange('service_number', parseInt(e.target.value) || 1)}
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Deskripsi Singkat</label>
              <textarea
                required
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={2}
                className={inputClass}
                placeholder="Deskripsi singkat tentang layanan"
              />
            </div>
            <div>
              <label className={labelClass}>Penanggung Jawab</label>
              <input
                type="text"
                value={form.responsible_person ?? ''}
                onChange={(e) => handleChange('responsible_person', e.target.value)}
                className={inputClass}
                placeholder="Nama penanggung jawab"
              />
            </div>
            <div>
              <label className={labelClass}>Ikon</label>
              <select
                value={form.icon ?? 'FileText'}
                onChange={(e) => handleChange('icon', e.target.value)}
                className={inputClass}
              >
                {ICON_OPTIONS.map((icon) => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Detail Pelayanan</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Persyaratan</label>
              <textarea
                required
                value={form.requirements}
                onChange={(e) => handleChange('requirements', e.target.value)}
                rows={4}
                className={inputClass}
                placeholder="Dokumen & identitas yang wajib dibawa pemohon"
              />
            </div>
            <div>
              <label className={labelClass}>Sistem & Prosedur</label>
              <textarea
                required
                value={form.procedure}
                onChange={(e) => handleChange('procedure', e.target.value)}
                rows={5}
                className={inputClass}
                placeholder="Tahapan mekanisme dari pengajuan hingga selesai"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Jangka Waktu</label>
                <input
                  type="text"
                  required
                  value={form.duration}
                  onChange={(e) => handleChange('duration', e.target.value)}
                  className={inputClass}
                  placeholder="Contoh: 3 hari kerja"
                />
              </div>
              <div>
                <label className={labelClass}>Biaya/Tarif</label>
                <input
                  type="text"
                  required
                  value={form.cost}
                  onChange={(e) => handleChange('cost', e.target.value)}
                  className={inputClass}
                  placeholder="Contoh: Gratis"
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Produk Layanan</label>
              <textarea
                required
                value={form.product}
                onChange={(e) => handleChange('product', e.target.value)}
                rows={2}
                className={inputClass}
                placeholder="Output atau hasil akhir yang diterima pemohon"
              />
            </div>
            <div>
              <label className={labelClass}>Penanganan Pengaduan</label>
              <textarea
                required
                value={form.complaint_handling}
                onChange={(e) => handleChange('complaint_handling', e.target.value)}
                rows={2}
                className={inputClass}
                placeholder="Kanal untuk menyampaikan keluhan, saran, dan masukan"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link
            to="/admin/services"
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
                {isEdit ? 'Simpan Perubahan' : 'Tambah Layanan'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
