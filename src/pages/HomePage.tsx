import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  ArrowRight, Users, Building2, Clock, BadgeCheck,
  Megaphone, Mail, MessageSquare, ShieldCheck, Quote,
  FileText, ClipboardCheck, Package,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Service } from '@/types/service';
import { getServiceIcon } from '@/components/ServiceIcon';
import { useSettings } from '@/contexts/SettingsContext';

export default function HomePage() {
  const [langsungCount, setLangsungCount] = useState(0);
  const [tidakLangsungCount, setTidakLangsungCount] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();

  useEffect(() => {
    supabase
      .from('services')
      .select('*')
      .order('category', { ascending: true })
      .order('service_number', { ascending: true })
      .then(({ data }) => {
        if (data) {
          setServices(data as Service[]);
          setLangsungCount(data.filter((s) => s.category === 'langsung').length);
          setTidakLangsungCount(data.filter((s) => s.category === 'tidak_langsung').length);
        }
        setLoading(false);
      });
  }, []);

  const langsungServices = services.filter((s) => s.category === 'langsung');

  return (
    <div>
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden">
        {/* Background image */}
        {settings.banner_url && (
          <div className="absolute inset-0">
            <img
              src={settings.banner_url}
              alt="Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/75 to-blue-900/60" />
          </div>
        )}
        {!settings.banner_url && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-10" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-10" />
          </div>
        )}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-medium mb-6">
              <ShieldCheck className="w-3.5 h-3.5" />
              Standar Pelayanan Publik Resmi
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              {settings.banner_title ?? 'Standar Pelayanan BAPPELITBANGDA'}
            </h1>
            <p className="mt-6 text-lg text-slate-200 leading-relaxed max-w-2xl">
              {settings.banner_subtitle ?? 'Panduan resmi jenis-jenis pelayanan Badan Perencanaan Pembangunan, Penelitian dan Pengembangan Daerah Kabupaten Soppeng.'}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                to="/layanan/langsung"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:-translate-y-0.5"
              >
                Lihat Pelayanan
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/pengaduan"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-all border border-white/20 backdrop-blur-sm"
              >
                <Megaphone className="w-4 h-4" />
                Sampaikan Pengaduan
              </Link>
            </div>
          </div>
        </div>

        {/* Maklumat Quote */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8 max-w-3xl">
            <Quote className="w-8 h-8 text-blue-400 mb-3" />
            <p className="text-slate-200 italic leading-relaxed text-sm md:text-base">
              "Kami sanggup menyelenggarakan pelayanan perencanaan pembangunan sesuai
              standar dan kualitas pelayanan. Jika kami tidak menepati janji ini,
              kami siap menerima sanksi sesuai ketentuan yang berlaku."
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Users, label: 'Pelayanan Langsung', value: langsungCount, color: 'text-blue-600' },
            { icon: Building2, label: 'Layanan Internal', value: tidakLangsungCount, color: 'text-cyan-600' },
            { icon: Clock, label: 'Proses Cepat', value: '1-60', suffix: ' hari', color: 'text-emerald-600' },
            { icon: BadgeCheck, label: 'Biaya', value: 'Gratis', color: 'text-amber-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow">
              <stat.icon className={`w-7 h-7 ${stat.color} mb-3`} />
              <p className="text-2xl font-bold text-slate-900">
                {stat.value}{stat.suffix ?? ''}
              </p>
              <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Service Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900">Bagaimana BAPPELITBANGDA Melayani</h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
            Seluruh pelayanan dibagi menjadi dua jalur utama, dibedakan dari siapa penerima manfaat langsungnya.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/layanan/langsung"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 hover:shadow-2xl hover:shadow-blue-900/30 transition-all hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl -mr-20 -mt-20" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-5">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Pelayanan Langsung Kepada Masyarakat</h3>
              <p className="text-sm text-blue-100 leading-relaxed">
                Layanan yang berinteraksi langsung dengan warga, pemohon data, maupun
                perangkat daerah lain — mulai dari konsultasi, pengaduan, pelaporan
                inovasi, hingga proses perencanaan pembangunan seperti Musrenbang.
              </p>
              <div className="mt-5 flex items-center gap-2 text-white text-sm font-medium">
                {langsungCount} layanan tersedia
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          <Link
            to="/layanan/tidak_langsung"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 p-8 hover:shadow-2xl hover:shadow-slate-900/30 transition-all hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl -mr-20 -mt-20" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-5">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Pelayanan Tidak Langsung Kepada Masyarakat</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Layanan administrasi kepegawaian internal — pengurusan kenaikan pangkat,
                gaji berkala, pensiun, hingga berbagai jenis cuti — yang menunjang
                kelancaran organisasi meski tidak diakses publik secara langsung.
              </p>
              <div className="mt-5 flex items-center gap-2 text-white text-sm font-medium">
                {tidakLangsungCount} layanan tersedia
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Service Delivery Process */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Proses Penyampaian Pelayanan</h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
              Setiap standar pelayanan disusun mengikuti enam komponen yang sama — inilah alur yang akan Anda temui pada tiap layanan.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: FileText, title: 'Persyaratan', desc: 'Dokumen & identitas yang wajib dibawa' },
              { icon: ClipboardCheck, title: 'Sistem & Prosedur', desc: 'Tahapan dari pengajuan hingga selesai' },
              { icon: Clock, title: 'Jangka Waktu', desc: 'Estimasi lama proses diselesaikan' },
              { icon: BadgeCheck, title: 'Biaya/Tarif', desc: 'Tidak dipungut biaya' },
              { icon: Package, title: 'Produk Layanan', desc: 'Output yang diterima pemohon' },
              { icon: Megaphone, title: 'Pengaduan', desc: 'Kanal untuk keluhan & saran' },
            ].map((item, i) => (
              <div key={i} className="text-center p-5 rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all group">
                <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center mx-auto mb-3 transition-colors">
                  <item.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      {!loading && langsungServices.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Pelayanan Publik</h2>
              <p className="mt-2 text-slate-600">Klik tiap layanan untuk melihat rincian lengkap</p>
            </div>
            <Link
              to="/layanan/langsung"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-800"
            >
              Lihat semua
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {langsungServices.slice(0, 6).map((service) => {
              const Icon = getServiceIcon(service.icon);
              return (
                <Link
                  key={service.id}
                  to={`/layanan/detail/${service.slug}`}
                  className="group bg-white rounded-xl border border-slate-100 p-6 hover:shadow-lg hover:border-blue-200 transition-all hover:-translate-y-0.5"
                >
                  <div className="w-11 h-11 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center mb-4 transition-colors">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                    {service.name}
                  </h3>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {service.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    {service.duration}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Complaint Channels */}
      <section className="bg-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white">Menyampaikan Keluhan, Saran & Masukan</h2>
            <p className="mt-3 text-slate-400 max-w-2xl mx-auto">
              Bappelitbangda menyediakan beberapa kanal resmi bagi masyarakat maupun pegawai untuk berkonsultasi atau mengadukan pelayanan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                title: 'Tatap Muka Langsung',
                desc: 'Datang ke meja pengaduan Bappelitbangda, mengisi formulir pengaduan dengan data diri yang jelas dan dapat dipertanggungjawabkan.',
              },
              {
                icon: Mail,
                title: 'Email Resmi',
                desc: 'Kirimkan pengaduan atau konsultasi ke bappelitbangda663@gmail.com — kanal utama untuk seluruh jenis layanan.',
              },
              {
                icon: MessageSquare,
                title: 'WhatsApp & SP4N-LAPOR',
                desc: 'Pengaduan via WhatsApp 085 255 283 177, serta melalui Aplikasi Pengaduan SP4N-LAPOR.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
